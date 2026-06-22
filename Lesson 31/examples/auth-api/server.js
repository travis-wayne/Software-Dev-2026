import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize In-Memory SQLite Database for the interactive lab
const db = new Database(':memory:');

// Create Users table
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

// Prepared statements for faster queries
const insertUser = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
const getUserByUsername = db.prepare('SELECT * FROM users WHERE username = ?');

// ============================================================
// Auth Routes
// ============================================================

// 1. REGISTER: Hash the password and save to DB
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    // Check if user exists
    const existingUser = getUserByUsername.get(username);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username already taken' });
    }

    // Hash the password (Cost factor 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save user
    const result = insertUser.run(username, passwordHash);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: result.lastInsertRowid,
        username,
        savedHash: passwordHash // Returning the hash ONLY for the lab visualizer
      }
    });
  } catch (error) {
    next(error);
  }
});

// 2. LOGIN: Compare hashes and issue JWT
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    // Find user
    const user = getUserByUsername.get(username);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Passwords match! Generate JWT
    const payload = {
      userId: user.id,
      username: user.username
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================
// Protected Routes
// ============================================================

// 3. MIDDLEWARE: Verify the JWT
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedPayload = jwt.verify(token, JWT_SECRET);
    req.user = decodedPayload; // Attach payload to the request
    next();
  } catch (error) {
    // Distinguish between expired and invalid/tampered
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Unauthorized: Token expired' });
    }
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid token signature' });
  }
};

// 4. PROTECTED ENDPOINT
app.get('/api/secure/profile', requireAuth, (req, res) => {
  // If we reach here, the token was valid and req.user exists!
  res.json({
    success: true,
    message: 'Welcome to the VIP area!',
    data: {
      user: req.user,
      secretMessage: 'Bcrypt makes brute force mathematically unfeasible.'
    }
  });
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🔒 Auth API running at http://localhost:${PORT}`);
});
