const express = require('express');
const router = express.Router();
const { getUserNotifications, markNotificationAsRead } = require('../controllers/notification.controller'); // ✅ Correct Controller

// 🔔 Get logged-in user notifications
router.get('/:userId', getUserNotifications);

// ✅ Mark notification as read
router.put('/:id/read', markNotificationAsRead);

module.exports = router;
