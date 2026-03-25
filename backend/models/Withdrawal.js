const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  ngnAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentDetails: {
    bankName: String,
    accountNumber: String,
    accountName: String
  },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
