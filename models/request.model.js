const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Request = sequelize.define(
  'Request',
  {
    userId: {
      type: DataTypes.INTEGER, // Assuming userId is an integer
      allowNull: false, // Make this false if it's mandatory
    },
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
      type: DataTypes.STRING, // File path
      allowNull: true,
    },
  },
  {
    tableName: 'requests',
    timestamps: true,
  }
);

module.exports = Request;
