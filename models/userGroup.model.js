const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const UserGroup = sequelize.define(
  'UserGroup',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Group names must be unique
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 0, // Default status is inactive
    },
  },
  {
    tableName: 'user_groups',
    timestamps: true, // Includes createdAt and updatedAt
  }
);

module.exports = UserGroup;
