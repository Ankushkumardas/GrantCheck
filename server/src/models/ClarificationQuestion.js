const mongoose = require('mongoose');

const ClarificationQuestionSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  requirementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Requirement'
  },
  reqId: {
    type: String,
    required: true
  },
  statusTrigger: {
    type: String,
    enum: ['WEAK', 'AMBIGUOUS', 'MISSING'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  context: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClarificationQuestion', ClarificationQuestionSchema);
