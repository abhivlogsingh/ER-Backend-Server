const Request = require('../models/request.model');

// Create a new request
const createRequest = async (req, res) => {
  try {
    const { description, type, duration, date, mode, select_name } = req.body;

    const request = await Request.create({
      description,
      type,
      duration,
      date,
      mode,
      select_name,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error('Error fetching request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a request by ID
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, type, duration, date, mode, select_name } = req.body;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await request.update({
      description,
      type,
      duration,
      date,
      mode,
      select_name,
    });

    res.status(200).json({ message: 'Request updated successfully' });
  } catch (err) {
    console.error('Error updating request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a request by ID
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await request.destroy();
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Error deleting request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
