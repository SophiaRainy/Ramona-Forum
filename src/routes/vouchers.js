const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 兑换卡密 (所有用户都可以)
router.post('/redeem', [auth, [
  body('code').notEmpty().withMessage('卡密不能为空')
]], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { code } = req.body;
    const voucher = await Voucher.findOne({ code, isUsed: false });

    if (!voucher) {
      return res.status(400).json({ msg: '无效的卡密或卡密已被使用' });
    }

    const user = await User.findById(req.user.id);
    user.currency += voucher.value;
    await user.save();

    voucher.isUsed = true;
    voucher.usedBy = user._id;
    voucher.usedAt = Date.now();
    await voucher.save();

    res.json({ msg: '卡密兑换成功', newBalance: user.currency });
  } catch (err) {
    next(err);
  }
});

// 创建新卡密（仅管理员和超级管理员可用）
router.post('/create', [
  auth, 
  checkRole(['admin', 'super']), 
  [
    body('code').notEmpty().withMessage('卡密不能为空'),
    body('value').isNumeric().withMessage('卡密价值必须是数字')
  ]
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { code, value } = req.body;
    const newVoucher = new Voucher({ code, value });
    await newVoucher.save();
    res.json({ msg: '卡密创建成功', voucher: newVoucher });
  } catch (err) {
    next(err);
  }
});

// 获取所有卡密（仅管理员和超级管理员可用）
router.get('/', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;