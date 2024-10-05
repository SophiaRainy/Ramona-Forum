const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const auth = require('../middleware/auth');

// 创建群组
router.post('/', auth, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newGroup = new Group({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id]
    });
    await newGroup.save();
    res.json(newGroup);
  } catch (err) {
    next(err);
  }
});

// 获取所有群组
router.get('/', async (req, res, next) => {
  try {
    const groups = await Group.find().populate('creator', 'username');
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

// 加入群组
router.post('/:id/join', auth, async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ msg: '群组不存在' });
    }
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ msg: '已经是群组成员' });
    }
    group.members.push(req.user.id);
    await group.save();
    res.json(group);
  } catch (err) {
    next(err);
  }
});

module.exports = router;