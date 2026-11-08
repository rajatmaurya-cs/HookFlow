const Event = require('../models/Event');
const { verifyEventOrganization } = require('./verificationService');

const dispatchSingleEvent = async (event) => {
  event.status = 'processing';
  await event.save();

  const verification = await verifyEventOrganization(event);

  if (!verification.valid) {
    event.status = 'failed';
    event.reason = verification.reason;
    event.attempts += 1;
    event.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000);
    await event.save();
    return;
  }

  const { organization } = verification;

  try {
    const response = await fetch(organization.destinationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-HookFlow-Event-Id': event._id.toString(),
      },
      body: JSON.stringify(event.payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Destination responded with status ${response.status}`);
    }

    event.status = 'completed';
    event.reason = '';
    await event.save();
  } catch (error) {
    event.status = 'failed';
    event.reason = error.message;
    event.attempts += 1;
    event.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000);
    await event.save();
  }
};

const processPendingEvents = async () => {
  try {
    const pendingEvents = await Event.find({
      status: { $in: ['pending', 'failed'] },
      nextRetryAt: { $lte: new Date() },
    }).limit(50);

    if (pendingEvents.length === 0) {
      return;
    }

    for (const event of pendingEvents) {
      await dispatchSingleEvent(event);
    }
  } catch (error) {
    console.error('Error scanning pending events:', error.message);
  }
};

const startEventDispatcherCron = (intervalMs = 5 * 60 * 1000) => {
  processPendingEvents();
  return setInterval(processPendingEvents, intervalMs);
};

module.exports = {
  processPendingEvents,
  startEventDispatcherCron,
  dispatchSingleEvent,
};
