const express = require('express');
const router = express.Router();
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes
router.post('/', protect, admin, validate(schemas.teamMember), createTeamMember);
router.put('/:id', protect, admin, validate(schemas.teamMember), updateTeamMember);
router.delete('/:id', protect, admin, deleteTeamMember);

module.exports = router;