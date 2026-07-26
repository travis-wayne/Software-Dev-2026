# Lesson 39 — Student Notes: Next.js API Routes & Database Integration

## 1. What Are Next.js API Routes?

When building traditional web applications, developers typically create two separate projects:
1. **A Frontend Application:** Built with React, Vite, or Vue, running in the user's web browser.
2. **A Backend Server:** Built with Node.js and Express, running on a dedicated server listening on a port like `3000` or `8080`.

**Next.js API Routes** eliminate this divide. By placing JavaScript files inside the `pages/api/` directory of your Next.js project, Next.js automatically transforms those files into **serverless backend API endpoints**.

### Why Is This a Superpower?
- **Zero CORS Configuration:** Because your React frontend and your API endpoints live on the exact same domain (e.g., `http://localhost:3000`), you never have to configure Cross-Origin Resource Sharing (CORS) headers.
- **Serverless Scaling:** When deployed to modern cloud platforms like Vercel, each API route becomes an isolated AWS Lambda function. If 1,000 users call `/api/projects` at once, the cloud automatically spins up 1,000 parallel instances. When traffic drops to zero, it scales down to zero cost!
- **Co-Located Codebase:** You can share TypeScript interfaces, utility functions, and validation schemas between your UI components and your database endpoints.

---

## 2. File-System Routing for APIs

Just like Next.js maps `pages/about.js` to the `/about` web page, it maps files in `pages/api/` to `/api/*` endpoints:

```text
pages/
└── api/
    ├── status.js              --> GET /api/status
    └── projects/
        ├── index.js           --> GET /api/projects  |  POST /api/projects
        └── [id].js            --> GET /api/projects/123  |  PUT /api/projects/123  |  DELETE /api/projects/123
```

> [!IMPORTANT]
> **API Routes never execute in the browser.** Even though they sit next to your React components, any code written in `pages/api/` runs strictly on Node.js server infrastructure. You can safely use database passwords, secret API keys, and filesystem tools here without exposing them to users.

---

## 3. Anatomy of an API Route Handler

Every API route file must export a default function called a **handler**. This function receives two core arguments: `req` (the HTTP request) and `res` (the HTTP response).

Here is the standard, production-grade template for handling multiple HTTP methods in a single file:

```javascript
// pages/api/projects/index.js
export default async function handler(req, res) {
  // 1. Inspect the incoming HTTP method
  switch (req.method) {
    case 'GET':
      return handleGetProjects(req, res);
    
    case 'POST':
      return handleCreateProject(req, res);
    
    default:
      // If client sends DELETE or PUT to /api/projects, reject with 405 Method Not Allowed
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function handleGetProjects(req, res) {
  try {
    // Simulate database lookup
    const projects = [
      { id: '1', title: 'E-Commerce Platform', tech: 'Next.js + Neon' },
      { id: '2', title: 'AI Task Tracker', tech: 'React + Zustand' }
    ];
    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
}

async function handleCreateProject(req, res) {
  try {
    const { title, tech } = req.body;
    if (!title || !tech) {
      return res.status(400).json({ success: false, error: 'Title and tech are required fields' });
    }
    
    const newProject = { id: Date.now().toString(), title, tech };
    return res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create project' });
  }
}
```

---

## 4. Database Integration: Neon PostgreSQL & SQLite Fallback

To make our application truly full-stack, we need persistent data storage. In professional development, we often use a powerful serverless cloud database like **Neon PostgreSQL** in production, while keeping an **in-memory SQLite database** as a fallback so our app works seamlessly offline or when cloud credentials aren't configured.

### The Dual-Mode Database Adapter Pattern

Let's create a database helper file that automatically detects whether a cloud PostgreSQL string is provided in `.env.local`:

```javascript
// lib/db.js
import { Pool } from 'pg';
import Database from 'better-sqlite3';

let dbAdapter = { type: 'none' };

// Check if Neon PostgreSQL connection string exists
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  // 1. NEON POSTGRESQL CLOUD ADAPTER
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for cloud serverless SSL
  });

  dbAdapter = {
    type: 'Neon PostgreSQL',
    query: async (text, params = []) => {
      const client = await pool.connect();
      try {
        // Convert SQLite ? placeholders to Postgres $1, $2, $3 placeholders automatically
        let pgText = text;
        let index = 1;
        while (pgText.includes('?')) {
          pgText = pgText.replace('?', `$${index++}`);
        }
        const result = await client.query(pgText, params);
        return result.rows;
      } finally {
        client.release();
      }
    }
  };
  console.log('✅ Connected to Neon PostgreSQL Cloud Database');

} else {
  // 2. SQLITE LOCAL FALLBACK ADAPTER (Offline Dev Mode)
  const sqliteDb = new Database(':memory:');
  
  // Initialize sample tables for local development
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      tech_stack TEXT,
      github_url TEXT,
      live_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed sample data
  const insertStmt = sqliteDb.prepare(`
    INSERT INTO projects (id, title, description, tech_stack, github_url, live_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertStmt.run('proj_1', 'E-Commerce Capstone', 'Full-stack store with cart & checkout', 'React, Next.js, Tailwind, Neon DB', 'https://github.com', 'https://demo.com');
  insertStmt.run('proj_2', 'State Lab Simulator', 'Interactive visualizer for Redux & Zustand', 'Vanilla JS, Glassmorphism CSS', 'https://github.com', 'https://demo.com');

  dbAdapter = {
    type: 'SQLite In-Memory Fallback',
    query: async (text, params = []) => {
      const stmt = sqliteDb.prepare(text);
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(params);
      } else {
        const info = stmt.run(params);
        return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
      }
    }
  };
  console.log('⚡ Using Local SQLite In-Memory Database Fallback');
}

