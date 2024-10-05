const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const { createNotification } = require('../services/notificationService');
const NotificationSettings = require('../models/NotificationSettings');
const { checkAndAwardBadges } = require('../services/badgeService');

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// 关注用户
router.post('/follow/:id', auth, async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: '用户不存在' });
    }

    if (userToFollow.id === currentUser.id) {
      return res.status(400).json({ msg: '不能关注自己' });
    }

    if (currentUser.following.includes(userToFollow.id)) {
      return res.status(400).json({ msg: '已经关注了该用户' });
    }

    currentUser.following.push(userToFollow.id);
    userToFollow.followers.push(currentUser.id);

    // 创建通知
    await createNotification(userToFollow.id, currentUser.id, 'new_follower');

    await currentUser.save();
    await userToFollow.save();

    await checkAndAwardBadges(req.params.id);

    res.json({ msg: '关注成功' });
  } catch (err) {
    next(err);
  }
});

// 取消关注用户
router.post('/unfollow/:id', auth, async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: '用户不存在' });
    }

    if (!currentUser.following.includes(userToUnfollow.id)) {
      return res.status(400).json({ msg: '还没有关注该用户' });
    }

    currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow.id.toString());
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser.id.toString());

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ msg: '取消关注成功' });
  } catch (err) {
    next(err);
  }
});

// 获取关注列表
router.get('/following', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('following', 'username');
    res.json(user.following);
  } catch (err) {
    next(err);
  }
});

// 获取粉丝列表
router.get('/followers', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('followers', 'username');
    res.json(user.followers);
  } catch (err) {
    next(err);
  }
});

// 获取推荐关注
router.get('/recommended', auth, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const recommendedUsers = await User.aggregate([
      { $match: { _id: { $nin: [...currentUser.following, currentUser._id] } } },
      { $sample: { size: 5 } },
      { $project: { username: 1, email: 1 } }
    ]);
    res.json(recommendedUsers);
  } catch (err) {
    next(err);
  }
});

// 获取通知
router.get('/notifications', auth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username');
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// 标记通知为已读
router.put('/notifications/:id/read', auth, async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ msg: '通知不存在' });
    }
    res.json(notification);
  } catch (err) {
    next(err);
  }
});

// 获取未读通知数量
router.get('/notifications/unread-count', auth, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user.id, read: false });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// 搜索用户
router.get('/search', auth, async (req, res, next) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(10);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 获取通知设置
router.get('/notification-settings', auth, async (req, res, next) => {
  try {
    let settings = await NotificationSettings.findOne({ user: req.user.id });
    if (!settings) {
      settings = new NotificationSettings({ user: req.user.id });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// 更新通知设置
router.put('/notification-settings', auth, async (req, res, next) => {
  try {
    const settings = await NotificationSettings.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

// 获取用户声誉信息
router.get('/reputation', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('reputation level');
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;