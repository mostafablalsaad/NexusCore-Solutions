
const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { login } = require('../controllers/authController');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);
router.post('/login',login);
// Admin routes
router.post('/', protect, admin, validate(schemas.service), createService);
router.put('/:id', protect, admin, validate(schemas.service), updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
