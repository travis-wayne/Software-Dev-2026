// Lesson 40 — Dual-Mode Database Adapter (Neon PostgreSQL + SQLite Fallback)
// Seeding both 'users' (for NextAuth credentials login) and 'projects' (for protected CRUD)

const bcrypt = require('bcryptjs');

let dbClient = null;
let mode = 'sqlite';

function getDb() {
  if (dbClient) return { client: dbClient, mode };

  if (process.env.DATABASE_URL) {
    try {
      const { Pool } = require('pg');
      dbClient = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000
      });
      mode = 'postgres';
      console.log('🌐 [Lesson 40 DB] Connected to Neon PostgreSQL cloud instance.');
      return { client: dbClient, mode };
    } catch (err) {
      console.warn('⚠️ [Lesson 40 DB] Failed to initialize PostgreSQL Pool. Falling back to SQLite memory.', err.message);
    }
  }

  // Fallback: in-memory SQLite database
  const Database = require('better-sqlite3');
  dbClient = new Database(':memory:');
  mode = 'sqlite';
  console.log('💾 [Lesson 40 DB] No DATABASE_URL detected. Initialized offline SQLite in-memory fallback.');

  // Create tables
  dbClient.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tech_stack TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default users (with bcrypt hashed passwords)
  const salt = bcrypt.genSaltSync(10);
  const travisHash = bcrypt.hashSync('password123', salt);
  const studentHash = bcrypt.hashSync('secret123', salt);

  const insertUser = dbClient.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run('Travis Wayne', 'travis@wayne.com', travisHash, 'admin', new Date().toISOString());
  insertUser.run('Student Learner', 'student@example.com', studentHash, 'user', new Date().toISOString());

  // Seed sample projects
  const insertProject = dbClient.prepare(`
    INSERT INTO projects (title, description, tech_stack, created_by, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertProject.run(
    'NextAuth.js Serverless Portal',
    'A full-stack portfolio dashboard secured by encrypted JSON Web Tokens and dual-mode Neon PostgreSQL.',
    'Next.js 14, NextAuth.js, Tailwind CSS, Neon DB',
    'travis@wayne.com',
    new Date(Date.now() - 3600000 * 24).toISOString()
  );

  insertProject.run(
    'Glassmorphism UI System',
    'A sleek dark-mode design token library built with backdrop-filter blur effects and HSL color harmony.',
    'React, Tailwind CSS, Vanilla CSS',
    'student@example.com',
    new Date().toISOString()
  );

  return { client: dbClient, mode };
}

// Helper to execute SQL cleanly across both PostgreSQL and SQLite
async function query(sql, params = []) {
  const { client, mode: dbMode } = getDb();

  if (dbMode === 'postgres') {
    // Convert SQLite '?' placeholders to PostgreSQL '$1, $2...'
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    const res = await client.query(pgSql, params);
    return res.rows;
  } else {
    // SQLite execution
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return client.prepare(sql).all(params);
    } else {
      const info = client.prepare(sql).run(params);
      return { insertId: info.lastInsertRowid, changes: info.changes };
    }
  }
}

async function execute(sql, params = []) {
  return query(sql, params);
}

function getMode() {
  getDb();
  return mode;
}

module.exports = {
  query,
  execute,
  getMode
};
