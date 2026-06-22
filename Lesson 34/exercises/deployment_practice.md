# Exercise: Deploying Your Full Stack Application

In this exercise, you will take your Auth/Movies API and your React Dashboard from previous lessons and deploy them to the public internet! 

## Prerequisites
- A GitHub account.
- A free Vercel account (for the frontend).
- A free Render account (for the backend). *(Note: Heroku is also fine if you have a paid account).*
- Your backend and frontend projects must be in **separate** GitHub repositories.

---

## Task 1 — Prepare Your Backend (API)

Before deploying, your backend code must be configured for a cloud environment.

1. **Port Binding:** Open your `server.js` and ensure you are using the environment variable for the port:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```
2. **Start Script:** Open your backend `package.json` and ensure you have a standard `start` script:
   ```json
   "scripts": {
     "start": "node src/server.js",
     "dev": "nodemon src/server.js"
   }
   ```
3. **CORS Configuration:** Your API needs to allow requests from your future Vercel URL.
   ```javascript
   app.use(cors({
     origin: process.env.CORS_ORIGIN || '*' // In production, this will be your vercel URL!
   }));
   ```
4. Commit and push these changes to GitHub.

---

## Task 2 — Deploy the Backend (Render)

1. Log into [Render.com](https://render.com) and click **New ➔ Web Service**.
2. Connect your GitHub account and select your backend repository.
3. Configure the settings:
   - **Build Command:** `npm install` (or `pnpm install`)
   - **Start Command:** `npm start` (or `pnpm start`)
4. **Environment Variables:** Scroll down to Advanced / Environment Variables. You MUST add the secrets from your local `.env` file here:
   - `JWT_SECRET`: (Your secret string)
   - `DATABASE_URL`: (Your production Neon PostgreSQL connection string)
   - `CORS_ORIGIN`: (Leave blank for now, we will add the Vercel URL later!)
5. Click **Deploy**. 
6. Watch the logs. Once it says "Live", copy the URL Render gives you (e.g., `https://my-api-123.onrender.com`).

---

## Task 3 — Prepare Your Frontend

1. Open your React/Vite project.
2. Ensure all your `fetch()` calls use an environment variable instead of hardcoded `localhost`:
   ```javascript
   // Change this:
   fetch('http://localhost:3000/api/movies')
   
   // To this:
   fetch(`${import.meta.env.VITE_API_URL}/api/movies`)
   ```
3. Create a `vercel.json` file in the root of your frontend project to handle React Router correctly:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Commit and push these changes to your frontend GitHub repository.

---

## Task 4 — Deploy the Frontend (Vercel)

1. Log into [Vercel.com](https://vercel.com) and click **Add New ➔ Project**.
2. Select your frontend GitHub repository.
3. **Environment Variables:** Before clicking Deploy, open the Environment Variables dropdown. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** (Paste the Render URL from Task 2 here, without a trailing slash!)
4. Click **Deploy**.
5. Once it finishes, click the domain Vercel provides (e.g., `https://my-dashboard.vercel.app`).

---

## Task 5 — Close the Loop (CORS)

If you try to log in on your new Vercel site right now, it will probably fail with a CORS error. Why? Because the backend doesn't trust the Vercel URL yet!

1. Copy your new Vercel URL.
2. Go back to your Render Dashboard ➔ Your Web Service ➔ Environment Variables.
3. Update the `CORS_ORIGIN` variable to be your Vercel URL.
4. Render will automatically redeploy your API.
5. Once the API is live again, go back to your Vercel site and try logging in. It should work perfectly!

🎉 **Congratulations! You have successfully deployed a Full Stack application!** 🎉
