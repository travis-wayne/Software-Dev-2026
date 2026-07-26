# Lesson 39 — Advanced Frontend: Next.js API Routes & Database Integration

**Session Type:** Advanced Frontend  
**Duration:** 90 minutes  
**Prerequisites:** Next.js Routing Basics (Lesson 38), REST API Basics & Authentication (Lessons 31–33), Database Design (Lesson 30)  

---

## What This Lesson Covers

| Topic | Description |
|---|---|
| **Serverless Functions in Next.js** | Understanding how Next.js API Routes (`pages/api/`) turn frontend apps into full-stack serverless architectures without a separate Express server. |
| **File-System API Routing** | Mapping files like `pages/api/projects/index.js` and `pages/api/projects/[id].js` to standard REST endpoints. |
| **Handling HTTP Methods** | Implementing clean routing inside serverless functions for `GET`, `POST`, `PUT`, and `DELETE` requests using `req.method`. |
| **Dual-Mode Database Integration** | Connecting API routes natively to cloud serverless databases (**Neon PostgreSQL**) while maintaining local **SQLite** fallback for offline development. |
| **Security & Environment Variables** | Securing mutation endpoints (`POST`, `PUT`, `DELETE`) with API keys and managing credentials safely via `.env.local` and `@t3-oss/env-nextjs` patterns. |
| **Error Handling & Validation** | Building robust, production-grade JSON responses with proper HTTP status codes (200, 201, 400, 401, 404, 500). |

---

## Running the Full-Stack Demo

The example project in `examples/nextjs-fullstack-demo` is a complete full-stack **Projects Portfolio Manager** built in Next.js with embedded API routes and database persistence.

```bash
cd examples/nextjs-fullstack-demo
npm install
npm run dev
```

Open **http://localhost:3000** in your browser. The app demonstrates:
- **Frontend Dashboard:** A sleek dark-mode UI for viewing, creating, updating, and deleting project portfolio items.
- **`GET /api/projects`:** Fetches all projects from the database (Neon PostgreSQL or local SQLite).
- **`POST /api/projects`:** Creates a new project (requires API Key authentication).
- **`GET /api/projects/[id]`:** Fetches a single project by ID.
- **`PUT /api/projects/[id]`:** Updates an existing project (requires API Key authentication).
- **`DELETE /api/projects/[id]`:** Deletes a project (requires API Key authentication).
- **`GET /api/status`:** Diagnostics endpoint returning active database adapter (`Neon PostgreSQL` or `SQLite In-Memory Fallback`).

---

## Exploring the Interactive Lab

We also provide a standalone, zero-dependency interactive visualizer in `examples/nextjs-api-lab/index.html`. Open this file directly in any web browser to explore:

1. **API Route Simulator:** Watch how browser requests are routed through Next.js serverless handlers and executed against a database.
2. **SQL Query Tester:** Test parameterized CRUD queries against a simulated Neon PostgreSQL instance.
3. **Endpoint Explorer:** Experiment with sending GET, POST, PUT, and DELETE requests with custom JSON headers and API keys.
4. **Interactive Quiz:** Test your mastery of Next.js full-stack architecture, status codes, and serverless concepts.

---

## File Structure

```text
Lesson 39/
├── README.md
├── notes/
│   ├── tutor_notes.md                         # 90-min teaching guide, analogies, debug scenarios, comprehension Qs
│   └── student_notes.md                       # Comprehensive guide to API routes, Neon DB integration, and security
├── exercises/
│   └── nextjs_api_practice.md                 # Scaffolded practice exercises with solutions
└── examples/
    ├── nextjs-fullstack-demo/                 # Working Next.js 14 full-stack app (Pages Router) with dual-mode DB
    └── nextjs-api-lab/
        └── index.html                         # Interactive 4-tab sleek glassmorphism learning lab
```