export default dbAdapter;
```

---

## 5. Building Full CRUD Endpoints

Now we can combine our file-system routing, our `req.method` switch handler, and our database adapter to build complete CRUD (Create, Read, Update, Delete) endpoints!

### Dynamic Routes (`pages/api/projects/[id].js`)

To handle operations on a specific item, we use bracket notation in our filename. Inside the handler, we extract the ID from `req.query`:

```javascript
// pages/api/projects/[id].js
import db from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const rows = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Project not found' });
        }
        return res.status(200).json({ success: true, data: rows[0] });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Database query failed' });
      }

    case 'PUT':
      try {
        const { title, description, tech_stack, github_url, live_url } = req.body;
        await db.query(
          `UPDATE projects SET title = ?, description = ?, tech_stack = ?, github_url = ?, live_url = ? WHERE id = ?`,
          [title, description, tech_stack, github_url, live_url, id]
        );
        return res.status(200).json({ success: true, message: 'Project updated successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Update failed' });
      }

    case 'DELETE':
      try {
        await db.query('DELETE FROM projects WHERE id = ?', [id]);
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Deletion failed' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
```

---

## 6. Securing API Routes with API Keys

Because API routes are publicly exposed over the internet, anyone could send a `DELETE /api/projects/123` request and wipe out your portfolio! To prevent unauthorized modifications, we must secure mutation endpoints (`POST`, `PUT`, `DELETE`).

A simple and effective technique for personal portfolios or admin dashboards is **API Key Authentication**:

```javascript
// Helper function to check API key in request headers
function isAuthenticated(req) {
  const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
  const secretKey = process.env.API_SECRET_KEY || 'default_secret_key_2026';
  return apiKey === secretKey;
}

export default async function handler(req, res) {
  // Allow anyone to GET projects (public read)
  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  // Require valid API Key for POST, PUT, DELETE (protected write)
  if (!isAuthenticated(req)) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Please provide a valid X-API-Key header.' 
    });
  }

  if (req.method === 'POST') return handlePost(req, res);
  if (req.method === 'DELETE') return handleDelete(req, res);
}
```

---

## 7. Next.js API Routes vs. Dedicated Express Server

When should you build your backend inside Next.js vs. spinning up a separate Express server?

| Feature | Next.js API Routes (`pages/api`) | Dedicated Express Server (`node server.js`) |
|---|---|---|
| **Deployment & Hosting** | Serverless Lambdas (Vercel/AWS). Scales instantly, zero cost when idle. | Long-running container/VM (Render/Heroku/EC2). Always on, fixed cost. |
| **CORS Setup** | **Not Needed!** Frontend and API share the same origin. | **Required.** Must configure `cors()` middleware for frontend domain. |
| **Cold Start Latency** | Slight delay (300ms–1s) on the very first request after period of inactivity. | **Zero latency.** Server is permanently running in memory. |
| **WebSockets / Realtime** | **Not Supported natively** (serverless execution halts after response). | **Fully Supported** (Socket.io, persistent TCP connections). |
| **Best Used For** | CRUD apps, portfolios, dashboards, webhook receivers, form submissions. | Real-time chat apps, multiplayer games, heavy background video processing. |

---

## 8. Common Mistakes & Quick Fixes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **Forgetting `return` before `res.status().json()`** | Code execution continues after sending response, causing double header errors. | Always write `return res.status(...).json(...)`. |
| **Using `localStorage` inside an API route** | API routes run on Node.js servers, which don't have browser APIs. | Read tokens from `req.headers` or `req.cookies` instead. |
| **Exposing DB secrets with `NEXT_PUBLIC_`** | Adding `NEXT_PUBLIC_DATABASE_URL` in `.env.local` exposes the string to browser JS bundles. | Name secret server environment variables without the prefix: `DATABASE_URL`. |
| **Sending JSON POST without Content-Type header** | Calling `fetch('/api/projects', { method: 'POST', body: JSON.stringify(data) })` without headers leaves `req.body` undefined. | Always include `headers: { 'Content-Type': 'application/json' }` in `fetch`. |
| **Hardcoding `localhost:3000` in API calls** | Writing `fetch('http://localhost:3000/api/projects')` breaks when deployed to Vercel. | Use relative paths: `fetch('/api/projects')` from your React frontend! |
