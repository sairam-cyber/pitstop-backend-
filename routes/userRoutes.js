// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary config
const auth = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  updateUserAddress,
  changePassword
} = require('../controllers/userController');

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-avatars', // Folder name in Cloudinary to store avatars
    allowed_formats: ['jpeg', 'png', 'jpg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  },
});

const upload = multer({ storage: storage });

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// This route now uses the new Cloudinary storage engine
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

router.put('/address', auth, updateUserAddress);

// @route   PUT api/user/password
// @desc    Change user password
router.put('/password', auth, changePassword);

module.exports = router;