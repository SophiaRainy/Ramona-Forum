const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const contentModeration = require('../middleware/contentModeration');
const redisClient = require('../services/redis');
const { createNotification } = require('../services/notificationService');
const { updateReputation } = require('../services/reputationService');
const upload = require('../middleware/upload');
const sharp = require('sharp');
const Badge = require('../models/Badge');
const { checkAndAwardBadges } = require('../services/badgeService');

// 获取所有帖子（不需要认证）
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username');

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (err) {
    next(err);
  }
});

// 添加新帖子（需要认证）
router.post('/', [auth, contentModeration, [
  body('title').notEmpty().withMessage('标题不能为空'),
  body('content').notEmpty().withMessage('内容不能为空'),
  body('tags').optional().isArray()
]], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, content, tags } = req.body;

    const newPost = new Post({
      user: req.user.id,
      title,
      content,
      tags
    });

    await updateReputation(req.user.id, 'post_created');
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// 获取关注的人的最新帖子
router.get('/following', auth, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const posts = await Post.find({ user: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'username');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// 点赞帖子
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: '帖子不存在' });
    }
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: '已经点赞过了' });
    }
    post.likes.push(req.user.id);
    await post.save();
    await updateReputation(post.user, 'post_liked');
    await checkAndAwardBadges(post.user);
    res.json(post.likes);
  } catch (err) {
    next(err);
  }
});

// 获取热门帖子
router.get('/hot', async (req, res, next) => {
  try {
    const cachedPosts = await redisClient.get('hotPosts');
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const hotPosts = await Post.find()
      .sort({ likes: -1, createdAt: -1 })
      .limit(10)
      .populate('user', 'username');

    await redisClient.set('hotPosts', JSON.stringify(hotPosts), {
      EX: 3600 // 缓存1小时
    });

    res.json(hotPosts);
  } catch (err) {
    next(err);
  }
});

// 添加评论
router.post('/:id/comment', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: '帖子不存在' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      date: Date.now()
    };

    post.comments.unshift(newComment);
    await post.save();

    // 创建通知
    if (post.user.toString() !== req.user.id) {
      await createNotification(post.user, req.user.id, 'new_comment', post._id);
    }

    res.json(post.comments);
  } catch (err) {
    next(err);
  }
});

// 创建带有多媒体内容的帖子
router.post('/', [auth, upload.single('media')], async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      user: req.user.id
    });

    if (req.file) {
      newPost.mediaUrl = `/uploads/${req.file.filename}`;
      newPost.mediaType = req.file.mimetype.split('/')[0];

      // 如果是图片，进行压缩
      if (newPost.mediaType === 'image') {
        await sharp(req.file.path)
          .resize(800)
          .jpeg({ quality: 80 })
          .toFile(`uploads/compressed_${req.file.filename}`);
        newPost.mediaUrl = `/uploads/compressed_${req.file.filename}`;
      }
    }

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    next(err);
  }
});

// 在创建帖子的路由中
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    const newPost = new Post({
      user: req.user.id,
      title,
      content,
      tags
    });

    await updateReputation(req.user.id, 'post_created');

    // 检查是否达到徽章条件
    const user = await User.findById(req.user.id);
    const postCount = await Post.countDocuments({ user: req.user.id });
    
    if (postCount === 1) {
      const firstPostBadge = await Badge.findOne({ name: '第一篇帖子' });
      if (firstPostBadge && !user.badges.includes(firstPostBadge._id)) {
        user.badges.push(firstPostBadge._id);
        await user.save();
      }
    } else if (postCount === 10) {
      const tenPostsBadge = await Badge.findOne({ name: '十篇帖子' });
      if (tenPostsBadge && !user.badges.includes(tenPostsBadge._id)) {
        user.badges.push(tenPostsBadge._id);
        await user.save();
      }
    }

    await checkAndAwardBadges(req.user.id);

    res.json(newPost);
  } catch (err) {
    next(err);
  }
});

module.exports = router;