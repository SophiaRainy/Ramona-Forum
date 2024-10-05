const mongoose = require('mongoose');

const NotificationSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newFollower: { type: Boolean, default: true },
  newMessage: { type: Boolean, default: true },
  postLike: { type: Boolean, default: true },
  postComment: { type: Boolean, default: true }
});

module.exports = mongoose.model('NotificationSettings', NotificationSettingsSchema);