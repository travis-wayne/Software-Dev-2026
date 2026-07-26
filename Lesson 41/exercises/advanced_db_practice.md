# Lesson 41 — Practice Exercises
**Advanced Backend: Advanced Database Topics (ORMs/ODMs, Migrations)**

---

## Instructions for Students
In this practice set, you will master declarative schema modeling, relational querying, migration workflows, and NoSQL ODM customization. Work through the exercises for your chosen database stack (**Path A: Prisma / PostgreSQL** or **Path B: Mongoose / MongoDB**), or complete both to become a versatile full-stack engineer!

---

## PART 1: Path A — Prisma ORM & Relational Migrations

### Exercise 1: Modeling a Multi-Vendor E-Commerce Schema
**Task:** Write a complete `prisma/schema.prisma` file that models a multi-vendor marketplace. Your schema must include:
1. A `Vendor` model with `id`, `name`, `email` (unique), and a 1-to-many relationship to `Product`.
2. A `Product` model with `id`, `title`, `price` (Float), `vendorId` (Foreign Key), and a 1-to-many relationship to `Review`.
3. A `Review` model with `id`, `rating` (Int 1-5), `comment` (String?), `productId`, and `authorName`.
4. Add B-Tree indexes (`@@index`) on all foreign key columns (`vendorId` and `productId`) to ensure high performance during SQL joins!

#### 💡 Exercise 1 Solution
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Vendor {
  id        Int       @id @default(autoincrement())
  name      String
  email     String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id          Int      @id @default(autoincrement())
  title       String
  price       Float
  vendorId    Int
  vendor      Vendor   @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  reviews     Review[]
  createdAt   DateTime @default(now())

  @@index([vendorId])
}

model Review {
  id          Int      @id @default(autoincrement())
  rating      Int
  comment     String?
  authorName  String
  productId   Int
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())

  @@index([productId])
}
```

---

### Exercise 2: Eager Relational Queries & Transactions
**Task:** Using the schema from Exercise 1, write a TypeScript/JavaScript function `createVendorWithCatalog()` that uses `PrismaClient` to:
1. Create a new `Vendor` named *"Acme Electronics"*.
2. In the **same atomic database transaction** (using nested write syntax), create two products: *"Wireless Mouse"* ($29.99) and *"Mechanical Keyboard"* ($89.99).
3. Then, write a second query to fetch all vendors, eagerly loading their products and any reviews associated with those products in a single SQL query (avoiding N+1 loops!).

#### 💡 Exercise 2 Solution
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createVendorWithCatalog() {
  // 1 & 2. Atomic nested creation!
  const newVendor = await prisma.vendor.create({
    data: {
      name: 'Acme Electronics',
      email: 'contact@acme.com',
      products: {
        create: [
          { title: 'Wireless Mouse', price: 29.99 },
          { title: 'Mechanical Keyboard', price: 89.99 }
        ]
      }
    },
    include: { products: true }
  });
  console.log('Created Vendor with Products:', newVendor);

  // 3. Eager relational fetch (1 compiled SQL query!)
  const allVendors = await prisma.vendor.findMany({
    include: {
      products: {
        include: {
          reviews: true
        }
      }
    }
  });
  console.log('All catalog data:', JSON.stringify(allVendors, null, 2));
}
```

---

### Exercise 3: The Schema Migration Workflow
**Task:** Explain the exact terminal commands required to evolve your database schema from initial creation to adding a new column in production:
1. How do you generate the initial SQL migration file?
2. You decide to add an optional `sku String?` column to the `Product` model. What command generates the second migration file?
3. Why must you use `DIRECT_URL` (port 5432) instead of pooled `DATABASE_URL` (port 6543) when running migrations against cloud databases like Neon PostgreSQL?

#### 💡 Exercise 3 Solution
1. **Initial Migration:** `npx prisma migrate dev --name init`
   * This creates `prisma/migrations/20260726000000_init/migration.sql`, runs it against the development database, and updates `_prisma_migrations`.
2. **Second Migration:** After adding `sku String?` to `schema.prisma`, run: `npx prisma migrate dev --name add_product_sku`. This generates a clean diff migration (`ALTER TABLE "Product" ADD COLUMN "sku" TEXT;`).
3. **Why `DIRECT_URL` is required:** Connection poolers like PgBouncer (port 6543) multiplex thousands of API requests across a few PostgreSQL connections by stripping session state and transaction locks between queries. Database migrations (`ALTER TABLE`, `CREATE INDEX`) require persistent **Data Definition Language (DDL) advisory locks**. If run through a pooler, the migration will hang or fail. `DIRECT_URL` connects directly to PostgreSQL (port 5432), allowing uninterrupted DDL locks!

---

## PART 2: Path B — Advanced Mongoose ODM & MongoDB

### Exercise 4: Virtuals & Pre-Save Middleware
**Task:** Write a Mongoose schema for a `Customer` model that enforces professional data integrity and security:
1. Fields: `email` (required, unique), `password` (required), and `createdAt` timestamp.
2. Implement a `pre('save')` middleware hook that automatically lowercases and trims the email address AND hashes the password with `bcryptjs` (only if the password was modified!).
3. Implement a virtual property `accountAgeDays` that calculates how many days have elapsed since `createdAt`.

#### 💡 Exercise 4 Solution
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property: accountAgeDays
customerSchema.virtual('accountAgeDays').get(function() {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(Date.now() - this.createdAt.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save lifecycle middleware
customerSchema.pre('save', async function() {
  // 1. Sanitize email
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  // 2. Hash password (with guard clause!)
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
```

---

### Exercise 5: Cross-Collection Populate & Aggregation
**Task:** Write an Express route handler `GET /api/products/:id/reviews` that queries a MongoDB `Review` collection where each review references a `Product` ObjectId and an `author` User ObjectId.
Use Mongoose `.populate()` to fetch all reviews for product `:id`, attaching the author's `username` and `avatarUrl` (while excluding sensitive fields like `password`).

#### 💡 Exercise 5 Solution
```javascript
import express from 'express';
import { Review } from '../models/Review.js';

const router = express.Router();

router.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch reviews and populate author details cleanly
    const reviews = await Review.find({ product: id })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatarUrl -_id'); // Select username and avatarUrl, exclude _id!

    // Compute average rating in Node.js memory
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: Number(avgRating),
      data: reviews
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
```

---

## PART 3: Universal Performance Challenge

### Exercise 6: The N+1 Query Refactoring Challenge
**Task:** Below is a buggy, unoptimized snippet written by a junior developer attempting to fetch all blog posts and their comments. Identify why this causes a database bottleneck, and rewrite it into 2 optimized lines using **Prisma** AND **Mongoose**.

#### ❌ The Buggy Snippet:
```javascript
// Naive Loop Approach
const posts = await Post.findAll(); // 1 query
for (let i = 0; i < posts.length; i++) {
  // Executes 1 network request per post inside the loop!
  const comments = await Comment.findAll({ where: { postId: posts[i].id } });
  posts[i].comments = comments;
}
return posts;
```

#### 💡 Exercise 6 Solution
**Why it is broken:** If there are 200 blog posts, this executes `1 + 200 = 201` sequential database requests over the network! Under concurrent user traffic, this will exhaust connection pools and cause 504 Gateway Timeouts.

**Optimized Prisma Solution (1 SQL query via `JOIN`):**
```javascript
const postsWithComments = await prisma.post.findMany({ include: { comments: true } });
```

**Optimized Mongoose Solution (2 NoSQL queries via `$in` operator merged in memory):**
```javascript
const postsWithComments = await Post.find().populate('comments');
```
