# Lesson 36 — Full-Stack Project: E-commerce API & Admin Dashboard
# 🗂️ Tutor Notes (120-Minute Session)

> **Important Note:** This is a capstone project session, not a concept-lecture session. Your primary role is that of a **senior engineer facilitating a junior engineer's first real project**. Guide architectural decisions, unblock the student when they get stuck, and reinforce good habits (planning before coding, testing as they go).

---

## Session Objectives

By the end of this session the student will be able to:

1. Plan and design the architecture of a full-stack e-commerce application from scratch.
2. Build a RESTful API with Express.js and connect it to a database (PostgreSQL or MongoDB).
3. Implement JWT-based authentication and role-based authorization middleware.
4. Build a React Admin Dashboard that consumes a live backend API.
5. Deploy both applications via GitHub Actions to Vercel and Render/Heroku.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Backend Scaffold | Have `examples/ecommerce-api` ready and understand each file. Be prepared to walk the student through it. |
| Frontend Scaffold | Have `examples/admin-dashboard` ready. |
| Database Ready | Ensure a Neon (PostgreSQL) or MongoDB Atlas cluster is ready. Know the connection string. |
| GitHub Repos | Create two empty GitHub repos (one for API, one for Dashboard) ahead of time and push the scaffolds to demonstrate. |
| Deployment Accounts | Verify you have active Vercel and Render (or Heroku) accounts for live demos. |
| Postman/Insomnia | Have a collection ready to demonstrate testing the API endpoints as they are built. |

---

## Phase-by-Phase Lesson Flow (120 min)

---

### Phase 1 — Project Planning & Architecture (20 min)

**Goal**: Establish the blueprint before writing a single line of code.

1. **The Scenario (5 min):**
   - Ask the student: *"Imagine you've been hired by a small Nigerian clothing brand. They need a website to sell their products and a private admin panel to manage stock. Where do you start?"*
   - Lead them to the answer: **Start with the data model, not the code.**

2. **Design the Database Schema Together (10 min):**
   - On a whiteboard or shared document, sketch the following tables/collections:

   | Entity | Key Fields |
   |--------|------------|
   | **User** | `id`, `name`, `email`, `password` (hashed), `role` (`user` \| `admin`) |
   | **Product** | `id`, `name`, `description`, `price`, `stock`, `category`, `imageUrl` |
   | **Order** | `id`, `userId` (FK), `status` (`pending` \| `shipped` \| `delivered`), `totalAmount`, `createdAt` |
   | **OrderItem** | `id`, `orderId` (FK), `productId` (FK), `quantity`, `price` |

3. **Map the API Endpoints (5 min):**
   - Walk through the full endpoint list in `student_notes.md` together, confirming the student understands each one's purpose before they begin building.

---

### Phase 2 — Building the Backend API (50 min)

**Goal**: Students build the working API, starting with a scaffold from `examples/ecommerce-api`.

1. **Project Setup (10 min):**
   - Have the student fork/clone the `ecommerce-api` scaffold.
   - Walk through the file structure together. Point out `server.js`, the `middleware/` folder, and the `routes/` stubs.
   - Ask: *"What does `process.env.PORT || 3000` do and why is it important here?"* (Recap from Lesson 34.)

2. **Database Connection (10 min):**
   - Guide the student to install their chosen ORM (`prisma` for PostgreSQL or `mongoose` for MongoDB).
   - Help them set up the `DATABASE_URL` in `.env` and connect.
   - For PostgreSQL/Prisma: Run `npx prisma db push` to create the schema from the plan above.

3. **User Auth Routes — `/register` and `/login` (15 min):**
   - Open `src/routes/userRoutes.js`. Walk through the stubs.
   - Help them implement `POST /register`: hash password with `bcrypt`, save user to DB, return success.
   - Help them implement `POST /login`: verify email/password, sign a JWT, return token.
   - **Crucial:** Test BOTH endpoints in Postman *before* moving on.

4. **Auth Middleware (5 min):**
   - Open `src/middleware/authMiddleware.js`. Walk through the JWT verification logic.
   - Explain: *"This function runs before any protected route. If the token is missing or invalid, it sends a 401 and stops the request dead."*

5. **Products & Orders CRUD (10 min):**
   - Guide the student through implementing the CRUD stubs in `productRoutes.js` and `orderRoutes.js`.
   - **Emphasize authorization:** `POST /products`, `PUT /products/:id`, `DELETE /products/:id` should require `role === 'admin'`.
   - Test with Postman as each route is implemented.

---

### Phase 3 — Building the Admin Dashboard (30 min)

**Goal**: Students build the React frontend that consumes the API.

1. **Project Setup (5 min):**
   - Have the student fork/clone the `admin-dashboard` scaffold.
   - Walk through the `vercel.json` and `.env` (`VITE_API_URL=http://localhost:3000`).

2. **Login Page & Auth State (10 min):**
   - Guide the student to build a Login form that calls `POST /login` on the API.
   - On success, store the JWT in `localStorage`.
   - Create a simple auth context or a protected route wrapper that redirects unauthenticated users to `/login`.

3. **Products Page (10 min):**
   - In `src/pages/ProductsPage.jsx`, help them implement a `useEffect` that fetches `GET /products` and renders a table.
   - Add a basic form (or modal) to `POST` a new product (admin only).

4. **Users & Orders Pages (5 min):**
   - Guide the student through quickly wiring up `UsersPage.jsx` (`GET /users`) and `OrdersPage.jsx` (`GET /orders`).
   - These are read-only views — focus on the fetch pattern being correct.

---

### Phase 4 — Deployment via GitHub Actions (15 min)

**Goal**: Ship both apps to the public internet using the CI/CD skills from Lesson 35.

1. **Backend Deployment (8 min):**
   - Have the student push their API to a GitHub repo.
   - Deploy to Render (or Heroku). Remind them of the **Holy Trinity**: `process.env.PORT`, `npm start` script, and environment variables in the dashboard (recap from Lesson 34).
   - Show how the provided `render.yaml` can be used for Infrastructure-as-Code deployment on Render.

2. **Frontend Deployment (7 min):**
   - Have the student push their Dashboard to a separate GitHub repo.
   - Deploy to Vercel. Add `VITE_API_URL` pointing to the live Render URL.
   - Update the backend's `CORS_ORIGIN` environment variable to the new Vercel URL.

---

### Phase 5 — End-to-End Testing & Wrap-Up (5 min)

**Goal**: Verify the complete system works end-to-end.

- Open the live Vercel URL in the browser.
- Log in with a user account. Verify the products, users, and orders pages load data from the live API.
- Celebrate the milestone! 🎉

---

## Common Issues to Watch Out For

| Problem | Cause | Fix |
|---------|-------|-----|
| `401 Unauthorized` on protected routes | JWT token not sent in `Authorization` header | Ensure React adds `Authorization: Bearer <token>` to requests |
| CORS error after deployment | Backend `CORS_ORIGIN` not updated with Vercel URL | Update `CORS_ORIGIN` env var on Render/Heroku dashboard |
| `Cannot find module` on Render | `node_modules` not installed | Ensure Build Command includes `npm install` |
| React Router 404 on Vercel refresh | Missing `vercel.json` rewrites | Add `vercel.json` to the frontend root |
| Database connection failed | `DATABASE_URL` not set in cloud dashboard | Add `DATABASE_URL` to the Render env vars panel |

---

## Homework / Take-Home

Assign `exercises/ecommerce_project_checklist.md`.

Students must complete the full project outside of session time, ensuring all CRUD operations, authentication, and deployment steps are working. They must present the live application in the next check-in.
