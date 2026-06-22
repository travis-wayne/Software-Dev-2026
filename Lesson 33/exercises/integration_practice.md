# Exercise: Integrating Auth & RBAC into the Movies API

In this exercise, you will act as the Lead Backend Engineer for the movie platform. Currently, any logged-in user can delete a movie. You need to implement **Role-Based Access Control (RBAC)** so only administrators can delete movies. You will also build the backend logic for a "Forgot Password" feature.

## Prerequisites
- Your working Express project from Lesson 32 (or the API provided in Lesson 31).
- Your database (Prisma + SQLite/Neon).

---

## Task 1 — Add a Role System (Prisma)

1. Open your `prisma/schema.prisma` file.
2. Add a `role` field to your `User` model. It should be a `String` and default to `"USER"`.
   ```prisma
   model User {
     id       Int    @id @default(autoincrement())
     email    String @unique
     password String
     role     String @default("USER")
   }
   ```
3. Run the command to update your database schema:
   ```bash
   npx prisma db push
   ```

## Task 2 — Update the Login Payload

If the role is only in the database, the `requireAuth` middleware won't know about it unless it looks up the user in the database every time (which is slow). We need to put the role inside the JWT!

1. Open your login route (`POST /api/auth/login`).
2. When creating the JWT payload, add the user's role:
   ```javascript
   const payload = { 
     userId: user.id, 
     role: user.role // Add this line!
   };
   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
   ```

## Task 3 — Build the `requireAdmin` Middleware

1. Create a new file `middleware/role.js`.
2. Write a middleware function that checks `req.user.role`.
   > *Hint: Remember that `req.user` is attached by the `requireAuth` middleware!*

```javascript
export const requireAdmin = (req, res, next) => {
  // If they aren't an admin, block them!
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  
  // Otherwise, let them proceed
  next();
};
```

## Task 4 — Protect the Delete Route

1. Open your movie routes.
2. Find the `DELETE /api/movies/:id` route.
3. Import your new `requireAdmin` middleware.
4. Chain the middleware so that a user must be logged in AND be an admin to delete a movie.

```javascript
app.delete('/api/movies/:id', requireAuth, requireAdmin, deleteMovieController);
```

5. **Test it in Postman!** 
   - Register a normal user, login, and try to delete a movie. You should get `403 Forbidden`.
   - Manually change your user's role to `"ADMIN"` in Prisma Studio (`npx prisma studio`), login again to get a new token, and try to delete a movie. It should succeed!

---

## Task 5 — Mock "Forgot Password" Flow

In the real world, you'd send an email with a reset link. Here, we will just build the logic to update a password.

1. Create a new route `POST /api/auth/reset-password`.
2. Accept `email` and `newPassword` in `req.body`.
3. Check if the user exists. If not, return a generic 400 error.
4. Hash the `newPassword` using `bcrypt.hash(newPassword, 10)`.
5. Update the user in the database using Prisma:
   ```javascript
   await prisma.user.update({
     where: { email },
     data: { password: hashedNewPassword }
   });
   ```
6. Return a success message. Test it in Postman, then try logging in with the new password!
