/** @format */

const Notification = require('../models/notification.model');

// ✅ Get Notifications for Specific User
const getUserNotifications = async (req, res) => {
	try {
		const { userId } = req.params;

		// 🛠 Fetch all notifications for the user, latest first
		const notifications = await Notification.findAll({
			where: { receiverId: userId },
			order: [['createdAt', 'DESC']], // Latest notifications first
		});

		// 🛠 Check the latest notification's read status
		let latestNotificationStatus = null;
		if (notifications.length > 0) {
			latestNotificationStatus = notifications[0].isRead ? 'Read' : 'Unread';
		}

		res.status(200).json({
			message: `Notifications fetched successfully`,
			latestNotificationStatus, // ✅ Show Read/Unread status of the latest one
			notifications, // Return all notifications
		});
	} catch (err) {
		console.error('Error fetching notifications:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

// ✅ Mark Notification as Read
const markNotificationAsRead = async (req, res) => {
	try {
		const { id } = req.params; // 🆗 Notification ID from URL
		const notification = await Notification.findByPk(id);

		if (!notification) {
			return res.status(404).json({ error: 'Notification not found' });
		}

		await notification.update({ isRead: true });

		res.status(200).json({ message: 'Notification marked as read' });
	} catch (err) {
		console.error('Error updating notification:', err);
		res.status(500).json({ error: 'Server error' });
	}
};

module.exports = { getUserNotifications, markNotificationAsRead };
