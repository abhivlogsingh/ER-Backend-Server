const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const Request = sequelize.define(
  'Request',
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    communicationMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completionStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING, // File path or name
      allowNull: true, // Optional
    },
  },
  {
    tableName: 'requests',
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

module.exports = Request;
