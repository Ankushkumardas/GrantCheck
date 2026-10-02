const mongoose = require('mongoose');

const MissingSupportingDocSchema = new mongoose.Schema({
  documentName: { type: String, required: true },
  requiredByReqId: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['MISSING', 'PROVIDED', 'NOT_APPLICABLE'], default: 'MISSING' }
}, { _id: false });

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Grant Application Review'
  },
  guidelineDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  applicationDocId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null
  },
  supportingDocIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  
  guidelineVersion: {
    type: Number,
    default: 1
  },
  applicationVersion: {
    type: Number,
    default: 1
  },
  
  status: {
    type: String,
    enum: ['DRAFT', 'ANALYZING', 'CURRENT', 'STALE', 'FAILED'],
    default: 'DRAFT'
  },
  staleReason: {
    type: String,
    default: ''
  },
  
  analysisStep: {
    type: String,
    enum: [
      'idle',
      'extracting_docs',
      'extracting_requirements',
      'mapping_evidence',
      'checking_claims',
      'generating_questions',
      'calculating_completeness',
      'completed',
      'failed'
    ],
    default: 'idle'
  },
  
  // Deterministic calculation results
  completenessScore: {
    type: Number,
    default: 0
  },
  mandatoryTotal: {
    type: Number,
    default: 0
  },
  mandatorySupported: {
    type: Number,
    default: 0
  },
  mandatoryWeak: {
    type: Number,
    default: 0
  },
  mandatoryAmbiguous: {
    type: Number,
    default: 0
  },
  mandatoryMissing: {
    type: Number,
    default: 0
  },
  
  recommendedTotal: {
    type: Number,
    default: 0
  },
  recommendedSupported: {
    type: Number,
    default: 0
  },

  missingSupportingDocuments: [MissingSupportingDocSchema],

  reviewedSummary: {
    totalReviewed: { type: Number, default: 0 },
    confirmedCount: { type: Number, default: 0 },
    correctedCount: { type: Number, default: 0 },
    rejectedCount: { type: Number, default: 0 },
    remainingIssuesCount: { type: Number, default: 0 },
    reviewedAt: { type: Date, default: null }
  },

  errorMessage: {
    type: String,
    default: null
  },
  
  createdBy: {
    type: String,
    default: 'demo@example.com'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
