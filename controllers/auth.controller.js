/** @format */

const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

// User Sign-In
exports.signIn = async (req, res) => {
	const { emailId, password } = req.body;

	try {
		const user = await User.findOne({
			where: { emailId },
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid password' });
		}

		// Generate JWT token and include role
		const tokenPayload = {
			id: user.id,
			emailId: user.emailId,
			role: user.role, // Include role in the token payload
		};

		const token = generateToken(tokenPayload);

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				emailId: user.emailId,
				companyName: user.companyName,
				role: user.role, // Include role in the response
			},
		});
	} catch (err) {
		console.error('Error during sign-in:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

exports.login = async (req, res) => {
	const { emailId, password } = req.body;

	try {
		const user = await User.findOne({ where: { emailId } });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid password' });
		}

		// Generate JWT token
		const token = generateToken({ id: user.id, role: user.role });

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				emailId: user.emailId,
				companyName: user.companyName,
				role: user.role,
			},
		});
	} catch (err) {
		console.error('Error during login:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

exports.me = async (req, res) => {
	try {
		const userId = req.user.id; // Extracted from JWT middleware
		const user = await User.findOne({
			where: { id: userId },
			attributes: ['id', 'emailId', 'companyName', 'role'], // Return specific fields
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json({
			message: 'User details fetched successfully',
			user,
		});
	} catch (err) {
		console.error('Error fetching user details:', err);
		res.status(500).json({ error: 'Server error' });
	}
};
