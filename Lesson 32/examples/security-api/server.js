import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xss from 'xss';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

// 1. Helmet sets 14 security headers (e.g. preventing Clickjacking)
app.use(helmet());

// 2. Strict CORS Configuration (Only allowing specific frontend)
// For the lab UI, we actually allow everything so it loads on localhost:3000,
// but we set up a special endpoint to DEMONSTRATE CORS failures.
app.use(cors({
  origin: '*', // In production, this should be an explicit array like ['http://localhost:5173']
  methods: ['GET', 'POST']
}));

// 3. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Serve static files (The Lab UI)
app.use(express.static(path.join(__dirname, 'public')));

// Database (In-memory array for the XSS lab)
let comments = [
  { id: 1, text: "Welcome to the comment board!" }
];

// Database (In-memory SQLite for SQL Injection lab)
const db = new Database(':memory:');
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  );
  INSERT INTO users (email, password, role) VALUES ('admin@admin.com', 'supersecret', 'admin');
  INSERT INTO users (email, password, role) VALUES ('alice@email.com', 'password123', 'user');
  INSERT INTO users (email, password, role) VALUES ('bob@email.com', 'password123', 'user');
`);

// ============================================================
// XSS LAB ROUTES
// ============================================================

// GET all comments
app.get('/api/comments', (req, res) => {
  res.json({ success: true, comments });
});

// VULNERABLE POST (No sanitization)
app.post('/api/comments/vulnerable', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const newComment = { id: Date.now(), text: text }; // Notice we save RAW input
  comments.push(newComment);
  
  res.json({ success: true, comment: newComment, safe: false });
});

// SECURE POST (With xss sanitization)
app.post('/api/comments/secure', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  // Clean the input before it ever hits the database!
  const cleanText = xss(text);

  const newComment = { id: Date.now(), text: cleanText };
  comments.push(newComment);

  res.json({ success: true, comment: newComment, safe: true });
});

// Reset comments (for lab UI convenience)
app.post('/api/comments/reset', (req, res) => {
  comments = [{ id: 1, text: "Welcome to the comment board!" }];
  res.json({ success: true });
});

// ============================================================
// SQL INJECTION LAB ROUTES
// ============================================================

// VULNERABLE LOGIN (String concatenation)
app.post('/api/sqli/vulnerable', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 🚨 DANGEROUS: Concatenating raw user input directly into SQL query
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    const user = db.prepare(query).get(); // Will execute the concatenated string
    
    if (user) {
      res.json({ success: true, message: `Welcome, ${user.email}! (Role: ${user.role})`, user, query });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials', query });
    }
  } catch (err) {
    // If they do something like drop table, catch it and return
    res.status(500).json({ success: false, error: err.message });
  }
});

// SECURE LOGIN (Parameterized Query)
app.post('/api/sqli/secure', (req, res) => {
  const { email, password } = req.body;
  
  try {
    // ✅ SAFE: Using ? placeholders. The database treats input strictly as data, not executable code.
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    const user = db.prepare(query).get(email, password);
    
    if (user) {
      res.json({ success: true, message: `Welcome, ${user.email}! (Role: ${user.role})`, user, query });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials', query });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================
// CORS LAB ROUTE
// ============================================================
// This route intentionally has STRICT CORS to demonstrate failures
app.get('/api/cors-strict', cors({ origin: 'http://my-strict-frontend.com' }), (req, res) => {
  res.json({ success: true, message: "If you are reading this in JS, CORS allowed you!" });
});

// ============================================================
// CSRF LAB ROUTE (Demonstration)
// ============================================================
// Demonstrates what happens if a cookie is sent via POST
app.post('/api/transfer-funds', (req, res) => {
  res.json({ 
    success: true, 
    message: "Funds transferred! (In the real world, check SameSite cookies or CSRF tokens)" 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🛡️ Security API running at http://localhost:${PORT}`);
});
