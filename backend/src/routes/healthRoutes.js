// ===================================
// Health Check Routes
// ===================================

const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/healthController');

// GET /health
router.get('/', healthCheck);

module.exports = router;

