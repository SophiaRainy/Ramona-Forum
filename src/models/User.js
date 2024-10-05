const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true  // 添加索引
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true  // 添加索引
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'super'],
    default: 'user',
  },
  moderatedSections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }],
  membershipLevel: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    default: 'basic',
  },
  currency: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  avatarFrame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AvatarFrame'
  },
  aiAssistantEnabled: {
    type: Boolean,
    default: false
  },
  reputation: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  googleId: String,
  facebookId: String,
  badges: [{
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    level: { type: Number, default: 1 }
  }],
  loginStreak: { type: Number, default: 0 },
  lastLogin: { type: Date }
});

// 添加复合索引
UserSchema.index({ createdAt: -1, username: 1 });

// 添加一个方法来更新用户等级
UserSchema.methods.updateLevel = function() {
  if (this.reputation < 100) {
    this.level = 1;
  } else if (this.reputation < 500) {
    this.level = 2;
  } else if (this.reputation < 1000) {
    this.level = 3;
  } else if (this.reputation < 5000) {
    this.level = 4;
  } else {
    this.level = 5;
  }
};

// 添加一个方法来更新登录连续天数
UserSchema.methods.updateLoginStreak = function() {
  const now = new Date();
  if (this.lastLogin && now.getDate() !== this.lastLogin.getDate()) {
    const daysSinceLastLogin = Math.floor((now - this.lastLogin) / (1000 * 60 * 60 * 24));
    if (daysSinceLastLogin === 1) {
      this.loginStreak += 1;
    } else {
      this.loginStreak = 1;
    }
  }
  this.lastLogin = now;
};

module.exports = mongoose.model('User', UserSchema);