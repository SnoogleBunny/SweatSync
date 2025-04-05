const rateLimit = require('express-rate-limit');

const baseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Default limit for all services
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Combine IP + user ID (if authenticated)
    return req.user?.id ? `${req.ip}:${req.user.id}` : req.ip;
  },
  message: 'Too many requests, please try later'
});

module.exports = { baseLimiter };