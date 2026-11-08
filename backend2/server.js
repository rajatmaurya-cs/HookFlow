const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const receivedWebhooks = [];

app.post('/webhook-destination', (req, res) => {
  const incoming = {
    receivedAt: new Date(),
    headers: req.headers,
    payload: req.body,
  };

  receivedWebhooks.unshift(incoming);

  console.log('\n--- [backend2] RECEIVED WEBHOOK FROM HOOKFLOW ---');
  console.log('Headers:', req.headers);
  console.log('Payload:', JSON.stringify(req.body, null, 2));
  console.log('-------------------------------------------------\n');

  return res.status(200).json({
    status: 'success',
    message: 'Webhook received successfully by backend2 destination',
  });
});

app.get('/received', (req, res) => {
  return res.json({
    count: receivedWebhooks.length,
    webhooks: receivedWebhooks,
  });
});

app.post('/send-test-hook', async (req, res) => {
  const { secretKey, userId, payload, idempotencyKey } = req.body;

  if (!secretKey || !userId) {
    return res.status(400).json({
      error: 'secretKey and userId are required to send data to HookFlow',
    });
  }

  const hookFlowUrl = 'http://localhost:2000/api/events/ingest';

  try {
    const headers = {
      'Content-Type': 'application/json',
      'secret-x-key': secretKey,
    };

    if (idempotencyKey) {
      headers['idempotency-key'] = idempotencyKey;
    }

    const response = await fetch(hookFlowUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        payload: payload || { test: 'Hello from backend2', timestamp: Date.now() },
      }),
    });

    const data = await response.json();
    return res.status(response.status).json({
      status: response.status,
      hookflowResponse: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend2 test server is running on http://localhost:${PORT}`);
  console.log(`- Webhook Receiver URL: http://localhost:${PORT}/webhook-destination`);
  console.log(`- Check received hooks:  http://localhost:${PORT}/received`);
  console.log(`- Send test trigger:    POST http://localhost:${PORT}/send-test-hook`);
});
