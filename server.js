/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./models/index'); // Sequelize instance for database connection
const userRoutes = require('./routes/user.routes'); // Import user routes
const requestRoutes = require('./routes/request.routes'); // Import request routes
const authRoutes = require('./routes/auth.routes'); // Import auth routes

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/requests', requestRoutes); // Request-related routes
app.use('/api/auth', authRoutes); // Authentication routes

// Test the database connection
sequelize
	.authenticate()
	.then(() => console.log('Connected to the MySQL database successfully!'))
	.catch((err) => console.error('Failed to connect to the database:', err));

// Sync Sequelize models with the database
sequelize
	.sync({ alter: true }) // Synchronize models
	.then(() => console.log('Database models synced successfully!'))
	.catch((err) => console.error('Failed to sync database models:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
