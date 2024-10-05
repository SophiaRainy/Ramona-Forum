const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const passwordValidator = require('password-validator');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const NotificationSettings = require('../models/NotificationSettings');
const passport = require('../config/passport');
const { checkAndAwardBadges } = require('../services/badgeService');

const schema = new passwordValidator();
schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();

router.post('/register', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('password').custom((value) => {
    if (!schema.validate(value)) {
      throw new Error('密码必须至少8个字符，包含大小写字母和数字，不能包含空格');
    }
    return true;
  })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: '用户已存在' });
    }

    user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // 创建默认的通知设置
    await NotificationSettings.create({ user: user.id });

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').exists().withMessage('请输入密码')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: '无效的凭证' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: '无效的凭证' });
    }

    user.updateLoginStreak();
    await user.save();
    await checkAndAwardBadges(user._id);

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    next(err);
  }
});

// 生成 2FA 密钥
router.post('/generate-2fa', auth, async (req, res) => {
  const secret = speakeasy.generateSecret({ name: 'YourAppName' });
  
  try {
    const user = await User.findById(req.user.id);
    user.twoFactorSecret = secret.base32;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      res.json({ secret: secret.base32, qr: data_url });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 验证 2FA 令牌
router.post('/verify-2fa', auth, async (req, res) => {
  const { token } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token
    });

    if (verified) {
      user.twoFactorEnabled = true;
      await user.save();
      res.json({ msg: '2FA enabled successfully' });
    } else {
      res.status(400).json({ msg: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// 社交媒体登录
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/auth-success?token=${token}`);
  });

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`/auth-success?token=${token}`);
  });

module.exports = router;