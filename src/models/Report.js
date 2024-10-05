const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedItem: { type: mongoose.Schema.Types.ObjectId, refPath: 'itemType' },
  itemType: { type: String, required: true, enum: ['Post', 'Comment', 'User'] },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);