# Exercise: Securing the Movies API

In this exercise, you will act as the Backend Lead for a movie review platform. Until now, anyone could delete movies or add fake reviews because the API was entirely public. Your job is to lock it down so only registered users can make changes.

## Prerequisites
- A working Express project (you can use your code from the Lesson 26/27 Movies API).
- A database (SQLite, Neon, or even an in-memory array for this exercise).
- API client (Postman or Insomnia).

## Task 1 — Install Dependencies

1. Open your terminal in your project folder.
2. Install the necessary security packages:
   ```bash
   npm install bcryptjs jsonwebtoken dotenv
   ```
3. Create a `.env` file and add a strong secret key:
   ```env
   JWT_SECRET=super_secret_dev_key_change_in_production_123!!
   ```

## Task 2 — Build Registration (Hashing)

Create a new route: `POST /api/auth/register`

1. Accept `username` and `password` from `req.body`.
2. Check if the user already exists (if so, return a 400 error).
3. Use `bcrypt.hash()` to hash the password with a salt round of 10.
   > **Important:** Do not forget the `await` keyword!
4. Save the new user to your database, storing the `hashedPassword` (NOT the plain text password).
5. Return a success message.

## Task 3 — Build Login (Issuing JWTs)

Create a new route: `POST /api/auth/login`

1. Accept `username` and `password` from `req.body`.
2. Find the user in the database by their username.
3. If the user doesn't exist, return a 401 error.
4. Use `bcrypt.compare()` to check if the provided password matches the stored hash.
5. If the passwords match:
   - Create a payload object containing the user's ID and username.
   - Use `jwt.sign()` to generate a token (using your `JWT_SECRET` from `.env`). Set it to expire in 1 hour.
   - Return `{ success: true, token: "eyJh..." }`
6. If they don't match, return a 401 error.

## Task 4 — Build the Auth Middleware

Create a new file called `middleware/auth.js` (or just put it in your `server.js` above your routes).

Write a middleware function `requireAuth(req, res, next)`:
1. Grab the `authorization` header from the request.
2. Check if it exists and starts with `"Bearer "`. If not, return 401 Unauthorized.
3. Extract the token string.
4. Wrap `jwt.verify()` in a `try/catch` block.
5. If verification succeeds, attach the decoded payload to `req.user` and call `next()`.
6. If it fails (throws an error), catch it and return 403 Forbidden.

## Task 5 — Protect Your Routes

Apply your `requireAuth` middleware to your existing movie routes:

- `GET /api/movies` — **Leave this public** (anyone can view movies).
- `POST /api/movies` — **Protect this** (only logged-in users can add movies).
- `PUT /api/movies/:id` — **Protect this**.
- `DELETE /api/movies/:id` — **Protect this**.

*Bonus:* When a user hits `POST /api/movies`, you now have access to `req.user.userId`. Save this ID along with the movie data so the database knows *who* added the movie!

## Task 6 — Test the Flow in Postman

1. **Attempt to add a movie without logging in.** You should get a `401 Unauthorized`.
2. **Register a new user.** Verify your database shows a hashed string, not the real password.
3. **Login.** Copy the `token` from the response.
4. **Attempt to add a movie WITH the token.**
   - In Postman, go to the "Authorization" tab.
   - Select "Bearer Token".
   - Paste your token into the box.
   - Send the POST request. It should succeed!
5. **Tamper with the token.** Delete the last letter of the token in Postman and send the request again. You should get a `403 Forbidden` because the signature no longer matches.

---

### Need a hint for Task 4?

<details>
<summary>Click to view the middleware template</summary>

```javascript
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};
```
</details>
