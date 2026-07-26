# Lesson 40 — Advanced Frontend: Next.js Authentication (NextAuth.js / Auth.js)

**Session Type:** Advanced Frontend  
**Duration:** 90 minutes  
**Prerequisites:** Next.js API Routes & Database Integration (Lesson 39), JWT & Bcrypt Authentication Basics (Lesson 31), Next.js Routing Basics (Lesson 38)  

---

## What This Lesson Covers

| Topic | Description |
|---|---|
| **NextAuth.js Architecture** | Why authentication in serverless Next.js differs from monolithic Express servers, and how NextAuth.js (Auth.js) abstracts OAuth and credentials workflows. |
| **Credentials Provider** | Setting up custom email/username and password login flows backed by our dual-mode **Neon PostgreSQL** / **SQLite** user table with `bcryptjs` password hashing. |
| **OAuth Providers (GitHub/Google)** | Integrating social logins cleanly using developer console Client IDs and Secrets, eliminating the need for password storage. |
| **Client-Side Session Access (`useSession`)** | Using the `<SessionProvider>` wrapper and `useSession()` hook in React components to build dynamic UI states (Logged in vs. Logged out, Profile badges). |
| **Server-Side Protection (`getServerSession`)** | Securing Pages Router (`getServerSideProps`) and serverless API routes (`pages/api/*`) by validating session tokens before querying databases. |
| **NextAuth Callbacks & JWT Customization** | Customizing the `jwt` and `session` callbacks to securely inject user IDs and roles into the frontend session object. |

---

## Running the Full-Stack Auth Demo

The example project in `examples/nextauth-fullstack-demo` is a complete authentication-enabled **Protected Portfolio Dashboard** built in Next.js 14 with NextAuth.js v4.

```bash
cd examples/nextauth-fullstack-demo
npm install
npm run dev
```

Open **http://localhost:3000** in your browser. The app demonstrates:
- **`pages/login.js`:** A sleek dark-mode glassmorphism login interface supporting both **Email/Password Credentials** (with a live registration modal) and **GitHub OAuth Simulator**.
- **`pages/dashboard.js`:** A protected dashboard route that redirects unauthenticated users back to `/login` automatically using server-side session checks.
- **`pages/api/auth/[...nextauth].js`:** The catch-all NextAuth.js backend handler configuring credentials verification and JWT token serialization.
- **`pages/api/projects/*`:** Protected CRUD API routes that require an authenticated NextAuth session to create, edit, or delete portfolio items.
- **`pages/api/status.js`:** Real-time database diagnostic reporting Neon PostgreSQL cloud connection or SQLite local memory fallback.

---

## Exploring the Interactive Lab

We also provide a zero-dependency standalone visualizer in `examples/nextauth-lab/index.html`. Open this file directly in any browser to explore:

1. **NextAuth Flow Simulator:** Watch how credentials and OAuth authentication requests travel from the browser to NextAuth handlers, verify against Neon PostgreSQL, generate encrypted JWT cookies, and return session payloads.
2. **JWT & Session Inspector:** Experiment with NextAuth callbacks (`jwt()` and `session()`) to see how server-side tokens are sanitized before being exposed to client-side React components.
3. **Protected Route Tester:** Test simulating client-side (`useSession`), server-side (`getServerSession`), and middleware route guards against authenticated vs. anonymous requests.
4. **Interactive Quiz:** 7 multiple choice questions testing NextAuth concepts, providers, session hooks, and security best practices.

---

## File Structure

```text
Lesson 40/
├── README.md
├── notes/
│   ├── tutor_notes.md                         # 90-min teaching guide, analogies, debug scenarios, comprehension Qs
│   └── student_notes.md                       # Comprehensive guide to NextAuth.js, OAuth, credentials, and session guards
├── exercises/
│   └── nextauth_practice.md                   # Scaffolded practice exercises with complete code solutions
└── examples/
    ├── nextauth-fullstack-demo/               # Working Next.js 14 app with NextAuth.js, protected CRUD, dual-mode DB
    └── nextauth-lab/
        └── index.html                         # Interactive 4-tab sleek glassmorphism learning lab
```
