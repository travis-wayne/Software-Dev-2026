import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────
// DB ADAPTER — Neon PostgreSQL OR better-sqlite3 fallback
// ─────────────────────────────────────────────────────────────
let dbAdapter = null; // { query, service, connected }

async function initDB() {
  if (process.env.DATABASE_URL) {
    // ── Try Neon PostgreSQL ──────────────────────────────────
    try {
      const { default: pg } = await import('pg');
      const { Pool } = pg;
      const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
      // Test connection
      await pool.query('SELECT 1');
      console.log('✅ Connected to Neon PostgreSQL');
      dbAdapter = {
        service: 'Neon PostgreSQL',
        connected: true,
        query: async (sql, params = []) => {
          const result = await pool.query(sql, params);
          return result.rows;
        },
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
  try {
    const { default: Database } = await import('better-sqlite3');
    const db = new Database(':memory:');
    db.pragma('foreign_keys = ON');

    createAndSeedSQLite(db);

    dbAdapter = {
      service: 'Local SQLite',
      connected: true,
      _db: db,
      query: async (sql, _params = []) => {
        const upper = sql.trim().toUpperCase();
        if (upper.startsWith('SELECT') || upper.startsWith('WITH')) {
          return db.prepare(sql).all();
        }
        db.prepare(sql).run();
        return [];
      },
    };
    console.log('✅ SQLite in-memory database seeded and ready.');
  } catch (err) {
    console.error('❌ SQLite init failed:', err.message);
    process.exit(1);
  }
}

function createAndSeedSQLite(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      bio     TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title   VARCHAR(200) NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tags (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER,
      tag_id  INTEGER,
      PRIMARY KEY (post_id, tag_id),
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY(tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
    );
  `);

  db.exec(`
    INSERT OR IGNORE INTO users (username) VALUES ('alice'), ('bob'), ('carol');
    INSERT OR IGNORE INTO user_profiles (user_id, bio) VALUES
      (1, 'Database enthusiast and SQL wizard. 🧙'),
      (3, 'Full-stack dev who loves relational data.');
    INSERT OR IGNORE INTO posts (user_id, title) VALUES
      (1, 'Understanding 1NF'),
      (1, 'Mastering SQL JOINs'),
      (2, 'My First Blog Post'),
      (3, 'Why Normalization Matters');
    INSERT OR IGNORE INTO tags (name) VALUES ('sql'), ('tutorial'), ('beginner'), ('databases');
    INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES
      (1, 1), (1, 2), (1, 3),
      (2, 1), (2, 2),
      (3, 3),
      (4, 1), (4, 4);
  `);
}

// ─────────────────────────────────────────────────────────────
// BLOCKED KEYWORDS — prevent destructive queries from the UI
// ─────────────────────────────────────────────────────────────
const BLOCKED = ['DROP', 'TRUNCATE', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];

function isBlocked(sql) {
  const upper = sql.trim().toUpperCase();
  return BLOCKED.some(kw => upper.startsWith(kw));
}

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

/** GET /api/status */
app.get('/api/status', (_req, res) => {
  if (!dbAdapter) {
    return res.json({ connected: false, service: 'Initializing…' });
  }
  res.json({ connected: dbAdapter.connected, service: dbAdapter.service });
});

/** GET /api/tables — return all 5 tables' data */
app.get('/api/tables', async (_req, res) => {
  if (!dbAdapter) return res.status(503).json({ success: false, error: 'DB not ready' });
  try {
    const [users, user_profiles, posts, tags, post_tags] = await Promise.all([
      dbAdapter.query('SELECT * FROM users'),
      dbAdapter.query('SELECT * FROM user_profiles'),
      dbAdapter.query('SELECT * FROM posts'),
      dbAdapter.query('SELECT * FROM tags'),
      dbAdapter.query('SELECT * FROM post_tags'),
    ]);
    res.json({ success: true, data: { users, user_profiles, posts, tags, post_tags } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/** POST /api/execute — run a SELECT query from the UI */
app.post('/api/execute', async (req, res) => {
  if (!dbAdapter) return res.status(503).json({ success: false, error: 'DB not ready' });

  const { query } = req.body;
  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, error: 'Query cannot be empty.' });
  }
  if (isBlocked(query)) {
    return res.status(403).json({ success: false, error: 'Only SELECT queries are allowed in the playground.' });
  }

  try {
    const rows = await dbAdapter.query(query);
    res.json({ success: true, data: rows, rowCount: rows.length });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/** POST /api/reset — re-seed SQLite fallback */
app.post('/api/reset', async (req, res) => {
  if (!dbAdapter) return res.status(503).json({ success: false, error: 'DB not ready' });
  if (dbAdapter.service !== 'Local SQLite') {
    return res.status(400).json({ success: false, error: 'Reset is only available in SQLite fallback mode.' });
  }
  try {
    const db = dbAdapter._db;
    db.exec(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS user_profiles;
      DROP TABLE IF EXISTS users;
    `);
    createAndSeedSQLite(db);
    res.json({ success: true, message: 'SQLite database reset and re-seeded.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────
await initDB();

app.listen(PORT, () => {
  console.log(`🚀 DB Design Explorer  →  http://localhost:${PORT}`);
  console.log(`🗄️  Service: ${dbAdapter?.service}`);
});
