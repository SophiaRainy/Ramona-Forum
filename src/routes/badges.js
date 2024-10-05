const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 获取所有徽章
router.get('/', async (req, res, next) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    next(err);
  }
});

// 创建新徽章（仅管理员）
router.post('/', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const { name, description, imageUrl, criteria } = req.body;
    const newBadge = new Badge({ name, description, imageUrl, criteria });
    await newBadge.save();
    res.json(newBadge);
  } catch (err) {
    next(err);
  }
});

// 授予用户徽章（仅管理员）
router.post('/award/:userId/:badgeId', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const badge = await Badge.findById(req.params.badgeId);
    if (!user || !badge) {
      return res.status(404).json({ msg: '用户或徽章不存在' });
    }
    if (user.badges.includes(badge._id)) {
      return res.status(400).json({ msg: '用户已拥有该徽章' });
    }
    user.badges.push(badge._id);
    await user.save();
    res.json(user.badges);
  } catch (err) {
    next(err);
  }
});

// 获取用户的徽章
router.get('/user', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('badges');
    res.json(user.badges);
  } catch (err) {
    next(err);
  }
});

module.exports = router;