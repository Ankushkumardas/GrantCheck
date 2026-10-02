const mongoose = require('mongoose');

const ClaimSourceSchema = new mongoose.Schema({
  document: { type: String, default: 'draft-application.pdf' },
  page: { type: Number, default: 1 },
  section: { type: String, default: '' }
}, { _id: false });

const UnsupportedClaimSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  claimText: {
    type: String,
    required: true
  },
  source: ClaimSourceSchema,
  reason: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UnsupportedClaim', UnsupportedClaimSchema);
