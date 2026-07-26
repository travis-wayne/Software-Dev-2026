// Lesson 40 — Single Project Endpoint
// GET is public read; PUT and DELETE are protected by NextAuth getServerSession guard!

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, error: 'Project ID is required.' });

  // ─────────────────────────────────────────────────────────────
  // GET: Public Read
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const projects = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
      if (!projects || projects.length === 0) {
        return res.status(404).json({ success: false, error: `No project found with ID ${id}` });
      }
      return res.status(200).json({ success: true, data: projects[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PUT & DELETE: Require Authenticated NextAuth Session!
  // ─────────────────────────────────────────────────────────────
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: You must be logged in to modify or delete portfolio items.'
    });
  }

  if (req.method === 'PUT') {
    const { title, description, tech_stack } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required for update.' });
    }
    try {
      await db.execute(
        'UPDATE projects SET title = ?, description = ?, tech_stack = ? WHERE id = ?',
        [title.trim(), description.trim(), tech_stack || 'React, Next.js', id]
      );
      return res.status(200).json({
        success: true,
        message: `Project ${id} updated successfully by ${session.user.email}`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.execute('DELETE FROM projects WHERE id = ?', [id]);
      return res.status(200).json({
        success: true,
        message: `Project ${id} permanently deleted by ${session.user.email}`
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed. Supported methods: GET, PUT, DELETE.` });
}
