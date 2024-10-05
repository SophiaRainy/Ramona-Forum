const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const AvatarFrame = require('../models/AvatarFrame');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 获取所有可用的头像框
router.get('/', auth, async (req, res, next) => {
  try {
    const frames = await AvatarFrame.find({ isAvailable: true });
    res.json(frames);
  } catch (err) {
    next(err);
  }
});

// 购买头像框
router.post('/buy/:id', auth, async (req, res, next) => {
  try {
    const frame = await AvatarFrame.findById(req.params.id);
    if (!frame || !frame.isAvailable) {
      return res.status(404).json({ msg: '头像框不存在或不可用' });
    }

    const user = await User.findById(req.user.id);
    if (user.currency < frame.price) {
      return res.status(400).json({ msg: '货币不足' });
    }

    user.currency -= frame.price;
    user.avatarFrame = frame._id;
    await user.save();

    res.json({ msg: '购买成功', newBalance: user.currency });
  } catch (err) {
    next(err);
  }
});

// 管理员添加新头像框
router.post('/', [auth, checkRole(['admin', 'super']), [
  body('name').notEmpty().withMessage('名称不能为空'),
  body('imageUrl').notEmpty().withMessage('图片URL不能为空'),
  body('price').isNumeric().withMessage('价格必须是数字')
]], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, imageUrl, price } = req.body;
    const newFrame = new AvatarFrame({ name, imageUrl, price });
    await newFrame.save();
    res.json(newFrame);
  } catch (err) {
    next(err);
  }
});

// 管理员修改头像框
router.put('/:id', [auth, checkRole(['admin', 'super']), [
  body('price').optional().isNumeric().withMessage('价格必须是数字'),
  body('isAvailable').optional().isBoolean().withMessage('可用性必须是布尔值')
]], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { price, isAvailable } = req.body;
    const frame = await AvatarFrame.findByIdAndUpdate(req.params.id, 
      { price, isAvailable }, 
      { new: true }
    );
    if (!frame) {
      return res.status(404).json({ msg: '头像框不存在' });
    }
    res.json(frame);
  } catch (err) {
    next(err);
  }
});

module.exports = router;