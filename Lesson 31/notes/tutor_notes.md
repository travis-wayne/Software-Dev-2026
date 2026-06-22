# Lesson 31 — Authentication & Security (JWT, Session, Bcrypt)
# 🗂️ Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this lesson students will be able to:

1. **Differentiate** between authentication (who you are) and authorization (what you can do).
2. **Explain why plain text passwords are a massive liability** and how Bcrypt stops brute-force attacks via "work factor".
3. **Contrast Session vs. Token (JWT) auth** using the "VIP List vs. Hotel Key Card" analogy.
4. **Read a JWT** to identify the header, payload, and signature, understanding why it is base64 encoded and *not* encrypted.
5. **Implement an Express middleware** that verifies a JWT to protect a route.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Node.js installed? | v18+ required |
| Run `npm install` in `examples/auth-api/` | Installs `express`, `bcryptjs`, `jsonwebtoken`, `better-sqlite3` |
| Allow script execution | Run `pnpm approve-builds` if you see better-sqlite3 warnings |
| Start Server | Run `pnpm dev` and open `localhost:3000` |
| Confirm UI loads | The "Auth Lab" tab is crucial for visualizing the auth flow. |

---

## Pedagogical Context — The VIP List vs The Hotel Key Card

> **Open with this analogy before writing any code.**

**The Problem:** HTTP is amnesic. Every request is a new person. How do we remember a user logged in?

**Approach 1: Stateful Sessions (The VIP List)**
"Imagine a nightclub. You show your ID (Login). The bouncer writes your name on the VIP list and hands you a blank wristband with `#44` on it (Session ID cookie). When you go to the bar, the bartender checks the VIP list for `#44`. The club has to check the list *every single time* you want a drink."
*Pros: Easy to kick someone out (just erase name).*
*Cons: Database lookup on every request.*

**Approach 2: Stateless JWTs (The Hotel Key Card)**
"Imagine a hotel. You show your ID at the front desk (Login). They encode a key card: 'Room 304, Valid until Friday', and cryptographically sign it. They don't keep a list. When you swipe your card at the pool, the door reader just verifies the digital signature. It doesn't call the front desk."
*Pros: Fast, no database lookups, scales perfectly.*
*Cons: Hard to kick someone out before the card expires.*

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — Hashing & Passwords (20 min)

**Goal**: Students understand *why* MD5 is bad and *why* Bcrypt is good.

1. **The Plain Text Problem** (5 min)
   - Ask: "Why is it bad if I can see your password in my database?" (Credential stuffing, reuse).
   - "Hashing is one-way. A sausage machine. You can put a pig in and get a sausage, but you can't put a sausage in and get a pig."

2. **Why Bcrypt?** (5 min)
   - Explain that modern GPUs can guess billions of MD5 hashes per second.
   - Bcrypt is intentionally slow. It takes ~100ms. If a hacker steals our DB, guessing 1 billion passwords takes hundreds of years.
   - Show the Bcrypt example in student notes.

3. **Live Auth Lab: Register** (10 min)
   - Open `localhost:3000` → Auth Lab tab.
   - Have students type a password into the Register box.
   - Show the resulting Bcrypt Hash on the screen. Highlight the `$2a$10$` prefix (the salt/cost factor).

---

### Phase 2 — Sessions vs JWTs (20 min)

**Goal**: Establish the mental model before writing the code.

1. **The Analogy** (10 min)
   - Tell the VIP List vs Hotel Key Card analogy.
   - Ask: "If Netflix uses JWTs, and you change your password on your laptop, why does your TV still stay logged in for a while?" (Because the TV's key card hasn't expired yet, and JWTs are hard to revoke instantly).

2. **Anatomy of a JWT** (10 min)
   - Switch to the Concepts tab → JWT section.
   - Explain the 3 parts: Header (alg), Payload (data), Signature (the lock).
   - **Crucial point:** The payload is NOT encrypted. Anyone can read it. Never put passwords or credit cards in it. It is base64 encoded.
   - Explain the Signature: `hash(Header + Payload + Secret)`. If you tamper with the payload, the signature breaks.

---

### Phase 3 — The Code: Building the Auth Flow (30 min)

**Goal**: Connect the theory to Express.js logic.

1. **The Login Route** (10 min)
   - Walk through the `POST /api/login` code.
   - `bcrypt.compare(req.password, db.password)`
   - `jwt.sign(payload, secret, options)`

2. **Auth Lab: Login & JWT** (5 min)
   - Go back to the Auth Lab UI.
   - Login with the user just registered.
   - Watch the JWT appear. Show how the payload automatically decoded to `{ userId, username, iat, exp }`.

3. **The Middleware** (15 min)
   - This is the core skill. Walk through the `requireAuth` middleware block by block.
   - Explain the `Authorization: Bearer <token>` header standard.
   - Show how `jwt.verify()` throws an error if the token is bad, which triggers the `catch` block (403 Forbidden).
   - Emphasize how we attach `req.user = decodedPayload` so the final route knows *who* is making the request.

---

### Phase 4 — Quiz & Lab Verification (20 min)

**Goal**: Verify retention.

1. **Auth Lab: Protected Route** (5 min)
   - In the Auth Lab UI, click the "Fetch Protected Data" button.
   - It will attach the JWT.
   - Then, manually tamper with the token (delete a character in the UI box) and click fetch again to show the `403 Forbidden` response.

2. **Quiz** (15 min)
   - Have students complete the 7-question quiz.
   - Review Q2 (Payload contents): Ensure they know NOT to store passwords.
   - Review Q5 (Bcrypt comparison): Ensure they know you use `bcrypt.compare()` instead of hashing the input and doing `===`.

**Expected scores:**
- 6-7/7: Ready for the take-home project.
- < 5/7: Re-explain the difference between Base64 Encoding and Encryption.

---

## Common Errors Table

| Error | Cause | Fix |
|-------|-------|-----|
| `jwt must be provided` | Client didn't send token, or sent it wrong format | Ensure header is exactly: `Authorization: Bearer <token>` |
| `invalid signature` | The token was modified, or server used wrong secret | Don't tamper with token; check `process.env.JWT_SECRET` |
| `jwt expired` | Token lifespan ended | User must log in again |
| `data and hash arguments required` | Forgot to `await` the DB query | `bcrypt.compare` needs a string. If DB returned null, it crashes. Handle `!user` first. |
| `Cannot destructure property 'password' of 'req.body' as it is undefined` | Forgot `express.json()` middleware | Add `app.use(express.json())` before routes |

---

## Homework / Take-Home

Assign `exercises/auth_practice.md` — Securing the Movies API.
Students will implement the exact flow (register, login, middleware) on their existing CRUD API.

---

## Extension Topics (if time allows)

- **Refresh Tokens:** Short-lived access token (15 mins) + Long-lived refresh token (7 days) to solve the "can't revoke JWT" problem.
- **CSRF (Cross-Site Request Forgery):** Why storing JWTs in `localStorage` is vulnerable to XSS, and storing them in `httpOnly` cookies is vulnerable to CSRF.
