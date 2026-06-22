# Lesson 32 — Web Security Basics (CORS, XSS, CSRF)

**Session Type:** Backend, Databases & Systems
**Duration:** 90 minutes
**Prerequisites:** Lesson 31 (Authentication & Security)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **CORS** | Cross-Origin Resource Sharing. Understanding the browser's Same-Origin Policy and how to configure an API to safely accept requests from trusted frontend applications. |
| **XSS** | Cross-Site Scripting. How attackers inject malicious Javascript into databases, and how to neutralize it using Input Sanitization and Output Encoding. |
| **CSRF** | Cross-Site Request Forgery. How attackers exploit ambient credentials (cookies) to force users into executing unwanted actions, and how `SameSite` cookies prevent this. |
| **Helmet** | An Express middleware that automatically applies 14 essential HTTP security headers (e.g., preventing Clickjacking, disabling X-Powered-By). |

---

## Running the Interactive Demo

The included API provides an interactive lab to visualize XSS and CORS vulnerabilities in real-time.

```bash
cd examples/security-api

# 1. Install dependencies
pnpm install

# 2. Start the server
pnpm dev
```

Open **http://localhost:3000** in your browser. 
You will see three tabs:
1. **Concepts:** Visual breakdown of CORS, XSS, and CSRF analogies.
2. **Security Lab:** A "Hack Yourself" playground. Try to inject `<script>alert('hacked')</script>` into the vulnerable comment board to see the attack execute, then try the secure version to see the sanitizer strip it out. Features a CORS tester to see how the browser blocks unauthorized origins.
3. **Quiz:** 7 interactive questions to test understanding.

---

## File Structure

```
Lesson 32/
├── README.md
├── notes/
│   ├── tutor_notes.md          # 90-min lesson plan, live demo steps, analogies
│   └── student_notes.md        # Deep conceptual reference for students
├── examples/
│   └── security-api/
│       ├── package.json
│       ├── server.js            # Express API demonstrating vulnerable & secure routes
│       └── public/
│           └── index.html       # Interactive 3-tab Hacker UI
└── exercises/
    └── security_practice.md     # Hands-on assignment to harden the Movies API
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Understand common web security vulnerabilities (CORS issues, XSS, CSRF).
2. Identify potential attack vectors in their own Express applications.
3. Implement basic countermeasures including CORS configuration, input sanitization (`xss`), and security headers (`helmet`).
4. Understand the difference between Input Sanitization (Backend) and Output Encoding (Frontend).

---

## Resources

| Resource | Link |
|----------|------|
| MDN: CORS | https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS |
| OWASP: Cross-Site Scripting (XSS) | https://owasp.org/www-community/attacks/xss/ |
| OWASP: Cross-Site Request Forgery (CSRF) | https://owasp.org/www-community/attacks/csrf |
| npm: helmet | https://www.npmjs.com/package/helmet |
| npm: xss | https://www.npmjs.com/package/xss |
