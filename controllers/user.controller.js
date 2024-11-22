/** @format */

const User = require('../models/user.model');

// Create a new user
const createUser = async (req, res) => {
	try {
		const {
			companyName,
			contactPerson,
			emailId,
			mobileNo,
			password,
			logoUrl,
			dashboardUrls,
			role,
		} = req.body;

		// Create the user in the database
		const user = await User.create({
			companyName,
			contactPerson,
			emailId,
			mobileNo,
			password,
			role: '2' || role,
			logoUrl,
			dashboardUrls: dashboardUrls || [],
		});

		res.status(201).json(user); // Respond with the created user
	} catch (err) {
		console.error('Error creating user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll();
		res.status(200).json(users); // Respond with all users
	} catch (err) {
		console.error('Error fetching users:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Get a user by ID
const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error('Error fetching user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Update a user
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			companyName,
			contactPerson,
			emailId,
			mobileNo,
			password,
			logoUrl,
			dashboardUrls,
		} = req.body;

		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		await user.update({
			companyName,
			contactPerson,
			emailId,
			mobileNo,
			password,
			logoUrl,
			dashboardUrls,
		});

		res.status(200).json({ message: 'User updated successfully' });
	} catch (err) {
		console.error('Error updating user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Delete a user
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		await user.destroy();
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (err) {
		console.error('Error deleting user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

const resetPassword = async (req, res) => {
	const { emailId, oldPassword, newPassword } = req.body;

	try {
		// Find the user by email ID
		const user = await User.findOne({ where: { emailId } });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if the old password matches
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid old password' });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the user's password
		await user.update({ password: hashedPassword });

		res.status(200).json({ message: 'Password reset successfully' });
	} catch (err) {
		console.error('Error during password reset:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	resetPassword,
};
