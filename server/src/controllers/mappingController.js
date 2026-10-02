const Mapping = require('../models/Mapping');
const Requirement = require('../models/Requirement');
const Assessment = require('../models/Assessment');
const ReviewLog = require('../models/ReviewLog');
const { calculateCompleteness } = require('../services/assessment/completenessCalculator');
const logger = require('../config/logger');

async function updateMappingReview(req, res, next) {
  try {
    const { mappingId } = req.params;
    const { action, newStatus, comment } = req.body;

    if (!['CONFIRM', 'CORRECT', 'REJECT'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'CONFIRM', 'CORRECT', or 'REJECT'."
      });
    }

    const mapping = await Mapping.findById(mappingId);
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }

    const previousFinalStatus = mapping.finalStatus;
    let computedFinalStatus;

    if (action === 'CONFIRM') {
      mapping.humanStatus = mapping.aiStatus;
      mapping.humanAction = 'CONFIRM';
      computedFinalStatus = mapping.aiStatus;
    } else if (action === 'CORRECT') {
      if (!newStatus || !['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING'].includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: 'When correcting a mapping, a valid newStatus is required.'
        });
      }
      mapping.humanStatus = newStatus;
      mapping.humanAction = 'CORRECT';
      computedFinalStatus = newStatus;
    } else if (action === 'REJECT') {
      mapping.humanStatus = newStatus || 'MISSING';
      mapping.humanAction = 'REJECT';
      computedFinalStatus = mapping.humanStatus;
    }

    mapping.finalStatus = computedFinalStatus;
    mapping.humanComment = comment || '';
    mapping.reviewedAt = new Date();
    mapping.reviewedBy = req.user?.email || 'demo@example.com';
    await mapping.save();

    // Log the review action
    const log = new ReviewLog({
      assessmentId: mapping.assessmentId,
      mappingId: mapping._id,
      reqId: mapping.reqId,
      previousStatus: previousFinalStatus,
      newStatus: computedFinalStatus,
      action: action,
      comment: comment || '',
      reviewedBy: mapping.reviewedBy
    });
    await log.save();

    logger.info('Mapping reviewed by user', {
      event: 'mapping_reviewed',
      mappingId: mapping._id.toString(),
      reqId: mapping.reqId,
      action,
      previousStatus: previousFinalStatus,
      newStatus: computedFinalStatus
    });

    // Recalculate deterministic completeness score on assessment
    const [allReqs, allMappings, assessment] = await Promise.all([
      Requirement.find({ assessmentId: mapping.assessmentId }),
      Mapping.find({ assessmentId: mapping.assessmentId }),
      Assessment.findById(mapping.assessmentId)
    ]);

    if (assessment) {
      const stats = calculateCompleteness(allReqs, allMappings);
      assessment.completenessScore = stats.completenessScore;
      assessment.mandatoryTotal = stats.mandatoryTotal;
      assessment.mandatorySupported = stats.mandatorySupported;
      assessment.mandatoryWeak = stats.mandatoryWeak;
      assessment.mandatoryAmbiguous = stats.mandatoryAmbiguous;
      assessment.mandatoryMissing = stats.mandatoryMissing;
      assessment.recommendedTotal = stats.recommendedTotal;
      assessment.recommendedSupported = stats.recommendedSupported;

      // Update review summary
      const confirmedCount = allMappings.filter(m => m.humanAction === 'CONFIRM').length;
      const correctedCount = allMappings.filter(m => m.humanAction === 'CORRECT').length;
      const rejectedCount = allMappings.filter(m => m.humanAction === 'REJECT').length;
      const remainingIssuesCount = allMappings.filter(m => m.finalStatus !== 'SUPPORTED').length;

      assessment.reviewedSummary = {
        totalReviewed: confirmedCount + correctedCount + rejectedCount,
        confirmedCount,
        correctedCount,
        rejectedCount,
        remainingIssuesCount,
        reviewedAt: new Date()
      };

      await assessment.save();
    }

    res.json({
      success: true,
      mapping,
      assessment
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateMappingReview
};
