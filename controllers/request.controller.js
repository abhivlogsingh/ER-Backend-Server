const Request = require("../models/request.model"); // Import the model

const createRequest = async (req, res) => {
  try {
    const {
      userId, // User ID from the payload
      description,
      type,
      requestDate,
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
    } = req.body;

    // Validate required fields
    if (!userId || !description || !type || !priority || !requestorName) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide all necessary details.',
      });
    }

    // Handle the file path for the attachment
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    // Create a new request record in the database
    const request = await Request.create({
      userId,
      description,
      type,
      requestDate: requestDate || new Date(), // Default to current date if not provided
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
      attachment,
    });

    // Return a success response
    res.status(201).json({
      message: 'Request created successfully',
      request,
    });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({
      error: 'Failed to create request. Please try again later.',
    });
  }
};



// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all requests by user
const getRequestsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await Request.findAll({ where: { userId } }); // Filter by userId
    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching user requests:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(request);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a request by ID
const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      type,
      requestDate,
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
    } = req.body;

    const attachment = req.file ? req.file.path : null;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await request.update({
      description,
      type,
      requestDate,
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
      attachment: attachment || request.attachment,
    });

    res.status(200).json({ message: "Request updated successfully" });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a request by ID
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await request.destroy();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestsByUser, // New function to get requests by user
  getRequestById,
  updateRequest,
  deleteRequest,
};
