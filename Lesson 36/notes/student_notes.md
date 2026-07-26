# Lesson 36 — Full-Stack Project: E-commerce API & Admin Dashboard
# Student Reference Notes

---

> **Restaurant Analogy**
> Think of the project like building a restaurant. The API (Express backend) is THE KITCHEN — only staff enter. The Admin Dashboard (React) is THE MANAGER'S TABLET — staff-only view with full control. The database is THE STORAGE ROOM — only the kitchen talks to it. Customers (a future mobile app) access things through the kitchen window only.

## 1. Project Overview

This is your **Month 3 Capstone Project**. You will build two separate applications and connect them together to form a complete, deployable e-commerce system:

1. **E-commerce API** — A Node.js/Express.js backend with a database, authentication, and RESTful endpoints for products, users, and orders.
2. **Admin Dashboard** — A React frontend that connects to your API and allows an admin to manage the store's data.

By the end, both applications will be deployed and accessible anywhere in the world via public URLs.

---

## 2. Step 1 — Plan Your Architecture First

> **Rule of thumb:** A confused developer writes confused code. Before you write a single line, plan your data and your endpoints.

### Database Schema

Design your database around these four entities:

#### User

| Field | Type | Notes |
|-------|------|-------|
| `id` | String/UUID | Primary key |
| `name` | String | User's display name |
| `email` | String | Unique, used for login |
| `password` | String | **Must be hashed with bcrypt, never stored in plain text** |
| `role` | Enum | `'user'` or `'admin'` |
| `createdAt` | DateTime | Auto-generated |

#### Product

| Field | Type | Notes |
|-------|------|-------|
| `id` | String/UUID | Primary key |
| `name` | String | Product name |
| `description` | String | Product details |
| `price` | Float | Price in Naira |
| `stock` | Int | Available quantity |
| `category` | String | e.g., `'Shirts'`, `'Shoes'` |
| `imageUrl` | String | URL to product image |
| `createdAt` | DateTime | Auto-generated |

#### Order

| Field | Type | Notes |
|-------|------|-------|
| `id` | String/UUID | Primary key |
| `userId` | String | Foreign key → User |
| `status` | Enum | `'pending'`, `'shipped'`, `'delivered'` |
| `totalAmount` | Float | Total cost of the order |
| `createdAt` | DateTime | Auto-generated |

#### OrderItem

| Field | Type | Notes |
|-------|------|-------|
| `id` | String/UUID | Primary key |
| `orderId` | String | Foreign key → Order |
| `productId` | String | Foreign key → Product |
| `quantity` | Int | Number of units ordered |
| `price` | Float | Price at time of purchase (snapshot) |

### Choosing Your Database

- **Option A: Neon PostgreSQL (recommended)** — serverless cloud Postgres. Get a free account at neon.tech. Connection string looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
- **Option B: Local SQLite (for offline dev)** — use `better-sqlite3`. No setup needed.

You can use a dual-mode pattern that switches between them based on your environment variables.

---

## 2.5. Prisma Schema

Here is the full `prisma/schema.prisma` code for all 4 models (User, Product, Order, OrderItem) with proper relations:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  orders    Order[]
}

enum Role {
  USER
  ADMIN
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String
  price       Float
  stock       Int         @default(0)
  category    String
  imageUrl    String?
  createdAt   DateTime    @default(now())
  orderItems  OrderItem[]
}

model Order {
  id          String      @id @default(uuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  totalAmount Float
  createdAt   DateTime    @default(now())
  items       OrderItem[]
}

enum OrderStatus {
  PENDING
  SHIPPED
  DELIVERED
  CANCELLED
}

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}
```

---

## 3. Step 2 — Build the E-commerce API

### Project Setup

Start from the scaffold in `examples/ecommerce-api`:

```bash
# Clone/copy the scaffold into your project folder
cd ecommerce-api
npm install

