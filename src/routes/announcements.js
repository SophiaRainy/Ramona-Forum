const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 获取当前活跃的公告
router.get('/active', async (req, res, next) => {
  try {
    const announcement = await Announcement.findOne({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort('-createdAt');
    res.json(announcement);
  } catch (err) {
    next(err);
  }
});

// 创建新公告（仅管理员）
router.post('/', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const { title, content, startDate, endDate } = req.body;
    const newAnnouncement = new Announcement({
      title,
      content,
      startDate,
      endDate
    });
    await newAnnouncement.save();
    res.json(newAnnouncement);
  } catch (err) {
    next(err);
  }
});

// 更新公告（仅管理员）
router.put('/:id', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const { title, content, startDate, endDate, isActive } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, startDate, endDate, isActive },
      { new: true }
    );
    res.json(announcement);
  } catch (err) {
    next(err);
  }
});

// 获取所有公告（仅管理员）
router.get('/', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort('-createdAt');
    res.json(announcements);
  } catch (err) {
    next(err);
  }
});

module.exports = router;