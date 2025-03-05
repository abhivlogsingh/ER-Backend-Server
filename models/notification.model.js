const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user.model');

const Notification = sequelize.define(
	'Notification',
	{
		receiverId: {
			type: DataTypes.INTEGER,
			allowNull: false, // Ye bataega ki ye kis user ke liye hai
			references: {
				model: User,
				key: 'id',
			},
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isRead: {
			type: DataTypes.BOOLEAN,
			defaultValue: false, // Default unread
		},
	},
	{
		tableName: 'notifications',
		timestamps: true,
	}
);

module.exports = Notification;
