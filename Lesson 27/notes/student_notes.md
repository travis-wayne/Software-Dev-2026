# Lesson 27 — Middleware, Error Handling & Environment Variables
# Student Reference Notes

> **Launch the lab before reading:**
> ```bash
> cd examples/middleware-api
> pnpm install   # first time only
> pnpm dev
> ```
> Open **http://localhost:3000** — start on the **Concepts** tab.

---

## What This Lesson Is About

In Lesson 26, you built a simple Express API that works perfectly — when everything goes right.

This lesson is about what happens when things go *wrong*, and how to build applications that:
1. **Know who is allowed in** (Authentication Middleware)
2. **Log what's happening** (Logging Middleware)
3. **Never crash publicly** (Global Error Handling)
4. **Keep secrets safe** (Environment Variables)

These are not optional extras. Every production application in the world uses all four of these patterns.

---

## 1. Environment Variables — Keeping Secrets Out of Your Code

### The Problem

Imagine you build a payment app. To charge customers, you need a Stripe API key. You write this in your code:

```javascript
// NEVER do this — hardcoding secrets in source code:
const apiKey = 'my_payment_api_key_abc123xyz';  // ← Example only, never real
```

Then you push your code to GitHub. **Within minutes, automated bots scan all new GitHub commits looking for exposed keys.** They find yours. They use it to charge thousands of transactions to your account.

This is not hypothetical. It happens constantly. Companies have lost tens of thousands of dollars this way.

### The Solution: `.env` Files

A `.env` file is a plain text file that lives in your project folder. It holds all your secrets:

```env
# .env
PORT=3000
API_SECRET_KEY=super_secret_key_12345
DATABASE_URL=postgresql://user:pass@host/db
```

**Three rules that make this secure:**
1. The file is called `.env` — the dot at the start hides it on Mac/Linux
2. `.env` is **always** added to `.gitignore` — so it never gets uploaded to GitHub
3. Your teammates each create their own `.env` from a shared `.env.example` template

### How Your Server Reads It — `dotenv`

The `dotenv` package reads your `.env` file and makes every value available through `process.env`:

```javascript
// This MUST be the very first line of your server
import 'dotenv/config';

// Now you can access your secrets anywhere:
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_SECRET_KEY;
```

**Why `|| 3000`?** If `PORT` is not set in `.env`, it defaults to 3000. This is how you make your code work both locally and in production (where Vercel/Heroku sets `PORT` automatically).

### The `.env.example` Pattern

You share a template with your team — real values stripped out:

```env
# .env.example  (this IS committed to GitHub — it has no real secrets)
PORT=3000
API_SECRET_KEY=
DATABASE_URL=
```

Teammates copy this file, rename it `.env`, and fill in real values. This way, everyone knows which variables exist without exposing any secrets.

---

## 2. Middleware — The Assembly Line

### What is Middleware?

When a request arrives at your Express server, it does not go directly to your route handler. It passes through a chain of **middleware functions** first.

Think of it like an airport security line:

```
Passenger arrives
    ↓
[Check-in desk]   → Logs the passenger's name and time
    ↓
[Passport control] → Checks if your ID is valid. If not, stop here.
    ↓
[Security scanner] → Parses your bags (body parsing)
    ↓
[Gate]             → Your actual destination (route handler)
```

In Express, each of those checkpoints is a middleware function. Every middleware receives three arguments:
- `req` — the incoming request object
- `res` — the response you send back
- `next` — a function that says "I'm done, pass to the next checkpoint"

### The Golden Rule

> **If your middleware does not send a response, it MUST call `next()`.**

If you forget `next()`, the request hangs forever. The client just waits... and waits... and times out. This is one of the most common beginner bugs in Express.

```javascript
// BROKEN — request will hang forever
const badMiddleware = (req, res, next) => {
  console.log('Logging...');
  // Forgot to call next()!
};

// CORRECT
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // Pass control to the next function
};
```

### Applying Middleware

```javascript
// app.use() applies middleware to EVERY request
app.use(express.json());       // Built-in: parses JSON request bodies
app.use(requestLogger);        // Custom: logs every request

// Apply to a SPECIFIC route only (as the second argument)
app.get('/api/secure', requireApiKey, (req, res) => {
  res.json({ message: 'You are authorized!' });
});
```

### The Three Types of Middleware

| Type | Examples | What It Does |
|------|---------|--------------|
| **Built-in** | `express.json()`, `express.static()` | Ships with Express |
| **Third-party** | `cors`, `morgan`, `helmet` | Installed via npm |
| **Custom** | `requestLogger`, `requireApiKey` | You write it yourself |

