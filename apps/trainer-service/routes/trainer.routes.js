const express = require('express');
const router = express.Router();
const { 
  getTrainers,
  createTrainerProfile,
  updateAvailability,
  updateTrainer
} = require('../controllers/trainer.controller');

// GET /api/trainers?location=...
router.get('/', getTrainers);

// POST /api/trainers
router.post('/', createTrainerProfile);

// PATCH /api/trainers/availability
router.patch('/availability', updateAvailability);

router.patch('/edit', updateTrainer);



module.exports = router;