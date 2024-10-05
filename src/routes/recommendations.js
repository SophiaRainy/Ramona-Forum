const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // 获取用户最近浏览和点赞的帖子的标签
    const recentInteractions = await Post.find({
      $or: [
        { _id: { $in: user.recentViews } },
        { likes: req.user.id }
      ]
    }).distinct('tags');

    // 基于这些标签推荐帖子
    const recommendedPosts = await Post.find({
      tags: { $in: recentInteractions },
      _id: { $nin: user.recentViews } // 排除已经看过的帖子
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'username');

    res.json(recommendedPosts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;