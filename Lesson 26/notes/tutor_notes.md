# Tutor Notes — Lesson 26: Building APIs with Express.js

---

## Session Objectives

By the end of this session the student will be able to:
1. Explain what an API is using the Restaurant analogy.
2. Initialise an Express server with the correct middleware order.
3. Define GET, POST, PUT, and DELETE routes and explain when to use each.
4. Extract data from `req.params`, `req.body`, and `req.query`.
5. Return responses with correct HTTP status codes (`200`, `201`, `400`, `404`).
6. Use the API Explorer UI to test all 5 routes live in the browser.

---

## Pre-Session Setup Checklist

- [ ] `pnpm dev` runs cleanly in `Lesson 26/examples/express-api/`.
- [ ] `http://localhost:3000` opens the **Concepts** tab without errors.
- [ ] The **API Explorer** tab can successfully `GET /api/books` and receive the 3 initial books.
- [ ] VS Code is open to `server.js`.

---

## Pedagogical Context: The "Invisible Backend" Problem

Lesson 26 faces a unique teaching challenge: when a student writes a React component, they see a button. When they write an Express route, they see... nothing — just terminal text.

The **API Explorer UI** embedded in this lesson solves this visually. The UI is served as a static file from the `public/` folder by Express itself, making it a live demonstration of a full-stack request cycle.

**Key framing before any code:**
> "You are about to build the *other half* of a full-stack application. Your React apps fetch data from somewhere. Today, you are going to be that somewhere."

---

## Lesson Flow (90-minute session)

### Phase 1 — Concepts Tab Tour (20 minutes)

Open `http://localhost:3000` on the **📖 Concepts** tab together. Walk through the three concept cards:

1. **What is an API?** — Use the restaurant analogy. Ask: *"If the API goes down, can the customer get food?"* (No — but the kitchen is still running. That's separation of concerns.)

2. **Express.js route anatomy** — Point to the code card and walk through every part:
   - `app` — the Express application object.
   - `.get()` — matches the HTTP method.
   - `'/api/books'` — the URL pattern (the route).
   - `(req, res) => {}` — the callback that runs when the route matches.

3. **Request & Response** — Spend time on the `req` side. Ask: *"Where does `req.body` come from?"* Answer: it doesn't exist naturally — `express.json()` middleware creates it.

4. **CRUD Table** — Ask the student to recite the mapping from memory before you show the table.

5. **Middleware Banner** — Stress this heavily. Run a live demonstration: comment out `app.use(express.json())` in `server.js`, save, send a POST from the Explorer, and show that `req.body` is now `undefined`. Then uncomment it and show it working again.

### Phase 2 — Reading `server.js` (20 minutes)

Open `server.js` side-by-side with the Explorer.

1. Walk through the **middleware setup** (lines 14–16): `cors()` and `express.json()`. Explain the order matters.
2. Walk through the **books array** — point out it resets on every server restart. *"What problem does this cause?"* (Data is ephemeral — next lesson introduces a real database.)
3. Walk through **GET all** and **GET by ID** together. Highlight:
   - `parseInt(req.params.id)` — params are always strings; the books array uses integers.
   - The `find()` vs `findIndex()` distinction (why POST uses push but PUT uses findIndex).

### Phase 3 — API Explorer (25 minutes)

Switch to the **📡 API Explorer** tab. Work through every endpoint in order:

1. **GET /api/books** — shows the 3 books. Confirm `success: true` wrapper.
2. **GET /api/books/:id** — get book 1. Then get book 999 — show the `404` response in red in the status bar.
3. **POST** — add a new book. Switch back to GET all to *prove* it was saved.
4. **PUT** — update book 1. Fill in all three fields (ID, title, author).
5. **DELETE** — delete book 2. GET all again to confirm it's gone.

At each step, **point to the Request Log** panel. Every call is logged with method, URL, status code, and response time.

### Phase 4 — Interactive Quiz (15 minutes)

Switch to the **🧠 Quiz** tab. Let the student answer all 7 questions.

The quiz now provides **instant per-answer feedback** — the student selects an option and immediately sees if they're right, with an explanation panel below. Score appears automatically when all questions are answered.

**If they miss the middleware question:** repeat the live `express.json()` demo from Phase 1.
**If they miss the `req.params` question:** write `/api/books/:id` on a whiteboard and draw an arrow from `:id` to `req.params.id`.

---

## Common Errors & Fixes

| Error / Symptom | Cause | Fix |
|---|---|---|
| `req.body is undefined` | `express.json()` middleware missing or defined after the route | Add `app.use(express.json())` before all route definitions |
| `Cannot GET /api/book` | URL typo (singular vs plural) | Ensure the fetch URL matches the route string exactly |
| `books.filter(...)` doesn't work | `const books` is reassigned during DELETE | Change `const books` to `let books` |
| Explorer shows "Failed to reach server" | Server not running | Run `pnpm dev` in the terminal |
| Data resets after file save | nodemon restarted the process | Intentional — real databases solve this (next lesson) |
| `404` on every request | Route defined before `app.use(express.static(...))` path issue | Ensure `server.js` path setup uses `import.meta.url` via `fileURLToPath` |

---

## Key Concepts to Reinforce Verbally

1. **`req.params` values are always strings.** Even if the URL has `/api/books/3`, `req.params.id` is `"3"`, not `3`. This is why we `parseInt()`.

2. **Middleware order matters.** `app.use(express.json())` must be defined *before* any routes that use `req.body`.

3. **Status codes are communication, not decoration.** A `201` tells any client *automatically* that the resource was just created. `400` tells them *they* made a mistake. `404` tells them *the resource doesn't exist*.

4. **In-memory data is a stepping stone.** The books array resets every time nodemon restarts. This is fine for learning — but always point students toward the next session (databases) as the real solution.

---

## Post-Session Assignment

Direct the student to `exercises/express_practice.md` — they must build a complete Movies API from scratch on port `5000`. The exercise intentionally has no provided starter UI, which forces them to use Postman or Insomnia for testing (a professional skill).

**Stretch goal:** Add a `GET /api/movies?director=Nolan` route that uses `req.query` to filter movies by director.
