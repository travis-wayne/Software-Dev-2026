# Lesson 40 — Tutor Notes: Next.js Authentication (NextAuth.js / Auth.js)

## Overview & Teaching Goals

By the end of this 90-minute session, students will transition from manually writing complex JWT token serialization and header parsing (as learned in Lesson 31) to leveraging **NextAuth.js (Auth.js)**—the industry standard authentication framework for Next.js applications.

### Learning Objectives
1. **Understand Serverless Authentication Architecture:** Explain why authentication in a serverless Next.js environment requires automated token encryption and cookie management compared to traditional stateful Express servers.
2. **Configure Multi-Provider Authentication:** Implement both **Credentials Provider** (email/password with bcrypt hashing) and **OAuth Providers** (GitHub/Google social login) in a single unified route file (`pages/api/auth/[...nextauth].js`).
3. **Master Client-Side & Server-Side Session Guards:** Utilize `<SessionProvider>` and `useSession()` for reactive frontend UI toggles, while enforcing bulletproof security on API routes and server-rendered pages using `getServerSession()`.
4. **Customize Session Callbacks:** Manipulate NextAuth JWT and Session callbacks to securely inject user database IDs and role permissions into the React client without exposing sensitive credentials.

---

## 90-Minute Session Outline

| Time | Section | Activity | Key Concept |
|---|---|---|---|
| **00:00–10:00** | **The Hook** | "The 500-Line Auth Nightmare" | Why building auth from scratch in serverless is tedious and error-prone; introducing NextAuth.js. |
| **10:00–25:00** | **Core Theory** | Catch-All Routes & NextAuth Providers | How `pages/api/auth/[...nextauth].js` automates `/login`, `/logout`, `/callback`, and session cookies. |
| **25:00–45:00** | **Live Coding** | Configuring NextAuth with Neon DB | Setting up Credentials Provider with bcrypt, connecting GitHub OAuth, and wrapping `_app.js` with `<SessionProvider>`. |
| **45:00–70:00** | **Guided Lab** | Interactive Glassmorphism Auth Lab | Students test simulated OAuth flows, inspect JWT sanitization callbacks, and verify route guards. |
| **70:00–75:00** | **Security & Debug** | Protecting API Routes & Common Pitfalls | Using `getServerSession` in `pages/api/*`, fixing missing secrets, and debugging callback race conditions. |
| **75:00–85:00** | **Auth.js v5** | Auth.js v5 syntax preview + migration overview | Highlighting the differences and how `auth()` replaces `getServerSession()`. |
| **85:00–90:00** | **Wrap-Up** | Comprehension check & assignment brief | Q&A, summarizing when to use Credentials vs. OAuth social logins. |

---

## Opening Hook: "The 500-Line Auth Nightmare"

Start the class by asking:
> *"In Lesson 31, when we built JWT authentication from scratch in Node.js and Express, how many steps did we have to write manually just to log a user in?"*

Students will recall: *"We had to look up the user, run `bcrypt.compare()`, generate a token with `jwt.sign()`, set an `httpOnly` cookie or return the token, write a custom `verifyToken` middleware, parse the `Authorization: Bearer` header on every protected request, and handle token expiration!"*

Then ask:
> *"Now imagine you also want to let users log in with **GitHub** and **Google**. How much OAuth OAuth handshake code, callback URL parsing, and token exchange boilerplate would you have to write?"*

*"Hundreds of lines! It would take days just to get social login working!"*

**The Hook:**
> *"What if I told you that Next.js has an official, industry-standard library called **NextAuth.js** that implements bcrypt credentials verification, GitHub OAuth, Google OAuth, encrypted `httpOnly` cookies, automatic session renewal, and React hooks in **less than 50 lines of code**? Today, we unlock professional Next.js Authentication."*

---

## Key Analogies for the Classroom

