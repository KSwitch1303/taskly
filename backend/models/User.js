const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  points: { type: Number, default: 0 },
  totalEarnedPoints: { type: Number, default: 0 },

  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