# Create your .env file
touch .env
```

Your `.env` file must contain:
```bash
PORT=3000
DATABASE_URL=your_database_connection_string_here
JWT_SECRET=your_super_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

### Full API Endpoint Reference

#### Users

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/users/register` | ❌ Public | Create a new user account |
| `POST` | `/api/users/login` | ❌ Public | Log in and receive a JWT token |
| `GET` | `/api/users/profile` | ✅ User | Get the currently logged-in user's profile |
| `GET` | `/api/users` | ✅ Admin only | Get a list of all users |

#### Products

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/products` | ❌ Public | Retrieve all products |
| `GET` | `/api/products/:id` | ❌ Public | Retrieve a single product by ID |
| `POST` | `/api/products` | ✅ Admin only | Create a new product |
| `PUT` | `/api/products/:id` | ✅ Admin only | Update an existing product |
| `DELETE` | `/api/products/:id` | ✅ Admin only | Delete a product |

#### Orders

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/orders` | ✅ Admin only | Retrieve all orders (admin view) |
| `GET` | `/api/orders/my-orders` | ✅ User | Retrieve the current user's own orders |
| `POST` | `/api/orders` | ✅ User | Create a new order |
| `PUT` | `/api/orders/:id/status` | ✅ Admin only | Update an order's status |

### Implementing Authentication

#### 1. Register (`POST /api/users/register`)

```javascript
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Hash the password — NEVER store plain text passwords
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2. Create the user in the database
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'user' },
  });

  res.status(201).json({ message: 'User created successfully', userId: user.id });
};
```

#### 2. Login (`POST /api/users/login`)

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  // 2. Compare the password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  // 3. Sign a JWT and return it
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
};
```

#### 3. Auth Middleware (`src/middleware/authMiddleware.js`)

```javascript
import jwt from 'jsonwebtoken';

// Verifies the token — run this before any protected route
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// Role-based guard — run this AFTER protect
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};
```

#### Using Middleware on Routes

```javascript
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only protected routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
```

### Testing with Postman

Always test your API endpoints as you build them — don't wait until the end.

- **Step 1:** Register a user (`POST /api/users/register`)
- **Step 2:** Check the DB — confirm password is hashed (never plain text)
- **Step 3:** Log in (`POST /api/users/login`) — copy the token
- **Step 4:** Set up a Postman environment variable for the token
- **Step 5:** Test `GET /api/users/profile` with Bearer token
- **Step 6:** Test `POST /api/products` (admin only — expect 403 first, then manually promote user to admin in DB)
- **Step 7:** Create an order (`POST /api/orders`) as a user

---

## 4. Step 3 — Build the Admin Dashboard

Start from the scaffold in `examples/admin-dashboard`:

```bash
cd admin-dashboard
npm install
npm run dev
```

Your `.env` file:
```bash
VITE_API_URL=http://localhost:3000
```

### Login Page

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Login failed');
    localStorage.setItem('token', data.token);
    onLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;
```

### Fetching Data with Auth

Every request to a protected route must include the JWT token in the `Authorization` header:

```javascript
// A reusable helper for authenticated API calls
export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};
```

### Products Page

```jsx
// src/pages/ProductsPage.jsx
import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    authFetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>₦{p.price.toLocaleString()}</td>
              <td>{p.stock}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
```

---

## 5. Step 4 — Deploy Both Applications

### Deploying the API (Render / Heroku)

Refer to **Lesson 34** for the full deployment walkthrough. Key checklist:

- [ ] `const PORT = process.env.PORT || 3000` in `server.js`
- [ ] `"start": "node src/server.js"` in `package.json`
- [ ] Add all environment variables in the Render dashboard:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN` ← set this to your Vercel URL after deploying the frontend

### Deploying the Dashboard (Vercel)

