const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('./src/models/Event');
const authRoutes = require('./src/routes/authRoutes');
const organizationRoutes = require('./src/routes/organizationRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const checkIdempotency = require('./src/middlewares/idempotency');
const { startEventDispatcherCron } = require('./src/services/dispatcherService');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/events', eventRoutes);

app.post('/api/events/ingest', checkIdempotency(300), async (req, res) => {
  try {
    const secretKey = req.headers['secret-x-key'];
    const { userId, payload } = req.body;

    if (!secretKey) {
      return res.status(400).json({ error: 'secret-x-key is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!payload) {
      return res.status(400).json({ error: 'Payload data is required' });
    }

    const event = await Event.create({
      user: userId,
      secretKey,
      payload,
      idempotencyKey: req.idempotencyKey || null,
    });

    return res.status(202).json({
      message: 'Event accepted for dispatching',
      eventId: event._id,
      status: event.status,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 2000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hookflow';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    startEventDispatcherCron(5 * 60 * 1000);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
