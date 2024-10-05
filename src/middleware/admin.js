const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: '访问被拒绝。需要管理员权限。' });
    }
    next();
  } catch (err) {
    res.status(500).send('服务器错误');
  }
};