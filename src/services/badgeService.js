const User = require('../models/User');
const Badge = require('../models/Badge');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { createNotification } = require('./notificationService');

const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  const badges = await Badge.find();

  for (let badge of badges) {
    let currentValue = 0;

    switch (badge.criteria) {
      case 'post_count':
        currentValue = await Post.countDocuments({ user: userId });
        break;
      case 'comment_count':
        currentValue = await Comment.countDocuments({ user: userId });
        break;
      case 'like_count':
        const likeCount = await Post.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } }
        ]);
        currentValue = likeCount[0]?.totalLikes || 0;
        break;
      case 'follower_count':
        currentValue = user.followers.length;
        break;
      case 'login_streak':
        currentValue = user.loginStreak;
        break;
      case 'reputation':
        currentValue = user.reputation;
        break;
    }

    const userBadge = user.badges.find(b => b.badge.equals(badge._id));
    const nextLevel = userBadge ? userBadge.level + 1 : 1;
    const nextThreshold = badge.thresholds.find(t => t.level === nextLevel);

    if (nextThreshold && currentValue >= nextThreshold.value) {
      if (userBadge) {
        userBadge.level = nextLevel;
      } else {
        user.badges.push({ badge: badge._id, level: nextLevel });
      }
      await user.save();

      // 创建通知
      await createNotification(userId, null, 'badge_earned', badge._id);
    }
  }
};

module.exports = { checkAndAwardBadges };