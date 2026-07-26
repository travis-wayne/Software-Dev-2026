import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;
const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3010';
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3011';

app.use(express.json());

const orders = [
  { id: 1, userId: 1, items: [{ productId: 1, quantity: 1 }], total: 1200, status: 'completed' },
  { id: 2, userId: 2, items: [{ productId: 3, quantity: 2 }, { productId: 6, quantity: 1 }], total: 35, status: 'processing' }
];

app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'healthy' });
});

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.get('/orders/:id', async (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  try {
    // Data Aggregation Pattern!
    const userRes = await fetch(`${USER_SERVICE}/users/${order.userId}`);
    const userData = userRes.ok ? await userRes.json() : null;
    
    const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
      const prodRes = await fetch(`${PRODUCT_SERVICE}/products/${item.productId}`);
      const prodData = prodRes.ok ? await prodRes.json() : null;
      return { ...item, productDetails: prodData };
    }));
    
    res.json({
      ...order,
      user: userData,
      items: itemsWithDetails
    });
  } catch (error) {
    // Fallback if other services are down
    res.json({ ...order, warning: 'Partial data. Could not fetch dependencies.' });
  }
});

app.post('/orders', async (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    // 1. Validate User
    const userRes = await fetch(`${USER_SERVICE}/users/${userId}`);
    if (!userRes.ok) return res.status(400).json({ error: 'Invalid User' });

    // 2. Validate Products and calculate total
    let total = 0;
    for (const item of items) {
      const prodRes = await fetch(`${PRODUCT_SERVICE}/products/${item.productId}`);
      if (!prodRes.ok) return res.status(400).json({ error: `Invalid Product ID ${item.productId}` });
      const prodData = await prodRes.json();
      
      if (prodData.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for Product ID ${item.productId}` });
      }
      total += (prodData.price * item.quantity);
    }
    
    // 3. Create Order
    const newOrder = {
      id: orders.length + 1,
      userId,
      items,
      total,
      status: 'pending'
    };
    orders.push(newOrder);
    
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Internal dependency failure' });
  }
});

app.listen(PORT, () => {
  console.log(`🛒 Order Service running on port ${PORT}`);
});
