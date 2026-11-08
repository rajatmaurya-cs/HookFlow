const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    secretKey: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
