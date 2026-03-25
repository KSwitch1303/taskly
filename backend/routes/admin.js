const express = require('express');
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/withdrawals', requireAuth, requireAdmin, async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const withdrawals = await Withdrawal.find(filter)
      .populate('user', 'email')
      .sort({ createdAt: -1 })
      .limit(200);
    return res.json({ withdrawals });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch withdrawals' });
  }
});

router.post('/withdrawals/:id/approve', requireAuth, requireAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = 'approved';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    await Transaction.create({
      user: withdrawal.user,
      type: 'withdraw_approved',
      points: withdrawal.points
    });

    return res.json({ withdrawal });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to approve withdrawal' });
  }
});

router.post('/withdrawals/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: 'Withdrawal already processed' });
    }

    withdrawal.status = 'rejected';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    await User.findByIdAndUpdate(withdrawal.user, {
      $inc: { points: withdrawal.points }
    });

    await Transaction.create({
      user: withdrawal.user,
      type: 'withdraw_rejected',
      points: withdrawal.points
    });

    return res.json({ withdrawal });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to reject withdrawal' });
  }
});

module.exports = router;
