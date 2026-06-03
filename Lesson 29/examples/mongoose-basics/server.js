import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
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
// 1. DATABASE CONNECTION
//    Tries MongoDB Atlas first, falls back to in-memory
// ==========================================================
let connectionInfo = { service: 'Disconnected', connected: false, dbName: null };

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    await mongoose.connect(mongoURI);
    const dbName = mongoose.connection.db.databaseName;
    connectionInfo = { service: 'MongoDB Atlas', connected: true, dbName };
    console.log(`✅ Connected to MongoDB Atlas — database: "${dbName}"`);
  } else {
    console.warn('⚠️  MONGODB_URI not set. Using in-memory MongoDB (data will NOT persist between restarts).');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    const dbName = mongoose.connection.db.databaseName;
    connectionInfo = { service: 'Local In-Memory MongoDB', connected: true, dbName };
    console.log(`✅ Connected to In-Memory MongoDB — database: "${dbName}"`);
  }
};

const seedDatabase = async () => {
  await Product.deleteMany({});
  await Product.create([
    { name: 'Laptop',               price: 999.99, description: 'A powerful coding machine.',         inStock: true  },
    { name: 'Coffee Mug',           price: 15.00,  description: 'Essential developer fuel container.', inStock: false },
    { name: 'Mechanical Keyboard',  price: 120.50, description: 'Tactile satisfaction guaranteed.',   inStock: true  },
  ]);
  console.log('✅ Database seeded with 3 initial products.');
};

// Boot sequence
(async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Mongoose Explorer running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Fatal: could not start server:', err.message);
    process.exit(1);
  }
})();


// ==========================================================
// 2. STATUS ROUTE
// ==========================================================

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: {
      connected: connectionInfo.connected,
      service:   connectionInfo.service,
      dbName:    connectionInfo.dbName,
    },
  });
});


// ==========================================================
// 3. PRODUCT CRUD ROUTES
// ==========================================================

// READ — get all products, newest first
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE — add a new product (Mongoose validates against schema)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description, inStock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'name and price are required.' });
    }

    const newProduct = await Product.create({ name, price, description, inStock });
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    // Catches Mongoose ValidationError, CastError, etc.
    res.status(400).json({ success: false, error: err.message });
  }
});

// UPDATE — modify a product by _id
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // new: returns updated doc; runValidators: re-runs schema rules
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: `No product found with id: ${id}` });
    }

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE — remove a product by _id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: `No product found with id: ${id}` });
    }

    res.json({ success: true, message: `"${deletedProduct.name}" deleted successfully.` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// ==========================================================
// 4. UTILITY ROUTES
// ==========================================================

// RESET — re-seed the database to its default state
app.post('/api/reset', async (req, res) => {
  try {
    await seedDatabase();
    const products = await Product.find().sort('-createdAt');
    res.json({ success: true, message: 'Database reset to 3 default products.', data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
