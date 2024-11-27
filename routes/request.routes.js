const express = require('express');
const multer = require('multer');
const router = express.Router();
const requestController = require('../controllers/request.controller');


// Multer setup for file uploads
const upload = multer({
    dest: 'uploads/', // Directory for uploaded files
    limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
  });
// Define routes
router.post('/', upload.single('attachment'), requestController.createRequest); // Create request
router.get('/', requestController.getAllRequests); // Get all requests
router.get('/:id', requestController.getRequestById); // Get request by ID
router.put('/:id', upload.single('attachment'), requestController.updateRequest); // Update request
router.delete('/:id', requestController.deleteRequest); // Delete request

module.exports = router;
