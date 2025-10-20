const express = require('express');
const router = express.Router();
const {
  getCaseStudies,
  getCaseStudy,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require('../controllers/caseStudyController');
const { protect, admin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.get('/', getCaseStudies);
router.get('/:id', getCaseStudy);

// Admin routes
router.post('/', protect, admin, validate(schemas.caseStudy), createCaseStudy);
router.put('/:id', protect, admin, validate(schemas.caseStudy), updateCaseStudy);
router.delete('/:id', protect, admin, deleteCaseStudy);

module.exports = router;