### 1. The Universal Adapter Plug (NextAuth Providers)
- **Manual Auth:** Like traveling internationally with 5 different appliances, each requiring a different wire splice, voltage converter, and physical plug shape. Integrating Google OAuth uses completely different API endpoints and token formats than GitHub OAuth or email/password login.
- **NextAuth.js:** Like having a high-end **Universal Travel Adapter**. You plug Google, GitHub, or Email into one side of the adapter, and out the other side comes the exact same standardized, encrypted session object (`{ user: { name, email, image } }`). Your React components don't care how the user logged in—the session interface is always identical!

### 2. The VIP Club Wristband vs. Passport Control (`useSession` vs. `getServerSession`)
- **Client-Side (`useSession` in React):** Like checking if a guest has a glowing VIP wristband inside a nightclub. It's instant, visual, and lets the bartender quickly show the VIP menu or hide the standard menu. But a clever counterfeiter could fake a wristband visually!
- **Server-Side (`getServerSession` in API Routes):** Like **Passport Control at International Border Security**. When a user tries to perform a sensitive action (like deleting a database record in `/api/projects/123`), we don't just trust what the browser's React UI says. We inspect the encrypted, tamper-proof `httpOnly` cookie on the server before executing a single line of SQL.

---

## 5 Pedagogical Pitfalls & How to Teach Around Them

### Pitfall 1: Forgetting the `<SessionProvider>` Wrapper in `_app.js`
- **What students do:** Import `useSession()` in a navbar component and immediately try to use it, without wrapping their application root in NextAuth's provider.
- **The Symptom:** React crashes with a runtime error: `Error: [next-auth]: `useSession` must be wrapped in a <SessionProvider />`.
- **How to fix:** Enforce step 1 of every NextAuth setup: Open `pages/_app.js` (or App Router layout) and wrap the main `<Component {...pageProps} />` with `<SessionProvider session={pageProps.session}>`. Explain that this uses React Context to share auth state globally without prop drilling!

### Pitfall 2: Protecting Client UI Without Protecting Server API Routes
- **What students do:** Add `if (!session) return <p>Access Denied</p>` in `pages/dashboard.js`, assuming their application is now 100% secure.
- **The Symptom:** An attacker opens Postman or Terminal, sends `DELETE /api/projects/101`, and successfully deletes records because the API route didn't verify the session!
- **How to fix:** Teach the golden rule of web security: **Client-side UI checks are for User Experience (UX); Server-side API checks are for Security.** Always require `await getServerSession(req, res, authOptions)` inside every mutation API route!

### Pitfall 3: Omitting `NEXTAUTH_SECRET` in Production
- **What students do:** Test locally without defining `NEXTAUTH_SECRET` in `.env.local` (NextAuth v4 generates a temporary fallback secret in development). When they deploy to Vercel, auth stops working.
- **The Symptom:** Users cannot log in on production. Server logs show: `NO_SECRET: Please define a NEXTAUTH_SECRET environment variable`.
- **How to fix:** Show students how to generate a cryptographically secure 128-character hex string in their terminal:
  ```bash
  openssl rand -base64 32
  ```
  Paste this value directly into `.env.local` as `NEXTAUTH_SECRET=...` and add it to Vercel project settings immediately.

> **Production Incident: The Rotate-AUTH_SECRET Outage**
> A startup engineer decided to rotate the `AUTH_SECRET` (or `NEXTAUTH_SECRET`) environment variable on their live Vercel deployment as a security best practice, but didn't realize that all existing user session cookies are signed with the old secret. The very moment the new secret deployed, every logged-in user across the world was silently signed out because their existing JWT cookies became cryptographically invalid. Hundreds of support tickets flooded in about "getting logged out while typing."
> **Lesson:** `AUTH_SECRET` rotation = forced global logout. Always communicate this to users in advance and rotate during low-traffic maintenance windows.

### Pitfall 4: Storing Passwords in Plaintext with Credentials Provider
- **What students do:** Write a query inside `authorize(credentials)` like: `SELECT * FROM users WHERE email = ? AND password = ?`.
- **The Symptom:** If the database is ever leaked, all user passwords are exposed in plain ASCII text.
- **How to fix:** Remind students of Lesson 31! Always use `bcryptjs`:
  ```javascript
  const isValid = await bcrypt.compare(credentials.password, user.password_hash);
  if (!isValid) throw new Error("Invalid password");
  ```

