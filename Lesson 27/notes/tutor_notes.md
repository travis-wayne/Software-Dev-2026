# Tutor Notes — Lesson 27: Middleware, Errors & Environments

---

## Session Objectives

By the end of this session the student will be able to:
1. Define middleware and explain the importance of the `next()` function.
2. Store sensitive configuration in a `.env` file and load it using `dotenv`.
3. Explain why `.env` must be added to `.gitignore`.
4. Create a custom authentication middleware to protect specific routes.
5. Implement a Global Error Handler using the 4-argument `(err, req, res, next)` signature.
6. Use the Web GUI to test these concepts live.

---

## Pre-Session Setup Checklist

- [ ] `cd Lesson 27/examples/middleware-api`
- [ ] `pnpm install`
- [ ] Ensure `.env` exists and has `API_SECRET_KEY=super_secret_key_12345`
- [ ] `pnpm dev` runs cleanly.
- [ ] `http://localhost:3000` opens the **Concepts** tab.
- [ ] VS Code is open to `server.js`.

---

## Pedagogical Context: Real-World Readiness

The previous lesson taught "Happy Path" backend development. If the user sends perfect data, the server works.
This lesson introduces the harsh reality: users send bad data, hackers try to access protected data, and servers crash.

We are teaching them how to build **defensive walls** (Middleware) and **safety nets** (Global Error Handlers).

---

## Lesson Flow (90-minute session)

### Phase 1 — The `.env` Security Talk (15 minutes)

Do not look at the UI yet. Open VS Code to `server.js` and `.env`.

1. **The Problem:** Ask the student: *"If we push our app to GitHub, and we hardcode our database password in `server.js`, what happens?"* (Bots scrape it instantly).
2. **The Solution:** Open `.env`. Explain that this is a local-only file.
3. **The Enforcer:** Open `.gitignore`. Prove that `.env` is listed here.
4. **The Bridge:** Show lines 6-8 in `server.js`. `dotenv.config()` is what reads the `.env` file and pushes the values into Node's memory at `process.env`.

### Phase 2 — Middleware Concepts (20 minutes)

Open `http://localhost:3000` to the **📖 Concepts** tab.

Walk through the "Middleware Functions" card and the "Middleware Chain" diagram at the bottom.

**Key visual analogy to use:**
> "Middleware is an assembly line. The request comes in on a conveyor belt. The `express.json()` robot parses the body. The `requestLogger` robot writes down the time. The `requireApiKey` robot checks for a badge. If you don't call `next()`, the conveyor belt stops and the client is left hanging forever."

Switch to VS Code (`server.js`) and look at lines 23-31 (the `requestLogger`).
Ask the student to intentionally comment out `next();` and save. Send a request from the Explorer. Show them how it hangs. Restore `next()`.

### Phase 3 — The Explorer (25 minutes)

Switch to the **🛡️ Explorer** tab.

1. **Public Route:** Click "Send Request". It works. Point out that the VS Code terminal logged the request (thanks to the logger middleware).
2. **Secure Route:** Click "Send Request". They get a **401 Unauthorized**.
   - Show `server.js` lines 36-50 (`requireApiKey`).
   - In the Explorer UI, enter `wrong_key` into the HTTP Headers input box. Send again. **403 Forbidden**.
   - Enter `super_secret_key_12345`. Send again. **200 OK**.
3. **Broken Route:** Explain that server crashes usually kill the process.
   - Look at `server.js` line 67: `const user = undefined; console.log(user.name);`. This is a fatal TypeError.
   - Click "Break Server".
   - Point out that instead of dying, it returns a clean JSON **500 Internal Server Error**.
   - Show lines 76-85: The Global Error Handler caught it.

### Phase 4 — Interactive Quiz (15 minutes)

Switch to the **🧠 Quiz** tab. Let the student answer all 7 questions independently.

Pay special attention to these concepts if they get them wrong:
- **Missing `next()`:** They must understand this causes a hanging request.
- **`.gitignore`:** If they miss this, reiterate the massive security implications.
- **4 arguments for Error Handlers:** This is a hard-coded Express rule they just have to memorize.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `process.env.API_KEY is undefined` | Forgot `dotenv.config()` or wrong key name | Call `dotenv.config()` at the very top of `server.js` |
| Request hangs forever | Forgot `next()` in a middleware | Add `next()` |
| Error Handler doesn't fire | Defined it *above* the routes | Move it to the very bottom of the file |
| `Cannot read properties of undefined` | Code bug inside a route | Expected! That's why we have the global error handler |

---

## Post-Session Assignment

Direct the student to `exercises/middleware_practice.md`.
They must take the `Movies API` they built in Lesson 26 and upgrade it:
1. Move the hardcoded port to a `.env` file.
2. Add a `requestLogger` that prints every request.
3. Add a global error handler that catches crashes.
4. Protect POST/PUT/DELETE routes with an API key, leaving GET routes public.
