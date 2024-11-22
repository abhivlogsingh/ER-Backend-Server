require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2/promise'); // Import mysql2 with promise support

// Function to test MySQL connection
const testConnection = async () => {
    try {
        // Create a MySQL connection using environment variables
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST, // Database host (e.g., localhost, or Hostinger hostname)
            user: process.env.DB_USER, // Database username
            password: process.env.DB_PASSWORD, // Database password
            database: process.env.DB_NAME, // Database name
            port: process.env.DB_PORT || 3306, // Database port (default is 3306 for MySQL)
        });

        console.log('Database connected successfully!');
        await connection.end(); // Close the connection after testing
    } catch (error) {
        // Log the error with additional information
        console.error('Database connection failed:', error.message);
        console.error('Ensure your environment variables are set correctly in the .env file.');
    }
};

// Run the connection test
testConnection();
