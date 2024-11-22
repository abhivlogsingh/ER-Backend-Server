const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance
const UserGroup = require('./userGroup.model'); // Import user_groups model

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
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

// Relationship: A User belongs to one user_group
User.belongsTo(UserGroup, { foreignKey: 'groupId', as: 'role' });

module.exports = User;
