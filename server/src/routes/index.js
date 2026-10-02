const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const mappingRoutes = require('./mappingRoutes');

router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/mappings', mappingRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Grant Application Completeness Assistant API',
    time: new Date().toISOString()
  });
});

module.exports = router;
