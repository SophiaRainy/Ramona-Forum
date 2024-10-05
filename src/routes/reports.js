const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res, next) => {
  try {
    const { reportedItem, itemType, reason } = req.body;
    const newReport = new Report({
      reporter: req.user.id,
      reportedItem,
      itemType,
      reason
    });
    await newReport.save();
    res.json(newReport);
  } catch (err) {
    next(err);
  }
});

module.exports = router;