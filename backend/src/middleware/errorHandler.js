// ===================================
// Error Handler Middleware
// ===================================

/**
 * Global error handler middleware
 * Formats errors in the standard API envelope
 */
function errorHandler(err, req, res, next) {
  const requestId = req.requestId || 'unknown';
  
  // Default error response
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_ERROR';
  let errorMessage = err.message || 'An unexpected error occurred';
  let errorDetails = err.details || undefined;
  
  // Log error
  console.error(`❌ [${requestId}] Error:`, {
    code: errorCode,
    message: errorMessage,
    stack: err.stack,
  });
  
  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    errorMessage = 'An unexpected error occurred';
    errorDetails = undefined;
  }
  
  // Send error response in standard envelope
  res.status(statusCode).json({
    ok: false,
    error: {
      code: errorCode,
      message: errorMessage,
      details: errorDetails,
    },
    requestId,
  });
}

/**
 * Create a custom API error
 */
class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

module.exports = {
  errorHandler,
  ApiError,
};

