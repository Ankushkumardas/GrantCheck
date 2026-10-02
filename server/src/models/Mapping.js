const mongoose = require('mongoose');

const EvidenceSourceSchema = new mongoose.Schema({
  document: { type: String, required: true },
  page: { type: Number, default: 1 },
  section: { type: String, default: '' },
  text: { type: String, required: true }
}, { _id: false });

const MappingSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement',
    required: true
  },
  reqId: {
    type: String,
    required: true
  },
  aiStatus: {
    type: String,
    enum: ['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING'],
    required: true
  },
  aiReason: {
    type: String,
    default: ''
  },
  aiEvidence: [EvidenceSourceSchema],
  
  // Human in the loop review fields
  humanStatus: {
    type: String,
    enum: ['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING', null],
    default: null
  },
  humanAction: {
    type: String,
    enum: ['CONFIRM', 'CORRECT', 'REJECT', null],
    default: null
  },
  humanComment: {
    type: String,
    default: ''
  },
  finalStatus: {
    type: String,
    enum: ['SUPPORTED', 'WEAK', 'AMBIGUOUS', 'MISSING'],
    required: true
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mapping', MappingSchema);
