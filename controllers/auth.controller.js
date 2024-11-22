const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user.model'); // User model
require('dotenv').config();

// Helper: Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.emailId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper: Send Email
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

// Sign In API
exports.signIn = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during sign in:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot Password API
exports.forgotPassword = async (req, res) => {
  const { emailId } = req.body;

  try {
    const user = await User.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

    await user.save();

    await sendEmail(user.emailId, 'Password Reset Code', `Your reset code is: ${resetToken}`);

    res.status(200).json({ message: 'Password reset code sent' });
  } catch (err) {
    console.error('Error during forgot password:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify Email Code API
exports.verifyEmailCode = async (req, res) => {
  const { emailId, code } = req.body;

  try {
    const user = await User.findOne({ where: { emailId } });

    if (!user || user.passwordResetToken !== code || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    res.status(200).json({ message: 'Code verified successfully' });
  } catch (err) {
    console.error('Error during email verification:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset Password API
exports.resetPassword = async (req, res) => {
  const { emailId, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error during password reset:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
