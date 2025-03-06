// Example logger.js (using Winston)
const winston = require('winston');

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' })
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