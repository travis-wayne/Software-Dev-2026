import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// ── GET /api/products ──────────────────────────────────────────────────────
// Returns all products. Public — no authentication required.
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/products/:id ──────────────────────────────────────────────────
// Returns a single product by ID. Public.
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/products ─────────────────────────────────────────────────────
// Creates a new product. Admin only.
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), stock: parseInt(stock) || 0, category, imageUrl },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PUT /api/products/:id ──────────────────────────────────────────────────
// Updates an existing product. Admin only.
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── DELETE /api/products/:id ───────────────────────────────────────────────
// Deletes a product. Admin only.
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Product not found' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
