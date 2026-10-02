const Assessment = require('../models/Assessment');
const Document = require('../models/Document');
const Requirement = require('../models/Requirement');
const Mapping = require('../models/Mapping');
const UnsupportedClaim = require('../models/UnsupportedClaim');
const ClarificationQuestion = require('../models/ClarificationQuestion');
const ReviewLog = require('../models/ReviewLog');
const { extractPdfContent } = require('../services/documents/pdfExtractor');
const { removeTempFile } = require('../middleware/upload');
const { runAssessmentWorkflow } = require('../services/assessment/workflowOrchestrator');
const { isAssessmentStale, getStaleReason } = require('../services/assessment/versionManager');
const logger = require('../config/logger');

// Create new Assessment draft
async function createAssessment(req, res, next) {
  try {
    const { title } = req.body;
    
    const assessment = new Assessment({
      title: title || 'Grant Application Review',
      createdBy: req.user?.email || 'demo@example.com',
      status: 'DRAFT'
    });

    await assessment.save();

    logger.info('New assessment created', {
      event: 'assessment_created',
      assessmentId: assessment._id.toString(),
      title: assessment.title
    });

    res.status(201).json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
}

// List all assessments
async function listAssessments(req, res, next) {
  try {
    const assessments = await Assessment.find()
      .populate('guidelineDocId', 'originalFileName version')
      .populate('applicationDocId', 'originalFileName version')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      assessments
    });
  } catch (error) {
    next(error);
  }
}

// Get single assessment by ID with doc population
async function getAssessment(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('guidelineDocId')
      .populate('applicationDocId')
      .populate('supportingDocIds');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
}

// Upload/Replace Grant Guideline
async function uploadGuideline(req, res, next) {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a PDF guideline file.' });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      removeTempFile(filePath);
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Extract PDF text and pages
    const { pageCount, extractedText, chunks } = await extractPdfContent(filePath, req.file.originalname);
    removeTempFile(filePath); // Delete temporary file immediately after extraction

    // Increment guideline version if replacing
    const newVersion = assessment.guidelineDocId ? assessment.guidelineVersion + 1 : 1;

    const doc = new Document({
      assessmentId: assessment._id,
      type: 'GUIDELINE',
      originalFileName: req.file.originalname,
      version: newVersion,
      mimeType: req.file.mimetype,
      chunks: chunks,
      extractedText: extractedText,
      metadata: {
        pageCount,
        fileSize: req.file.size
      }
    });
    await doc.save();

    // If assessment was already completed, mark it STALE due to guideline version change
    if (assessment.status === 'CURRENT' && assessment.guidelineDocId) {
      assessment.status = 'STALE';
      assessment.staleReason = `Guideline updated to v${newVersion}`;
      logger.info('Assessment marked as stale due to guideline update', {
        event: 'assessment_marked_stale',
        assessmentId: assessment._id.toString(),
        reason: assessment.staleReason
      });
    }

    assessment.guidelineDocId = doc._id;
    assessment.guidelineVersion = newVersion;
    await assessment.save();

    logger.info('Guideline uploaded successfully', {
      event: 'document_uploaded',
      type: 'GUIDELINE',
      assessmentId: assessment._id.toString(),
      fileName: req.file.originalname,
      version: newVersion
    });

    res.json({
      success: true,
      document: doc,
      assessment
    });
  } catch (error) {
    removeTempFile(filePath);
    next(error);
  }
}

// Upload/Replace Draft Application
async function uploadApplication(req, res, next) {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please provide a PDF application file.' });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      removeTempFile(filePath);
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Extract PDF text and pages
    const { pageCount, extractedText, chunks } = await extractPdfContent(filePath, req.file.originalname);
    removeTempFile(filePath); // Delete temporary file immediately after extraction

    // Increment application version if replacing
    const newVersion = assessment.applicationDocId ? assessment.applicationVersion + 1 : 1;

    const doc = new Document({
      assessmentId: assessment._id,
      type: 'APPLICATION',
      originalFileName: req.file.originalname,
      version: newVersion,
      mimeType: req.file.mimetype,
      chunks: chunks,
      extractedText: extractedText,
      metadata: {
        pageCount,
        fileSize: req.file.size
      }
    });
    await doc.save();

    // If assessment was already completed, mark it STALE due to application version change
    if (assessment.status === 'CURRENT' && assessment.applicationDocId) {
      assessment.status = 'STALE';
      assessment.staleReason = `Application updated to v${newVersion}`;
      logger.info('Assessment marked as stale due to application update', {
        event: 'assessment_marked_stale',
        assessmentId: assessment._id.toString(),
        reason: assessment.staleReason
      });
    }

    assessment.applicationDocId = doc._id;
    assessment.applicationVersion = newVersion;
    await assessment.save();

    logger.info('Application uploaded successfully', {
      event: 'document_uploaded',
      type: 'APPLICATION',
      assessmentId: assessment._id.toString(),
      fileName: req.file.originalname,
      version: newVersion
    });

    res.json({
      success: true,
      document: doc,
      assessment
    });
  } catch (error) {
    removeTempFile(filePath);
    next(error);
  }
}

