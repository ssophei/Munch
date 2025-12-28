// ===================================
// Health Check Controller
// ===================================

const { checkFirebaseHealth } = require('../config/firebase');
const yelpService = require('../services/yelpService');

/**
 * Health check endpoint
 * GET /health
 */
async function healthCheck(req, res) {
  const checks = {
    firebase: false,
    yelp: false,
  };

  // Check Firebase
  try {
    checks.firebase = await checkFirebaseHealth();
  } catch (error) {
    console.error('Firebase health check error:', error);
  }

  // Check Yelp
  try {
    checks.yelp = await yelpService.checkHealth();
  } catch (error) {
    console.error('Yelp health check error:', error);
  }

  const allHealthy = checks.firebase && checks.yelp;
  const status = allHealthy ? 'ok' : 'degraded';

  res.status(allHealthy ? 200 : 503).json({
    ok: true,
    data: {
      status,
      timestamp: new Date().toISOString(),
      services: checks,
    },
    requestId: req.requestId,
  });
}

module.exports = {
  healthCheck,
};

