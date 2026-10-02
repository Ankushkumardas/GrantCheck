import { describe, it, expect } from 'vitest';
const MockAiProvider = require('../../src/services/ai/mockProvider');
const {
  RequirementExtractionResultSchema,
  EvidenceMappingResultSchema,
  ClaimAnalysisResultSchema,
  QuestionGenerationResultSchema
} = require('../../src/validators/aiValidators');

describe('AI Provider and Schema Validation', () => {
  const provider = new MockAiProvider();

  it('should generate valid requirements matching Zod schema', async () => {
    const raw = await provider.generateJson('Please extract all distinct requirements from GUIDELINE CONTENT:');
    const validated = RequirementExtractionResultSchema.parse(raw);

    expect(validated.requirements.length).toBeGreaterThan(0);
    expect(validated.requirements[0]).toHaveProperty('id');
    expect(validated.requirements[0]).toHaveProperty('text');
    expect(validated.requirements[0]).toHaveProperty('mandatory');
    expect(validated.requirements[0].source).toHaveProperty('page');
  });

  it('should generate valid evidence mappings matching Zod schema', async () => {
    const raw = await provider.generateJson('Please map each grant requirement against the supplied Draft Application:');
    const validated = EvidenceMappingResultSchema.parse(raw);

    expect(validated.mappings.length).toBeGreaterThan(0);
    expect(['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING']).toContain(validated.mappings[0].status);
  });

  it('should generate valid unsupported claims matching Zod schema', async () => {
    const raw = await provider.generateJson('identify key factual or numerical claims in the Draft Application that are NOT supported:');
    const validated = ClaimAnalysisResultSchema.parse(raw);

    expect(Array.isArray(validated.claims)).toBe(true);
    if (validated.claims.length > 0) {
      expect(validated.claims[0]).toHaveProperty('claimText');
      expect(validated.claims[0]).toHaveProperty('reason');
    }
  });

  it('should generate valid clarification questions matching Zod schema', async () => {
    const raw = await provider.generateJson('generate concise, specific, and actionable clarification questions:');
    const validated = QuestionGenerationResultSchema.parse(raw);

    expect(Array.isArray(validated.questions)).toBe(true);
    if (validated.questions.length > 0) {
      expect(validated.questions[0]).toHaveProperty('question');
      expect(['WEAK', 'AMBIGUOUS', 'MISSING']).toContain(validated.questions[0].statusTrigger);
    }
  });

  it('should fail validation when required fields are missing', () => {
    const invalidData = { requirements: [{ badField: 123 }] };
    expect(() => RequirementExtractionResultSchema.parse(invalidData)).toThrow();
  });
});
