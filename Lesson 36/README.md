# Lesson 36 — Full-Stack Project: E-commerce API & Admin Dashboard

**Session Type:** Capstone Project
**Duration:** 120 minutes
**Prerequisites:** Express.js APIs (Lesson 31–33), Deployment (Lesson 34), CI/CD with GitHub Actions (Lesson 35), React frontend (Lessons 20–26)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **API Design** | Creating RESTful endpoints for products, orders, and users using Express.js. |
| **Database Integration** | Connecting to PostgreSQL or MongoDB to store and manage e-commerce data. |
| **Authentication & Authorization** | JWT-based login, user registration, and role-based access control for admin routes. |
| **Frontend Integration** | Connecting a React Admin Dashboard to the backend API to fetch, display, and manage data. |
| **Deployment** | Deploying the React frontend (Vercel) and Node.js backend (Render/Heroku) via GitHub Actions CI/CD. |
| **Web Security** | Applying CORS configuration and input validation as basic security layers. |

---

## Project Structure

This is a capstone lesson. Students will build two separate projects (in their own GitHub repositories) and connect them. The `examples/` folder contains the starter scaffolding they will build upon.

### Backend (`examples/ecommerce-api`)
A boilerplate Express/Node.js API pre-configured with:
- Dynamic Port Binding (`process.env.PORT || 3000`) for cloud deployment.
- JWT authentication middleware scaffold.
- Placeholder routes for `products`, `users`, and `orders`.
- A `Procfile` for Heroku and a `render.yaml` for Render.

### Frontend (`examples/admin-dashboard`)
A boilerplate Vite/React project pre-configured with:
- A `vercel.json` for React Router support on Vercel.
- `VITE_API_URL` environment variable usage to target the production API.
- Placeholder pages for Products, Users, and Orders management.

---

## File Structure

```text
Lesson 36/
├── README.md
├── notes/
│   ├── tutor_notes.md                     # 120-min session guide + project facilitation tips
│   └── student_notes.md                   # Full project brief, API reference, and concepts recap
├── examples/
│   ├── ecommerce-api/                     # Starter Express backend scaffold
│   │   ├── Procfile
│   │   ├── render.yaml
│   │   ├── package.json
│   │   └── src/
│   │       ├── server.js                  # Express app entry point
│   │       ├── middleware/
│   │       │   └── authMiddleware.js      # JWT verification middleware
│   │       └── routes/
│   │           ├── productRoutes.js       # CRUD route stubs for /products
│   │           ├── userRoutes.js          # /register, /login, /profile routes
│   │           └── orderRoutes.js         # CRUD route stubs for /orders
│   └── admin-dashboard/                   # Starter React frontend scaffold
│       ├── vercel.json
│       ├── package.json
│       └── src/
│           ├── App.jsx
│           └── pages/
│               ├── ProductsPage.jsx
│               ├── UsersPage.jsx
│               └── OrdersPage.jsx
└── exercises/
    └── ecommerce_project_checklist.md     # Step-by-step build and deployment checklist
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Plan and design the architecture of a full-stack e-commerce application from scratch.
2. Build a RESTful API with Express.js and connect it to a database (PostgreSQL or MongoDB).
3. Implement JWT-based authentication and role-based authorization middleware.
4. Build a React Admin Dashboard that consumes a live backend API.
5. Deploy both applications via GitHub Actions to Vercel and Render/Heroku.
