const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const OfferClick = require('../models/OfferClick');

router.get('/', async (req, res) => {
  try {
    const { user_id, amount, txid, secret } = req.query;

    console.log('POSTBACK HIT:', req.query);

    if (secret !== process.env.CPA_SECRET) {
      console.log('POSTBACK INVALID SECRET');
      return res.status(403).send('Invalid secret');
    }

    if (!user_id || !amount || !txid) {
      console.log('POSTBACK MISSING PARAMS');
      return res.status(400).send('Missing required parameters');
    }

    const amountUsd = Number(amount);
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return res.status(400).send('Invalid amount');
    }

    const user = await User.findById(user_id);
    if (!user) {
      console.log('POSTBACK USER NOT FOUND:', user_id);
      return res.status(404).send('User not found');
    }

    const USD_TO_NGN = Number(process.env.USD_TO_NGN || 1500);
    const REWARD_SHARE = Number(process.env.REWARD_SHARE || 0.3);
    const POINTS_PER_NGN = Number(process.env.POINTS_PER_NGN || 2);
    const REFERRAL_EARN_PERCENT = Number(process.env.REFERRAL_EARN_PERCENT || 0.1);

    const grossNgn = amountUsd * USD_TO_NGN;
    const userNgn = grossNgn * REWARD_SHARE;
    const points = Math.floor(userNgn * POINTS_PER_NGN);

    try {
      await Transaction.create({
        user: user._id,
        type: 'earn',
        points,
        amountUsd,
        txid
      });
    } catch (err) {
      if (err && err.code === 11000) {
        console.log('POSTBACK DUPLICATE TXID:', txid);
        return res.send('Already credited');
      }
      throw err;
    }

    const pendingClick = await OfferClick.findOne({
      user: user._id,
      status: 'pending'
    }).sort({ createdAt: -1 });

    if (pendingClick) {
      pendingClick.status = 'confirmed';
      pendingClick.txid = txid;
      pendingClick.amountUsd = amountUsd;
      pendingClick.points = points;
      pendingClick.confirmedAt = new Date();
      await pendingClick.save();
    } else {
      await OfferClick.create({
        user: user._id,
        status: 'confirmed',
        txid,
        amountUsd,
        points,
        confirmedAt: new Date()
      });
    }

    if (points > 0) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { points, totalEarnedPoints: points }
      });
    }

    if (user.referredBy && points > 0 && REFERRAL_EARN_PERCENT > 0) {
      const referralPoints = Math.floor(points * REFERRAL_EARN_PERCENT);
      if (referralPoints > 0) {
        await User.findByIdAndUpdate(user.referredBy, {
          $inc: { points: referralPoints, totalEarnedPoints: referralPoints }
        });
        await Transaction.create({
          user: user.referredBy,
          type: 'referral_bonus',
          points: referralPoints
        });
      }
    }

    return res.send('OK');
  } catch (err) {
    return res.status(500).send('Server error');
  }
});

module.exports = router;