---

## 3. Building an Authentication Middleware

This is the most important middleware pattern you will use in every real application:

```javascript
// The requireApiKey middleware checks every request for a valid API key
const requireApiKey = (req, res, next) => {
  // 1. Read the key from the request header
  const userKey = req.headers['x-api-key'];

  // 2. If no key at all, stop immediately
  if (!userKey) {
    return res.status(401).json({
      success: false,
      error: 'Missing API Key. Include "X-API-KEY" in your request headers.'
    });
  }

  // 3. Compare against the real key stored in .env
  const realKey = process.env.API_SECRET_KEY;

  if (userKey !== realKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API Key.'
    });
  }

  // 4. Key matches! Attach user info and move on
  req.authenticated = true;
  next();
};
```

**Why `return res.status(401)`?**
The `return` keyword is critical. Without it, the code continues executing after sending the response. This causes the dreaded "Cannot set headers after they are sent" error.

**Status codes 101:**
- `401 Unauthorized` — "Who are you? No key provided."
- `403 Forbidden` — "I know who you are. You're not allowed."
- `200 OK` — Success

---

## 4. Global Error Handling — The Safety Net

### The Problem Without It

If a database query fails or you try to access `.name` on `undefined`, Express will:
- Crash the current request
- Send an ugly HTML error page to the user
- Potentially expose your server's file paths and stack trace

This is a security risk and a terrible user experience.

### The Solution: A 4-Argument Error Handler

Express has one rule for error handlers: they must have **exactly four arguments** — `(err, req, res, next)`. That's how Express knows it is an error handler and not a regular middleware.

```javascript
// IMPORTANT: This MUST be the very last app.use() in your file
// It must be placed AFTER all routes
app.use((err, req, res, next) => {
  // Log the full error for developers (never send this to users)
  console.error('Server Error:', err.stack);

  // Send a clean, safe response to the client
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});
```

### How Errors Reach It

Inside your routes, you trigger the error handler by calling `next(err)`:

```javascript
app.get('/api/risky', async (req, res, next) => {
  try {
    const data = await fetchFromDatabase(); // This might throw
    res.json({ success: true, data });
  } catch (err) {
    next(err); // Pass the error to the global handler
  }
});
```

Or you can create custom errors with status codes:

```javascript
app.get('/api/items/:id', (req, res, next) => {
  const item = db.find(req.params.id);
  if (!item) {
    const err = new Error('Item not found');
    err.status = 404;
    return next(err); // The global handler sets res.status(404)
  }
  res.json(item);
});
```

---

## 5. How It All Fits Together

Here's the complete picture — the order your `server.js` should always follow:

```javascript
import 'dotenv/config';          // 1. Load secrets FIRST
import express from 'express';

const app = express();

// 2. Built-in middleware (parse incoming requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Custom middleware applied to all routes
app.use(requestLogger);

// 4. Public routes (no auth needed)
app.get('/api/public', (req, res) => {
  res.json({ message: 'Anyone can see this' });
});

// 5. Protected routes (auth middleware applied)
app.get('/api/secure', requireApiKey, (req, res) => {
  res.json({ message: 'Only valid keys get here' });
});

// 6. Global error handler — ALWAYS LAST
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, error: err.message });
});

app.listen(process.env.PORT || 3000);
```

---

## 6. Common Mistakes to Avoid

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Forgetting `next()` in middleware | Request hangs forever | Always call `next()` if you don't send a response |
| Calling `next()` AND `res.json()` | "Headers already sent" error | Use `return` before `res.json()` to stop execution |
| Putting error handler before routes | Errors never reach it | Error handler must be the **last** `app.use()` |
| Committing `.env` to GitHub | Secrets get stolen | Add `.env` to `.gitignore` immediately |
| Loading dotenv after other imports | `process.env` is empty | `import 'dotenv/config'` must be the first line |

---

## 7. Real-World Middleware You Should Know

Once you understand the pattern, many popular packages are just pre-written middleware:

```javascript
import cors from 'cors';
// Allows your API to be called from a different domain (e.g., React on port 5173)
app.use(cors());

import morgan from 'morgan';
// Professional request logger with timing info
app.use(morgan('dev'));

import helmet from 'helmet';
// Sets dozens of security headers automatically
app.use(helmet());
```

---

## 8. Next Steps

Work through [`exercises/middleware_practice.md`](../exercises/middleware_practice.md) — you'll build a secured Movies API from scratch, applying every pattern from this lesson.
