/** @format */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/register', authController.signIn);
router.post('/login', authController.login);
router.post('/me', authenticateToken, authController.me);

module.exports = router;
