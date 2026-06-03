# Exercise: Hardening the Movies API

In Lesson 26, you built a working REST API for Movies. It works, but it's fragile and insecure.
In this exercise, you will apply Middleware, Environment Variables, and Error Handling to make it production-ready.

## Prerequisites
Open the Movies API project you built in Lesson 26.

## Task 1: Environment Variables Setup
Currently, your `PORT` is hardcoded. Let's fix that.

1. Install `dotenv`:
   ```bash
   pnpm install dotenv
   ```
2. Create a `.env` file at the root of your project.
3. Add two variables to it:
   ```env
   PORT=5000
   ADMIN_API_KEY=batman123
   ```
4. Create a `.gitignore` file and add `node_modules` and `.env` to it.
5. In your `server.js`, import `dotenv` and call `dotenv.config()` at the very top.
6. Change your app to listen on `process.env.PORT || 3000`.

## Task 2: Custom Logging Middleware
We want to see every request that hits our server in the terminal.

1. Create a middleware function named `logger`.
2. It should `console.log()` the `req.method` and `req.url`.
3. **Crucial:** Don't forget to call `next()`!
4. Apply it to the whole app using `app.use(logger)`.

## Task 3: The Authentication Checkpoint
We want anyone to be able to *read* our movies, but only admins should be able to *modify* them.

1. Create a middleware function named `requireAdmin`.
2. It should check if `req.headers['x-admin-key']` matches `process.env.ADMIN_API_KEY`.
3. If it doesn't match (or is missing), return `res.status(401).json({ error: 'Unauthorized' })`.
4. If it does match, call `next()`.
5. Apply this middleware **only** to your `POST`, `PUT`, and `DELETE` routes.
   *Example:* `app.post('/api/movies', requireAdmin, (req, res) => { ... })`
6. Test it in Postman/Insomnia:
   - GET should work normally.
   - POST without a header should fail (401).
   - POST with `x-admin-key: batman123` should succeed (201).

## Task 4: The Safety Net (Global Error Handler)
If something crashes, we don't want the server to die or send HTML back to our JSON client.

1. Add a route designed to crash, just for testing:
   ```javascript
   app.get('/api/crash', (req, res) => {
     throw new Error('System Meltdown!');
   });
   ```
2. At the **very bottom** of your `server.js` (but before `app.listen`), add a Global Error Handling middleware.
3. Remember, it must have 4 arguments: `(err, req, res, next)`.
4. Make it console.error the error stack, and send a `res.status(500)` JSON response back to the client.
5. Hit `/api/crash` in Postman to confirm it works gracefully.
