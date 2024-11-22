require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize'); // Import Sequelize

// Initialize Sequelize with database connection details
const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Database username
    process.env.DB_PASSWORD, // Database password
    {
        host: process.env.DB_HOST, // Database host
        dialect: 'mysql', // Specify MySQL as the database dialect
        dialectOptions: {
            connectTimeout: 60000, // Increase timeout to 60 seconds for slow connections
        },
        port: process.env.DB_PORT || 3306, // Database port (default is 3306)
        logging: false, // Disable logging; set to console.log to debug SQL queries
    }
);

// Test Sequelize connection
(async () => {
    try {
        // Authenticate Sequelize with the database
        await sequelize.authenticate();
        console.log('Connected to the MySQL database successfully via Sequelize!');
    } catch (error) {
        // Log error details if authentication fails
        console.error('Unable to connect to the MySQL database via Sequelize:', error.message);
        console.error(
            'Ensure the database is running, credentials are correct, and external access is allowed.'
        );
    }
})();

// Export the Sequelize instance for use in models
module.exports = sequelize;
