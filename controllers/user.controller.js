/** @format */

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const Notification = require('../models/notification.model'); // Import Notification Model

const createUser = async (req, res) => {
	try {
		const {
			companyName,
			contactPerson,
			email,
			mobileNo,
			password,
			dashboardUrl1,
			dashboardUrl2,
			dashboardUrl3,
			role,
			organizationMission,
			organizationSupport,
		} = req.body;

		// Check if password is provided
		if (!password) {
			return res.status(400).json({ error: 'Password is required' });
		}

		// Encrypt the password before storing it
		const hashedPassword = await bcrypt.hash(password, 10);

		// Check and assign the logo and image (if uploaded)
		const logoUrl = req?.files?.logo ? req.files.logo[0].path : '';
		const image = req?.files?.image ? req.files.image[0].path : '';

		// Create the user in the database
		const user = await User.create({
			companyName,
			contactPerson,
			email,
			mobileNo,
			password: hashedPassword, // Store hashed password
			role: role || '2', // Default role to '2' (User)
			logoUrl,
			dashboardUrl1: dashboardUrl1 || '',
			dashboardUrl2: dashboardUrl2 || '',
			dashboardUrl3: dashboardUrl3 || '',
			organizationMission: organizationMission || '',
			organizationSupport: organizationSupport || '',
			image,
		});

		// 🔔 Create Notification for the created user
		await Notification.create({
			receiverId: user.id, // Notification sirf iss user ke liye hoga
			message: `Welcome ${contactPerson}! Your account has been created.`,
		});

		res.status(201).json({
			message: 'User created successfully',
			user,
		});
	} catch (err) {
		console.error('Error creating user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll();
		res.status(200).json(users); // Return all users
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

		res.status(200).json(user); // Return the user by ID
	} catch (err) {
		console.error('Error fetching user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			companyName,
			contactPerson,
			email,
			mobileNo,
			password,
			dashboardUrl1,
			dashboardUrl2,
			dashboardUrl3,
			organizationMission,
			organizationSupport,
		} = req.body;

		// Find the existing user
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Prepare the updated data
		const updatedData = {
			companyName,
			contactPerson,
			email,
			mobileNo,
			logoUrl: req?.files?.logo ? req.files.logo[0].path : user?.logoUrl, // If logo is uploaded, update it
			dashboardUrl1: dashboardUrl1 || user.dashboardUrl1,
			dashboardUrl2: dashboardUrl2 || user.dashboardUrl2,
			dashboardUrl3: dashboardUrl3 || user.dashboardUrl3,
			organizationMission: organizationMission || user.organizationMission,
			organizationSupport: organizationSupport || user.organizationSupport,
			image: req?.files?.image ? req.files.image[0].path : user?.image, // If image is uploaded, update it
		};

		// If password is provided, hash the new password and update it
		if (password) {
			updatedData.password = await bcrypt.hash(password, 10);
		}

		// Update the user with the new data
		await user.update(updatedData);

		// 🔔 Create Notification for the updated user
		await Notification.create({
			receiverId: id, // Notification sirf iss user ke liye
			message: `Hello ${contactPerson}, your profile has been updated.`,
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

		// Delete the user
		await user.destroy();
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (err) {
		console.error('Error deleting user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// Reset Password
const resetPassword = async (req, res) => {
	const { email, oldPassword, newPassword } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Compare old password with stored hashed password
		const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Invalid old password' });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		await user.update({ password: hashedPassword });

		res.status(200).json({ message: 'Password reset successfully' });
	} catch (err) {
		console.error('Error during password reset:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = {
	createUser,
	updateUser,
	getAllUsers,
	getUserById,
	deleteUser,
	resetPassword,
};
