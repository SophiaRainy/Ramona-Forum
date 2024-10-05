const User = require('../models/User');

module.exports = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!roles.includes(user.role)) {
        return res.status(403).json({ msg: '权限不足' });
      }
      next();
    } catch (err) {
      res.status(500).send('服务器错误');
    }
  };
};