### Pitfall 5: Confusion Between the `jwt` Callback and `session` Callback
- **What students do:** Want to add the user's database `id` or `role` to `useSession()`, so they add it inside the `jwt` callback but can't find it in the React frontend.
- **The Symptom:** `session.user.id` is undefined in the frontend component.
- **How to fix:** Draw the **NextAuth Data Relay** on the whiteboard:
  ```text
  [Database / Authorize]  ──(returns user)──>  [ jwt() Callback ]  ──(stores in token)──>  [ session() Callback ]  ──(sends to React)──>  [ useSession() ]
  ```
  Explain: *"The `jwt` callback runs first when a user logs in—it saves data into the encrypted cookie. The `session` callback runs every time React asks who is logged in—it copies data FROM the token TO the browser!"*

---

## 5 Comprehension Questions & Complete Answers

### Q1: Why is the configuration file for NextAuth in Pages Router named `[...nextauth].js` with three dots and square brackets?
**Answer:** It is a Next.js **Optional Catch-All Dynamic Route**. By naming it `[...nextauth].js` inside `pages/api/auth/`, Next.js automatically intercepts all requests starting with `/api/auth/*`—such as `/api/auth/signin`, `/api/auth/signout`, `/api/auth/callback/github`, and `/api/auth/session`—and routes them to the NextAuth handler function without needing dozens of separate files!

### Q2: What is the difference between `useSession()` and `getSession()` in NextAuth.js?
**Answer:** `useSession()` is a **React Hook** used strictly inside client-side functional components (`"use client"`). It listens reactively to authentication state changes and triggers UI re-renders automatically. `getSession()` (or `getServerSession()`) is an **async server-side function** used in `getServerSideProps` or backend API routes (`pages/api/*`) to inspect the user's session cookie directly on the Node.js server before sending a response.

### Q3: How does NextAuth.js securely store the user's session in the browser without using `localStorage`?
**Answer:** NextAuth.js stores the session as an encrypted JSON Web Token (JWT) inside an **`httpOnly`, `Secure`, and `SameSite` browser cookie** (named `next-auth.session-token`). Because it is `httpOnly`, malicious JavaScript running on the page (XSS attacks) cannot read or steal the token!

### Q4: Why must you implement BOTH a `jwt` callback and a `session` callback if you want to include custom user attributes (like `userId` or `role`) in your React UI?
**Answer:** By default, NextAuth only sends minimal public data (`name`, `email`, `image`) to the browser session for security and size optimization. To add custom fields from your database, the `jwt` callback must first attach the database ID/role to the server-side token when the user authenticates, and the `session` callback must then explicitly expose those properties from the token onto the client-side `session.user` object.

### Q5: How do you prevent unauthenticated users from executing a `DELETE` request in a Next.js serverless API route?
**Answer:** By calling `const session = await getServerSession(req, res, authOptions)` at the very top of the API handler function. If `!session` is true (or if `session.user` is missing), immediately return an HTTP status code of `401 Unauthorized` (`res.status(401).json({ error: 'Unauthorized' })`) and terminate execution before querying the database.

### Q6: Can two different OAuth providers (GitHub + Google) resolve to the same user account?
**Answer:** No by default — NextAuth creates separate accounts for each provider. You need to implement a custom `signIn` callback that checks if the email already exists in your database and manually links the OAuth accounts to prevent duplicate profiles.

### Q7: What happens when the JWT expires mid-session while the user is browsing?
**Answer:** NextAuth silently refreshes the session on the next request via the session callback if the `maxAge` hasn't passed (if rolling sessions are configured). The user stays logged in. Once the absolute `maxAge` has passed, the session is cleared and they're redirected to the login page on their next protected action.

---

## 5 Live Debug Scenarios for the Classroom

