const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');

// Define routes
router.post('/', requestController.createRequest); // Create a new request
router.get('/', requestController.getAllRequests); // Get all requests
router.get('/:id', requestController.getRequestById); // Get a single request by ID
router.put('/:id', requestController.updateRequest); // Update a request by ID
router.delete('/:id', requestController.deleteRequest); // Delete a request by ID

module.exports = router;
