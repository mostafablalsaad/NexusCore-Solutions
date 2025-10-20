const express = require('express');
const router = express.Router();
const {
  submitContact,
  getMessages,
  getMessage,
  markAsRead,
  respondToMessage,
  deleteMessage,
  exportMessages,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { contactLimiter } = require('../middleware/rateLimit');

// Public routes
router.post('/', contactLimiter, validate(schemas.contact), submitContact);

// Admin routes
router.get('/', protect, admin, getMessages);
router.get('/export', protect, admin, exportMessages);
router.get('/:id', protect, admin, getMessage);
router.put('/:id/read', protect, admin, markAsRead);
router.put('/:id/respond', protect, admin, respondToMessage);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
