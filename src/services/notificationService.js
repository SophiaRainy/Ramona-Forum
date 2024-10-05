const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');
const Badge = require('../models/Badge');

const createNotification = async (recipientId, senderId, type, relatedId = null) => {
  try {
    const settings = await NotificationSettings.findOne({ user: recipientId });
    if (settings && !settings[type]) {
      return null;
    }

    let notificationContent = '';
    if (type === 'badge_earned') {
      const badge = await Badge.findById(relatedId);
      notificationContent = `你获得了 "${badge.name}" 徽章！`;
    }

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      relatedId,
      content: notificationContent
    });

    await notification.save();
    global.io.to(recipientId).emit('newNotification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = { createNotification };