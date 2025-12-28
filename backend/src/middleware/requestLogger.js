// ===================================
// Request Logger Middleware
// ===================================

const { v4: uuidv4 } = require('uuid');

/**
 * Middleware to log requests and attach a unique request ID
 */
function requestLogger(req, res, next) {
  // Generate unique request ID
  const requestId = uuidv4();
  req.requestId = requestId;
  
  // Store start time
  const startTime = Date.now();
  
  // Log request
  console.log(`➡️  [${requestId}] ${req.method} ${req.url}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`⬅️  [${requestId}] ${res.statusCode} ${req.method} ${req.url} - ${duration}ms`);
  });
  
  next();
}

module.exports = requestLogger;

