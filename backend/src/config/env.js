// ===================================
// Environment Configuration
// ===================================

require('dotenv').config();

const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Yelp API
  yelp: {
    apiKey: process.env.YELP_API_KEY,
    apiUrl: process.env.YELP_API_URL || 'https://api.yelp.com/v3',
  },
  
  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : ['http://localhost:19000', 'http://localhost:19006', 'exp://localhost:19000'],
  },
};

/**
 * Validate required environment variables
 */
function validateEnv() {
  const warnings = [];
  
  if (!config.yelp.apiKey) {
    warnings.push('YELP_API_KEY not set - Yelp API integration disabled, using Firestore only');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    warnings.forEach(warn => console.warn(`   - ${warn}`));
  }
  
  return true;
}

module.exports = {
  config,
  validateEnv,
};

