// Lesson 41 — Prisma ORM Express REST API Server
// Demonstrates declarative queries, eager relational loading (JOINs), and atomic transactions!

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// DIAGNOSTIC ENDPOINT: Database Health & Row Counts
// ─────────────────────────────────────────────────────────────
app.get('/api/status', async (req, res) => {
  try {
    const [userCount, productCount, orderCount, itemCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.orderItem.count()
    ]);

    res.status(200).json({
      success: true,
      status: 'online',
      driver: 'PrismaClient v5.22.0',
      database_url: process.env.DATABASE_URL ? 'Configured via .env' : 'Default SQLite (dev.db)',
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
        orderItems: itemCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// EAGER RELATIONAL FETCHING: Users + Orders + Items + Products
// ─────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    // Notice: 6 lines of JavaScript compile into an optimized SQL JOIN!
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: {
                  select: { name: true, sku: true, price: true } // Select only specific columns!
                }
              }
            }
          }
        }
      }
    });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PRODUCT CATALOG API
// ─────────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { price: 'desc' }
    });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ATOMIC TRANSACTION: Create Order with Nested Items
// Body: { userId: 1, items: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }] }
// ─────────────────────────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Must provide valid userId and items array.' });
    }

    // Use interactive transaction to verify stock and calculate total securely on backend!
    const newOrder = await prisma.$transaction(async (tx) => {
      let grandTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ID ${item.productId} not found.`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
        }

        // Deduct stock atomically
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });

        const lineTotal = product.price * item.quantity;
        grandTotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Create Order and nested order items in 1 command
      return await tx.order.create({
        data: {
          userId: Number(userId),
          total: grandTotal,
          status: 'COMPLETED',
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: { product: true }
          }
        }
      });
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully via atomic Prisma transaction!',
      data: newOrder
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CASCADING DELETE: Deleting a user deletes all their orders!
// ─────────────────────────────────────────────────────────────
app.delete('/api/users/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deletedUser = await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: `User #${id} (${deletedUser.email}) and all associated orders were deleted via cascading relation!`,
      data: deletedUser
    });
  } catch (error) {
    res.status(404).json({ success: false, error: 'User not found or deletion failed.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Lesson 41 Prisma ORM Server running on http://localhost:${PORT}`);
  console.log(`📡 Diagnostic Check: http://localhost:${PORT}/api/status`);
  console.log(`👥 View Users + Nested Orders: http://localhost:${PORT}/api/users`);
});
