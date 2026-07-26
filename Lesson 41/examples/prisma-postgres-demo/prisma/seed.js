// Lesson 41 — Automated Relational Database Seeder
// Demonstrates atomic transactions and relational nested writes using PrismaClient!

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing tables in reverse relational dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared old database rows.');

  // 1. Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'TECH-MBP-16',
        name: 'MacBook Pro 16" M3 Max',
        description: '36GB RAM, 1TB SSD Space Black',
        price: 3499.00,
        stock: 25
      }
    }),
    prisma.product.create({
      data: {
        sku: 'TECH-APRO-2',
        name: 'AirPods Pro (2nd Gen)',
        description: 'Active Noise Cancellation with USB-C MagSafe Case',
        price: 249.00,
        stock: 150
      }
    }),
    prisma.product.create({
      data: {
        sku: 'TECH-4K-MON',
        name: '32" UltraSharp 4K Monitor',
        description: 'IPS Black Panel with 98% DCI-P3 Color Accuracy',
        price: 899.50,
        stock: 40
      }
    }),
    prisma.product.create({
      data: {
        sku: 'TECH-MECH-KB',
        name: 'Keychron Q1 Pro Wireless Mechanical Keyboard',
        description: '75% Layout, Banana Switches, Full Aluminum Body',
        price: 199.00,
        stock: 80
      }
    })
  ]);

  console.log(`📦 Seeded ${products.length} products.`);

  // 2. Create Users with Nested Orders & Items
  const adminUser = await prisma.user.create({
    data: {
      email: 'travis@wayne.com',
      name: 'Travis Wayne',
      role: 'ADMIN',
      orders: {
        create: [
          {
            total: 3748.00,
            status: 'COMPLETED',
            items: {
              create: [
                { productId: products[0].id, quantity: 1, price: 3499.00 },
                { productId: products[1].id, quantity: 1, price: 249.00 }
              ]
            }
          }
        ]
      }
    },
    include: { orders: { include: { items: true } } }
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Alex Rivera',
      role: 'USER',
      orders: {
        create: [
          {
            total: 1098.50,
            status: 'COMPLETED',
            items: {
              create: [
                { productId: products[2].id, quantity: 1, price: 899.50 },
                { productId: products[3].id, quantity: 1, price: 199.00 }
              ]
            }
          }
        ]
      }
    },
    include: { orders: { include: { items: true } } }
  });

  console.log(`👤 Seeded User ${adminUser.name} with ${adminUser.orders.length} order(s).`);
  console.log(`👤 Seeded User ${studentUser.name} with ${studentUser.orders.length} order(s).`);
  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
