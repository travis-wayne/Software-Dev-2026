import express from 'express';
import { PrismaClient } from '@prisma/client';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// ── POST /api/orders ───────────────────────────────────────────────────────
// Creates a new order for the authenticated user.
// Expects: { items: [{ productId, quantity }] }
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Fetch product prices from the database to avoid client-side price manipulation
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });
      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        status: 'pending',
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/orders/my-orders ──────────────────────────────────────────────
// Returns all orders belonging to the authenticated user.
// NOTE: This route must be defined BEFORE /:id to avoid 'my-orders' being treated as an ID.
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/orders ────────────────────────────────────────────────────────
// Returns ALL orders across all users. Admin only.
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PUT /api/orders/:id/status ─────────────────────────────────────────────
// Updates an order's status (e.g., pending → shipped → delivered). Admin only.
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json(updated);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Order not found' });
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
