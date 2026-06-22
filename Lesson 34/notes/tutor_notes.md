# Lesson 34 — Deployment Basics
# 🗂️ Tutor Notes (90-Minute Session)

> **Important Note:** Heroku no longer offers a free tier. While the lesson concepts apply perfectly to Heroku (and we use a `Procfile`), you are highly encouraged to teach students to deploy their backends using **Render** (which has a free tier) or **Railway**. The `examples/deployable-api` includes configuration files for both platforms.

---

## Session Objectives

By the end of this lesson students will be able to:

1. Understand the difference between hosting Static assets (Frontend) and Runtime environments (Backend).
2. Configure a React/Vite app for Vercel deployment (Environment variables, routing rewrites).
3. Configure a Node.js Express API for production (`process.env.PORT`, start scripts).
4. Successfully manage CORS across two different deployed domains.
5. Safely manage `.env` secrets in cloud dashboards.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Vercel Account | Ensure you have a GitHub-linked Vercel account. |
| Render/Heroku Account | Ensure you have an account for backend deployment demos. |
| Example Repos | Have the `deployable-client` and `deployable-api` pushed to your own GitHub repos to demonstrate live deployment clicks. |

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — The Deployment Concept (15 min)

**Goal**: Break the "localhost" bubble.

1. **Why deploy?** 
   - Ask students: "If you wanted to show me your project right now, how would you do it?" (They'd say screen share). Explain that deployment changes this to just sharing a URL.
2. **Frontend vs Backend Hosting**
   - Explain that React is compiled into basic HTML/JS/CSS (Static). Vercel uses CDNs to serve this instantly worldwide.
   - Explain that Node.js needs a computer (server) constantly running and listening to ports. Render/Heroku provides these containers.

---

### Phase 2 — Preparing & Deploying the Backend (35 min)

**Goal**: Successfully deploy an API.

1. **The Holy Trinity of Backend Deployment (10 min)**
   - Open `examples/deployable-api/src/server.js`.
   - **Crucial step:** Show `const PORT = process.env.PORT || 3000;`. Explain that cloud providers inject their own port. If you hardcode 3000, it will crash.
   - Show `package.json`'s `"start": "node src/server.js"` script.
2. **Environment Variables (10 min)**
   - Ask: "Should we commit `.env` to GitHub?" (Emphatic NO).
   - Explain how cloud providers have a "Settings" tab to paste secrets manually.
3. **Live Demo: Render/Heroku Deployment (15 min)**
   - Go to Render.com -> New Web Service -> Connect GitHub repo.
   - Show where the Build Command (`npm install`) and Start Command (`npm start`) go.
   - Enter environment variables (`CORS_ORIGIN`, `DATABASE_URL`).
   - Deploy and show the live API returning JSON in the browser!

---

### Phase 3 — Preparing & Deploying the Frontend (25 min)

**Goal**: Connect the UI to the live API via Vercel.

1. **Vite Environment Variables (10 min)**
   - Open `examples/deployable-client/.env`. Show `VITE_API_URL`.
   - Explain how Vite requires the `VITE_` prefix to expose variables to the browser.
2. **Vercel Rewrites (5 min)**
   - Open `vercel.json`. Explain the Single Page Application (SPA) routing problem. (If a user refreshes on `/about`, Vercel looks for an `about.html` file and 404s).
3. **Live Demo: Vercel Deployment (10 min)**
   - Go to Vercel -> Import Project -> Connect GitHub.
   - **Crucial step:** In the Vercel deploy screen, open "Environment Variables" and add `VITE_API_URL` pointing to the Render API you just deployed.
   - Deploy and show the fully working app!

---

### Phase 4 — Troubleshooting & Q&A (15 min)

**Goal**: Equip them to handle the inevitable deployment crashes.

**Common Errors to Discuss:**
- **App crashes immediately on boot (Backend):** You hardcoded `PORT=3000`.
- **404 Not Found when refreshing page (Frontend):** You forgot `vercel.json` rewrites.
- **Network Error / Fetch Failed (Frontend):** 
  - Did you update `VITE_API_URL` to the production link?
  - Did you add the Vercel URL to the backend's `CORS_ORIGIN`?
- **Database connection failed (Backend):** You forgot to add `DATABASE_URL` to the Render dashboard.

---

## Homework / Take-Home

Assign `exercises/deployment_practice.md`.
Students must deploy their own Movies API (Lesson 33) and Dashboard (Lesson 24/33), and ensure they can register/login over the public internet.
