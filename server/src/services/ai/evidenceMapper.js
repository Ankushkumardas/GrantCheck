const aiService = require('./aiService');
const { buildEvidenceMappingPrompt } = require('./prompts/evidenceMappingPrompt');
const { EvidenceMappingResultSchema } = require('../../validators/aiValidators');
const logger = require('../../config/logger');

async function mapEvidenceForRequirements(requirements, applicationChunks, supportingDocsChunks = []) {
  logger.info('Starting evidence mapping against application and supporting docs', {
    event: 'evidence_mapping_started',
    requirementCount: requirements.length,
    appChunkCount: applicationChunks.length,
    supportingDocChunkCount: supportingDocsChunks.length
  });

  const prompt = buildEvidenceMappingPrompt(requirements, applicationChunks, supportingDocsChunks);

  const result = await aiService.executeWithValidation(
    prompt,
    EvidenceMappingResultSchema,
    'evidence_mapping'
  );

  // Safety filter: ensure MISSING items don't have invented evidence citations
  const sanitizedMappings = result.mappings.map(m => {
    if (m.status === 'MISSING') {
      return { ...m, evidence: [] };
    }
    return m;
  });

  logger.info('Evidence mapping completed', {
    event: 'evidence_mapping_completed',
    mappingCount: sanitizedMappings.length,
    supportedCount: sanitizedMappings.filter(m => m.status === 'SUPPORTED').length,
    weakCount: sanitizedMappings.filter(m => m.status === 'WEAK').length,
    ambiguousCount: sanitizedMappings.filter(m => m.status === 'AMBIGUOUS').length,
    missingCount: sanitizedMappings.filter(m => m.status === 'MISSING').length
  });

  return { mappings: sanitizedMappings };
}

module.exports = { mapEvidenceForRequirements };
