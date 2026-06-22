# Lesson 34 — Deployment Basics (Vercel & Render)

**Session Type:** Deployment & DevOps
**Duration:** 90 minutes
**Prerequisites:** Working Node.js API and React Frontend

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Vercel** | The premier platform for deploying static sites and Frontend frameworks like React/Vite. Understand CDNs, build steps, and `vercel.json` rewrites. |
| **Render / Heroku** | Containerized hosting for Backend APIs. Understand the necessity of dynamic Port Binding (`process.env.PORT`) and Start Scripts. |
| **Environment Variables** | How to securely store secrets (`DATABASE_URL`, `JWT_SECRET`) in cloud dashboards instead of leaking them via `.env` files on GitHub. |
| **Production CORS** | Updating your Express API to explicitly allow HTTP requests from your newly minted Vercel UI domain. |

---

## Deployable Templates

This lesson contains two pre-configured, stripped-down templates designed for 1-click deployment.

### 1. Backend (`examples/deployable-api`)
This is a standard Express app featuring:
- Dynamic Port Binding (`process.env.PORT || 3000`)
- A generic `cors()` setup ready to accept `process.env.CORS_ORIGIN`
- A `Procfile` for Heroku deployments.
- A `render.yaml` for Render deployments.

### 2. Frontend (`examples/deployable-client`)
This is a standard Vite/React app featuring:
- A `vercel.json` configuration file to ensure React Router URLs don't result in `404 Not Found` when a user hits refresh.
- Dynamic environment variable usage (`import.meta.env.VITE_API_URL`) to seamlessly switch from `localhost` to your production API domain.

---

## File Structure

```text
Lesson 34/
├── README.md
├── notes/
│   ├── tutor_notes.md           # 90-min plan + troubleshooting guide
│   └── student_notes.md         # Deployment concepts and configuration theory
├── examples/
│   ├── deployable-api/          # Ready-to-deploy Express API
│   │   ├── Procfile
│   │   ├── render.yaml
│   │   └── src/server.js
│   └── deployable-client/       # Ready-to-deploy Vite/React App
│       ├── vercel.json
│       └── src/App.jsx
└── exercises/
    └── deployment_practice.md   # Step-by-step instructions to deploy personal projects
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Distinguish between Static Hosting (Frontend) and Runtime Container Hosting (Backend).
2. Prepare a Node.js Express API for production environments using dynamic Ports.
3. Configure environment variables in cloud dashboards to hide sensitive data.
4. Establish cross-origin communication between a deployed UI and a deployed API by updating CORS policies.
