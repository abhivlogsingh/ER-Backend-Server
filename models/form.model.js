const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Sequelize instance

// Define the FormData model
const FormData = sequelize.define(
  'FormData',
  {
    // Description field
    description: {
      type: DataTypes.STRING(255), // Matches `description` column (VARCHAR(255))
      allowNull: false, // This field is mandatory
    },
    // Link field
    link: {
      type: DataTypes.STRING(255), // Matches `link` column (VARCHAR(255))
      allowNull: false, // This field is mandatory
      validate: {
        isUrl: true, // Ensures the value is a valid URL
      },
    },
    // Image Path field
    imagePath: {
      type: DataTypes.STRING(255), // Matches `image_path` column (VARCHAR(255))
      allowNull: false, // This field is mandatory
      field: 'image_path', // Explicitly map Sequelize field to SQL column
    },
  },
  {
    // Options
    tableName: 'form_data', // Explicitly set the table name to match the database
    timestamps: true, // Adds `created_at` and `updated_at` columns automatically
    underscored: true, // Use snake_case for automatically added fields
  }
);

module.exports = FormData;
