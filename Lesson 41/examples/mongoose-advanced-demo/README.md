# Advanced Mongoose ODM Demonstration
**Lesson 41 Runnable Demonstration Project**

This project demonstrates advanced NoSQL object-document modeling with **Mongoose ODM v8.3.0**, featuring virtual properties, pre-save lifecycle middleware (automated Bcrypt hashing), embedded sub-documents, and cross-collection `.populate()` queries.

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Express API Server
By default, the server will automatically launch a zero-setup in-memory MongoDB instance (`mongodb-memory-server`) and seed sample users, products, and orders!
```bash
npm run dev
```

The server will start on `http://localhost:3002`.

---

## 📡 Available API Endpoints

* `GET /api/status` — Returns driver version, connection mode (In-Memory or Cloud), and live collection counts.
* `GET /api/users` — Returns all user documents, demonstrating automatic serialization of the `fullName` virtual property.
* `GET /api/products` — Returns all products, demonstrating embedded `reviews` sub-documents and calculated `averageRating` virtuals.
* `GET /api/orders` — Demonstrates cross-collection NoSQL Joins by `.populate('user')` and `.populate('items.product')` in a single query.
* `POST /api/products/:id/reviews` — Adds a review sub-document to a product and re-serializes virtuals.
* `POST /api/seed` — Manually re-runs the database seeder.

---

## ☁️ Connecting to External MongoDB / Atlas

To connect to a persistent local Docker container or cloud MongoDB Atlas cluster:
1. Open `.env` (or copy `.env.example` to `.env`) and uncomment your connection string:
   ```env
   MONGODB_URI="mongodb+srv://user:pass@cluster0.mongodb.net/lesson41_advanced_odm?retryWrites=true&w=majority"
   ```
2. Restart the server with `npm run dev`. It will detect `MONGODB_URI` and connect externally!
