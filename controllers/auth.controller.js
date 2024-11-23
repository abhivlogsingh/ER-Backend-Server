/** @format */

const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const nodemailer = require('nodemailer');
exports.register = async (req, res) => {
	try {
		const {
			companyName,
			contactPerson,
			email,
			mobileNo,
			password,
			logoUrl,
			dashboardUrl1,
			dashboardUrl2,
			dashboardUrl3,
			role,
		} = req.body;

		// Encrypt the password before storing it
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user in the database
		const user = await User.create({
			companyName,
			contactPerson,
			email: email, // Assuming the column is emailId in the User model
			mobileNo,
			password: hashedPassword, // Store the hashed password
			role: role || '2', // Default role to '2' (User) if not provided
			logoUrl: logoUrl || '',
			dashboardUrl1: dashboardUrl1 || '', // Default to an empty array if not provided
			dashboardUrl2: dashboardUrl2 || '', // Default to an empty array if not provided
			dashboardUrl3: dashboardUrl3 || '', // Default to an empty array if not provided
		});

		res.status(201).json({
			message: 'User created successfully',
			user: {
				id: user.id,
				companyName: user.companyName,
				contactPerson: user.contactPerson,
				email: user.email,
				mobileNo: user.mobileNo,
				role: user.role,
				logoUrl: user.logoUrl,
				dashboardUrl1: user.dashboardUrl1,
				dashboardUrl2: user.dashboardUrl2,
				dashboardUrl3: user.dashboardUrl3,
			},
		});
	} catch (err) {
		console.error('Error creating user:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);
	try {
		const user = await User.findOne({ where: { email } });

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
				email: user.email,
				companyName: user.companyName,
				role: user.role,
				contactPerson: user.contactPerson,
				image: user.image,
				mobileNo: user.mobileNo,
				logoUrl: user.logoUrl,
				dashboardUrl1: user.dashboardUrl1,
				dashboardUrl2: user.dashboardUrl2,
				dashboardUrl3: user.dashboardUrl3,
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
			attributes: [
				'id',
				'email',
				'companyName',
				'role',
				'contactPerson',
				'image',
				'mobileNo',
				'logoUrl',
				'dashboardUrl1',
				'dashboardUrl2',
				'dashboardUrl3',
			], // Return specific fields
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

exports.forgetPassword = async (req, res) => {
	const { email } = req.body;

	try {
		// Find the user by email
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Generate a random password
		const randomPassword = Math.random().toString(36).slice(-8);

		// Hash the random password
		const hashedPassword = await bcrypt.hash(randomPassword, 10);

		// Update the user's password in the database
		await user.update({ password: hashedPassword });

		// Send the random password to the user's email
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
			port: process.env.SMTP_PORT, // e.g., 587 for TLS
			secure: process.env.SMTP_PORT, // true for SSL, false for TLS // Use your email service (e.g., Gmail, Outlook)
			auth: {
				user: process.env.EMAIL_USERNAME, // Your email address
				pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to: email,
			subject: 'Password Reset',
			text: `Your new password is: ${randomPassword}`,
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: 'New password sent to your email' });
	} catch (err) {
		console.error('Error during forget password:', err);
		res.status(500).json({ error: 'Server error' });
	}
};
