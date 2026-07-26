# Lesson 39 — Tutor Notes: Next.js API Routes & Database Integration

## Overview & Teaching Goals

By the end of this 90-minute session, students will transition from thinking of frontend and backend as two completely separate applications residing on different servers (e.g., React on port 5173 + Express on port 3000) to understanding the **unified serverless architecture** of Next.js.

### Learning Objectives
1. **Understand Serverless API Co-Location:** Explain how Next.js transforms frontend applications into full-stack platforms using the `pages/api/` directory.
2. **Master HTTP Routing within Serverless Functions:** Implement multi-method endpoints (`GET`, `POST`, `PUT`, `DELETE`) within single route files using clean conditional logic (`req.method`).
3. **Integrate Real-World Databases:** Connect Next.js API routes natively to serverless cloud databases (**Neon PostgreSQL**) while using local fallback adapters for offline reliability.
4. **Enforce API Security & Validation:** Protect data-modifying endpoints with custom API key authentication and proper HTTP status code error handling.

---

## 90-Minute Session Outline

| Time | Section | Activity | Key Concept |
|---|---|---|---|
| **00:00–010:00** | **The Hook** | "The Two-Server Problem" & CORS headaches | Why managing two deployments is hard; how serverless functions solve it. |
| **10:00–25:00** | **Core Theory** | File-System Routing in `pages/api/` | How `pages/api/projects/[id].js` maps to `/api/projects/123`. |
| **25:00–45:00** | **Live Coding** | Building a CRUD API with Neon PostgreSQL | Connecting `pg` Pool, writing parameterized queries, handling CORS & status codes. |
| **45:00–70:00** | **Guided Lab** | Interactive Glassmorphism API Lab | Students test endpoints, simulate serverless routing, and inspect SQL traces. |
| **70:00–75:00** | **Security & Debug** | API Key protection & common pitfalls | Protecting `POST`/`DELETE`, debugging hanging requests, handling `.env.local`. |
| **75:00–85:00** | **App Router** | App Router API Routes live code demo | Showing the shift from pages/api to app/api/route.js. |
| **85:00–90:00** | **Wrap-Up** | Comprehension check & assignment brief | Q&A, summarizing when to use Next.js APIs vs dedicated backend servers. |

---

## Opening Hook: "The Two-Server Problem"

Start the class by asking:
> *"In Lesson 36 (E-commerce Capstone), how many terminal windows did you have to open just to develop your app locally?"*

Students will answer: *"Two! One for `npm run dev` in the React frontend, and one for `node src/server.js` in the Express backend."*

Then ask:
> *"And when you deployed it in Lesson 34, how many separate services did you have to configure, monitor, and pay for?"*

*"Two! Vercel for the frontend, and Render or Heroku for the backend. Plus all those annoying CORS errors when the domains didn't match perfectly!"*

**The Hook:**
> *"What if I told you that Next.js allows you to build your entire frontend **AND** your backend database API inside a single codebase, run it with a single `npm run dev` command, deploy it to Vercel in one click, and never write a single line of CORS configuration again? Today, we unlock Next.js API Routes."*

---

## Key Analogies for the Classroom

### 1. The Direct Elevator in a Skyscraper
- **Traditional Architecture (React + Express):** Like a company occupying two separate buildings on opposite sides of town. To get a file from the archive (database), an employee (frontend) has to walk out on the street, cross traffic, show ID at the security desk of the other building (CORS), and wait for the file to be brought down.
- **Next.js API Routes:** Like having your archive in the basement of the **exact same skyscraper**. The employee just steps into the private internal elevator, hits `-1`, grabs the data, and returns. No going outside, no traffic, no CORS security checks needed!

### 2. The Vending Machine vs. The Full Restaurant Kitchen
- **Next.js API Routes (Serverless):** A high-tech vending machine. When someone presses button `A1`, the machine spins up instantly, drops the snack (executes the query), and shuts down immediately. It costs almost nothing when idle and scales automatically if 100 people use 100 different machines simultaneously.
- **Dedicated Express Server:** A 24/7 staffed restaurant kitchen. The chefs are there, lights on, stoves burning whether 100 customers are eating or 0 customers are eating. It's powerful for complex long-running banquets (WebSockets, heavy background video processing), but expensive and complex to maintain just for simple CRUD tasks.

---

## Decision Tree: When to Use Next.js API Routes vs. Dedicated Backend

Use this diagram on the whiteboard to help students understand architectural trade-offs:

```
               [ Do you need a backend API? ]
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
       [ Yes, standard CRUD ]         [ Heavy Background Jobs, ]
     [ Database queries, Auth ]     [ WebSockets, Microservices ]
              │                               │
              ▼                               ▼
  ┌───────────────────────────────┐   ┌───────────────────────────────┐
  │     Next.js API Routes        │   │  Dedicated Backend (Express/  │
  │   (Co-located, Serverless,    │   │      NestJS / Fastify)        │
  │    Zero CORS, Fast Deploy)    │   │  (Long-running, Persistent    │
  │                               │   │   Connections, Heavy Compute) │
  └───────────────────────────────┘   └───────────────────────────────┘
```

