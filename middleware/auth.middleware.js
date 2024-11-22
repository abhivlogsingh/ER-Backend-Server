/** @format */

const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
	// Get the token from the Authorization header
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		return res.status(401).json({ error: 'No token provided' });
	}

	const token = authHeader.split(' ')[1]; // Extract the token part

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: 'Invalid or expired token' });
		}

		// Attach the decoded user data (from token payload) to the request object
		req.user = decoded;
		next();
	});
};

// Role Authorization Middleware
exports.authorizeRole = (allowedRoles) => {
	return (req, res, next) => {
		const userRole = req.user.role; // Extract role from decoded JWT

		if (!allowedRoles.includes(userRole)) {
			return res
				.status(403)
				.json({ error: 'Access denied. Unauthorized role.' });
		}

		next();
	};
};
