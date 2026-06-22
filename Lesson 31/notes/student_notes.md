# Lesson 31 — Authentication & Security (JWT, Session, Bcrypt)
# Student Reference Notes

> **Launch the lab before reading:**
> ```bash
> cd examples/auth-api
> pnpm install   # first time only
> pnpm dev
> ```
> Open **http://localhost:3000** — start on the **Concepts** tab.

---

## What This Lesson Is About

Until now, our APIs have been completely open. Anyone could delete any user, create any post, or view any data. In the real world, an application needs to know **who** is making the request and **what** they are allowed to do.

This lesson covers three fundamental pillars of web security:
1. **Password Hashing** — How to store passwords so even you (the developer) cannot read them.
2. **Authentication** — How to verify who a user is (Login).
3. **Stateless Authorization** — How to remember the user across multiple requests without forcing them to login every time.

---

## 1. Password Security: Never Store Plain Text

### The Problem
If you store passwords in plain text (`password: 'ilovecats123'`), and a hacker breaches your database, they get everyone's password. Because people reuse passwords, the hacker can now log into your users' email, bank, and social media accounts. You are liable.

### The Solution: Hashing
A **hash function** is a one-way mathematical algorithm. You put data in, and a scrambled string comes out. 
- **Encryption is two-way:** You can encrypt and decrypt.
- **Hashing is one-way:** You can hash, but you **cannot un-hash**.

```javascript
// Plain text
"ilovecats123"

// Bcrypt Hash
"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

If a hacker steals the hash, it's mathematically impossible for them to reverse it back into "ilovecats123".

### Why Bcrypt?
Older hash functions like MD5 or SHA-256 are *too fast*. A modern graphics card can guess 100 billion MD5 hashes per second. This makes "brute-force" attacks easy.

**Bcrypt** is intentionally slow. It has a "work factor" (salt rounds). If you set the work factor to 10, it takes about 100 milliseconds to hash one password. That means guessing 100 billion passwords would take hundreds of years.

```javascript
import bcrypt from 'bcryptjs';

// 1. Registering a user
const saltRounds = 10;
const hashedPassword = await bcrypt.hash('ilovecats123', saltRounds);
// Save `hashedPassword` to the database

// 2. Logging a user in
// bcrypt.compare() hashes the login attempt and checks if it matches the stored hash
const isMatch = await bcrypt.compare('ilovecats123', storedHashedPassword);

if (isMatch) {
  // Login successful!
} else {
  // Wrong password
}
```

> **Why bcryptjs instead of bcrypt?** `bcrypt` requires C++ compilation on your machine. `bcryptjs` is written entirely in JavaScript. It's slightly slower, but guarantees it will install on any operating system without errors.

---

## 2. Authentication: Session vs. JWT

HTTP is a **stateless** protocol. The server forgets who you are the second it finishes sending a response. If you login on request #1, the server has no idea who you are on request #2.

We need a way for the client to say "Hey, it's still me!" on every request. There are two main ways to do this.

### Approach A: Session-Based Auth (The VIP Guest List)

Imagine a nightclub.
1. **Login:** You show your ID at the door.
2. **The Session:** The bouncer writes your name on the VIP Guest List and gives you a blank wristband with a number: `#442`.
3. **Subsequent Requests:** Every time you go to the bar, you show wristband `#442`. The bartender looks up `#442` on the VIP list, sees your name, and serves you.

**In code:** The server stores a session object in its memory/database. The client stores a tiny cookie containing just the Session ID. 

**Pros:** The server has total control. If you get kicked out, the bouncer just crosses your name off the list.
**Cons:** The server has to check the list (database) on *every single request*. If you have a million users, the list gets huge and slow.

### Approach B: JSON Web Tokens (The Hotel Key Card)

Imagine a hotel.
1. **Login:** You show your ID at the front desk.
2. **The JWT:** The receptionist encodes a key card: *"Room 304, Valid until Friday"*. They digitally sign the card. The hotel does **not** keep a list of who is in what room.
3. **Subsequent Requests:** You swipe your card at your door. The door reader verifies the digital signature. It doesn't need to ask the front desk. It just trusts the signature on the card.

**In code:** The server creates a **JWT (JSON Web Token)** containing the user's ID, signs it with a secret key, and gives it to the client. The client sends this token in the headers of every request. The server verifies the signature mathematically without touching the database.

**Pros:** Completely stateless. Fast. Highly scalable.
**Cons:** You cannot easily "revoke" a token before it expires. If someone steals the key card, they have access until it expires.

---

## 3. Anatomy of a JWT

A JWT is a long string separated by two periods: `Header.Payload.Signature`

1. **Header:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   - Says: "I am a JWT, and I am signed using the HS256 algorithm."
2. **Payload:** `eyJ1c2VySWQiOjQyLCJpYXQiOjE2ODg1NjgxNjR9`
   - The actual data (e.g., `{ "userId": 42 }`). **This is base64 encoded, NOT encrypted.** Anyone can decode and read this. **Never put passwords or secrets in the payload.**
