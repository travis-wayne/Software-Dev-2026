# Lesson 33 — Integrating Auth into an Express App

**Session Type:** Backend, Databases & Systems
**Duration:** 90 minutes
**Prerequisites:** Lesson 31 & 32 (Authentication, Security Concepts)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Registration Flow** | How to validate users, check for duplicates, hash passwords using `bcryptjs`, and safely return data without leaking the hash. |
| **Login Flow** | How to verify credentials securely without exposing whether the email or password was wrong, mitigating enumeration attacks. |
| **Role-Based Access Control** | Adding a `role` field to Prisma models (e.g., `"USER"`, `"ADMIN"`) and building chained Express middleware (`requireAdmin`) to restrict endpoints. |
| **Frontend Integration** | Building a "Glassmorphism" UI that stores the JWT in `localStorage` and automatically attaches it as an `Authorization: Bearer <token>` header in `fetch()` calls. |

---

## Running the Interactive Demo

The included API provides a complete, production-ready Auth ecosystem.

```bash
cd examples/full-auth-api

# 1. Install dependencies
pnpm install

# 2. Push the Prisma schema to generate the SQLite database
npx prisma db push

# 3. Start the server
pnpm dev
```

Open **http://localhost:3000** in your browser.
You will see four tabs:
1. **Auth Portal:** A fully functional Registration and Login form.
2. **Dashboard:** A private endpoint that only loads if you have a valid JWT. You can add notes here!
3. **Admin Panel:** A restricted area. Normal users get a `403 Forbidden` error. Try manually opening Prisma Studio (`npx prisma studio`), changing your role to `"ADMIN"`, logging back in, and accessing the panel!
4. **Quiz:** 5 interactive questions to test your Auth knowledge.

---

## File Structure

```
Lesson 33/
├── README.md
├── notes/
│   ├── tutor_notes.md          # 90-min lesson plan, common errors, live demo steps
│   └── student_notes.md        # Code walkthroughs for Register, Login, and RBAC
├── examples/
│   └── full-auth-api/
│       ├── prisma/schema.prisma # Prisma setup with Role field
│       ├── src/
│       │   ├── middleware/      # requireAuth & requireAdmin
│       │   ├── routes/          # auth.routes.js & notes.routes.js
│       │   └── server.js        # Main Express app
│       └── public/index.html    # Interactive Frontend UI
└── exercises/
    └── integration_practice.md  # Take-home assignment (Mock Forgot Password & Admin Routes)
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Build a robust user registration and login flow using Express, Bcrypt, and JWT.
2. Integrate Prisma ORM to save and query users.
3. Understand the difference between Authentication (Identity) and Authorization (Permissions).
4. Implement chained middleware to protect routes based on user roles (RBAC).
5. Explain how the browser utilizes `localStorage` to persist JWTs across page reloads.
