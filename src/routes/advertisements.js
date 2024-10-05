const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// 获取当前活跃的广告
router.get('/active', async (req, res, next) => {
  try {
    const ad = await Advertisement.findOne({ 
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort('-createdAt');
    if (ad) {
      ad.impressions += 1;
      await ad.save();
    }
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

// 记录广告点击
router.post('/click/:id', async (req, res, next) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (ad) {
      ad.clicks += 1;
      await ad.save();
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// 创建新广告（仅管理员）
router.post('/', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const { imageUrl, linkUrl, expiresAt } = req.body;
    const newAd = new Advertisement({ 
      imageUrl, 
      linkUrl, 
      expiresAt: new Date(expiresAt)
    });
    await newAd.save();
    res.json(newAd);
  } catch (err) {
    next(err);
  }
});

// 更新广告（仅管理员）
router.put('/:id', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const { imageUrl, linkUrl, isActive, expiresAt } = req.body;
    const ad = await Advertisement.findByIdAndUpdate(req.params.id, 
      { imageUrl, linkUrl, isActive, expiresAt: new Date(expiresAt) }, 
      { new: true }
    );
    res.json(ad);
  } catch (err) {
    next(err);
  }
});

// 获取广告统计信息（仅管理员）
router.get('/stats', [auth, checkRole(['admin', 'super'])], async (req, res, next) => {
  try {
    const ads = await Advertisement.find().sort('-createdAt');
    res.json(ads.map(ad => ({
      id: ad._id,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      isActive: ad.isActive,
      expiresAt: ad.expiresAt,
      impressions: ad.impressions,
      clicks: ad.clicks,
      ctr: ad.impressions > 0 ? (ad.clicks / ad.impressions * 100).toFixed(2) + '%' : '0%'
    })));
  } catch (err) {
    next(err);
  }
});

module.exports = router;