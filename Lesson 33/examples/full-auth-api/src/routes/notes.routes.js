import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/role.js';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

// In-memory array for notes (to keep the lab simple and focused on Auth)
// In a real app, this would be in the database linked to the User via a relation.
let notes = [
  { id: 1, userId: 1, text: "Buy milk" },
  { id: 2, userId: 1, text: "Learn Express Auth" }
];

// ==========================================
// GET PRIVATE NOTES (Requires Login)
// ==========================================
router.get('/', requireAuth, (req, res) => {
  // `req.user` was attached by the `requireAuth` middleware!
  const myNotes = notes.filter(n => n.userId === req.user.id);
  
  res.json({
    success: true,
    user: req.user.name || req.user.email,
    notes: myNotes
  });
});

// ==========================================
// CREATE A PRIVATE NOTE (Requires Login)
// ==========================================
router.post('/', requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const newNote = {
    id: Date.now(),
    userId: req.user.id, // Tie the note to the currently logged in user!
    text
  };
  
  notes.push(newNote);
  res.status(201).json({ success: true, note: newNote });
});

// ==========================================
// ADMIN DASHBOARD (Requires Login AND Admin Role)
// ==========================================
router.get('/admin-stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    // Admins can see total users in the DB
    const totalUsers = await prisma.user.count();
    
    res.json({
      success: true,
      message: "Welcome to the highly classified Admin Panel.",
      stats: {
        totalUsers,
        totalNotes: notes.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching admin stats" });
  }
});

export default router;
