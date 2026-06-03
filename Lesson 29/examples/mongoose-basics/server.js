import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import { fileURLToPath } from 'url';

// Import our Mongoose Model
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================================
// 1. DATABASE CONNECTION (Using In-Memory MongoDB for Learning)
// ==========================================================
let mongoServer;

const connectDB = async () => {
  try {
    // Spin up a fake MongoDB server in memory
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the fake server
    await mongoose.connect(uri);
    console.log(`✅ Connected to In-Memory MongoDB at: ${uri}`);
    
    // Seed some initial data
    await seedDatabase();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await Product.deleteMany({}); // Clear existing
  await Product.create([
    { name: 'Laptop', price: 999.99, description: 'A powerful coding machine.' },
    { name: 'Coffee Mug', price: 15.00, description: 'Fuel container.', inStock: false },
    { name: 'Mechanical Keyboard', price: 120.50 }
  ]);
  console.log('✅ Database seeded with initial products.');
};

// Initialize DB
connectDB();


// ==========================================================
// 2. MONGOOSE CRUD ROUTES
// ==========================================================

// READ: Get all products
app.get('/api/products', async (req, res) => {
  try {
    // .find() with no arguments gets everything
    const products = await Product.find().sort('-createdAt');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE: Add a new product
app.post('/api/products', async (req, res) => {
  try {
    // Mongoose validates the req.body against the Schema automatically
    const newProduct = await Product.create(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    // Catch validation errors (e.g. missing name, negative price)
    res.status(400).json({ success: false, error: err.message });
  }
});

// UPDATE: Modify a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // new: returns the updated doc. runValidators: checks rules again
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE: Remove a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Utility Route: Reset Database
app.post('/api/reset', async (req, res) => {
  await seedDatabase();
  res.json({ success: true, message: 'Database reset to default products.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mongoose Server running on http://localhost:${PORT}`);
});
