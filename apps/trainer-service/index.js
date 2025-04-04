require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const trainerRoutes = require('./routes/trainer.routes');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {})
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/trainers', trainerRoutes);

//This should always be used AFTER the routes are imported
app.use(errorHandler);


// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Trainer service running on port ${PORT}`);
}); 