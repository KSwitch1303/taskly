const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const AdGemEvent = require('../models/AdGemEvent');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
}

function isIpAllowed(req) {
  const list = (process.env.ADGEM_WHITELIST_IP || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);
  if (!list.length) return true;
  const ip = getClientIp(req);
  return list.includes(ip);
}

function buildUnsignedUrl(req) {
  const protoHeader = req.headers['x-forwarded-proto'];
  const hostHeader = req.headers['x-forwarded-host'] || req.get('host');
  const proto = protoHeader ? protoHeader.split(',')[0].trim() : req.protocol;
  const url = new URL(`${proto}://${hostHeader}${req.originalUrl}`);
  url.searchParams.delete('verifier');
  return url.toString();
}

function verifyPostback(req) {
  const key = process.env.ADGEM_POSTBACK_KEY;
  if (!key) return true;
  const verifier = String(req.query.verifier || '');
  if (!verifier) return false;
  const unsignedUrl = buildUnsignedUrl(req);
  const expected = crypto.createHmac('sha256', key).update(unsignedUrl).digest('hex');
  try {
    const expectedBuf = Buffer.from(expected, 'hex');
    const verifierBuf = Buffer.from(verifier, 'hex');
    if (expectedBuf.length !== verifierBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, verifierBuf);
  } catch (err) {
    return false;
  }
}

router.post('/click', requireAuth, async (req, res) => {
  try {
    const event = await AdGemEvent.create({ user: req.user.id, status: 'clicked' });
    return res.json({ id: event._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to record click' });
  }
});

router.get('/events', requireAuth, async (req, res) => {
  try {
    const events = await AdGemEvent.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
});

router.get('/postback', async (req, res) => {
  try {
    if (!isIpAllowed(req)) {
      return res.status(403).send('IP not allowed');
    }

    if (!verifyPostback(req)) {
      return res.status(403).send('Invalid verifier');
    }

    const playerId =
      req.query.player_id ||
      req.query.playerid ||
      req.query.userid ||
      req.query.user_id;
    const transactionId =
      req.query.transaction_id ||
      req.query.transactionid ||
      req.query.txid;
    const payoutRaw = req.query.payout || req.query.amount;

    if (!playerId || !transactionId || !payoutRaw) {
      return res.status(400).send('Missing required parameters');
    }

    const payoutUsd = Number(payoutRaw);
    if (!Number.isFinite(payoutUsd) || payoutUsd <= 0) {
      return res.status(400).send('Invalid payout');
    }

    const normalizedPlayerId = String(playerId).trim();
    if (!mongoose.Types.ObjectId.isValid(normalizedPlayerId)) {
      return res.status(400).send('Invalid player_id');
    }

    const user = await User.findById(normalizedPlayerId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const offerName = req.query.offer_name || '';
    const goalId = req.query.goal_id || '';
    const campaignId = req.query.campaign_id || '';
    const adType = req.query.ad_type || '';

    const USD_TO_NGN = Number(process.env.USD_TO_NGN || 1500);
    const REWARD_SHARE = Number(process.env.REWARD_SHARE || 0.3);
    const POINTS_PER_NGN = Number(process.env.POINTS_PER_NGN || 2);

    const grossNgn = payoutUsd * USD_TO_NGN;
    const userNgn = grossNgn * REWARD_SHARE;
    const rewardPoints = Math.floor(userNgn * POINTS_PER_NGN);

    const txid = `adgem:${transactionId}`;
    try {
      await Transaction.create({
        user: user._id,
        type: 'earn',
        points: rewardPoints,
        amountUsd: payoutUsd,
        txid
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.send('Already credited');
      }
      throw err;
    }

    const clicked = await AdGemEvent.findOne({
      user: user._id,
      status: 'clicked'
    }).sort({ createdAt: -1 });

    if (clicked) {
      clicked.status = 'postback';
      clicked.transactionId = transactionId;
      clicked.payoutUsd = payoutUsd;
      clicked.rewardPoints = rewardPoints;
      clicked.offerName = offerName;
      clicked.goalId = goalId;
      clicked.campaignId = campaignId;
      clicked.adType = adType;
      clicked.postbackAt = new Date();
      await clicked.save();
    } else {
      await AdGemEvent.create({
        user: user._id,
        status: 'postback',
        transactionId,
        payoutUsd,
        rewardPoints,
        offerName,
        goalId,
        campaignId,
        adType,
        postbackAt: new Date()
      });
    }

    if (rewardPoints > 0) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { points: rewardPoints, totalEarnedPoints: rewardPoints }
      });
    }

    const REFERRAL_EARN_PERCENT = Number(process.env.REFERRAL_EARN_PERCENT || 0.1);
    if (user.referredBy && rewardPoints > 0 && REFERRAL_EARN_PERCENT > 0) {
      const referralPoints = Math.floor(rewardPoints * REFERRAL_EARN_PERCENT);
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
