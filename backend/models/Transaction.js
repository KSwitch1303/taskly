const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'earn',
      'referral_bonus',
      'withdraw_request',
      'withdraw_approved',
      'withdraw_rejected'
    ],
    required: true
  },
  points: { type: Number, default: 0 },
  amountUsd: { type: Number, default: 0 },
  txid: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
