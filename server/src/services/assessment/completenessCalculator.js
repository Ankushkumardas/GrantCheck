/**
 * Deterministic Completeness Calculator
 *
 * Requirements:
 * 1. Completeness percentage is calculated SOLELY on mandatory requirements.
 * 2. Recommended requirements are tracked separately and MUST NOT affect mandatory completeness percentage.
 * 3. Human-reviewed statuses override AI statuses.
 * 4. Returns 0% if there are no mandatory requirements.
 */

function calculateCompleteness(requirements = [], mappings = []) {
  const reqMap = new Map();
  requirements.forEach(req => {
    const id = req.reqId || req.id;
    reqMap.set(id, req);
  });

  let mandatoryTotal = 0;
  let mandatorySupported = 0;
  let mandatoryWeak = 0;
  let mandatoryAmbiguous = 0;
  let mandatoryMissing = 0;

  let recommendedTotal = 0;
  let recommendedSupported = 0;
  let recommendedWeak = 0;
  let recommendedAmbiguous = 0;
  let recommendedMissing = 0;

  // Aggregate stats
  mappings.forEach(m => {
    const reqId = m.reqId || m.requirementId;
    const req = reqMap.get(reqId);
    if (!req) return;

    // Human reviewed status takes precedence over AI status
    const effectiveStatus = m.humanStatus || m.finalStatus || m.aiStatus || 'MISSING';

    if (req.mandatory) {
      mandatoryTotal++;
      if (effectiveStatus === 'SUPPORTED') mandatorySupported++;
      else if (effectiveStatus === 'WEAK') mandatoryWeak++;
      else if (effectiveStatus === 'AMBIGUOUS') mandatoryAmbiguous++;
      else if (effectiveStatus === 'MISSING') mandatoryMissing++;
    } else {
      recommendedTotal++;
      if (effectiveStatus === 'SUPPORTED') recommendedSupported++;
      else if (effectiveStatus === 'WEAK') recommendedWeak++;
      else if (effectiveStatus === 'AMBIGUOUS') recommendedAmbiguous++;
      else if (effectiveStatus === 'MISSING') recommendedMissing++;
    }
  });

  const completenessScore = mandatoryTotal > 0
    ? Math.round((mandatorySupported / mandatoryTotal) * 100)
    : 0;

  return {
    completenessScore,
    mandatoryTotal,
    mandatorySupported,
    mandatoryWeak,
    mandatoryAmbiguous,
    mandatoryMissing,
    recommendedTotal,
    recommendedSupported,
    recommendedWeak,
    recommendedAmbiguous,
    recommendedMissing
  };
}

module.exports = { calculateCompleteness };
