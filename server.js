/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const requestRoutes = require('./routes/request.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', requestRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
