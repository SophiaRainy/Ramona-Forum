# 社区软件项目

这是一个基于 Node.js、Express 和 React 的高级社区软件项目。它提供了丰富的功能，包括用户认证、内容管理、社交互动、AI 集成等。

## 功能特性

- 用户认证（注册、登录、2FA、社交媒体登录）
- 多级权限控制（普通用户、版主、管理员、超级管理员）
- 内容管理（发帖、评论、标签系统）
- 社交功能（关注/取消关注、私聊、内容分享）
- AI 集成（AI 助手、内容推荐）
- 实时通信（使用 Socket.IO）
- 虚拟货币系统（卡密兑换）
- 个性化（头像框系统）
- 活动系统
- 群组功能
- 广告系统（支持统计和自动过期）
- 内容审核和举报功能
- GraphQL API
- 多语言支持
- 黑暗模式
- 文件上传（拖放功能）
- 富文本编辑器
- CAPTCHA 验证
- 搜索功能（使用 Elasticsearch）
- 用户通知系统
- 用户声誉系统
- 徽章系统（可自定义和自动授予）
- 多媒体内容支持（图片、视频、音频）
- 移动端应用（React Native）
- 内容过滤（不当内容自动过滤）
- 事件系统（用户可以创建和参与事件）
- 公告系统（管理员可以创建和管理公告）

## 技术栈

- 后端：Node.js, Express, MongoDB, GraphQL, Socket.IO, Elasticsearch
- 前端：React, TypeScript, Material-UI, Socket.IO-client
- 移动端：React Native
- 认证：JSON Web Tokens (JWT), 2FA, Passport.js
- AI：OpenAI API (GPT-3.5-turbo)
- 缓存：Redis
- 其他：Docker, CI/CD (GitHub Actions)

## 安装

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/community-software.git
   cd community-software
   ```

2. 安装依赖
   ```bash
   npm install
   cd client && npm install
   ```

3. 创建 `.env` 文件并设置环境变量
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   ELASTICSEARCH_NODE=your_elasticsearch_node
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

4. 运行应用
   ```bash
   npm run dev
   ```

## 使用方法

访问 `http://localhost:3000` 来使用 Web 应用。
对于移动应用，请参考 React Native 的文档进行设置和运行。

## 主要功能

1. 内容管理：用户可以发帖、评论，使用标签系统进行分类。支持富文本编辑和多媒体内容上传。
2. 社交互动：用户可以关注其他用户，查看关注用户的最新动态，进行私聊，分享内容到社交媒体。
3. AI 集成：AI 助手可以在私聊中提供帮助，系统还会根据用户行为推荐内容。使用 GPT-3.5-turbo 模型，支持响应缓存和内容过滤。
4. 虚拟经济：用户可以通过卡密兑换虚拟货币，购买个性化物品如头像框。
5. 广告系统：管理员可以创建和管理广告，系统会自动统计广告效果和处理过期广告。
6. 活动系统：管理员可以创建活动，用户可以参与。
7. 群组功能：用户可以创建和加入群组，在群组内进行交流。
8. 多语言支持：系统支持多种语言，用户可以自由切换。
9. 实时通信：使用 Socket.IO 实现实时私聊和通知。
10. 搜索功能：使用 Elasticsearch 实现高效的全文搜索。
11. 用户声誉系统：用户可以通过各种活动获得声誉积分，解锁特定功能。
12. 徽章系统：用户可以通过完成特定任务获得徽章，徽章可升级。
13. 多媒体编辑：支持基本的图片、视频和音频编辑功能。
14. 内容审核：自动过滤不当内容，用户可以举报违规内容。
15. 事件系统：用户可以创建和参与各种社区事件。
16. 公告系统：管理员可以创建和管理公告，用户可以在登录时看到最新公告。

## 管理员功能

1. 用户管理：查看、编辑、禁用用户账户。
2. 内容管理：审核、编辑、删除用户发布的内容。
3. 广告管理：创建、编辑、删除广告，查看广告效果统计。
4. 徽章管理：创建、编辑、删除徽章，设置徽章获取条件。
5. 活动管理：创建、编辑、删除社区活动。
6. 系统设置：管理系统全局设置，如内容过滤规则、用户权限等。
7. 公告管理：创建、编辑、删除公告，设置公告的有效期。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开一个 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)