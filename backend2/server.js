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

const sendEventToHookFlow = async () => {
  const secretKey = "sec_aba1d28cdb9ffc51663a400024133721bd66b297750e6d0c";
  const userId = "6af0b7db7b540b7b50b8524e";
  const payload = {
    orderId: "45393x7nnv83",
    productName: "LG Tv",
    price: "90k",
  };

  const response = await fetch('http://localhost:2000/api/events/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'secret-x-key': secretKey,
    },
    body: JSON.stringify({ userId, payload }),
  });

  const data = await response.json();
  return { status: response.status, data };
};

app.get('/send-event', async (req, res) => {
  try {
    const result = await sendEventToHookFlow();
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/send-event', async (req, res) => {
  try {
    const result = await sendEventToHookFlow();
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend2 running on port ${PORT}`);
});
