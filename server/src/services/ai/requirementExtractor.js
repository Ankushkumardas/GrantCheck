const aiService = require('./aiService');
const { buildRequirementExtractionPrompt } = require('./prompts/requirementExtractionPrompt');
const { RequirementExtractionResultSchema } = require('../../validators/aiValidators');
const logger = require('../../config/logger');

async function extractRequirementsFromGuideline(guidelineChunks, originalFileName = 'grant-guideline.pdf') {
  logger.info('Starting requirement extraction from guideline', {
    event: 'requirement_extraction_started',
    fileName: originalFileName,
    chunkCount: guidelineChunks.length
  });

  const prompt = buildRequirementExtractionPrompt(guidelineChunks, originalFileName);
  
  const result = await aiService.executeWithValidation(
    prompt,
    RequirementExtractionResultSchema,
    'requirement_extraction'
  );

  logger.info('Requirement extraction completed', {
    event: 'requirement_extraction_completed',
    count: result.requirements.length,
    mandatoryCount: result.requirements.filter(r => r.mandatory).length,
    recommendedCount: result.requirements.filter(r => !r.mandatory).length
  });

  return result;
}

module.exports = { extractRequirementsFromGuideline };
