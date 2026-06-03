import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize an in-memory SQLite database
// In a real production app, you would connect to PostgreSQL using the 'pg' library
const db = new Database(':memory:');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Seed the database with some initial tables and data
const seedDatabase = () => {
  // CREATE TABLE
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      age INTEGER
    );
  `);

  // INSERT initial data
  const insert = db.prepare('INSERT INTO users (name, email, age) VALUES (?, ?, ?)');
  insert.run('Alice Johnson', 'alice@example.com', 28);
  insert.run('Bob Smith', 'bob@example.com', 34);
  insert.run('Charlie Brown', 'charlie@example.com', 22);
  
  console.log('✅ In-memory database initialized and seeded.');
};

seedDatabase();

// -----------------------------------------------------
// SQL EXECUTOR API
// -----------------------------------------------------
// WARNING: NEVER DO THIS IN PRODUCTION!
// Executing raw SQL sent from a client is a massive security vulnerability (SQL Injection).
// We are ONLY doing this to build an interactive learning sandbox.
app.post('/api/execute', (req, res) => {
  const { query } = req.body;
  
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query cannot be empty.' });
  }

  try {
    // If it's a SELECT query, we want to return the rows using .all()
    // If it's an INSERT/UPDATE/DELETE, we want to run it using .run()
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db.prepare(query);
      const rows = stmt.all();
      return res.json({ success: true, data: rows, type: 'read' });
    } else {
      // It's a write operation
      const stmt = db.prepare(query);
      const info = stmt.run();
      return res.json({ 
        success: true, 
        message: `Query executed successfully. Changes: ${info.changes}`,
        type: 'write'
      });
    }
  } catch (error) {
    // Send the SQL error back to the client so they can learn from it
    console.error(`SQL Error: ${error.message}`);
    return res.status(400).json({ error: error.message });
  }
});

// A route to reset the database back to its initial state
app.post('/api/reset', (req, res) => {
  db.exec('DROP TABLE IF EXISTS users');
  seedDatabase();
  res.json({ success: true, message: 'Database reset.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 SQL Server running on http://localhost:${PORT}`);
});
