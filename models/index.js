/** @format */

const { Sequelize } = require('sequelize');

// Initialize Sequelize with database connection
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',
		port: process.env.DB_PORT,
		logging: false, // Disable logging; set to console.log to view SQL queries
	}
);

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Connected to the MySQL database successfully!');
	} catch (error) {
		console.error('Unable to connect to the MySQL database:', error);
	}
})();

module.exports = sequelize;
