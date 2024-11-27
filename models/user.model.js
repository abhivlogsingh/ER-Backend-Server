const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

const User = sequelize.define(
  'User',
  {
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('1', '2'),
      allowNull: false,
      defaultValue: '2',
      validate: {
        isIn: [['1', '2']],
      },
      comment: '1 for Admin, 2 for User',
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dashboardUrl1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dashboardUrl2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dashboardUrl3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationMission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationSupport: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
