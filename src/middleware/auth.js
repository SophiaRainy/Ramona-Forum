const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 从 header 获取 token
  const token = req.header('x-auth-token');

  // 检查是否有 token
  if (!token) {
    return res.status(401).json({ msg: '无 token，授权失败' });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, 'your_jwt_secret');

    // 将用户信息添加到请求对象
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token 无效' });
  }
};