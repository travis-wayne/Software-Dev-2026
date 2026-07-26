// Lesson 40 — Database & Auth System Status Endpoint
// Reports whether Neon PostgreSQL or SQLite in-memory mode is active, plus user and project counts

import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const mode = db.getMode();
    const users = await db.query('SELECT id, name, email, role, created_at FROM users');
    const projects = await db.query('SELECT * FROM projects');

    return res.status(200).json({
      status: 'online',
      database_mode: mode,
      database_name: mode === 'postgres' ? 'Neon PostgreSQL Cloud' : 'SQLite In-Memory Fallback',
      stats: {
        total_users: users.length,
        total_projects: projects.length
      },
      registered_users: users,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