---

## 5 Pedagogical Pitfalls & How to Teach Around Them

### Pitfall 1: Omitting the `req.method` Check
- **What students do:** Write code directly inside `export default async function handler(req, res) { ... }` assuming every request is a `GET`.
- **The Symptom:** Sending a `POST` or `DELETE` request runs the exact same code as `GET`, or crashes mysteriously.
- **How to fix:** Teach the **Switch-Case Pattern** as mandatory boilerplate from Minute 1:
  ```javascript
  export default async function handler(req, res) {
    switch (req.method) {
      case 'GET': return handleGet(req, res);
      case 'POST': return handlePost(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  }
  ```

### Pitfall 2: Hanging Requests (Forgetting `res.status().json()`)
- **What students do:** Perform a database operation like `await pool.query(...)` but forget to call `res.json(...)` or `res.end()` at the end of an execution path.
- **The Symptom:** The browser or Postman spinner spins indefinitely for 30 seconds until a timeout error occurs: `504 Gateway Timeout` or `API resolved without sending a response`.
- **How to fix:** Remind students that serverless functions are like telephone calls—if you don't say *"Goodbye"* (`res.json()`), the line stays open until the phone operator forcibly hangs up on you!

### Pitfall 3: Exposing Secret Database Credentials (`NEXT_PUBLIC_` Abuse)
- **What students do:** Name their database connection string `NEXT_PUBLIC_DATABASE_URL` in `.env.local` because they got used to prefixing variables in React.
- **The Symptom:** Next.js bundles the database password directly into the browser's JavaScript bundle! Anyone viewing Page Source can steal the database credentials.
- **How to fix:** Enforce the golden rule: **`NEXT_PUBLIC_` is for browser public data ONLY (like UI themes or Stripe public keys). NEVER use `NEXT_PUBLIC_` for database URLs, JWT secrets, or private API keys.**

> **Production Incident: The Day We Exposed Our Database URL**
> Share this story with students: "A junior developer on a project once prefixed their private database URL with `NEXT_PUBLIC_` to 'make sure it worked'. Next.js faithfully compiled the entire connection string, including the master password, right into the client-side JavaScript. Anyone who opened DevTools and searched for 'postgres' could read it. Why? Because `NEXT_PUBLIC_` variables are literally hardcoded into the compiled browser bundle at build time. Only environment variables *without* the prefix are kept securely on the Node.js server."

### Pitfall 4: Creating a New Database Connection Pool on Every Request
- **What students do:** Write `const pool = new Pool({ connectionString: ... })` inside the route handler function itself.
- **The Symptom:** In development, after refreshing the page 10 times, the database crashes with `Error: too many clients already` (Neon/PostgreSQL connection limit exceeded).
- **How to fix:** Teach the global caching pattern for serverless database connections:
  ```javascript
  // lib/db.js — Re-use connection pool across serverless cold starts
  import { Pool } from 'pg';
  let pool;
  if (!global._pgPool) {
    global._pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  pool = global._pgPool;
  export default pool;
  ```

### Pitfall 5: Forgetting that API Routes DO NOT Execute in the Browser
- **What students do:** Try to use `localStorage.getItem('token')` or `window.location.href` inside `pages/api/user.js`.
- **The Symptom:** `ReferenceError: localStorage is not defined` or `ReferenceError: window is not defined`.
- **How to fix:** Remind students: *"Everything inside `pages/api/` runs on Node.js in the cloud! It has no browser, no DOM, no window, and no localStorage. Read headers from `req.headers` and cookies from `req.cookies`."*

---

## 5 Comprehension Questions & Complete Answers

### Q1: What is the primary architectural difference between an Express server and Next.js API Routes?
**Answer:** An Express server is a long-running, persistent Node.js process that listens continuously on a port (e.g., 3000). Next.js API Routes are **serverless functions**—they are executed on-demand per request and spin down when idle. They are co-located in the same project as the frontend, sharing deployment and domain configuration.

### Q2: How do you define a dynamic route parameter (like a Project ID) in Next.js API Routes?
**Answer:** By using square brackets in the filename within the `pages/api/` directory. For example, naming a file `pages/api/projects/[id].js`. Inside the handler function, the value is accessed via `req.query.id`.

### Q3: Why don't you encounter CORS (Cross-Origin Resource Sharing) errors when fetching data from `/api/projects` in a Next.js component?
**Answer:** Because both the React frontend page and the Next.js API route are served from the **exact same domain and port** (e.g., `http://localhost:3000/api/projects` or `https://my-app.vercel.app/api/projects`). Since the protocol, domain, and port match, the browser's Same-Origin Policy is satisfied without needing CORS headers.

### Q4: What HTTP status code should you return when a client attempts to use a `PATCH` request on an endpoint that only supports `GET` and `POST`?
**Answer:** `405 Method Not Allowed`. You should also set an HTTP response header `Allow: GET, POST` to inform the client which methods are supported on that resource.

