const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') { // Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join('. ');
  }

  if (err.code === 11000) { // Mongoose duplicate key
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // Final error response
  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  next();
};

module.exports = { errorHandler };