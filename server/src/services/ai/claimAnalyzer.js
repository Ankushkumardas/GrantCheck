const aiService = require('./aiService');
const { buildClaimAnalysisPrompt } = require('./prompts/claimAnalysisPrompt');
const { ClaimAnalysisResultSchema } = require('../../validators/aiValidators');
const logger = require('../../config/logger');

async function analyzeUnsupportedClaims(applicationChunks, supportingDocsChunks = []) {
  logger.info('Starting unsupported claim analysis on application', {
    event: 'claim_analysis_started',
    appChunkCount: applicationChunks.length,
    supportingChunkCount: supportingDocsChunks.length
  });

  const prompt = buildClaimAnalysisPrompt(applicationChunks, supportingDocsChunks);

  const result = await aiService.executeWithValidation(
    prompt,
    ClaimAnalysisResultSchema,
    'claim_analysis'
  );

  logger.info('Unsupported claim analysis completed', {
    event: 'claim_analysis_completed',
    claimsFound: result.claims.length
  });

  return result;
}

module.exports = { analyzeUnsupportedClaims };
