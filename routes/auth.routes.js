const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Authentication Routes
router.post('/signin', authController.signIn); // Sign In
router.post('/forgot-password', authController.forgotPassword); // Forgot Password
router.post('/verify-code', authController.verifyEmailCode); // Verify Email Code
router.post('/reset-password', authController.resetPassword); // Reset Password

module.exports = router;
