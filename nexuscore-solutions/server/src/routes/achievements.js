const express = require('express');
const router = express.Router();
const {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require('../controllers/achievementController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', getAchievements);
router.get('/:id', getAchievement);

// Admin routes
router.post('/', protect, admin, validate(schemas.achievement), createAchievement);
router.put('/:id', protect, admin, validate(schemas.achievement), updateAchievement);
router.delete('/:id', protect, admin, deleteAchievement);

module.exports = router;