During your demonstration, introduce these intentional bugs and have students diagnose and fix them:

### Debug Scenario 1: The "Session is always null" Frontend Bug
- **Buggy Code (`pages/dashboard.js`):**
  ```javascript
  import { useSession } from 'next-auth/react';
  export default function Dashboard() {
    const { data: session } = useSession();
    return <h1>Welcome, {session.user.name}</h1>; // Crashes: Cannot read properties of null (reading 'user')
  }
  ```
- **Student Diagnosis:** The student just logged in successfully, but navigating to `/dashboard` instantly crashes with a TypeError! Why is `session` null when the app boots up?
- **The Fix:** Explain that authentication verification is asynchronous! When a React component first renders, NextAuth is still verifying the cookie over the network, so `session` starts as `null` or `status === 'loading'`. Always handle the loading and unauthenticated states:
  ```javascript
  const { data: session, status } = useSession();
  if (status === 'loading') return <p>Loading authentication state...</p>;
  if (!session) return <p>Please log in to view this page.</p>;
  return <h1>Welcome, {session.user.name}</h1>;
  ```

### Debug Scenario 2: The Silent Credentials Login Failure
- **Buggy Code (`pages/api/auth/[...nextauth].js`):**
  ```javascript
  authorize: async (credentials) => {
    const user = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
    if (user && user[0]) {
      return { email: user[0].email, name: user[0].name }; // Forgot ID!
    }
    return null;
  }
  ```
- **Student Diagnosis:** When typing valid email and password in the login box and clicking "Sign In", the screen flashes and returns right back to the login form with no error message!
- **The Fix:** NextAuth requires the returned user object from `authorize()` to have an unique **`id` string or number**! If `id` is missing, NextAuth silently rejects the session serialization:
  ```javascript
  return { id: String(user[0].id), email: user[0].email, name: user[0].name };
  ```

### Debug Scenario 3: The API Route Bypass
- **Buggy Code (`pages/api/projects/index.js`):**
  ```javascript
  import { getSession } from 'next-auth/react'; // WRONG IMPORT FOR BACKEND!
  export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    // Execute SQL insert...
  }
  ```
- **Student Diagnosis:** In NextAuth v4+, using client-oriented `getSession({ req })` on server API routes creates extra unnecessary HTTP network loopback hops and sometimes fails or times out in Vercel serverless environments!
- **The Fix:** Teach the high-performance server-side standard: Import `getServerSession` from `next-auth/next` along with your exported `authOptions`:
  ```javascript
  import { getServerSession } from 'next-auth/next';
  import { authOptions } from '../auth/[...nextauth]';

  export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: "Unauthorized" });
    // Safe to execute SQL...
  }
  ```

### Debug Scenario 4: The OAuth Callback Mismatch
- **Buggy Code:** A student configures their GitHub OAuth app with Callback URL `http://localhost:3000/callback`, clicks "Sign in with GitHub", and gets a scary GitHub error: `redirect_uri_mismatch`.
- **Student Diagnosis:** Why is GitHub rejecting our application callback?
- **The Fix:** Remind students of the catch-all routing rule! NextAuth automatically listens for callbacks on `/api/auth/callback/<provider-name>`. The GitHub Developer Settings URL must be set to precisely:
  ```text
  http://localhost:3000/api/auth/callback/github
  ```

### Debug Scenario 5: The Static HTML Build Crash
- **Buggy Code (`pages/profile.js`):**
  ```javascript
  export async function getStaticProps() {
    const session = await getServerSession(...); // CRASH!
    return { props: { user: session.user } };
  }
  ```
- **Student Diagnosis:** Running `npm run build` fails with an error: `Error: getStaticProps cannot access req or session cookies`.
- **The Fix:** Explain the architectural difference! `getStaticProps` runs **once at build time** on the developer's computer or Vercel server before any user visits the site. There are no user cookies at build time! To render personalized user profiles, use **`getServerSideProps`** (runs per-request on the server) or fetch the session client-side with **`useSession()`**.