### Q5: How do you protect a Next.js API Route from unauthorized users modifying the database?
**Answer:** By checking for an authentication token or API key in the incoming request headers (e.g., `req.headers['x-api-key']` or `req.headers.authorization`). If the key is missing or invalid, immediately return `res.status(401).json({ error: 'Unauthorized' })` and terminate execution before any database queries run.

---

## 5 Live Debug Scenarios for the Classroom

During the live demonstration, intentionally introduce these bugs and have the class diagnose and fix them:

### Debug Scenario 1: The "Everything is undefined" Body Bug
- **Buggy Code:**
  ```javascript
  export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { title, description } = req.body;
      console.log("Creating project:", title); // Prints: Creating project: undefined
      // DB insert fails with NOT NULL constraint violation!
    }
  }
  ```
- **Student Diagnosis:** Why is `req.body.title` undefined when we sent a JSON payload in Postman?
- **The Fix:** Explain that if sending requests via `fetch()` from the frontend, students must include `headers: { 'Content-Type': 'application/json' }` and `body: JSON.stringify({ title, description })`. Unlike Express where you need `app.use(express.json())`, Next.js parses JSON automatically **only if** the `Content-Type` header is set correctly!

### Debug Scenario 2: The Silent 500 Crash on Database Error
- **Buggy Code:**
  ```javascript
  export default async function handler(req, res) {
    const result = await pool.query('SELECT * FROM non_existent_table');
    res.status(200).json(result.rows);
  }
  ```
- **Student Diagnosis:** The API route crashes with a nasty unhandled rejection in the server terminal, and the client receives an ugly HTML error page instead of JSON.
- **The Fix:** Always wrap database calls in a `try / catch` block:
  ```javascript
  try {
    const result = await pool.query('SELECT * FROM projects');
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
  ```

### Debug Scenario 3: The Dynamic Route Collision
- **Buggy Code:** A student creates both `pages/api/projects/[id].js` AND `pages/api/projects/featured.js`, then requests `/api/projects/featured`.
- **Student Diagnosis:** Sometimes the request hits `[id].js` with `req.query.id = "featured"`, causing a database error when trying to cast `"featured"` to an integer ID or UUID!
- **The Fix:** Explain Next.js routing specificity: static routes (`featured.js`) take precedence over dynamic routes (`[id].js`). However, inside `[id].js`, always validate that `id` is the expected format (e.g., numeric or valid UUID) before querying:
  ```javascript
  const { id } = req.query;
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID format' });
  }
  ```

### Debug Scenario 4: The Multiple Response Error
- **Buggy Code:**
  ```javascript
  export default async function handler(req, res) {
    if (!req.headers['x-api-key']) {
      res.status(401).json({ error: 'Missing API key' }); // Forgot 'return'!
    }
    const projects = await pool.query('SELECT * FROM projects');
    res.status(200).json(projects.rows);
  }
  ```
- **Student Diagnosis:** The server logs an error: `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client`.
- **The Fix:** Emphasize that calling `res.status().json()` sends the HTTP response but **does not stop JavaScript function execution**. Always use `return res.status(...).json(...)` to exit the function immediately!

### Debug Scenario 5: The Local vs. Cloud Environment Clash
- **Buggy Code:**
  ```javascript
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Neon cloud, breaks local SQLite/Docker Postgres!
  });
  ```
- **Student Diagnosis:** Works in production on Vercel + Neon, but crashes on the student's local machine with SSL handshake errors.
- **The Fix:** Use conditional SSL configuration based on the connection string or environment:
  ```javascript
  const isProdOrNeon = process.env.DATABASE_URL?.includes('neon.tech') || process.env.NODE_ENV === 'production';
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProdOrNeon ? { rejectUnauthorized: false } : undefined
  });
  ```

### Debug Scenario 6: Cold-Start Connection Pool Exhaustion
- **Buggy Code:** Students have 10-20 API routes, all creating new Postgres pools, and quickly refresh the page during development.
- **Student Diagnosis:** Under load, or during cold starts, Neon reports "too many connections" (503 error) and crashes the app.
- **The Fix:** Serverless functions can spawn hundreds of instances rapidly. Standard connection strings quickly max out Neon's connection limits. Show them how to use a connection pooler URL (e.g., pgBouncer on Neon, typically by adding `-pooler` to the connection string) and limiting the pool max size to 5-10 for serverless environments.

### Debug Scenario 7: Missing `export default` on API Route File
- **Buggy Code:**
  ```javascript
  export async function handler(req, res) {
    res.status(200).json({ success: true });
  }
  ```
- **Student Diagnosis:** Every request to this endpoint returns a 404 Not Found, even though the file is exactly where it should be.
- **The Fix:** In the Pages Router, Next.js explicitly requires `export default` for API handlers. It's incredibly easy to omit the `default` keyword. Without it, Next.js ignores the file entirely, causing the 404.
