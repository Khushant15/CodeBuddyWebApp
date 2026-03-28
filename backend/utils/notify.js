const Notification = require('../models/Notification');

const triggerNotification = async (firebaseUID, title, message, type = 'system') => {
  try {
    const notification = new Notification({
      firebaseUID,
      title,
      message,
      type
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Failed to trigger notification:', err);
  }
};

module.exports = { triggerNotification };
