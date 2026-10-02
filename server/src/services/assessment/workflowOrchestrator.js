const Assessment = require('../../models/Assessment');
const Document = require('../../models/Document');
const Requirement = require('../../models/Requirement');
const Mapping = require('../../models/Mapping');
const UnsupportedClaim = require('../../models/UnsupportedClaim');
const ClarificationQuestion = require('../../models/ClarificationQuestion');
const { extractRequirementsFromGuideline } = require('../ai/requirementExtractor');
const { mapEvidenceForRequirements } = require('../ai/evidenceMapper');
const { analyzeUnsupportedClaims } = require('../ai/claimAnalyzer');
const { generateClarificationQuestions } = require('../ai/questionGenerator');
const { calculateCompleteness } = require('./completenessCalculator');
const logger = require('../../config/logger');

async function runAssessmentWorkflow(assessmentId) {
  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    throw new Error(`Assessment ${assessmentId} not found`);
  }

  logger.info(`Starting assessment workflow for ${assessmentId}`, {
    event: 'assessment_workflow_started',
    assessmentId: assessmentId.toString(),
    title: assessment.title
  });

  try {
    // Step 1: Document extraction verification
    assessment.status = 'ANALYZING';
    assessment.analysisStep = 'extracting_docs';
    assessment.errorMessage = null;
    await assessment.save();

    const guidelineDoc = await Document.findById(assessment.guidelineDocId);
    const applicationDoc = await Document.findById(assessment.applicationDocId);
    const supportingDocs = assessment.supportingDocIds?.length 
      ? await Document.find({ _id: { $in: assessment.supportingDocIds } })
      : [];

    if (!guidelineDoc || !guidelineDoc.chunks || guidelineDoc.chunks.length === 0) {
      throw new Error('Grant Guideline document is missing or has no extractable text chunks.');
    }
    if (!applicationDoc || !applicationDoc.chunks || applicationDoc.chunks.length === 0) {
      throw new Error('Draft Application document is missing or has no extractable text chunks.');
    }

    // Prepare supporting docs chunks tagged with their document name
    const supportingChunks = [];
    supportingDocs.forEach(doc => {
      doc.chunks.forEach(chunk => {
        supportingChunks.push({
          documentName: doc.originalFileName,
          pageNumber: chunk.pageNumber,
          section: chunk.section,
          text: chunk.text
        });
      });
    });

    const appChunks = applicationDoc.chunks.map(c => ({
      documentName: applicationDoc.originalFileName,
      pageNumber: c.pageNumber,
      section: c.section,
      text: c.text
    }));

    // Step 2: Extract Requirements
    assessment.analysisStep = 'extracting_requirements';
    await assessment.save();

    // Clear any previous artifacts for clean re-runs
    await Promise.all([
      Requirement.deleteMany({ assessmentId }),
      Mapping.deleteMany({ assessmentId }),
      UnsupportedClaim.deleteMany({ assessmentId }),
      ClarificationQuestion.deleteMany({ assessmentId })
    ]);

    const reqResult = await extractRequirementsFromGuideline(
      guidelineDoc.chunks,
      guidelineDoc.originalFileName
    );

    // Save Requirements to DB
    const createdRequirements = await Requirement.insertMany(
      reqResult.requirements.map((req, idx) => ({
        assessmentId: assessment._id,
        reqId: req.id || `REQ-${String(idx + 1).padStart(3, '0')}`,
        text: req.text,
        category: req.category,
        mandatory: req.mandatory,
        source: req.source,
        order: idx + 1
      }))
    );

    // Track Missing Supporting Documents identified by guideline vs provided
    const missingDocsList = (reqResult.missingSupportingDocs || []).map(item => {
      const provided = supportingDocs.some(sd => 
        sd.originalFileName.toLowerCase().includes(item.documentName.toLowerCase().replace(/\s+/g, '')) ||
        item.documentName.toLowerCase().includes(sd.originalFileName.toLowerCase().replace(/\.pdf$/i, ''))
      );
      return {
        documentName: item.documentName,
        requiredByReqId: item.requiredByReqId || '',
        description: item.description || '',
        status: provided ? 'PROVIDED' : 'MISSING'
      };
    });
    assessment.missingSupportingDocuments = missingDocsList;

    // Step 3: Evidence Mapping
    assessment.analysisStep = 'mapping_evidence';
    await assessment.save();

    const mappingResult = await mapEvidenceForRequirements(
      createdRequirements,
      appChunks,
      supportingChunks
    );

    // Prepare Map to link requirements
    const reqByReqId = new Map();
    createdRequirements.forEach(r => reqByReqId.set(r.reqId, r));

    const mappingDocsToInsert = mappingResult.mappings.map(m => {
      const matchedReq = reqByReqId.get(m.requirementId) || createdRequirements[0];
      
      // Override status if tied to a MISSING physical document
      let finalAiStatus = m.status;
      let finalReason = m.reason;
      
      const missingDocMatch = missingDocsList.find(d => d.requiredByReqId === matchedReq.reqId && d.status === 'MISSING');
      if (missingDocMatch) {
        finalAiStatus = 'MISSING';
        finalReason = `Required supporting document '${missingDocMatch.documentName}' was not attached.`;
      }

      return {
        assessmentId: assessment._id,
        requirementId: matchedReq._id,
        reqId: matchedReq.reqId,
        aiStatus: finalAiStatus,
        aiReason: finalReason,
        aiEvidence: m.evidence || [],
        humanStatus: null,
        humanAction: null,
        humanComment: '',
        finalStatus: finalAiStatus
      };
    });

    const createdMappings = await Mapping.insertMany(mappingDocsToInsert);

    // Step 4: Check Unsupported Claims in Application
    assessment.analysisStep = 'checking_claims';
    await assessment.save();

    const claimResult = await analyzeUnsupportedClaims(appChunks, supportingChunks);
    if (claimResult.claims && claimResult.claims.length > 0) {
      await UnsupportedClaim.insertMany(
        claimResult.claims.map(c => ({
          assessmentId: assessment._id,
          claimText: c.claimText,
          source: c.source,
          reason: c.reason
        }))
      );
    }

    // Step 5: Generate Clarification Questions for non-SUPPORTED items
    assessment.analysisStep = 'generating_questions';
    await assessment.save();

    const issueItems = createdMappings
      .filter(m => m.aiStatus !== 'SUPPORTED')
      .map(m => {
        const req = reqByReqId.get(m.reqId);
        return {
          reqId: m.reqId,
          requirementText: req ? req.text : '',
          status: m.aiStatus,
          reason: m.aiReason,
          evidenceSnippet: m.aiEvidence?.[0]?.text || ''
        };
      });

    if (issueItems.length > 0) {
      const questionResult = await generateClarificationQuestions(issueItems);
      if (questionResult.questions && questionResult.questions.length > 0) {
        await ClarificationQuestion.insertMany(
          questionResult.questions.map(q => {
            const req = reqByReqId.get(q.requirementId);
            return {
              assessmentId: assessment._id,
              requirementId: req ? req._id : null,
              reqId: q.requirementId,
              statusTrigger: q.statusTrigger,
              question: q.question,
              context: q.context
            };
          })
        );
      }
    }

    // Step 6: Deterministic Completeness Calculation
    assessment.analysisStep = 'calculating_completeness';
    await assessment.save();

    const stats = calculateCompleteness(createdRequirements, createdMappings);

    assessment.completenessScore = stats.completenessScore;
    assessment.mandatoryTotal = stats.mandatoryTotal;
    assessment.mandatorySupported = stats.mandatorySupported;
    assessment.mandatoryWeak = stats.mandatoryWeak;
    assessment.mandatoryAmbiguous = stats.mandatoryAmbiguous;
    assessment.mandatoryMissing = stats.mandatoryMissing;
    assessment.recommendedTotal = stats.recommendedTotal;
    assessment.recommendedSupported = stats.recommendedSupported;

    // Mark as Completed and CURRENT
    assessment.status = 'CURRENT';
    assessment.analysisStep = 'completed';
    assessment.errorMessage = null;
    await assessment.save();

    logger.info(`Assessment workflow completed successfully for ${assessmentId}`, {
      event: 'assessment_calculated',
      assessmentId: assessmentId.toString(),
      completenessScore: stats.completenessScore,
      mandatoryTotal: stats.mandatoryTotal,
      mandatorySupported: stats.mandatorySupported
    });

    return assessment;
  } catch (error) {
    logger.error(`Assessment workflow failed for ${assessmentId}: ${error.message}`, {
      event: 'assessment_workflow_failed',
      assessmentId: assessmentId.toString(),
      error: error.message
    });

    assessment.status = 'FAILED';
    assessment.analysisStep = 'failed';
    assessment.errorMessage = error.message;
    await assessment.save();

    throw error;
  }
}

module.exports = { runAssessmentWorkflow };
