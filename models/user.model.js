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
		emailId: {
			type: DataTypes.STRING,
			allowNull: false,
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
		passwordResetToken: {
			type: DataTypes.STRING,
			allowNull: true, // Token for password reset
		},
		passwordResetExpires: {
			type: DataTypes.DATE,
			allowNull: true, // Expiration time for the reset token
		},
	},
	{
		tableName: 'users',
		timestamps: true,
	}
);

module.exports = User;
