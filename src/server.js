require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const vouchersRouter = require('./routes/vouchers');
const adminRouter = require('./routes/admin');
const messagesRouter = require('./routes/messages');
const avatarFramesRouter = require('./routes/avatarFrames');
const recommendationsRouter = require('./routes/recommendations');
const groupsRouter = require('./routes/groups');
const advertisementsRouter = require('./routes/advertisements');
const badgesRouter = require('./routes/badges');
const announcementsRouter = require('./routes/announcements');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 中间件
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制每个 IP 15 分钟内最多 100 个请求
});

app.use(limiter);

// 数据库连接
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users')); // 新增用户路由
app.use('/api/v1/auth', require('./api/v1/auth'));
app.use('/api/v1/posts', require('./api/v1/posts'));
app.use('/api/vouchers', vouchersRouter);  // 添加这行
app.use('/api/admin', adminRouter);  // 添加这行
app.use('/api/messages', messagesRouter);  // 添加这行
app.use('/api/avatar-frames', avatarFramesRouter);  // 添加这行
app.use('/api/recommendations', recommendationsRouter);  // 添加这行
app.use('/api/groups', groupsRouter);  // 添加这行
app.use('/api/advertisements', advertisementsRouter);  // 添加新路由
app.use('/api/badges', badgesRouter);
app.use('/api/announcements', announcementsRouter);

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('authenticate', (token) => {
    // 验证 token 并将 socket 与用户关联
    // 这里需要实现 verifyToken 函数
    const userId = verifyToken(token);
    if (userId) {
      socket.userId = userId;
      socket.join(userId); // 将 socket 加入到以用户 ID 命名的房间
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 在生产环境中提供静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 错误处理中间件应该在所有路由之后
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');

// ... 其他代码

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const cron = require('node-cron');
const Advertisement = require('./models/Advertisement');

// 每天午夜运行一次，停用过期广告
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await Advertisement.updateMany(
      { expiresAt: { $lte: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );
    console.log(`已停用 ${result.nModified} 个过期广告`);
  } catch (err) {
    console.error('停用过期广告时出错:', err);
  }
});

// 创建限速器
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制每个 IP 在 windowMs 内最多 100 个请求
  message: '请求过于频繁，请稍后再试。'
});

// 将限速器应用到所有路由
app.use('/api/', apiLimiter);

// 你也可以为特定路由设置不同的限制
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 小时
  max: 5, // 限制每个 IP 1小时内最多 5 次登录尝试
  message: '登录尝试次数过多，请稍后再试。'
});
app.use('/api/auth/login', authLimiter);

const https = require('https');
const fs = require('fs');

// 只在生产环境中使用 HTTPS
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('/path/to/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/path/to/cert.pem', 'utf8');
  const ca = fs.readFileSync('/path/to/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// 使用 cookie-parser 中间件
app.use(cookieParser());

// 设置 CSRF 保护
const csrfProtection = csrf({ cookie: true });

// 对需要保护的路由使用 CSRF
app.use('/api', csrfProtection);

// 提供一个路由来获取 CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});