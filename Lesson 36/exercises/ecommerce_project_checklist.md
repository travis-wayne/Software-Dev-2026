# Exercise: Full-Stack E-commerce Project Checklist

Use this checklist to build and deploy your full-stack e-commerce application. Work through it in order — each phase builds on the last. Tick each item off as you complete it.

---

## Phase 1 — Planning

- [ ] Sketch the database schema for `User`, `Product`, `Order`, and `OrderItem`.
- [ ] List all the API endpoints you will need (refer to `student_notes.md` for the full reference table).
- [ ] Create two empty GitHub repositories: one for `ecommerce-api`, one for `admin-dashboard`.

---

## Phase 2 — Backend API Setup

- [ ] Clone/copy the `examples/ecommerce-api` scaffold into your `ecommerce-api` repo.
- [ ] Run `npm install` to install dependencies.
- [ ] Create a `.env` file with `PORT`, `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGIN`.
- [ ] Add `.env` to your `.gitignore` — **never commit secrets to GitHub**.
- [ ] Set up your database connection (Prisma for PostgreSQL or Mongoose for MongoDB).
- [ ] Run `npx prisma db push` (PostgreSQL) or define your Mongoose schemas (MongoDB) to create the database tables/collections.

---

## Phase 3 — Auth Routes

- [ ] Implement `POST /api/users/register` — hash password with `bcrypt`, save user to DB.
- [ ] Implement `POST /api/users/login` — verify credentials, return a signed JWT.
- [ ] Test `register` in Postman. Confirm the password stored in the DB is **hashed**, not plain text.
- [ ] Test `login` in Postman. Copy the returned JWT token.

---

## Phase 4 — Auth Middleware

- [ ] Implement `protect` middleware in `src/middleware/authMiddleware.js` to verify JWT tokens.
- [ ] Implement `adminOnly` middleware to check `req.user.role === 'admin'`.
- [ ] Implement `GET /api/users/profile` (protected) — returns the logged-in user's data.
- [ ] Test `GET /api/users/profile` in Postman with and without the token. Expect `401` without it.

---

## Phase 5 — Products CRUD

- [ ] Implement `GET /api/products` — returns all products (public).
- [ ] Implement `GET /api/products/:id` — returns a single product by ID (public).
- [ ] Implement `POST /api/products` — creates a product (`protect` + `adminOnly` required).
- [ ] Implement `PUT /api/products/:id` — updates a product (`protect` + `adminOnly` required).
- [ ] Implement `DELETE /api/products/:id` — deletes a product (`protect` + `adminOnly` required).
- [ ] Test all 5 routes in Postman. Confirm admin-only routes return `403 Forbidden` for regular users.

---

## Phase 6 — Orders CRUD

- [ ] Implement `POST /api/orders` — creates an order linked to the authenticated user.
- [ ] Implement `GET /api/orders/my-orders` — returns the current user's orders (protected).
- [ ] Implement `GET /api/orders` — returns ALL orders (admin only).
- [ ] Implement `PUT /api/orders/:id/status` — updates an order's status (admin only).
- [ ] Test all order routes in Postman with user and admin tokens.

---

## Phase 7 — Admin Dashboard Setup

- [ ] Clone/copy the `examples/admin-dashboard` scaffold into your `admin-dashboard` repo.
- [ ] Run `npm install` and `npm run dev`.
- [ ] Create a `.env` file with `VITE_API_URL=http://localhost:3000`.
- [ ] Confirm the dev server starts at `http://localhost:5173`.

---

## Phase 8 — Dashboard Pages

- [ ] Implement the **Login page** — calls `POST /api/users/login`, stores the JWT in `localStorage`.
- [ ] Implement a protected route wrapper that redirects unauthenticated users to `/login`.
- [ ] Implement the **Products page** — fetches and displays all products in a table.
- [ ] Add a form on the Products page to **create** a new product.
- [ ] Add **Edit** and **Delete** buttons to each row of the Products table.
- [ ] Implement the **Users page** — fetches and displays all users (admin only).
- [ ] Implement the **Orders page** — fetches and displays all orders with their statuses (admin only).

---

## Phase 9 — Deployment: API

- [ ] Confirm `const PORT = process.env.PORT || 3000;` is in `server.js`.
- [ ] Confirm `"start": "node src/server.js"` exists in `package.json`.
- [ ] Push your `ecommerce-api` to GitHub.
- [ ] Deploy to [Render](https://render.com/) (New ➔ Web Service ➔ Connect GitHub repo).
  - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy` (PostgreSQL) or `npm install` (MongoDB)
  - Start Command: `npm start`
- [ ] Add all environment variables in the Render dashboard: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.
- [ ] Verify the live API is accessible. Test `GET /api/products` in Postman using the Render URL.

---

## Phase 10 — Deployment: Dashboard

- [ ] Confirm `vercel.json` exists in the frontend root with React Router rewrites.
- [ ] Confirm all `fetch()` calls use `import.meta.env.VITE_API_URL`.
- [ ] Push your `admin-dashboard` to GitHub.
- [ ] Deploy to [Vercel](https://vercel.com/) (Add New ➔ Project ➔ Connect GitHub repo).
  - Add `VITE_API_URL` in Vercel's Environment Variables settings, pointing to your Render URL.
- [ ] Copy the Vercel URL Vercel gives you (e.g., `https://admin-dashboard.vercel.app`).
- [ ] Go back to Render and update `CORS_ORIGIN` to your Vercel URL. Render will redeploy automatically.

---

## Phase 11 — CI/CD with GitHub Actions

- [ ] In your `ecommerce-api` repo, create `.github/workflows/ci.yml` — a basic CI pipeline that runs `npm install` and `npm test` on every push.
- [ ] In your `admin-dashboard` repo, add a GitHub Actions workflow that triggers a Vercel deployment on push to `main` (see the template in `student_notes.md`).
- [ ] Add the necessary secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) to your GitHub repository secrets.
- [ ] Push code and confirm the GitHub Actions tab shows a successful run.

---

## Phase 12 — End-to-End Verification

- [ ] Open the live Vercel URL in your browser.
- [ ] Log in as an admin user.
- [ ] Confirm the Products page loads data from the **live Render API**.
- [ ] Create a new product from the dashboard. Confirm it appears in the products list.
- [ ] Delete a product. Confirm it disappears from the list.
- [ ] Check the Orders and Users pages load correctly.

---

## 🎉 Final Deliverable

Prepare a 5–10 minute presentation covering:

1. **Architecture Overview** — Explain your database schema, why you made the design choices you did.
2. **API Demo** — Show a few endpoints working in Postman (register, login, products CRUD).
3. **Dashboard Demo** — Log in as admin on the live Vercel URL and demonstrate full management of products, users, and orders.
4. **Deployment** — Show the GitHub Actions workflow run in the Actions tab.

> **Bonus Challenge:** Add a public-facing product listing page to the dashboard so customers can browse products without needing to log in.
