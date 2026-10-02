const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error('Unhandled API Error', {
    event: 'api_error',
    path: req.originalUrl,
    method: req.method,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred during processing.',
    event: 'error_response'
  });
}

module.exports = { errorHandler };
