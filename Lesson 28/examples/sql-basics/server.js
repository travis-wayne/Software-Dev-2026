import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Connection state ──────────────────────────────────────────────────────────
let pgPool   = null;   // set when DATABASE_URL is available
let sqliteDb = null;   // set when falling back to better-sqlite3
let SERVICE  = '';

// ─── Allowed SQL operations (allowlist) ───────────────────────────────────────
const ALLOWED_STARTS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TABLE'];
// Blocked destructive patterns
const BLOCKED_PATTERNS = [
  /DROP\s+DATABASE/i,
  /DROP\s+TABLE\s+.*CASCADE/i,
  /TRUNCATE\s+TABLE/i,
  /ALTER\s+TABLE/i,
];

function validateQuery(query) {
  const trimmed = query.trim().toUpperCase();
  const startsOk = ALLOWED_STARTS.some(op => trimmed.startsWith(op));
  if (!startsOk) {
    return { ok: false, reason: `Only ${ALLOWED_STARTS.join(', ')} statements are allowed in this sandbox.` };
  }
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(query)) {
      return { ok: false, reason: 'Destructive operations (DROP DATABASE, DROP TABLE CASCADE, TRUNCATE, ALTER) are blocked in this sandbox.' };
    }
  }
  return { ok: true };
}

// ─── Neon PostgreSQL setup ────────────────────────────────────────────────────
async function setupNeon() {
  try {
    const { default: pg } = await import('pg');
    const { Pool } = pg;
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    // Test connection
    const client = await pgPool.connect();
    await client.query('SELECT 1');
    client.release();
    SERVICE = 'Neon PostgreSQL';
    console.log('✅ Connected to Neon PostgreSQL');
    return true;
  } catch (err) {
    console.warn('⚠️  Could not connect to Neon PostgreSQL:', err.message);
    pgPool = null;
    return false;
  }
}

// ─── SQLite (in-memory) fallback ──────────────────────────────────────────────
async function setupSQLite() {
  try {
    const { default: Database } = await import('better-sqlite3');
    sqliteDb = new Database(':memory:');

    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        username    TEXT    NOT NULL UNIQUE,
        email       TEXT    NOT NULL UNIQUE,
        created_at  TEXT    DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS posts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER NOT NULL REFERENCES users(id),
        title       TEXT    NOT NULL,
        content     TEXT,
        created_at  TEXT    DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS comments (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id     INTEGER NOT NULL REFERENCES posts(id),
        user_id     INTEGER NOT NULL REFERENCES users(id),
        body        TEXT    NOT NULL,
        created_at  TEXT    DEFAULT (datetime('now'))
      );
    `);

    // Seed data
    sqliteDb.exec(`
      INSERT INTO users (username, email) VALUES
        ('alice_dev',  'alice@example.com'),
        ('bob_codes',  'bob@example.com');

      INSERT INTO posts (user_id, title, content) VALUES
        (1, 'Getting Started with SQL', 'SQL is a declarative language for managing relational databases...'),
        (1, 'Understanding JOINs',       'A JOIN combines rows from two or more tables based on a related column.'),
        (2, 'PostgreSQL vs SQLite',       'SQLite is great for learning; PostgreSQL shines in production.');

      INSERT INTO comments (post_id, user_id, body) VALUES
        (1, 2, 'Great intro post!'),
        (2, 2, 'JOINs finally make sense. Thanks!');
    `);

    SERVICE = 'Local SQLite (fallback)';
    console.log('✅ In-memory SQLite initialized and seeded with blog schema');
  } catch (err) {
    console.error('❌ Failed to initialize SQLite fallback:', err.message);
    process.exit(1);
  }
}

// ─── Async SQLite helper (wraps sync API for consistent code) ─────────────────
async function sqliteExec(query) {
  const trimmed = query.trim().toUpperCase();
  if (trimmed.startsWith('SELECT')) {
    const stmt = sqliteDb.prepare(query);
    const rows = stmt.all();
    return { rows, rowCount: rows.length, type: 'read' };
  } else {
    const stmt = sqliteDb.prepare(query);
    const info = stmt.run();
    return { rows: [], rowCount: info.changes, type: 'write' };
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function bootstrap() {
  if (process.env.DATABASE_URL) {
    const ok = await setupNeon();
    if (!ok) setupSQLite();
  } else {
    console.log('ℹ️  DATABASE_URL not set — using in-memory SQLite fallback');
    // setupSQLite is sync but called in async context
    const { default: Database } = await import('better-sqlite3');
    sqliteDb = new Database(':memory:');
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        username    TEXT    NOT NULL UNIQUE,
        email       TEXT    NOT NULL UNIQUE,
        created_at  TEXT    DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS posts (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id     INTEGER NOT NULL REFERENCES users(id),
        title       TEXT    NOT NULL,
        content     TEXT,
        created_at  TEXT    DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS comments (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id     INTEGER NOT NULL REFERENCES posts(id),
        user_id     INTEGER NOT NULL REFERENCES users(id),
        body        TEXT    NOT NULL,
        created_at  TEXT    DEFAULT (datetime('now'))
      );
    `);
    sqliteDb.exec(`
      INSERT INTO users (username, email) VALUES
        ('alice_dev',  'alice@example.com'),
        ('bob_codes',  'bob@example.com');
      INSERT INTO posts (user_id, title, content) VALUES
        (1, 'Getting Started with SQL', 'SQL is a declarative language for managing relational databases...'),
        (1, 'Understanding JOINs',       'A JOIN combines rows from two or more tables based on a related column.'),
        (2, 'PostgreSQL vs SQLite',       'SQLite is great for learning; PostgreSQL shines in production.');
      INSERT INTO comments (post_id, user_id, body) VALUES
        (1, 2, 'Great intro post!'),
        (2, 2, 'JOINs finally make sense. Thanks!');
    `);
    SERVICE = 'Local SQLite (fallback)';
    console.log('✅ In-memory SQLite initialized and seeded with blog schema');
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/status — connection health check
app.get('/api/status', (req, res) => {
  const connected = !!(pgPool || sqliteDb);
  res.json({
    success: true,
    connected,
    service: SERVICE,
    message: pgPool
      ? 'Connected to Neon PostgreSQL cloud database.'
      : 'Running with local in-memory SQLite. Set DATABASE_URL in .env to connect to Neon.',
  });
});

// POST /api/execute — run a SQL query
app.post('/api/execute', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ success: false, error: 'Query cannot be empty.' });
  }

  const validation = validateQuery(query);
  if (!validation.ok) {
    return res.status(403).json({ success: false, error: validation.reason });
  }

  try {
    if (pgPool) {
      // — Neon PostgreSQL path —
      const result = await pgPool.query(query);
      const isRead = query.trim().toUpperCase().startsWith('SELECT');
      return res.json({
        success: true,
        data:     isRead ? result.rows : [],
        type:     isRead ? 'read' : 'write',
        rowCount: result.rowCount ?? result.rows.length,
      });
    } else {
      // — SQLite fallback path —
      const result = await sqliteExec(query);
      return res.json({
        success:  true,
        data:     result.rows,
        type:     result.type,
        rowCount: result.rowCount,
      });
    }
  } catch (err) {
    console.error('SQL Error:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
bootstrap().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SQL Playground running → http://localhost:${PORT}`);
    console.log(`   Backend: ${SERVICE}`);
  });
});
