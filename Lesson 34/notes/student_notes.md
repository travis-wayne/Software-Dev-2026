# Lesson 34 — Deployment Basics (Vercel & Render/Heroku)
# Student Reference Notes

---

## 1. The Deployment Mindset

Up until now, you've been running your applications on `localhost`. This is great for development, but nobody else can see your work!

**Deployment** is the process of moving your code from your laptop to a server on the internet so that anyone in the world can access it via a URL (e.g., `my-cool-app.com`).

There are two main types of deployment we care about:
1. **Frontend Deployment (Static):** HTML, CSS, React, Vite. These are compiled into flat files and served very quickly. We use **Vercel** or **Netlify** for this.
2. **Backend Deployment (Server):** Node.js, Express, Databases. These require a constantly running server environment (a "runtime"). We use **Render**, **Railway**, or **Heroku** for this.

---

## 2. Deploying a Frontend to Vercel

[Vercel](https://vercel.com/) is optimized for frontend frameworks. It automatically hooks into your GitHub repository and redeploys your app every time you push code (this is called **Continuous Deployment** or CD).

### The Build Process
When you deploy a React (Vite) app, Vercel runs:
```bash
npm install
npm run build
```
This takes all your React code and minifies it into a tiny `dist` folder. Vercel then takes that folder and distributes it across hundreds of servers worldwide (a CDN) so it loads instantly for everyone.

### Routing in React Apps (vercel.json)
If you are using React Router, you must tell Vercel to redirect all traffic to `index.html`. Otherwise, if a user goes directly to `yoursite.com/dashboard`, Vercel will look for a folder named "dashboard" and return a `404 Not Found`.

You fix this by creating a `vercel.json` file in your root:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 3. Deploying a Backend API

Backend APIs are different. They don't output a `dist` folder. They run continuously, listening for requests. Platforms like Render or Heroku provide containerized environments to run your Node.js code.

### The Holy Trinity of Backend Deployment

To deploy a backend successfully, you MUST configure these three things correctly:

#### 1. Port Binding (`process.env.PORT`)
On your computer, you used `const PORT = 3000;`. But cloud providers assign a random port to your app dynamically. You must tell Express to use their port:
```javascript
// ❌ BAD
const PORT = 3000; 

// ✅ GOOD
const PORT = process.env.PORT || 3000; 
```

#### 2. Start Scripts
Cloud providers need to know how to start your app. They will look in your `package.json` for the `start` script.
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```
*(Render uses the Start Command you type in their dashboard, but Heroku specifically looks for a `Procfile` containing `web: npm start`)*.

#### 3. Environment Variables
You should **never** push your `.env` file to GitHub (that leaks your `DATABASE_URL` and `JWT_SECRET`!). 
Instead, you must manually copy/paste your environment variables into the Vercel/Render dashboard under the "Environment Variables" settings tab.

---

## 4. Connecting the Frontend and Backend (CORS)

When you deploy, your frontend might be at `https://my-ui.vercel.app` and your backend at `https://my-api.onrender.com`.

### Updating the Frontend
In your React app, you can no longer fetch from `http://localhost:3000`. You must use your new production URL.
We solve this using Vite environment variables:
```javascript
// .env (Local)
VITE_API_URL=http://localhost:3000

// In Vercel Settings (Production)
VITE_API_URL=https://my-api.onrender.com
```
Then in your code:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/auth/login`);
```

### Updating the Backend (CORS)
By default, your Express API will block requests from `my-ui.vercel.app` because of the Same-Origin Policy. You must update your backend CORS settings to allow your new Vercel domain!
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
```
*(Don't forget to add `CORS_ORIGIN` to your Render/Heroku dashboard!)*

---

## 5. Reading Build Logs — When Things Go Wrong

Every deployment platform shows logs — this is **always** the first place you look when a deploy fails. Don't guess. Read the logs.

### Where to Find Logs

**Render:**
Dashboard → Your Service → **Logs** tab (top navigation inside your service). You'll see both build logs (what ran during deployment) and runtime logs (console.log output from your running app).

**Vercel:**
Deployments tab → Click on a specific deployment → **View Build Logs** button in the top-right corner. You can also see function logs under **Functions** if you are using serverless functions.

### Common Render Build Errors

| Log Message | Cause | Fix |
|---|---|---|
| `Error: Cannot find module 'express'` | `node_modules` not installed | Ensure Build Command includes `npm install` |
| `Error: listen EADDRINUSE: address already in use` | Hardcoded port (e.g. `3000`) conflicts with Render's assigned port | Use `process.env.PORT \|\| 3000` |
| `prisma: command not found` | Prisma CLI not in `dependencies` (only in `devDependencies`) | Move `prisma` to `dependencies` in `package.json` |
| `Process exited with code 1` | Unhandled error at startup | Check for missing environment variables or a syntax error; look at the lines above this message |
| `Cannot read properties of undefined` | Code is using an env variable that was never set | Double-check every `process.env.X` in your code against your Render env vars panel |

### How to Read a Log Like a Detective

1. **Start from the bottom** — the actual error is almost always near the last few lines.
2. **Look for `Error:` or `✗`** — these are the keywords that matter.
3. **Read the stack trace** — the indented lines under the error tell you exactly which file and line number caused it.
4. **Grep for your own file names** — if the stack trace shows `node_modules/express/...`, that's a library error, but if it shows `src/server.js:14`, that's YOUR code.

---

## 6. Staging vs Production Environments

### Why You Never Test Directly on Production

Imagine you push a bug fix to your live app but the bug fix itself has a bug. Now thousands of real users are seeing a broken experience. This is called a **production incident** and it's very bad.

The solution is to have multiple environments:

| Environment | Who Uses It | Where It Runs |
|---|---|---|
| **Development** | Just you | Your laptop (`localhost`) |
| **Staging** | Your team for final testing | A cloud server (copy of production) |
| **Production** | Real users | Your live cloud server |

Code flows **left to right**: Dev → Staging → Production. You only promote code to the right when it passes testing in the environment on the left.

### Vercel Preview Deployments (Built-In Staging!)

Vercel does this automatically. Every time you push a branch or open a Pull Request, Vercel creates a **unique preview URL** for that specific deployment:

```
main branch    → https://my-app.vercel.app          (Production)
feature/login  → https://my-app-git-feature-login-me.vercel.app  (Preview)
fix/bug-123    → https://my-app-git-fix-bug-123-me.vercel.app    (Preview)
```

This means every PR gets its own live URL you can share with teammates or a client for review — without touching production.

### Render Staging Setup

On Render, you create staging manually:
1. Create a **second Render service** (Web Service)
2. Point it to the same GitHub repository
3. Set the **branch** to `staging` instead of `main`
4. Give it its own environment variables

```
Production service  → branch: main    → DATABASE_URL (production DB)
Staging service     → branch: staging → DATABASE_URL_STAGING (staging DB)
```

### Environment Variable Naming Convention

Use a naming convention that makes it obvious which environment a variable belongs to:

```bash
# Production
DATABASE_URL=postgresql://prod-user:pass@prod-host/mydb

# Staging  
DATABASE_URL_STAGING=postgresql://staging-user:pass@staging-host/mydb_staging

# Never mix these up — staging data should NEVER touch the production database!
```

---

## 7. Render Cold Starts — The Frustrating Reality of Free Tiers

### What is a Cold Start?

Render's **free tier** saves money by spinning down (sleeping) your service after **15 minutes of inactivity**. When a new user visits your sleeping app, Render has to wake it back up. This takes **30–60 seconds**.

During those 60 seconds, your user is staring at a loading spinner (or worse, an error). Your app isn't broken — it's just waking up. But it looks broken.

### How to Tell if Your App is Cold-Starting

- First request after inactivity takes > 30 seconds
- Render dashboard shows the service as "Sleeping" (yellow indicator)
- Logs show the startup sequence when the request comes in

### Solutions

**Option 1: Upgrade to a Paid Plan** (Render Starter at $7/month)
No cold starts. Services stay awake 24/7. Best for a real product.

**Option 2: Add a Frontend Retry Pattern**
Handle the slow response gracefully in your UI so users see a "Loading..." message instead of an error.

```javascript
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
      if (res.ok) return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        console.log(`Attempt ${i + 1} failed, retrying...`);
        await new Promise(r => setTimeout(r, 2000)); // Wait 2s before retry
      }
    }
  }
  throw new Error('Server unavailable after retries');
}
```

This function tries 3 times, waiting 2 seconds between each attempt. It also uses `AbortSignal.timeout(10000)` to cancel requests that take more than 10 seconds.

**Option 3: Keep-Alive Pings (Free!)**
Use a free cron service like [cron-job.org](https://cron-job.org) to ping your API every 10 minutes. This keeps Render from sleeping your service.

1. Go to cron-job.org → Create an account (free)
2. Create a new cron job: `*/10 * * * *` (every 10 minutes)
3. URL: `https://your-api.onrender.com/health`
4. Add a `/health` route to your Express app that just returns `{ status: 'ok' }`

