const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/receive-event', (req, res) => {
  console.log('Received event from HookFlow:', req.body);
  return res.status(200).json({ status: 'received' });
});

app.post('/send-event', async (req, res) => {
  try {
    const { secretKey, userId, payload } = req.body;

    const response = await fetch('http://localhost:2000/api/events/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secret-x-key': secretKey,
      },
      body: JSON.stringify({ userId, payload }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend2 running on port ${PORT}`);
});
