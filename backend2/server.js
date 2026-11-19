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
  orderId: "45393x7nnv83",
  SellerAssigned: "Arvind Traders",
  productName: "Beard Trimmer",
  ProductOrigin: "Japan",
  brand: "Panasonic",
  model: "ER-GB80",
  category: "Personal Grooming",
  quantity: 2,
  price: "90k",
  discount: "10%",
  tax: "18%",
  paymentStatus: "Paid",
  paymentMethod: "UPI",
  orderStatus: "Shipped",
  shippingAddress: {
    name: "Rahul Sharma",
    street: "42 Green Park",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    country: "India"
  },
  shipping: {
    courier: "BlueDart",
    trackingId: "BD782934561IN",
    estimatedDelivery: "2026-11-24"
  },
  customer: {
    customerId: "CUST78291",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210"
  },
  orderDate: "2026-11-19T14:30:00Z",
  warranty: "2 Years",
  returnEligible: true,
  sellerRating: 4.7
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

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend2 running on port ${PORT}`);
});
