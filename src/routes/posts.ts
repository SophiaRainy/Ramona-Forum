import express from 'express';
import elasticClient from '../services/elasticsearch';
import Notification from '../models/Notification';

const router = express.Router();

// ... 其他路由保持不变

// 搜索帖子
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    const result = await elasticClient.search({
      index: 'posts',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['title', 'content', 'tags']
          }
        }
      }
    });

    const posts = result.body.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

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

    // 创建通知
    if (post.user.toString() !== req.user.id) {
      const notification = new Notification({
        recipient: post.user,
        sender: req.user.id,
        type: 'post_like',
        post: post._id
      });
      await notification.save();
    }

    res.json(post.likes);
  } catch (err) {
    next(err);
  }
});

// 获取所有标签
router.get('/tags', async (req, res, next) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(tags);
  } catch (err) {
    next(err);
  }
});

// 根据标签获取帖子
router.get('/bytag/:tag', async (req, res, next) => {
  try {
    const posts = await Post.find({ tags: req.params.tag })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'username');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

export default router;