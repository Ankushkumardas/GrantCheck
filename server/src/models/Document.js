const mongoose = require('mongoose');

const DocumentChunkSchema = new mongoose.Schema({
  chunkId: { type: String, required: true },
  pageNumber: { type: Number, required: true },
  section: { type: String, default: 'General' },
  text: { type: String, required: true }
}, { _id: false });

const DocumentSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['GUIDELINE', 'APPLICATION', 'SUPPORTING'],
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  chunks: [DocumentChunkSchema],
  extractedText: {
    type: String,
    default: ''
  },
  metadata: {
    pageCount: { type: Number, default: 0 },
    fileSize: { type: Number, default: 0 },
    extractedAt: { type: Date, default: Date.now }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Document', DocumentSchema);
