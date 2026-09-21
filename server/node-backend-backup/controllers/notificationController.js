const NotificationModel = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await NotificationModel.findByUser(userId);
    const unreadCount = await NotificationModel.countUnread(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching notifications'
    });
  }
};

// @desc    Get unread notification count for logged-in user
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const unreadCount = await NotificationModel.countUnread(userId);

    return res.status(200).json({
      success: true,
      unreadCount,
      count: unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching unread count'
    });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const notification = await NotificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (String(notification.userId) !== String(userId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify another user\'s notification'
      });
    }

    const updated = await NotificationModel.markAsRead(id, userId);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: updated
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating notification status'
    });
  }
};

// @desc    Mark all notifications for logged-in user as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await NotificationModel.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error marking all notifications as read'
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
