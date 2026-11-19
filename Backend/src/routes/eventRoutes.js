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

router.post('/:id/retry', authenticateUser, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.userId });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.status = 'pending';
    event.reason = '';
    event.attempts = 0;
    event.nextRetryAt = new Date();
    await event.save();

    return res.status(200).json({
      message: 'Event status reset to pending for dispatch',
      event,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
