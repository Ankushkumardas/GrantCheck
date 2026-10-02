const mongoose = require('mongoose');

const RequirementSourceSchema = new mongoose.Schema({
  document: { type: String, default: '' },
  page: { type: Number, default: 1 },
  section: { type: String, default: '' },
  text: { type: String, default: '' }
}, { _id: false });

const RequirementSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  reqId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['ELIGIBILITY', 'SUBMISSION', 'FINANCIAL', 'PROJECT_DESCRIPTION', 'GOVERNANCE', 'EVALUATION', 'OTHER'],
    default: 'ELIGIBILITY'
  },
  mandatory: {
    type: Boolean,
    required: true,
    default: true
  },
  source: RequirementSourceSchema,
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Requirement', RequirementSchema);
