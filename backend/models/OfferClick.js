const mongoose = require('mongoose');

const offerClickSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['clicked', 'pending', 'confirmed', 'expired'],
    default: 'clicked'
  },
  txid: { type: String, default: null },
  amountUsd: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  postbackAt: { type: Date, default: null },
  confirmedAt: { type: Date, default: null }
});

module.exports = mongoose.model('OfferClick', offerClickSchema);
