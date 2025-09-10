// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword, googleLogin } = require('../controllers/authController');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', signup);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post('/forgotpassword', forgotPassword);

// @route   POST api/-auth/resetpassword/:token
// @desc    Reset password
// @access  Public
router.post('/resetpassword/:token', resetPassword);

// ADD THIS NEW ROUTE
// @route   POST api/auth/google-login
// @desc    Authenticate user with Google
// @access  Public
router.post('/google-login', googleLogin);

module.exports = router;