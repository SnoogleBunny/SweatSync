const express = require('express');
const router = express.Router();
const { 
  getTrainers,
  createTrainerProfile,
  updateAvailability
} = require('../controllers/trainer.controller');

// GET /api/trainers?location=...
router.get('/', getTrainers);

// POST /api/trainers
router.post('/', createTrainerProfile);

// PATCH /api/trainers/availability
router.patch('/availability', updateAvailability);

module.exports = router;