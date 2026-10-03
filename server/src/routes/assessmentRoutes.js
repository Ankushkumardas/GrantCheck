const express = require('express');
const router = express.Router();
const {
  createAssessment,
  listAssessments,
  getAssessment,
  uploadGuideline,
  uploadApplication,
  uploadSupportingDocuments,
  runAnalysis,
  getAssessmentResults,
  getAssessmentSummary,
  rerunAssessment,
  deleteAssessment
} = require('../controllers/assessmentController');
const { upload } = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Assessments CRUD
router.post('/', authMiddleware, createAssessment);
router.get('/', authMiddleware, listAssessments);
router.get('/:id', authMiddleware, getAssessment);
router.delete('/:id', authMiddleware, deleteAssessment);

// Document uploads
router.post('/:id/guideline', authMiddleware, upload.single('file'), uploadGuideline);
router.post('/:id/application', authMiddleware, upload.single('file'), uploadApplication);
router.post('/:id/supporting-documents', authMiddleware, upload.array('files', 10), uploadSupportingDocuments);

// AI Analysis Workflow
router.post('/:id/analyze', authMiddleware, apiLimiter, runAnalysis);
router.post('/:id/rerun', authMiddleware, apiLimiter, rerunAssessment);

// Results and Summaries
router.get('/:id/results', authMiddleware, getAssessmentResults);
router.get('/:id/summary', authMiddleware, getAssessmentSummary);

module.exports = router;