3. **Signature:** `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
   - A cryptographic hash of the Header + Payload + Your Server's Secret Key. 

If a hacker decodes the payload, changes `"userId": 42` to `"userId": 1` (the admin), and sends it back to you, **the signature will no longer match**. Your server will reject it. The signature guarantees the token hasn't been tampered with.

---

## 4. Implementing JWT Auth in Express

### Step 1: The Login Route (Issuing the Token)
When the user provides the correct password, we generate a token.

```javascript
import jwt from 'jsonwebtoken';

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.findUser(username);

  // 1. Verify user exists and password matches
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2. Generate the JWT
  // Arg 1: Payload (what to store inside the token)
  // Arg 2: Secret Key (from .env)
  // Arg 3: Options (expiration time)
  const token = jwt.sign(
    { userId: user.id, username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } 
  );

  // 3. Send the token to the client
  res.json({ success: true, token });
});
```

### Step 2: The Middleware (Protecting Routes)
We create a middleware that intercepts requests, checks for the token, and verifies it.

```javascript
const requireAuth = (req, res, next) => {
  // Tokens are usually sent in the Authorization header like: "Bearer eyJhbG..."
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer "

  try {
    // Verify the token using our secret
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data to the request object
    req.user = decodedPayload;
    
    // Move to the next function (the route handler)
    next();
  } catch (err) {
    // If token is invalid or expired, jwt.verify throws an error
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};
```

### Step 3: Applying the Middleware
Now we can easily protect any route by dropping `requireAuth` into the chain.

```javascript
// This route is open to everyone
app.get('/api/public-movies', (req, res) => { ... });

// This route requires a valid JWT
app.post('/api/movies', requireAuth, (req, res) => {
  // Because requireAuth ran first, we have access to req.user!
  console.log(`User ${req.user.username} is adding a movie.`);
  
  // Create movie logic...
});
```

---

## 6. Sessions vs JWT — The Full Comparison Table

| Feature | Session-Based | JWT (Token-Based) |
|---------|--------------|-------------------|
| Where token is stored | Server memory/DB | Client (localStorage/cookie) |
| Scalability | Hard (need shared session store) | Easy (stateless) |
| Revocation | Easy (delete from DB) | Hard (wait for expiry) |
| Server storage needed | Yes | No |
| Best for | Traditional web apps with cookies | APIs, mobile apps, microservices |
| Protection against XSS | Better (httpOnly cookies) | Vulnerable if in localStorage |

---

## 7. Refresh Tokens — Staying Logged In Securely

If access tokens live forever, a hacker who steals one has permanent access. Therefore, access tokens should be **short-lived** (e.g., 15 minutes). But users don't want to log in every 15 minutes. 

**The Solution:** Pair a short-lived access token with a long-lived **refresh token** (e.g., 7-30 days).

1. **Login:** Server sends *two* tokens. The access token (short life) and a refresh token (long life).
2. **Access Token:** Lives in memory (or localStorage if risky) and is sent on every API request.
3. **Refresh Token:** Lives securely in an `httpOnly` cookie.
4. **When Access Token Expires:** The API returns `401 Unauthorized`. The frontend silently calls a `/api/refresh` endpoint. The browser automatically includes the `httpOnly` refresh token. The server verifies it and issues a fresh access token.

```text
Client                  Server
  |--- Login ------------>|
  |<-- Access + Refresh --|
  |                       |
  |--- API + Access ----->|
  |<-- 401 Expired -------|
  |                       |
  |--- /refresh + Ref --->|
  |<-- New Access Token --|
```

---

## 8. httpOnly Cookies vs localStorage

If you store a JWT in `localStorage`, **any JavaScript on your page can read it**. If your site has an XSS (Cross-Site Scripting) vulnerability, a hacker can inject malicious JS that steals your users' tokens.

**`httpOnly` cookies** are a safer alternative for web apps. An `httpOnly` cookie is sent by the server and stored by the browser. Crucially, **JavaScript cannot read an `httpOnly` cookie**.

```javascript
// Express example of setting an httpOnly cookie
res.cookie('token', jwt, { 
  httpOnly: true,  // JS cannot read this cookie
  secure: true,    // HTTPS only
  sameSite: 'Strict', // CSRF protection
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

**Trade-offs:**
- `localStorage` is simpler for APIs consumed by multiple clients (mobile, web, desktop) but vulnerable to XSS.
- `httpOnly` cookies protect from XSS but require CSRF protection.

---

## 9. Common Mistakes to Avoid

| Mistake | What Happens | Fix |
|---------|--------------|-----|
| Putting secrets in JWT payload | Anyone can read your database password | Only put non-sensitive identifiers (e.g., `userId`) in the payload |
| Forgetting `await` on `bcrypt.hash` | You accidentally save a Promise object to the database instead of a hash | Always use `await bcrypt.hash()` |
| Hardcoding JWT secret | If code goes to GitHub, hackers can forge tokens | Use `process.env.JWT_SECRET` |
| Comparing plain text passwords directly | Logins always fail because the database has a hash | Always use `await bcrypt.compare(plainText, hash)` |
| Storing sensitive data in JWT payload | Base64 decoded by anyone — data is public | Only store non-sensitive IDs (`userId`) |
| Using localStorage for JWT in XSS-vulnerable apps | XSS attack steals all tokens | Use httpOnly cookies for production web apps |
| Short JWT_SECRET like "secret" | Bruteforce attacks can guess the key and forge tokens | Use a strong random 64-character string |

---

## 10. Next Steps

Work through [`exercises/auth_practice.md`](../exercises/auth_practice.md) — you'll secure a Movies API from scratch by building Registration, Login, and Authorization middleware.
