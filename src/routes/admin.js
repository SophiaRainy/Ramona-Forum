const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 获取所有用户（仅超级管理员可用）
router.get('/users', [auth, checkRole(['super'])], async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 更改用户角色（仅超级管理员可用）
router.put('/users/:userId/role', [
  auth, 
  checkRole(['super']),
  body('role').isIn(['user', 'moderator', 'admin', 'super']).withMessage('无效的角色')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { role: req.body.role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: '用户不存在' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;