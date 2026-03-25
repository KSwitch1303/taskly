const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const POINTS_PER_NGN = Number(process.env.POINTS_PER_NGN || 2);
const MIN_WITHDRAW_NGN = Number(process.env.MIN_WITHDRAW_NGN || 2000);
const MIN_WITHDRAW_POINTS = MIN_WITHDRAW_NGN * POINTS_PER_NGN;

router.get('/balance', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('points');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ngnEstimate = user.points / POINTS_PER_NGN;
    return res.json({
      points: user.points,
      ngnEstimate,
      minWithdrawNgn: MIN_WITHDRAW_NGN,
      minWithdrawPoints: MIN_WITHDRAW_POINTS,
      pointsPerNgn: POINTS_PER_NGN
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch balance' });
  }
});

router.get('/transactions', requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({ transactions });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

router.get('/withdrawals', requireAuth, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json({ withdrawals });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
});

router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const { points, paymentDetails } = req.body;
    const pointsRequested = Number(points);

    if (!Number.isFinite(pointsRequested) || pointsRequested <= 0) {
      return res.status(400).json({ message: 'Invalid points amount' });
    }

    if (pointsRequested < MIN_WITHDRAW_POINTS) {
      return res.status(400).json({
        message: `Minimum withdrawal is ${MIN_WITHDRAW_NGN} NGN`
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user.id, points: { $gte: pointsRequested } },
      { $inc: { points: -pointsRequested } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    const ngnAmount = pointsRequested / POINTS_PER_NGN;
    const withdrawal = await Withdrawal.create({
      user: req.user.id,
      points: pointsRequested,
      ngnAmount,
      paymentDetails: paymentDetails || {}
    });

    await Transaction.create({
      user: req.user.id,
      type: 'withdraw_request',
      points: pointsRequested
    });

    return res.json({ withdrawal });
  } catch (err) {
    return res.status(500).json({ message: 'Withdrawal request failed' });
  }
});

module.exports = router;
