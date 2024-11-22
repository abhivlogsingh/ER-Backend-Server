const requestModel = require('../models/requestModel');

// Create a new request
exports.createRequest = async (req, res) => {
    try {
        const requestData = req.body; // Data from the request body
        const result = await requestModel.createRequest(requestData); // Call model function
        res.status(201).json({ message: 'Request created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error in createRequest:', error.message);
        res.status(500).json({ message: 'Error creating request', error: error.message });
    }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await requestModel.getAllRequests(); // Fetch all requests
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error in getAllRequests:', error.message);
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

// Get a single request by ID
exports.getRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await requestModel.getRequestById(id); // Fetch by ID
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        console.error('Error in getRequestById:', error.message);
        res.status(500).json({ message: 'Error fetching request', error: error.message });
    }
};

// Update a request by ID
exports.updateRequest = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const result = await requestModel.updateRequest(id, updatedData); // Update query
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request updated successfully' });
    } catch (error) {
        console.error('Error in updateRequest:', error.message);
        res.status(500).json({ message: 'Error updating request', error: error.message });
    }
};

// Delete a request by ID
exports.deleteRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await requestModel.deleteRequest(id); // Delete query
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error in deleteRequest:', error.message);
        res.status(500).json({ message: 'Error deleting request', error: error.message });
    }
};
