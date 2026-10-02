const mongoose = require('mongoose');

const ReviewLogSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  mappingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mapping',
    required: true
  },
  reqId: {
    type: String,
    required: true
  },
  previousStatus: {
    type: String,
    required: true
  },
  newStatus: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['CONFIRM', 'CORRECT', 'REJECT'],
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: String,
    default: 'demo-user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReviewLog', ReviewLogSchema);