```javascript
// Add this route to your Express server
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

---

## 8. Production Database Migrations

### The Critical Difference: `db push` vs `migrate deploy`

This is one of the most important distinctions you will learn. Getting this wrong can **permanently delete user data**.

| Command | Use In | What It Does | Safe for Production? |
|---|---|---|---|
| `npx prisma db push` | **Development only** | Directly syncs schema to DB, may drop columns | ❌ NO |
| `npx prisma migrate deploy` | **Production** | Runs pre-generated migration files safely | ✅ YES |

### Why `db push` is Dangerous in Production

`prisma db push` looks at your current schema and makes the database match it — including **dropping tables or columns** that no longer exist in your schema. If you removed a column from your schema but production users still have data in that column, `db push` will **delete all of it with no warning**.

### The Production Migration Workflow

**Step 1: Generate migration files in development**
```bash
# On your laptop, after editing schema.prisma:
npx prisma migrate dev --name add-user-avatar
# This creates: prisma/migrations/20240101_add-user-avatar/migration.sql
```

**Step 2: Commit the migration file to GitHub**
```bash
git add prisma/migrations/
git commit -m "feat: add user avatar column"
git push
```

**Step 3: Configure Render to run migrations on deploy**

In your Render dashboard, set the **Build Command** to:
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

`npx prisma migrate deploy` reads the migration files from `prisma/migrations/` and applies any that haven't been run yet. It is **additive only** — it will never drop data.

### NEVER Run `db push` on Production

```bash
# ❌ NEVER DO THIS WITH A PRODUCTION DATABASE_URL
DATABASE_URL=postgresql://prod-user:... npx prisma db push

