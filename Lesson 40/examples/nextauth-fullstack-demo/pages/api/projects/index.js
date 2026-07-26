// Lesson 40 — Projects Collection Endpoint
// GET is public read; POST is protected by NextAuth getServerSession guard!

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '../../../lib/db';

export default async function handler(req, res) {
  // ─────────────────────────────────────────────────────────────
  // GET: Public Read (No Session Required)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const projects = await db.query('SELECT * FROM projects ORDER BY id DESC');
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST: Protected Creation (Must be logged in via NextAuth!)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: You must be logged in to publish portfolio items.'
      });
    }

    const { title, description, tech_stack } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    try {
      const result = await db.execute(
        'INSERT INTO projects (title, description, tech_stack, created_by, created_at) VALUES (?, ?, ?, ?, ?)',
        [title.trim(), description.trim(), tech_stack || 'Next.js 14, Tailwind CSS', session.user.email, new Date().toISOString()]
      );

      const newProject = {
        id: result.insertId || Date.now(),
        title: title.trim(),
        description: description.trim(),
        tech_stack: tech_stack || 'Next.js 14, Tailwind CSS',
        created_by: session.user.email,
        created_at: new Date().toISOString()
      };

      return res.status(201).json({
        success: true,
        message: `Project created successfully by authenticated user ${session.user.email}`,
        data: newProject
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed. Supported methods: GET, POST.` });
}
