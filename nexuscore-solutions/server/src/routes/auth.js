
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
const upload = require('../middleware/uploadImages');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);
router.post('/login',login);
// Admin routes
router.post('/', protect, admin, validate(schemas.service), createService);
router.put('/:id', protect, admin, validate(schemas.service), updateService);
router.delete('/:id', protect, admin, deleteService);


// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log("File received:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});
module.exports = router;
