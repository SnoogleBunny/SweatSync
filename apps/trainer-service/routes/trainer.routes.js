const express = require('express');
const router = express.Router();
const { 
  getTrainers,
  getTrainerById,
  createTrainerProfile,
  updateAvailability,
  updateTrainer,
  deleteUsers
} = require('../controllers/trainer.controller');

// GET
router.get('/', getTrainers);
router.get('/:id', getTrainerById);

// POST 
router.post('/', createTrainerProfile);

// PATCH
router.patch('/availability', updateAvailability);
router.patch('/edit', updateTrainer);

// Administrative Routes (We will move these to a separate decoupled service later)
// DELETE
router.delete("/", deleteUsers);

module.exports = router;