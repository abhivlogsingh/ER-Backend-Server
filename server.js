/** @format */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // For logging HTTP requests
const helmet = require('helmet'); // For setting secure HTTP headers
const path = require('path'); // For working with file paths
require('dotenv').config();

const sequelize = require('./models/index'); // Sequelize instance for database connection
const userRoutes = require('./routes/user.routes'); // User-related routes
const requestRoutes = require('./routes/request.routes'); // Request-related routes
const authRoutes = require('./routes/auth.routes'); // Authentication routes
const formRoutes = require('./routes/form.routes'); // Import the routes

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests
app.use(helmet()); // Secure app with HTTP headers

// Static File Serving
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Static File Serving
app.use('/api/profileuploads', express.static(path.join(__dirname, 'profileuploads'))); // Serve uploaded files

// Static file serving for uploads
app.use('/api/modelsuploads', express.static(path.join(__dirname, 'modelsuploads')));


// Routes
app.use('/api/forms', formRoutes); // Use the form routes

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
	.sync({ alter: true }) // Synchronize models with the database
	.then(() => console.log('Database models synced successfully!'))
	.catch((err) => console.error('Failed to sync database models:', err));

// Handle undefined routes
app.use((req, res, next) => {
	res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
	console.error('Error:', err.message || err);
	res.status(err.status || 500).json({
		error: err.message || 'Internal Server Error',
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
