// Lesson 40 — User Registration Endpoint
// Hashes new passwords with bcrypt and inserts into dual-mode database

import bcrypt from 'bcryptjs';
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed. Please use POST.` });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and password.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);

    if (existing && existing.length > 0) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.execute(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), cleanEmail, passwordHash, 'user', new Date().toISOString()]
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! You may now sign in using your credentials.',
      user: {
        id: result.insertId || 'new_user',
        name: name.trim(),
        email: cleanEmail,
        role: 'user'
      }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create user account: ' + err.message });
  }
}
