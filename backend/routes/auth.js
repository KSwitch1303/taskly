const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const REFERRAL_BONUS_POINTS = Number(process.env.REFERRAL_BONUS_POINTS || 100);

function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function generateReferralCode() {
  for (let i = 0; i < 5; i += 1) {
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const exists = await User.findOne({ referralCode: code }).lean();
    if (!exists) return code;
  }
  return `${Date.now().toString(36).toUpperCase()}`.slice(-8);
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: String(referralCode).trim().toUpperCase() });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
      referredBy = referrer._id;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role =
      process.env.ADMIN_EMAIL &&
      normalizedEmail === String(process.env.ADMIN_EMAIL).trim().toLowerCase()
        ? 'admin'
        : 'user';

    const referralCodeGenerated = await generateReferralCode();
    const user = await User.create({
      email: normalizedEmail,
      password: passwordHash,
      referralCode: referralCodeGenerated,
      referredBy,
      role
    });

    if (referredBy && REFERRAL_BONUS_POINTS > 0) {
      await User.findByIdAndUpdate(referredBy, {
        $inc: { points: REFERRAL_BONUS_POINTS, totalEarnedPoints: REFERRAL_BONUS_POINTS }
      });
      await Transaction.create({
        user: referredBy,
        type: 'referral_bonus',
        points: REFERRAL_BONUS_POINTS
      });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        points: user.points,
        role: user.role,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        points: user.points,
        role: user.role,
        referralCode: user.referralCode
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
