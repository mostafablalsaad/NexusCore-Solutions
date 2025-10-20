const express = require('express');
const router = express.Router();
const {
  getWhitepapers,
  getWhitepaper,
  downloadWhitepaper,
  createWhitepaper,
  updateWhitepaper,
  deleteWhitepaper,
} = require('../controllers/whitepaperController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', getWhitepapers);
router.get('/:id', getWhitepaper);
router.get('/:id/download', downloadWhitepaper);

// Admin routes
router.post('/', protect, admin, validate(schemas.whitepaper), createWhitepaper);
router.put('/:id', protect, admin, validate(schemas.whitepaper), updateWhitepaper);
router.delete('/:id', protect, admin, deleteWhitepaper);

module.exports = router;