- [ ] `vercel.json` exists in the root of the frontend repo (for React Router)
- [ ] Add `VITE_API_URL` in Vercel's Environment Variables dashboard pointing to your Render URL
- [ ] All `fetch()` calls use `import.meta.env.VITE_API_URL` (no hardcoded `localhost`)

### Setting up GitHub Actions CI/CD (Lesson 35)

Add this workflow to auto-deploy your frontend on every push to `main`:

```yaml
# .github/workflows/deploy.yml (in your admin-dashboard repo)
name: Deploy to Vercel

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 6. Assignments

### Pre-session
- Review all backend (Lessons 31–33), deployment (Lesson 34), and CI/CD (Lesson 35) concepts.
- Sketch out your own version of the database schema and endpoint list before the session begins.

### Post-session
- [ ] Complete all CRUD operations for products, users, and orders.
- [ ] Verify that all authentication and authorization middleware works correctly.
- [ ] Confirm both frontend and backend are deployed and accessible via public URLs.
- [ ] Ensure GitHub Actions workflows trigger on push and deploy successfully.
- [ ] Prepare a 5–10 minute presentation of your live application, highlighting:
  - The database schema choices you made.
  - How authentication and authorization are enforced.
  - A live demo of the Admin Dashboard managing data through the API.

---

## 7. Resources & Links

### Reading Materials
- [MDN Web Docs: Building a RESTful API with Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/rest_api)
- [Full-Stack React & Node.js Tutorial — freeCodeCamp](https://www.freecodecamp.org/news/build-a-fullstack-app-with-react-and-node-js/)

### Video Tutorials
- [Build a Full Stack MERN App — Traversy Media](https://www.youtube.com/watch?v=PBb-J-i_p_I)
- [Build a Full Stack E-commerce App (React, Node.js, Express, MongoDB) — The Net Ninja](https://www.youtube.com/watch?v=C_X_y2e260w)

### Tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download)
- [Postman](https://www.postman.com/downloads/) / [Insomnia](https://insomnia.rest/download)
- [GitHub](https://github.com/)
- [Vercel](https://vercel.com/)
- [Render](https://render.com/) / [Heroku](https://www.heroku.com/)

---

## 8. Common Mistakes

| Mistake | Why It's Dangerous | Fix |
|---------|--------------------|-----|
| Hardcoding `localhost:3000` in frontend | Breaks in production | Use `import.meta.env.VITE_API_URL` |
| Using `role: 'admin'` from JWT payload for access control without verifying | User can fake JWT payload | Always verify JWT signature server-side — the middleware already does this |
| Committing `.env` to GitHub | Exposes DB credentials to the world | Add `.env` to `.gitignore` immediately |
| CORS allowing `*` in production | Any website can call your API | Set `CORS_ORIGIN` to exact Vercel URL |
| Not handling errors with try/catch | Server crashes and stays down | Wrap all async route handlers in try/catch |

---

## 9. Quick Reference

### Security Rules — Never Break These

| ❌ Never | ✅ Always |
|----------|----------|
| Store plain text passwords | Hash with `bcrypt` before saving |
| Commit your `.env` file to GitHub | Add `.env` to `.gitignore` |
| Hardcode `localhost` in production fetch calls | Use `import.meta.env.VITE_API_URL` |
| Allow all CORS origins in production | Set `CORS_ORIGIN` to your exact Vercel URL |
| Run `prisma db push` on a production database | Use `prisma migrate deploy` for production |

### Common HTTP Status Codes in This Project

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200 OK` | Success | Successful GET, PUT |
| `201 Created` | Created | Successful POST (new resource) |
| `400 Bad Request` | Invalid input | Missing fields, validation error |
| `401 Unauthorized` | Not logged in | Missing or invalid JWT token |
| `403 Forbidden` | Not allowed | Logged in but wrong role (not admin) |
| `404 Not Found` | Doesn't exist | Product/User/Order not found in DB |
| `500 Internal Server Error` | Server crashed | Unhandled exception — check your logs |