# ✅ ALWAYS USE THIS INSTEAD
DATABASE_URL=postgresql://prod-user:... npx prisma migrate deploy
```

---

## 9. The .env Audit Checklist

Before you deploy, audit every environment variable your app needs. A missing variable is one of the most common causes of deployment failures.

### The Complete Variable Map

| Variable | Set In | Notes |
|---|---|---|
| `DATABASE_URL` | Render dashboard | Use your production DB URL (Neon, PlanetScale, Supabase), NOT your dev URL |
| `DIRECT_URL` | Render dashboard | Only needed if using connection pooling (e.g. Neon with Prisma) |
| `JWT_SECRET` | Render AND Vercel (if both need it) | Must be identical on both services; use a 64-character random string |
| `CORS_ORIGIN` | Render dashboard | Set to your exact Vercel frontend URL: `https://my-app.vercel.app` |
| `VITE_API_URL` | Vercel dashboard | Set to your exact Render backend URL: `https://my-api.onrender.com` |
| `NODE_ENV` | Render dashboard | Set to `production` — unlocks performance optimizations in many libraries |
| `RESEND_API_KEY` | Render dashboard | Or Vercel if sending emails from serverless functions |
| `PAYSTACK_SECRET_KEY` | Render dashboard | Never expose on frontend — backend only! |

### How to Generate a Strong Secret

```bash
# In your terminal (macOS/Linux):
openssl rand -base64 64

# Output example:
# 7kP9mN2qR8vX3wL5jH1tY6uE4oA0bC/dF+gI=kJ...
```

Or use Node.js:
```javascript
require('crypto').randomBytes(64).toString('hex')
```

### Pre-Deploy Verification Steps

1. Search your codebase for `process.env.` — list every variable referenced
2. Open your Render/Vercel dashboard and verify every variable from step 1 is set
3. Double-check URLs don't have trailing slashes (e.g., use `https://api.onrender.com` not `https://api.onrender.com/`)
4. Verify `NODE_ENV=production` is set

---

## 10. Custom Domains (Conceptual)

### Vercel Custom Domains (3 Clicks)

Vercel makes adding a custom domain extremely easy:
1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Type in your domain (e.g., `myapp.com`) → Click **Add**
3. Vercel shows you DNS records to configure (usually a CNAME record)
4. Go to your domain registrar → Add those records → Wait 5–60 minutes for DNS to propagate

### Understanding DNS: The Post Office Analogy

Think of the internet as a city. Every server has a numerical address (an **IP address**, like `76.223.105.230`). Domain names like `myapp.com` are like human-readable nicknames for those addresses.

**DNS (Domain Name System)** is like the post office's address book — it translates `myapp.com` into `76.223.105.230`.

A **CNAME record** is like a mail forwarding address. Instead of pointing your domain directly to an IP, you point it to another domain name (which Vercel manages):

```
myapp.com  →  CNAME  →  cname.vercel-dns.com  →  (Vercel handles the rest)
```

This lets Vercel move their servers around (changing IPs) without you having to update your DNS records every time.

### Getting a Domain

| Option | Cost | Best For |
|---|---|---|
| `.vercel.app` subdomain | Free, automatic | Learning and personal projects |
| Namecheap Education | Free with `.edu` email | Students |
| Namecheap | ~$10/year for `.com` | Small projects |
| Google Domains / Squarespace | ~$12/year | Professional projects |

> **Recommendation for this course:** Use your free `.vercel.app` subdomain. It's professional enough to put on a portfolio and requires zero setup.

---

## Quick Reference

### Render Build Command (with Prisma)
```bash
npm install && npx prisma generate && npx prisma migrate deploy
```

### Render Start Command
```bash
npm start
```

### Vercel Settings Summary
- **Framework Preset:** Vite (or auto-detected)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Root Directory:** (leave blank unless your frontend is in a subfolder)

### The Deployment Checklist
- [ ] `process.env.PORT || 3000` in backend
- [ ] `"start"` script in `package.json`
- [ ] `.env` in `.gitignore`
- [ ] All environment variables in dashboard
- [ ] CORS set to production frontend URL
- [ ] `prisma migrate deploy` (not `db push`) in build command
- [ ] Vercel `vercel.json` rewrites for React Router
- [ ] `VITE_API_URL` set in Vercel dashboard
