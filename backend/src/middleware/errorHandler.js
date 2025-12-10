const logger = require('../utils/logger');

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: isProduction ? 'An error occurred' : err.message,
    ...((!isProduction && err.stack) && { stack: err.stack })
  });
};

module.exports = errorHandler;
