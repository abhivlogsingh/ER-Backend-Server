const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load secret keys from .env

// Function to generate a token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id, // Include user ID
      role: user.role.name, // Include user role (e.g., Admin, User)
    },
    process.env.JWT_SECRET, // Secret key from .env
    {
      expiresIn: '1h', // Token expires in 1 hour
    }
  );
};

module.exports = { generateToken };
