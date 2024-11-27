const Request = require('../models/request.model'); // Import the model

const createRequest = async (req, res) => {
  console.log('Request Body:', req.body); // Debug body
  console.log('Uploaded File:', req.file); // Debug uploaded file

  try {
    const {
      description,
      type,
      requestDate,
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
    } = req.body;

    const attachment = req.file ? req.file.path : null; // Use file path if file is uploaded

    const request = await Request.create({
      description,
      type,
      requestDate,
      priority,
      requestorName,
      communicationMethod,
      completionStatus,
      attachment,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createRequest };


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
			return res.status(404).json({ error: 'Request not found' });
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
