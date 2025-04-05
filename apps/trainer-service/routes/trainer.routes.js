const express = require('express');
const router = express.Router();
const { 
  getTrainers,
  getTrainerById,
  createTrainerProfile,
  updateAvailability,
  updateTrainer
} = require('../controllers/trainer.controller');

// GET /api/trainers
router.get('/', getTrainers);

// GET /api/trainers
router.get('/:id', getTrainerById);

// POST /api/trainers
router.post('/', createTrainerProfile);

// PATCH /api/trainers/availability
router.patch('/availability', updateAvailability);

router.patch('/edit', updateTrainer);



module.exports = router;