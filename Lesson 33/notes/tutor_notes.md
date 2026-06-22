# Lesson 33 — Integrating Auth into an Express App
# 🗂️ Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this lesson students will be able to:

1. **Integrate** Bcrypt and JWT into a full Model-View-Controller (MVC) or modular routing architecture using Prisma.
2. **Build a robust Registration flow** that checks for duplicate emails and strips password hashes from API responses.
3. **Build a robust Login flow** that uses generic error messages ("Invalid credentials") to prevent enumeration attacks.
4. **Implement Role-Based Access Control (RBAC)** by combining `requireAuth` and `requireAdmin` middleware.
5. **Connect a Frontend** to the API by storing tokens in `localStorage` and attaching them to the `Authorization` header on subsequent `fetch()` calls.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Node.js installed? | v18+ required |
| Run `npm install` in `examples/full-auth-api/` | Installs dependencies |
| Push Prisma Schema | Run `npx prisma db push` to generate SQLite DB |
| Start Server | Run `pnpm dev` and open `localhost:3000` |
| Test the Lab | Register a user, login, and access the dashboard to ensure DB is working. |

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — The Architecture & Registration (25 min)

**Goal**: Move from single-file concepts (Lesson 31) to a structured project.

1. **Review the Folder Structure (5 min)**
   - Walk through `src/routes`, `src/middleware`, and `prisma/schema.prisma`.
   - Explain how separating routes and middleware makes the app scalable.

2. **The Registration Flow (15 min)**
   - Open `src/routes/auth.routes.js` and look at `/register`.
   - Discuss the logic flow: Validation ➔ Duplicate Check ➔ Hash ➔ Save ➔ Scrub Response.
   - **Crucial Question for Students:** "Why did we omit the `password` field from the `newUser` object before sending `res.json()`?" (Answer: Never leak password hashes to the client).

3. **Live Lab: Register (5 min)**
   - Open `localhost:3000`. Show the sleek Auth Portal.
   - Create a user. Have students look at the Network tab in DevTools to verify the hash is NOT in the JSON response.

---

### Phase 2 — Login & LocalStorage (25 min)

**Goal**: Connect the backend token generation to the frontend storage.

1. **The Login Flow (10 min)**
   - Walk through `/login`.
   - Highlight the generic `Invalid credentials` error message. 
   - Ask: "Why don't we tell them 'Email not found'?" (Answer: Enumeration attacks).

2. **The Frontend Connection (15 min)**
   - Switch to the live Lab and Login.
   - Open Chrome DevTools ➔ Application Tab ➔ Local Storage. Show them the token sitting there!
   - Explain how the Frontend Javascript now has to manually attach that token to every subsequent `fetch()` request via the `Authorization: Bearer <token>` header.

---

### Phase 3 — Protected Routes & RBAC (20 min)

**Goal**: Implement Authorization (RBAC).

1. **The `requireAuth` Middleware (5 min)**
   - Brief review of extracting the token and running `jwt.verify`.
   - Show how `req.user` is populated.

2. **Role-Based Access Control (10 min)**
   - Open `prisma/schema.prisma` to show the `role String @default("USER")` field.
   - Open `src/middleware/role.js` to show the `requireAdmin` logic.
   - Explain how middleware can be chained: `app.delete(..., requireAuth, requireAdmin, controller)`.

3. **Live Lab: The Admin Panel (5 min)**
   - In the Lab UI, try to click the "Admin Panel" tab with the regular user just created. It will return a 403 Forbidden.
   - (Tutor Trick: You can manually change the role to "ADMIN" in Prisma Studio to show it working, or use a script).

---

### Phase 4 — Quiz & Lab Verification (20 min)

**Goal**: Verify retention.

1. **Quiz (15 min)**
   - Have students complete the 7-question quiz in the UI.
   - Review Q3 (Why use generic login errors?): Emphasize enumeration attacks.
   - Review Q5 (Middleware chaining): Ensure they understand `requireAuth` MUST run before `requireAdmin` so that `req.user` exists.

**Expected scores:**
- 6-7/7: Ready for the take-home project.
- < 5/7: Re-explain the difference between `localStorage` and Cookies, and the concept of Middleware chaining.

---

## Common Errors Table

| Error | Cause | Fix |
|-------|-------|-----|
| `PrismaClientInitializationError` | Forgot to push the schema | Run `npx prisma db push` |
| `req.user is undefined` in `requireAdmin` | `requireAuth` wasn't placed before it in the route | Change `app.get(..., requireAdmin, requireAuth)` to `app.get(..., requireAuth, requireAdmin)` |
| `Cannot destructure property 'email' of 'req.body' as it is undefined` | Forgot `express.json()` | Add `app.use(express.json())` in `server.js` |
| Token is null on frontend | `localStorage.setItem('token', ...)` used wrong variable name | Check frontend JS where the fetch response is parsed |

---

## Homework / Take-Home

Assign `exercises/integration_practice.md`
Students will implement an "Admin" role system on their existing Movies API and build a mock "Forgot Password" flow.
