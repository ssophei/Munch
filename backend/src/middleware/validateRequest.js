// ===================================
// Request Validation Middleware
// ===================================

const { ApiError } = require('./errorHandler');

/**
 * Middleware factory to validate request data using Zod schemas
 * @param {Object} schemas - Object containing schemas for body, query, params
 * @returns {Function} Express middleware
 */
function validateRequest(schemas = {}) {
  return (req, res, next) => {
    try {
      // Validate request body
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          throw new ApiError(
            400,
            'VALIDATION_ERROR',
            'Invalid request body',
            result.error.issues
          );
        }
        req.body = result.data;
      }
      
      // Validate query parameters
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          throw new ApiError(
            400,
            'VALIDATION_ERROR',
            'Invalid query parameters',
            result.error.issues
          );
        }
        req.query = result.data;
      }
      
      // Validate route parameters
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          throw new ApiError(
            400,
            'VALIDATION_ERROR',
            'Invalid route parameters',
            result.error.issues
          );
        }
        req.params = result.data;
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = validateRequest;

