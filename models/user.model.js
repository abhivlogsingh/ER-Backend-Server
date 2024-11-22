/** @format */

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const User = sequelize.define(
	'User',
	{
		companyName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contactPerson: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		mobileNo: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM('1', '2'), // Enum definition
			allowNull: false,
			validate: {
				isIn: [['1', '2']], // Ensure the value is within the allowed enum
			},
			comment: '1 for Admin, 2 for User', // Optional: Descriptive comment for clarity
		},
		logoUrl: {
			type: DataTypes.STRING,
			allowNull: true, // Optional: Allow null values for the logoUrl column
		},
		dashboardUrl: {
			type: DataTypes.STRING,
			allowNull: true, // Optional: Allow null values for the dashboardUrl column
		},
	},
	{
		tableName: 'users',
		timestamps: true,
	}
);

module.exports = User;
