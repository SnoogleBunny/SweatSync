require('dotenv').config();
const express = require('express');
const trainerRoutes = require('./routes/trainer.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./utils/logger');
const { baseLimiter } = require('@sweatsync/shared/ratelimiter');
const { authenticateJWT } = require('@sweatsync/shared/middleware');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(express.json());
app.use(requestLogger);
//app.use(authenticateJWT);

// Database Connection
connectDB();

// Routes
app.use('/api/trainers', baseLimiter, trainerRoutes);

//This should always be used AFTER the routes are imported
app.use(errorHandler);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Trainer service running on port ${PORT}`);
}); 