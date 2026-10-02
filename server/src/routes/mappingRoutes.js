const express = require('express');
const router = express.Router();
const { updateMappingReview } = require('../controllers/mappingController');
const { authMiddleware } = require('../middleware/auth');

router.patch('/:mappingId', authMiddleware, updateMappingReview);

module.exports = router;
