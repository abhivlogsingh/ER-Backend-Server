const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Define CRUD routes for users
router.post('/', userController.createUser); // Create a new user
router.get('/', userController.getAllUsers); // Get all users
router.get('/:id', userController.getUserById); // Get a user by ID
router.put('/:id', userController.updateUser); // Update a user by ID
router.delete('/:id', userController.deleteUser); // Delete a user by ID


// Routes
router.get(
    '/',
    authenticateToken,
    authorizeRole(['Admin']), // Only Admin can access
    userController.getAllUsers
  );
  
  router.post(
    '/',
    authenticateToken,
    authorizeRole(['Admin']), // Only Admin can create users
    userController.createUser
  );

module.exports = router;
