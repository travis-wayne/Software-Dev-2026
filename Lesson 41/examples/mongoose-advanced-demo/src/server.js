// Lesson 41 — Mongoose Advanced ODM Express REST API Server
// Demonstrates Virtual Properties, .populate() NoSQL Joins, and Pre-Save Middleware!

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

let mongoServer = null;
let dbStatus = 'disconnected';
let connectionUri = '';

// ─────────────────────────────────────────────────────────────
// AUTOMATED MONGODB CONNECTION & SEEDING
// If MONGODB_URI is not set, spin up mongodb-memory-server automatically!
// ─────────────────────────────────────────────────────────────
async function connectAndSeed() {
  try {
    if (process.env.MONGODB_URI) {
      connectionUri = process.env.MONGODB_URI;
      await mongoose.connect(connectionUri);
      console.log('📡 Connected to external MongoDB Cloud/Docker cluster.');
    } else {
      console.log('⏳ Starting zero-setup in-memory MongoDB Server (mongodb-memory-server)...');
      mongoServer = await MongoMemoryServer.create();
      connectionUri = mongoServer.getUri();
      await mongoose.connect(connectionUri);
      console.log('📡 Connected to automated In-Memory MongoDB Server!');
    }

    dbStatus = 'online';
    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    dbStatus = 'error';
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding MongoDB collections...');
  await Order.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});

  // 1. Create Users (Pre-save middleware will automatically hash passwords!)
  const admin = await User.create({
    email: 'travis@wayne.com',
    firstName: 'Travis',
    lastName: 'Wayne',
    password: 'password123',
    role: 'admin'
  });

  const student = await User.create({
    email: 'student@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'secretpassword',
    role: 'user'
  });

  // 2. Create Products with Embedded Review Sub-Documents
  const laptop = await Product.create({
    sku: 'MBP-M3-MAX',
    name: 'MacBook Pro 16" M3 Max',
    description: '16-core CPU, 40-core GPU, 48GB Unified Memory',
    price: 3499.00,
    stock: 20,
    reviews: [
      { user: admin._id, authorName: 'Travis Wayne', rating: 5, comment: 'Incredible compilation speeds for Rust and TypeScript!' },
      { user: student._id, authorName: 'Jane Doe', rating: 5, comment: 'Best developer laptop on the market.' }
    ]
  });

  const monitor = await Product.create({
    sku: 'DELL-U3223QE',
    name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
    description: 'IPS Black technology with 2000:1 contrast ratio',
    price: 859.99,
    stock: 45,
    reviews: [
      { user: student._id, authorName: 'Jane Doe', rating: 4, comment: 'Great color accuracy, but HDR could be brighter.' }
    ]
  });

  // 3. Create Orders with Cross-Collection ObjectId References
  await Order.create({
    user: admin._id,
    total: 3499.00,
    status: 'COMPLETED',
    items: [
      { product: laptop._id, quantity: 1, price: 3499.00 }
    ]
  });

  await Order.create({
    user: student._id,
    total: 859.99,
    status: 'SHIPPED',
    items: [
      { product: monitor._id, quantity: 1, price: 859.99 }
    ]
  });

  console.log('✅ MongoDB seeding completed successfully!');
}

// ─────────────────────────────────────────────────────────────
// API ENDPOINTS
// ─────────────────────────────────────────────────────────────

app.get('/api/status', async (req, res) => {
  try {
    const [userCount, productCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      status: dbStatus,
      driver: 'Mongoose ODM v8.3.0',
      mode: process.env.MONGODB_URI ? 'Cloud/Docker MongoDB' : 'In-Memory MongoDB Server',
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users — Demonstrates Virtual Property serialization (fullName)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products — Demonstrates Array Aggregation Virtuals (averageRating & reviewCount)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ price: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders — Demonstrates cross-collection NoSQL Joins via .populate()!
app.get('/api/orders', async (req, res) => {
  try {
    // Notice how .populate() replaces raw ObjectId hex strings with rich user and product objects!
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email role') // Excludes password automatically!
      .populate('items.product', 'name sku price');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products/:id/reviews — Adds an embedded review sub-document
app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, authorName, rating, comment } = req.body;

    if (!rating || !authorName) {
      return res.status(400).json({ success: false, error: 'Rating and authorName are required.' });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    product.reviews.push({
      user: userId || new mongoose.Types.ObjectId(),
      authorName,
      rating: Number(rating),
      comment
    });

    await product.save(); // Triggers virtual averageRating recalculation!
    res.status(201).json({ success: true, message: 'Review added!', data: product });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/seed — Trigger manual database re-seeding
app.post('/api/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database re-seeded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`🚀 Lesson 41 Mongoose Advanced ODM Server running on http://localhost:${PORT}`);
  await connectAndSeed();
  console.log(`📡 Diagnostic Check: http://localhost:${PORT}/api/status`);
  console.log(`📦 View Populated Orders: http://localhost:${PORT}/api/orders`);
});
