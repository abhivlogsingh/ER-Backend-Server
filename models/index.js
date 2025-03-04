/** @format */

const { Sequelize } = require('sequelize');

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
	process.env.DB_NAME, // Database name
	process.env.DB_USER, // Database user
	process.env.DB_PASSWORD, // Database password
	{
		host: process.env.DB_HOST, // Database host
		dialect: 'mysql', // Using MySQL dialect
		port: process.env.DB_PORT || 3306, // Default MySQL port
		logging: process.env.DB_LOGGING === 'true' ? console.log : false, // Toggle logging with an env variable
		pool: {
			max: 10, // Maximum number of connections in the pool
			min: 0, // Minimum number of connections in the pool
			acquire: 30000, // Maximum time (ms) Sequelize will try to connect before throwing an error
			idle: 10000, // Time (ms) before a connection is released
		},
		dialectOptions: {
			ssl:
				process.env.DB_SSL === 'true'
					? { rejectUnauthorized: false }
					: undefined, // Optional SSL setup
		},
		define: {
			timestamps: false, // Disable default timestamps (createdAt, updatedAt)
		},
	}
);

(async () => {
	try {
		await sequelize.authenticate();
		console.log('🚀 Connected to the MySQL database successfully!');
	} catch (error) {
		console.error('❌ Unable to connect to the MySQL database:', error.message);
		if (error.original) console.error('Original Error:', error.original);
	} finally {
		// Optional: Close the connection immediately (useful for testing)
		// await sequelize.close();
	}
})();

module.exports = sequelize;
