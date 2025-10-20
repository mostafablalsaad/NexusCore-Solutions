const express = require('express');
const router = express.Router();
const {
  subscribe,
  confirmSubscription,
  unsubscribe,
  getSubscribers,
  exportSubscribers,
  deleteSubscriber,
} = require('../controllers/newsletterController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.post('/subscribe', validate(schemas.newsletter), subscribe);
router.get('/confirm/:token', confirmSubscription);
router.post('/unsubscribe', validate(schemas.newsletter), unsubscribe);

// Admin routes
router.get('/', protect, admin, getSubscribers);
router.get('/export', protect, admin, exportSubscribers);
router.delete('/:id', protect, admin, deleteSubscriber);

module.exports = router;
