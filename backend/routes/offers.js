const express = require('express');
const OfferClick = require('../models/OfferClick');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/click', requireAuth, async (req, res) => {
  try {
    const click = await OfferClick.create({ user: req.user.id });
    return res.json({ clickId: click._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to record click' });
  }
});

router.get('/clicks', requireAuth, async (req, res) => {
  try {
    const clicks = await OfferClick.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ clicks });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch clicks' });
  }
});

module.exports = router;
