// Example logger.js (using Winston)
const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exceptions.log' })
  ]
});

// Express middleware (for request logging)
const requestLoggerMiddleware = (req, res, next) => {
  logger.info({
    message: 'Request received',
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
};

module.exports = {
  logger,          // For general logging
  requestLogger: requestLoggerMiddleware // For Express middleware
};