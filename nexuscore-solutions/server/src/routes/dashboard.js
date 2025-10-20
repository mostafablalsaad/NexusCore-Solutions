const express = require('express');
const router = express.Router();
const { getDashboardStats, uploadImage, uploadPDF } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');
const { uploadImage: multerImage, uploadPDF: multerPDF } = require('../config/cloudinary');

router.get('/stats', protect, admin, getDashboardStats);
router.post('/upload/image', protect, admin, multerImage.single('image'), uploadImage);
router.post('/upload/pdf', protect, admin, multerPDF.single('pdf'), uploadPDF);

module.exports = router;