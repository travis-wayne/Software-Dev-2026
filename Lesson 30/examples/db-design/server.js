import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize an in-memory SQLite database to simulate PostgreSQL for the UI
const db = new Database(':memory:');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create the tables exactly matching our PostgreSQL schema.sql
const seedDatabase = () => {
  // SQLite requires enabling foreign keys
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL
    );

    -- 1:1
    CREATE TABLE user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        bio TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- 1:N
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title VARCHAR(200) NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- M:N
    CREATE TABLE tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL
    );

    CREATE TABLE post_tags (
        post_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  // Insert seed data
  db.exec(`
    INSERT INTO users (username) VALUES ('alice'), ('bob');
    INSERT INTO user_profiles (user_id, bio) VALUES (1, 'Database enthusiast.');
    INSERT INTO posts (user_id, title) VALUES (1, 'Understanding 1NF'), (1, 'Mastering Joins'), (2, 'My First Post');
    INSERT INTO tags (name) VALUES ('sql'), ('tutorial');
    INSERT INTO post_tags (post_id, tag_id) VALUES (1, 1), (1, 2), (2, 1);
  `);
};

seedDatabase();

// -----------------------------------------------------
// SQL EXECUTOR API FOR RELATIONSHIPS
// -----------------------------------------------------
app.post('/api/execute', (req, res) => {
  const { query } = req.body;
  
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query cannot be empty.' });
  }

  try {
    const stmt = db.prepare(query);
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const rows = stmt.all();
      return res.json({ success: true, data: rows, type: 'read' });
    } else {
      const info = stmt.run();
      return res.json({ success: true, message: `Query executed. Changes: ${info.changes}`, type: 'write' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Route to get the raw table data for the visualizer
app.get('/api/tables', (req, res) => {
  const tables = ['users', 'user_profiles', 'posts', 'tags', 'post_tags'];
  const data = {};
  tables.forEach(t => {
    data[t] = db.prepare(`SELECT * FROM ${t}`).all();
  });
  res.json({ success: true, data });
});

app.post('/api/reset', (req, res) => {
  db.exec('DROP TABLE IF EXISTS post_tags; DROP TABLE IF EXISTS tags; DROP TABLE IF EXISTS posts; DROP TABLE IF EXISTS user_profiles; DROP TABLE IF EXISTS users;');
  seedDatabase();
  res.json({ success: true, message: 'Database reset.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Database Design Server running on http://localhost:${PORT}`);
});
