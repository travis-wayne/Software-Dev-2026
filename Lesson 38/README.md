# Lesson 38 — Advanced Frontend: Next.js (SSR, SSG & Routing)

**Session Type:** Advanced Frontend
**Duration:** 90 minutes
**Prerequisites:** React components, props, React Router (Lessons 20–26), API & data fetching (Lesson 31+)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Client-Side vs Server-Side Rendering** | Why traditional React SPAs struggle with SEO and initial load performance, and how Next.js solves this. |
| **Static Site Generation (SSG)** | Generating HTML at build time with `getStaticProps` and `getStaticPaths` for maximum performance. |
| **Server-Side Rendering (SSR)** | Rendering pages on the server per-request with `getServerSideProps` for dynamic, user-specific content. |
| **File-System Routing** | How Next.js maps files in the `pages/` directory to URL routes — including dynamic routes (`[id].js`). |
| **Image Optimization** | Using Next.js's built-in `<Image>` component for automatic resizing, lazy-loading, and format conversion. |
| **API Routes** | Creating serverless backend endpoints inside a Next.js project with `pages/api/`. |

---

## Running the Demo

```bash
cd examples/nextjs-blog-demo
npm install
npm run dev
```

Open **http://localhost:3000** to explore the demo. The project is a minimal blog that demonstrates:

- `/` — Home page, statically generated at build time
- `/about` — Simple static page showing file-system routing
- `/posts` — Blog post listing, data fetched with `getStaticProps` (SSG)
- `/posts/[id]` — Dynamic post page using `getStaticPaths` + `getStaticProps`
- `/profile` — Server-rendered page using `getServerSideProps` (SSR)
- `/api/posts` — A Next.js API route returning JSON

---

## File Structure

```text
Lesson 38/
├── README.md
├── notes/
│   ├── tutor_notes.md                         # 90-min session plan + rendering strategy guide
│   └── student_notes.md                       # Concepts, code walkthroughs, SSR vs SSG comparison
├── examples/
│   └── nextjs-blog-demo/                      # Minimal Next.js 14 app (Pages Router)
│       ├── package.json
│       ├── next.config.js
│       ├── pages/
│       │   ├── _app.js                        # Global layout and styles
│       │   ├── index.js                       # Home — SSG
│       │   ├── about.js                       # Static page — file-system routing demo
│       │   ├── profile.js                     # SSR demo using getServerSideProps
│       │   ├── posts/
│       │   │   ├── index.js                   # Post listing — getStaticProps
│       │   │   └── [id].js                    # Dynamic post — getStaticPaths + getStaticProps
│       │   └── api/
│       │       └── posts.js                   # API Route — serverless endpoint
│       └── public/
│           └── (static assets)
└── exercises/
    └── nextjs_routing_practice.md             # Hands-on task: build a portfolio in Next.js
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Explain the difference between CSR, SSR, and SSG — and choose the correct strategy for a given page.
2. Create a new Next.js project and understand the `pages/` directory structure.
3. Implement `getStaticProps` and `getStaticPaths` for statically pre-rendered dynamic routes.
4. Implement `getServerSideProps` for pages that require fresh, per-request server rendering.
5. Create a Next.js API Route inside `pages/api/` as a serverless backend endpoint.
6. Use the Next.js `<Image>` component to automatically optimize images.
