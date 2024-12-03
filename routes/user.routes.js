/** @format */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/user.controller');
const {
	authenticateToken,
	authorizeRole,
} = require('../middleware/auth.middleware');

// Multer storage configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = 'profileuploads/'; // Folder to store uploaded files
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${timestamp}${ext}`);
	},
});

// Multer upload middleware with file validation and size limit
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png'];
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
		}
		cb(null, true);
	},
}).fields([
	{ name: 'logo', maxCount: 1 }, // File input for logo
	{ name: 'image', maxCount: 1 }, // File input for user image
]);

// Define CRUD routes for users
router.post('/', upload, userController.createUser); // User creation route with file upload
router.get('/', userController.getAllUsers); // Get all users
router.post('/resetPassword', userController.resetPassword); // Reset password
router.get('/:id', userController.getUserById); // Get a user by ID
router.put('/:id', upload, userController.updateUser); // Update user with file upload
router.delete('/:id', userController.deleteUser); // Delete user

// Routes with authentication and role authorization
router.get(
	'/',
	authenticateToken,
	authorizeRole(['Admin']), // Only Admin can access
	userController.getAllUsers
);

// User routes with authentication and authorization
router.post(
	'/',
	authenticateToken,
	authorizeRole(['Admin']),
	upload, // File upload middleware for user creation
	userController.createUser
);

module.exports = router;
