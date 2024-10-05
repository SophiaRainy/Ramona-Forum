const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getAIResponse } = require('../services/aiAssistant');
const { createNotification } = require('../services/notificationService');

// 获取用户的所有对话
router.get('/conversations', auth, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user.id] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $addFields: {
          isFollowing: { $in: ['$_id', currentUser.following] }
        }
      },
      {
        $sort: { isFollowing: -1, 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (err) {
    next(err);
  }
});

// 获取与特定用户的对话
router.get('/:userId', auth, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// 发送新消息
router.post('/', auth, async (req, res, next) => {
  try {
    const { recipient, content } = req.body;
    const sender = await User.findById(req.user.id);
    const recipientUser = await User.findById(recipient);

    const newMessage = new Message({
      sender: sender._id,
      recipient,
      content
    });

    await newMessage.save();

    // 如果接收者开启了 AI 助手，生成 AI 回复
    if (recipientUser.aiAssistantEnabled) {
      try {
        const aiResponse = await getAIResponse(content);
        const aiMessage = new Message({
          sender: recipient,
          recipient: sender._id,
          content: aiResponse,
          isAIResponse: true
        });
        await aiMessage.save();
        res.json([newMessage, aiMessage]);
      } catch (error) {
        console.error('Error generating AI response:', error);
        res.json(newMessage);
      }
    } else {
      // 创建通知
      await createNotification(recipient, req.user.id, 'new_message', newMessage._id);

      res.json(newMessage);
    }
  } catch (err) {
    next(err);
  }
});

// 切换 AI 助手
router.post('/toggle-ai', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.aiAssistantEnabled = !user.aiAssistantEnabled;
    await user.save();
    res.json({ aiAssistantEnabled: user.aiAssistantEnabled });
  } catch (err) {
    next(err);
  }
});

module.exports = router;