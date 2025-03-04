/** @format */

const express = require('express');
const multer = require('multer');
const path = require('path');
const formController = require('../controllers/form.controller'); // Import the form controller

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = 'modelsuploads/';
		cb(null, uploadPath); // Set the upload directory
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now(); // Use current timestamp for uniqueness
		const ext = path.extname(file.originalname); // Get the file extension
		const name = path.basename(file.originalname, ext); // Get file name without extension
		cb(null, `${name}-${timestamp}${ext}`); // Generate a unique filename
	},
});

// Multer upload configuration
const upload = multer({
	storage: storage,
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

// Define routes
router.post(
	'/',
	upload.single('image'),
	multerErrorHandler,
	formController.createForm
); // Create a form
router.get('/', formController.getAllForms); // Get all forms
router.get('/:id', formController.getFormById); // Get a specific form by ID
router.put(
	'/:id',
	upload.single('image'),
	multerErrorHandler,
	formController.updateForm
); // Update a form by ID
router.delete('/:id', formController.deleteForm); // Delete a form by ID

module.exports = router; // Export the router
