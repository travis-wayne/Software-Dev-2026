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

// ─────────────────────────────────────────────────────────────
// DB ADAPTER — Neon PostgreSQL OR better-sqlite3 fallback
// ─────────────────────────────────────────────────────────────
let dbAdapter = null;

async function initDB() {
  if (process.env.DATABASE_URL) {
    try {
      const { default: pg } = await import('pg');
      const { Pool } = pg;
      const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
      await pool.query('SELECT 1');
      console.log('✅ Connected to Neon PostgreSQL');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      dbAdapter = {
        service: 'Neon PostgreSQL',
        connected: true,
        getUser: async (email) => {
          const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
          return res.rows[0];
        },
        createUser: async (email, passwordHash, name = '', role = 'user') => {
          const res = await pool.query(
            'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
            [email, passwordHash, name, role]
          );
          return res.rows[0].id;
        }
      };
    } catch (err) {
      console.warn('⚠️  Neon connection failed:', err.message);
      console.warn('⚠️  Falling back to SQLite in-memory.');
      await initSQLite();
    }
  } else {
    console.log('ℹ️  DATABASE_URL not set — using SQLite in-memory fallback.');
    await initSQLite();
  }
}

async function initSQLite() {
  const { default: Database } = await import('better-sqlite3');
  const db = new Database(':memory:');
  
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const stmtGet = db.prepare('SELECT * FROM users WHERE email = ?');
  const stmtInsert = db.prepare('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)');

  dbAdapter = {
    service: 'Local SQLite',
    connected: true,
    getUser: async (email) => stmtGet.get(email),
    createUser: async (email, passwordHash, name = '', role = 'user') => {
      const info = stmtInsert.run(email, passwordHash, name, role);
      return info.lastInsertRowid;
    }
  };
}

// ============================================================
// Auth Routes
// ============================================================

// 1. REGISTER: Hash the password and save to DB
app.post('/api/auth/register', async (req, res, next) => {
  try {
    // The UI sends username, we map it to email for the DB schema requirement
    const { username, password } = req.body;
    const email = req.body.email || username;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Username/Email and password required' });
    }

    if (!dbAdapter) return res.status(503).json({ success: false, error: 'DB not ready' });

    // Check if user exists
    const existingUser = await dbAdapter.getUser(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username/Email already taken' });
    }

    // Hash the password (Cost factor 10)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save user
    const userId = await dbAdapter.createUser(email, passwordHash);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        username: email,
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
    // The UI sends username, we map it to email
    const { username, password } = req.body;
    const email = req.body.email || username;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Username/Email and password required' });
    }

    if (!dbAdapter) return res.status(503).json({ success: false, error: 'DB not ready' });

    // Find user
    const user = await dbAdapter.getUser(email);
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
      username: user.email,
      role: user.role
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
await initDB();

app.listen(PORT, () => {
  console.log(`🔒 Auth API running at http://localhost:${PORT}`);
  console.log(`🗄️  Service: ${dbAdapter?.service}`);
});