// Upload Supporting Documents (Multiple)
async function uploadSupportingDocuments(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  try {
    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'No supporting documents provided.' });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      files.forEach(f => removeTempFile(f.path));
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const createdDocs = [];

    for (const file of files) {
      try {
        const { pageCount, extractedText, chunks } = await extractPdfContent(file.path, file.originalname);
        removeTempFile(file.path);

        const doc = new Document({
          assessmentId: assessment._id,
          type: 'SUPPORTING',
          originalFileName: file.originalname,
          version: 1,
          mimeType: file.mimetype,
          chunks: chunks,
          extractedText: extractedText,
          metadata: {
            pageCount,
            fileSize: file.size
          }
        });
        await doc.save();
        createdDocs.push(doc);
        assessment.supportingDocIds.push(doc._id);
      } catch (docErr) {
        removeTempFile(file.path);
        logger.warn(`Skipping unparseable supporting document: ${file.originalname}: ${docErr.message}`);
      }
    }

    if (createdDocs.length > 0 && assessment.status === 'CURRENT') {
      assessment.status = 'STALE';
      assessment.staleReason = 'New supporting documents uploaded';
      logger.info('Assessment marked as stale due to new supporting documents', {
        event: 'assessment_marked_stale',
        assessmentId: assessment._id.toString(),
        reason: assessment.staleReason
      });
    }

    await assessment.save();

    logger.info('Supporting documents uploaded', {
      event: 'document_uploaded',
      type: 'SUPPORTING',
      count: createdDocs.length,
      assessmentId: assessment._id.toString()
    });

    res.json({
      success: true,
      documents: createdDocs,
      assessment
    });
  } catch (error) {
    files.forEach(f => removeTempFile(f.path));
    next(error);
  }
}

// Trigger AI Analysis Workflow
async function runAnalysis(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (!assessment.guidelineDocId) {
      return res.status(400).json({
        success: false,
        message: 'Grant Guideline document is missing. Please upload the guideline first.'
      });
    }

    if (!assessment.applicationDocId) {
      return res.status(400).json({
        success: false,
        message: 'Draft Application document is missing. Please upload the draft application first.'
      });
    }

    // Execute the workflow
    const completedAssessment = await runAssessmentWorkflow(assessment._id);

    res.json({
      success: true,
      message: 'Analysis completed successfully',
      assessment: completedAssessment
    });
  } catch (error) {
    next(error);
  }
}

// Get Full Results
async function getAssessmentResults(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('guidelineDocId')
      .populate('applicationDocId')
      .populate('supportingDocIds');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const [requirements, mappings, unsupportedClaims, clarificationQuestions, reviewLogs] = await Promise.all([
      Requirement.find({ assessmentId: assessment._id }).sort({ order: 1 }),
      Mapping.find({ assessmentId: assessment._id }).populate('requirementId'),
      UnsupportedClaim.find({ assessmentId: assessment._id }),
      ClarificationQuestion.find({ assessmentId: assessment._id }).populate('requirementId'),
      ReviewLog.find({ assessmentId: assessment._id }).sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      assessment,
      requirements,
      mappings,
      unsupportedClaims,
      clarificationQuestions,
      missingSupportingDocuments: assessment.missingSupportingDocuments || [],
      reviewLogs
    });
  } catch (error) {
    next(error);
  }
}

