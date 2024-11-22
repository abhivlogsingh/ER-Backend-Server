const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Import Sequelize instance

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
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    select_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'requests',
    timestamps: true,
  }
);

module.exports = Request;
