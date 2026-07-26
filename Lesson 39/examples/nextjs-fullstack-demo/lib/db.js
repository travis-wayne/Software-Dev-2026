// lib/db.js — Dual-Mode Database Adapter (Neon PostgreSQL + Local SQLite Fallback)
import { Pool } from 'pg';
import Database from 'better-sqlite3';

let dbAdapter;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  // ─────────────────────────────────────────────────────────────
  // 1. NEON POSTGRESQL CLOUD ADAPTER (Production / Cloud Mode)
  // ─────────────────────────────────────────────────────────────
  if (!global._pgPool) {
    global._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  }
  const pool = global._pgPool;

  dbAdapter = {
    type: 'Neon PostgreSQL',
    connected: true,
    query: async (text, params = []) => {
      const client = await pool.connect();
      try {
        // Automatically translate SQLite '?' syntax to PostgreSQL '$1, $2...' syntax
        let pgText = text;
        let index = 1;
        while (pgText.includes('?')) {
          pgText = pgText.replace('?', `$${index++}`);
        }
        const result = await client.query(pgText, params);
        return result.rows;
      } finally {
        client.release();
      }
    },
    execute: async (text, params = []) => {
      const client = await pool.connect();
      try {
        let pgText = text;
        let index = 1;
        while (pgText.includes('?')) {
          pgText = pgText.replace('?', `$${index++}`);
        }
        const result = await client.query(pgText, params);
        return { changes: result.rowCount };
      } finally {
        client.release();
      }
    }
  };
  console.log('✅ Connected to Neon PostgreSQL Cloud Database');

} else {
  // ─────────────────────────────────────────────────────────────
  // 2. SQLITE LOCAL FALLBACK ADAPTER (Offline Dev Mode)
  // ─────────────────────────────────────────────────────────────
  if (!global._sqliteDb) {
    const sqliteDb = new Database(':memory:');
    
    // Create projects table
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech_stack TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed initial data
    const insertStmt = sqliteDb.prepare(`
      INSERT INTO projects (id, title, description, tech_stack, github_url, live_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(
      'proj_101', 
      'E-Commerce Capstone API', 
      'Full-stack retail store with shopping cart, user authentication, and order processing.', 
      'Next.js 14, Neon PostgreSQL, Tailwind CSS, Prisma',
      'https://github.com/travis-wayne/Software-Dev-2026',
      'https://vercel.com'
    );
    insertStmt.run(
      'proj_102', 
      'Interactive State Management Lab', 
      'Visual simulator demonstrating Redux Toolkit and Zustand state persistence.', 
      'React, Zustand, Redux Toolkit, Glassmorphism UI',
      'https://github.com/travis-wayne/Software-Dev-2026',
      'https://vercel.com'
    );
    insertStmt.run(
      'proj_103', 
      'AI Code Assistant Dashboard', 
      'Real-time coding analytics and syntax highlighting workspace with custom theme support.', 
      'TypeScript, Next.js, Framer Motion, Lucide Icons',
      'https://github.com/travis-wayne/Software-Dev-2026',
      'https://vercel.com'
    );

    global._sqliteDb = sqliteDb;
    console.log('⚡ Using Local SQLite In-Memory Database Fallback');
  }

  const sqliteDb = global._sqliteDb;

  dbAdapter = {
    type: 'SQLite In-Memory Fallback',
    connected: true,
    query: async (text, params = []) => {
      const stmt = sqliteDb.prepare(text);
      return stmt.all(params);
    },
    execute: async (text, params = []) => {
      const stmt = sqliteDb.prepare(text);
      const info = stmt.run(params);
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    }
  };
}

export default dbAdapter;
