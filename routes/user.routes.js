/** @format */

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/user.controller');
const {
	authenticateToken,
	authorizeRole,
} = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = 'modelsuploads/';
		cb(null, uploadPath); // Set the upload directory
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now(); // Use current timestamp for uniqueness
		const ext = path.extname(file.originalname); // Get the file extension
		cb(null, `image-${timestamp}${ext}`); // Generate a unique filename
	},
});

// Multer upload configuration
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Set a file size limit (5MB)
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png']; // Allowed file types
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
		}
		cb(null, true);
	},
});

// Error handling middleware for multer
const multerErrorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		console.error('Multer Error:', err.message);
		return res.status(400).json({ error: `Multer Error: ${err.message}` });
	} else if (err) {
		console.error('File Upload Error:', err.message);
		return res.status(400).json({ error: err.message });
	}
	next();
};

// Define CRUD routes for users
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers); // Get all users
router.post('/resetPassword', userController.resetPassword); // Create a new user
router.get('/:id', userController.getUserById); // Get a user by ID
router.put(
	'/:id',
	upload.single('image'),
	multerErrorHandler,
	userController.updateUser
); // Update a user by ID
router.delete('/:id', userController.deleteUser); // Delete a user by ID

// Routes
router.get(
	'/',
	authenticateToken,
	authorizeRole(['Admin']), // Only Admin can access
	userController.getAllUsers
);

// User routes
router.post(
	'/',
	authenticateToken,
	authorizeRole(['Admin']),
	userController.createUser
);

module.exports = router;
