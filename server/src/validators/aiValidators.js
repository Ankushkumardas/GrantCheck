const { z } = require('zod');

// Schema for extracted requirement from guideline
const RequirementItemSchema = z.object({
  id: z.string().default('REQ-001'),
  text: z.string().min(3),
  category: z.enum([
    'ELIGIBILITY',
    'SUBMISSION',
    'FINANCIAL',
    'PROJECT_DESCRIPTION',
    'GOVERNANCE',
    'EVALUATION',
    'OTHER'
  ]).default('ELIGIBILITY'),
  mandatory: z.boolean().default(true),
  source: z.object({
    document: z.string().default('guideline.pdf'),
    page: z.number().int().positive().default(1),
    section: z.string().default('General'),
    text: z.string().default('')
  })
});

const RequirementExtractionResultSchema = z.object({
  requirements: z.array(RequirementItemSchema).min(1),
  missingSupportingDocs: z.array(z.object({
    documentName: z.string(),
    requiredByReqId: z.string().default(''),
    description: z.string().default('')
  })).default([])
});

// Schema for evidence item
const EvidenceItemSchema = z.object({
  document: z.string().min(1),
  page: z.number().int().positive().default(1),
  section: z.string().default('General'),
  text: z.string().min(1)
});

// Schema for evidence mapping output
const EvidenceMappingItemSchema = z.object({
  requirementId: z.string(),
  status: z.enum(['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING']),
  evidence: z.array(EvidenceItemSchema).default([]),
  reason: z.string().min(1)
});

const EvidenceMappingResultSchema = z.object({
  mappings: z.array(EvidenceMappingItemSchema).min(1)
});

// Schema for unsupported claims
const UnsupportedClaimItemSchema = z.object({
  claimText: z.string().min(3),
  source: z.object({
    document: z.string().default('draft-application.pdf'),
    page: z.number().int().positive().default(1),
    section: z.string().default('General')
  }).default({ document: 'draft-application.pdf', page: 1, section: 'General' }),
  reason: z.string().min(3)
});

const ClaimAnalysisResultSchema = z.object({
  claims: z.array(UnsupportedClaimItemSchema).default([])
});

// Schema for clarification questions
const ClarificationQuestionItemSchema = z.object({
  requirementId: z.string(),
  statusTrigger: z.enum(['WEAK', 'AMBIGUOUS', 'MISSING']),
  question: z.string().min(5),
  context: z.string().default('')
});

const QuestionGenerationResultSchema = z.object({
  questions: z.array(ClarificationQuestionItemSchema).default([])
});

module.exports = {
  RequirementExtractionResultSchema,
  EvidenceMappingResultSchema,
  ClaimAnalysisResultSchema,
  QuestionGenerationResultSchema
};
