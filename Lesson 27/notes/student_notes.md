# Student Notes — Lesson 27: Middleware, Errors & Environments

> **Start the server and open the Explorer!**
> ```bash
> cd examples/middleware-api
> pnpm install   # only needed once
> pnpm dev       # starts Express with nodemon
> ```
> Open **http://localhost:3000** and start on the **📖 Concepts** tab.

---

## 1. Middleware: The Assembly Line

In Express, **Middleware** functions are the workers on an assembly line. When a request comes in, it passes through each worker in order. 

Each middleware function can:
1. Look at the request (`req`).
2. Change the request (e.g., attach a user, parse JSON).
3. End the request early (e.g., "You are not logged in!").
4. **Pass control to the next worker** using `next()`.

### The Golden Rule of Middleware
If a middleware function does *not* send a response back to the client (like `res.json()`), it **MUST** call `next()`. If it forgets, the request will hang forever.

```javascript
// A simple logging middleware
const requestLogger = (req, res, next) => {
  console.log(`Someone visited: ${req.url}`);
  next(); // CRITICAL: Move to the next function
};

// Apply it to EVERY route
app.use(requestLogger);
```

---

## 2. Environment Variables: Keeping Secrets Safe

Real applications have secrets: database passwords, Stripe payment keys, JWT secrets. 
**You must NEVER type these directly into your code.** If you commit them to GitHub, bots will steal them in seconds.

### The Solution: `dotenv`

1. Create a file named `.env` at the root of your project.
2. Add your secrets:
   ```env
   API_SECRET_KEY=super_secret_key_12345
   PORT=3000
   ```
3. **CRITICAL:** Add `.env` to your `.gitignore` file so it is never uploaded.
4. Load them in your app:
   ```javascript
   import dotenv from 'dotenv';
   dotenv.config();

   console.log(process.env.API_SECRET_KEY); // -> super_secret_key_12345
   ```

---

## 3. Creating an Authentication Middleware

We can combine middleware and environment variables to create a security checkpoint. We only want users who provide the correct `X-API-KEY` header to access a route.

```javascript
const requireApiKey = (req, res, next) => {
  const userKey = req.headers['x-api-key'];
  const realKey = process.env.API_SECRET_KEY;

  if (!userKey) {
    return res.status(401).json({ error: 'Missing API Key' }); // End early
  }

  if (userKey !== realKey) {
    return res.status(403).json({ error: 'Invalid API Key' }); // End early
  }

  next(); // Key matches! Let them through.
};

// Apply it to a SPECIFIC route only
app.get('/api/secure-data', requireApiKey, (req, res) => {
  res.json({ message: 'You passed the security check!' });
});
```

---

## 4. The Global Error Handler

Sometimes your server crashes. Maybe a database is offline, or you try to read a property of `undefined`.
By default, Express handles this poorly — it often sends an ugly HTML error page or kills the server.

A **Global Error Handler** is a special middleware that catches *any* error thrown anywhere in your app.

### How Express recognizes it
Express knows a function is an error handler if it has **exactly four arguments**: `(err, req, res, next)`.

### Where it goes
It **MUST** be the very last `app.use()` in your file, after all your routes.

```javascript
// ... all your routes go above here ...

// The Global Error Handler
app.use((err, req, res, next) => {
  console.error("The server crashed:", err.message);
  
  // Send a nice JSON error to the frontend instead of dying
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});
```

---

## 5. Next Steps
Open [`exercises/middleware_practice.md`](../exercises/middleware_practice.md) and apply these exact patterns to the Movies API you built in the last lesson.
