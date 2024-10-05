const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    enum: ['post_count', 'comment_count', 'like_count', 'follower_count', 'login_streak', 'reputation'],
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  thresholds: [{
    level: Number,
    value: Number
  }]
});

module.exports = mongoose.model('Badge', BadgeSchema);