# Prisma ORM & Neon PostgreSQL Migrations Demo
**Lesson 41 Runnable Demonstration Project**

This project demonstrates declarative database modeling with **Prisma v5.22.0**, type-safe database queries, atomic transactions, eager relational loading, and the schema migration lifecycle (`prisma migrate dev` vs `prisma db push`).

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database Schema
By default, the project connects to an offline local SQLite database (`dev.db`). Push the schema to create the tables:
```bash
npx prisma db push
```

### 3. Seed Sample Data
Populate users, products, and nested relational orders:
```bash
node prisma/seed.js
```

### 4. Start the Express API Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`.

---

## 📡 Available API Endpoints

* `GET /api/status` — Returns driver version, connection status, and live row counts across all tables.
* `GET /api/users` — Demonstrates eager relational loading (`include`) by returning all users, their orders, and nested line items in 1 SQL query.
* `GET /api/products` — Returns the available hardware product catalog.
* `POST /api/orders` — Executes an atomic `prisma.$transaction()` that checks stock, deducts inventory, and creates an order with items simultaneously.
* `DELETE /api/users/:id` — Demonstrates cascading foreign key deletion (`onDelete: Cascade`).

---

## ☁️ Connecting to Neon Cloud PostgreSQL

To test cloud migrations against a real serverless database:
1. Open `prisma/schema.prisma` and change `provider = "sqlite"` to `provider = "postgresql"`. Uncomment the `directUrl` line.
2. Open `.env` (or copy `.env.example` to `.env`) and provide your Neon PostgreSQL connection credentials:
   ```env
   DATABASE_URL="postgresql://user:pass@ep-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15"
   DIRECT_URL="postgresql://user:pass@ep-direct.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```
3. Generate and execute a formal database migration:
   ```bash
   npx prisma migrate dev --name init_neon_cloud
   ```
