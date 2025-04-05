const rateLimit = require('express-rate-limit');
const baseLimiter = require('./baseLimiter');

// Allows services to override the base limiter, just add the service here and the rate you want
function createDynamicLimiter(overrides = {}) {
  return rateLimit({
    ...baseLimiter,  // Defaults from base
    ...overrides     // Service-specific changes
  });
}

module.exports = { createDynamicLimiter };