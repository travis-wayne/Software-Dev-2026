import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;

app.use(express.json());

const products = [
  { id: 1, name: 'Laptop Pro', category: 'electronics', price: 1200, stock: 45, description: 'High end laptop' },
  { id: 2, name: 'Smartphone X', category: 'electronics', price: 800, stock: 120, description: 'Latest smartphone' },
  { id: 3, name: 'Coffee Mug', category: 'home', price: 15, stock: 300, description: 'Ceramic mug' },
  { id: 4, name: 'Desk Chair', category: 'furniture', price: 150, stock: 25, description: 'Ergonomic chair' },
  { id: 5, name: 'Headphones', category: 'electronics', price: 100, stock: 80, description: 'Noise cancelling' },
  { id: 6, name: 'Notebook', category: 'office', price: 5, stock: 500, description: 'Lined notebook' },
  { id: 7, name: 'Monitor 27"', category: 'electronics', price: 300, stock: 40, description: '4K monitor' },
  { id: 8, name: 'Keyboard', category: 'electronics', price: 50, stock: 150, description: 'Mechanical keyboard' }
];

// simulate delay
app.use((req, res, next) => {
  const jitter = Math.floor(Math.random() * 50);
  setTimeout(next, 50 + jitter);
});

app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'healthy' });
});

app.get('/products', (req, res) => {
  let result = products;
  if (req.query.category) {
    result = result.filter(p => p.category === req.query.category);
  }
  if (req.query.minPrice) {
    result = result.filter(p => p.price >= parseInt(req.query.minPrice));
  }
  res.json(result);
});

app.get('/products/:id', (req, res) => {
  const p = products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.post('/products', (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/products/:id/stock', (req, res) => {
  const p = products.find(p => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Product not found' });
  
  if (req.body.quantity !== undefined) {
    p.stock = req.body.quantity;
  }
  res.json(p);
});

app.listen(PORT, () => {
  console.log(`📦 Product Service running on port ${PORT}`);
});
