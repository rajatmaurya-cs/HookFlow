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

    const secretKey = "sec_5f529df612a3fb914d79395d3c6a5c40d64adb7c5d9c4a10"

    const userId = "6af0b7db7b540b7b50b8524e"

    const payload = {
      orderId:"45393x7nnv83",
      productName:"Samsung Mobile",
      price:"90k"
    }

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
