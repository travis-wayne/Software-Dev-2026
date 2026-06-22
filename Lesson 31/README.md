# Lesson 31 — Authentication & Security (JWT, Session, Bcrypt)

**Session Type:** Backend, Databases & Systems
**Duration:** 90 minutes
**Prerequisites:** Lesson 27 (Middleware & Environment Variables)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Password Hashing** | Why plain text passwords are a massive liability, and why `bcrypt` is preferred over MD5/SHA-256 (the concept of "work factor"). |
| **Authentication** | The process of verifying *who* a user is (Login). |
| **Stateful Sessions** | The "VIP List" analogy. Storing session IDs in a database and looking them up on every request. |
| **Stateless Tokens (JWT)** | The "Hotel Key Card" analogy. Cryptographically signed tokens that the server can verify without a database lookup. |
| **Auth Middleware** | Intercepting requests to extract the `Authorization: Bearer <token>` header, verify the signature, and protect routes. |

---

## Running the Interactive Demo

The included API provides an interactive lab to visualize the Auth flow. It uses a zero-config SQLite in-memory database, so no external setup is required.

```bash
cd examples/auth-api

# 1. Install dependencies
pnpm install

# 2. Copy environment template
cp .env.example .env

# 3. Start the server
pnpm dev
```

Open **http://localhost:3000** in your browser. 
You will see three tabs:
1. **Concepts:** Visual breakdown of the analogies.
2. **Auth Lab:** A playground to Register (hash), Login (issue JWT), and access a Protected Route. Includes a JWT tampering visualizer.
3. **Quiz:** 7 interactive questions to test understanding.

---

## File Structure

```
Lesson 31/
├── README.md
├── notes/
│   ├── tutor_notes.md          # 90-min lesson plan, live demo steps, analogies
│   └── student_notes.md        # Deep conceptual reference for students
├── examples/
│   └── auth-api/
│       ├── .env.example
│       ├── package.json
│       ├── server.js            # Express API with bcrypt, jwt, and auth middleware
│       └── public/
│           └── index.html       # Interactive 3-tab UI (Auth Lab visualizer)
└── exercises/
    └── auth_practice.md         # Hands-on assignment to secure the Movies API
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Differentiate between authentication (who you are) and authorization (what you can do).
2. Explain why plain text passwords are a liability and how Bcrypt stops brute-force attacks via "work factor".
3. Contrast Session vs. Token (JWT) auth using the "VIP List vs. Hotel Key Card" analogy.
4. Read a JWT to identify the header, payload, and signature, understanding why it is base64 encoded and *not* encrypted.
5. Implement an Express middleware that verifies a JWT to protect a route.

---

## Resources

| Resource | Link |
|----------|------|
| OWASP Authentication Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html |
| JWT.io (Token Debugger & Intro) | https://jwt.io/introduction/ |
| npm: bcryptjs | https://www.npmjs.com/package/bcryptjs |
| Traversy Media: Node.js Auth (JWT) | https://www.youtube.com/watch?v=mbsmsi7l3FU |
| The Net Ninja: Node.js Auth Tutorial | https://www.youtube.com/watch?v=SnoAwZa1OWA |
| Session vs Token Based Authentication | https://www.youtube.com/watch?v=kx_b12g2g9I |
