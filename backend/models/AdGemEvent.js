const mongoose = require('mongoose');

const adGemEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['clicked', 'postback', 'confirmed'],
    default: 'clicked'
  },
  transactionId: { type: String, unique: true, sparse: true },
  payoutUsd: { type: Number, default: 0 },
  rewardPoints: { type: Number, default: 0 },
  offerName: { type: String, default: '' },
  goalId: { type: String, default: '' },
  campaignId: { type: String, default: '' },
  adType: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  postbackAt: { type: Date, default: null },
  confirmedAt: { type: Date, default: null }
});

module.exports = mongoose.model('AdGemEvent', adGemEventSchema);
