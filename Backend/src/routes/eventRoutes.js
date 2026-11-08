const express = require('express');
const authenticateUser = require('../middlewares/auth');
const Event = require('../models/Event');

const router = express.Router();

router.get('/my-events', authenticateUser, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({ events });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
