const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const UserGroup = require('../models/userGroup.model');
const { generateToken } = require('../utils/jwt');

// User Sign-In
exports.signIn = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({
      where: { emailId },
      include: { model: UserGroup, as: 'role' }, // Include role information
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
