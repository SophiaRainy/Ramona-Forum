const { checkAndAwardBadges } = require('../services/badgeService');

router.post('/', auth, async (req, res, next) => {
  try {
    // ... 创建评论的代码

    await checkAndAwardBadges(req.user.id);

    res.json(newComment);
  } catch (err) {
    next(err);
  }
});