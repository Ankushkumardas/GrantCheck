/**
 * Versioning and Stale State Manager
 */

function isAssessmentStale(assessment, latestGuidelineVersion, latestApplicationVersion) {
  if (!assessment) return false;

  const guidelineMismatch = assessment.guidelineVersion !== latestGuidelineVersion;
  const applicationMismatch = assessment.applicationVersion !== latestApplicationVersion;

  return guidelineMismatch || applicationMismatch;
}

function getStaleReason(assessment, latestGuidelineVersion, latestApplicationVersion) {
  const reasons = [];
  if (assessment.guidelineVersion !== latestGuidelineVersion) {
    reasons.push(`Guideline changed from v${assessment.guidelineVersion} to v${latestGuidelineVersion}`);
  }
  if (assessment.applicationVersion !== latestApplicationVersion) {
    reasons.push(`Draft Application changed from v${assessment.applicationVersion} to v${latestApplicationVersion}`);
  }

  return reasons.join(' and ');
}

module.exports = {
  isAssessmentStale,
  getStaleReason
};
