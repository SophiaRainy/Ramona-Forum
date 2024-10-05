const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// 创建活动
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user.id
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    next(err);
  }
});

// 获取所有活动
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().populate('organizer', 'username');
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// 参加活动
router.post('/:id/join', auth, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: '活动不存在' });
    }
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: '已经参加了该活动' });
    }
    event.participants.push(req.user.id);
    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
});

module.exports = router;