// Get Reviewed Completeness Summary
async function getAssessmentSummary(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('guidelineDocId', 'originalFileName version')
      .populate('applicationDocId', 'originalFileName version');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const [requirements, mappings, unsupportedClaims, clarificationQuestions] = await Promise.all([
      Requirement.find({ assessmentId: assessment._id }),
      Mapping.find({ assessmentId: assessment._id }).populate('requirementId'),
      UnsupportedClaim.find({ assessmentId: assessment._id }),
      ClarificationQuestion.find({ assessmentId: assessment._id })
    ]);

    // Compute review counters
    const confirmedCount = mappings.filter(m => m.humanAction === 'CONFIRM').length;
    const correctedCount = mappings.filter(m => m.humanAction === 'CORRECT').length;
    const rejectedCount = mappings.filter(m => m.humanAction === 'REJECT').length;
    const totalReviewed = confirmedCount + correctedCount + rejectedCount;

    // Remaining issues: requirements with finalStatus !== 'SUPPORTED'
    const remainingIssues = mappings.filter(m => m.finalStatus !== 'SUPPORTED');

    res.json({
      success: true,
      summary: {
        assessmentTitle: assessment.title,
        status: assessment.status,
        completenessScore: assessment.completenessScore,
        mandatoryTotal: assessment.mandatoryTotal,
        mandatorySupported: assessment.mandatorySupported,
        mandatoryWeak: assessment.mandatoryWeak,
        mandatoryAmbiguous: assessment.mandatoryAmbiguous,
        mandatoryMissing: assessment.mandatoryMissing,
        recommendedTotal: assessment.recommendedTotal,
        recommendedSupported: assessment.recommendedSupported,
        guidelineVersion: assessment.guidelineVersion,
        applicationVersion: assessment.applicationVersion,
        guidelineFileName: assessment.guidelineDocId?.originalFileName || 'guideline.pdf',
        applicationFileName: assessment.applicationDocId?.originalFileName || 'application.pdf',
        totalRequirements: requirements.length,
        totalReviewed,
        confirmedCount,
        correctedCount,
        rejectedCount,
        remainingIssuesCount: remainingIssues.length,
        remainingIssuesList: remainingIssues.map(m => {
          const req = requirements.find(r => r._id.toString() === m.requirementId.toString());
          return { reqId: req ? req.reqId : 'Unknown', text: req ? req.text : '', status: m.finalStatus };
        }),
        unsupportedClaimsCount: unsupportedClaims.length,
        unsupportedClaimsList: unsupportedClaims.map(c => c.claimText),
        clarificationQuestionsCount: clarificationQuestions.length,
        clarificationQuestionsList: clarificationQuestions.map(q => ({ reqId: q.requirementId, question: q.question })),
        missingSupportingDocsCount: (assessment.missingSupportingDocuments || []).filter(d => d.status === 'MISSING').length,
        missingSupportingDocsList: (assessment.missingSupportingDocuments || []).filter(d => d.status === 'MISSING').map(d => d.documentName),
        reviewedAt: assessment.reviewedSummary?.reviewedAt || assessment.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
}

// Re-run assessment
async function rerunAssessment(req, res, next) {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Reset review summary and rerun
    assessment.status = 'ANALYZING';
    assessment.staleReason = '';
    assessment.reviewedSummary = {
      totalReviewed: 0,
      confirmedCount: 0,
      correctedCount: 0,
      rejectedCount: 0,
      remainingIssuesCount: 0,
      reviewedAt: null
    };
    await assessment.save();

    const updated = await runAssessmentWorkflow(assessment._id);

    res.json({
      success: true,
      message: 'Assessment re-analyzed successfully',
      assessment: updated
    });
  } catch (error) {
    next(error);
  }
}

// Delete an assessment and associated data
async function deleteAssessment(req, res, next) {
  try {
    const assessmentId = req.params.id;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Delete associated data
    await Promise.all([
      Document.deleteMany({ assessmentId }),
      Requirement.deleteMany({ assessmentId }),
      Mapping.deleteMany({ assessmentId }),
      UnsupportedClaim.deleteMany({ assessmentId }),
      ClarificationQuestion.deleteMany({ assessmentId }),
      ReviewLog.deleteMany({ assessmentId }),
      Assessment.findByIdAndDelete(assessmentId)
    ]);

    logger.info('Assessment deleted', {
      event: 'assessment_deleted',
      assessmentId
    });

    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createAssessment,
  listAssessments,
  getAssessment,
  uploadGuideline,
  uploadApplication,
  uploadSupportingDocuments,
  runAnalysis,
  getAssessmentResults,
  getAssessmentSummary,
  rerunAssessment,
  deleteAssessment
};
