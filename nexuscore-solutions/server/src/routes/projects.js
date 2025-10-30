const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Admin routes
// router.post('/', protect, admin, validate(schemas.project), createProject);
router.post('/', protect, admin, createProject);
router.put('/:id', protect, admin, validate(schemas.project), updateProject);
router.delete('/:id', protect, admin, deleteProject);

module.exports = router;
