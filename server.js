/** @format */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON
app.use(cors()); // Enable CORS

// Routes
app.use('/requests', requestRoutes); // Prefix for request routes

// Error Handling Middleware (for generic errors)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res
		.status(500)
		.json({ message: 'Something went wrong!', error: err.message });
});

// Start Server
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
