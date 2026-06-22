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
