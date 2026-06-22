# Lesson 33 — Integrating Auth into an Express App
# Student Reference Notes

> **Launch the lab before reading:**
> ```bash
> cd examples/full-auth-api
> pnpm install   # first time only
> npx prisma db push # push schema to SQLite
> pnpm dev
> ```
> Open **http://localhost:3000** to access the complete Auth Portal.

---

## What This Lesson Is About

In previous lessons, we learned the theory behind Bcrypt, JSON Web Tokens (JWTs), and Express Middleware. Today, we put it all together into a **production-ready Auth Architecture**.

We will cover:
1. **The Registration Flow:** Safely validating and storing new users in a database (Prisma + SQLite/Neon).
2. **The Login Flow:** Authenticating users and issuing tokens.
3. **Role-Based Access Control (RBAC):** Creating an `Admin` role to restrict powerful endpoints.
4. **The Client Connection:** How the frontend actually stores and uses JWTs via `localStorage`.

---

## 1. The Full Registration Flow

Registration isn't just about throwing a username and password into the database. A proper registration flow must:
1. Validate that the input exists.
2. Check if the email is already in use (to prevent duplicates).
3. Hash the password.
4. Save the user.
5. **CRITICAL:** Strip the password hash out of the response before sending it back to the client!

```javascript
// Example Registration Logic
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  // 1. Validation
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  // 2. Check duplicates
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).json({ error: "Email already in use" });

  // 3. Hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Save
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });

  // 5. Omit the password hash from the response!
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({ success: true, user: userWithoutPassword });
});
```

---

## 2. The Full Login Flow

When logging in, the server's only job is to verify identity and issue a "Key Card" (JWT). 

```javascript
// Example Login Logic
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" }); // Don't say "Email not found"

  // 2. Compare the hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" }); // Don't say "Wrong password"

  // 3. Sign the JWT payload
  // DO NOT put the password in here. Only non-sensitive identifiers.
  const payload = { userId: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // 4. Send the token
  res.json({ success: true, token });
});
```

> **Security Tip:** Notice how we return `"Invalid credentials"` regardless of whether the email was wrong or the password was wrong. This prevents "Enumeration Attacks" where hackers use the login form to guess which emails belong to registered users.

---

## 3. Role-Based Access Control (RBAC)

Authentication asks: *"Are you logged in?"*
Authorization asks: *"Are you allowed to do this?"*

In a real app, you don't want standard users deleting other people's accounts. We solve this with **Roles**.

### Step 1: Add a Role to the Database
In Prisma, we add a role field with a default value of `USER`.
```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  role     String @default("USER") // 'USER' or 'ADMIN'
}
```

### Step 2: Ensure the Role is in the JWT Payload
When logging in, make sure `user.role` is included in the `jwt.sign()` payload so the middleware can read it later.

### Step 3: Create the Role Middleware
You already know how to write the `requireAuth` middleware to check if the token is valid. Now, we write a second middleware that runs *after* `requireAuth`.

```javascript
export const requireAdmin = (req, res, next) => {
  // `req.user` was attached by the `requireAuth` middleware that ran right before this!
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next(); // They are an admin, let them through!
};
```

### Step 4: Chain them together!
You can pass multiple middleware functions in an array, or separated by commas.

```javascript
// Standard users can access this
app.get('/api/profile', requireAuth, getProfile);

// ONLY Admins can access this
app.delete('/api/users/:id', requireAuth, requireAdmin, deleteUser);
```

---

## 4. The Frontend Connection (localStorage)

How does the frontend browser actually use the JWT?

When the React app (or vanilla JS) receives the token from the login response, it stores it inside the browser's `localStorage`.

```javascript
// 1. After successful login
localStorage.setItem('token', data.token);

// 2. When fetching a protected route later
const myToken = localStorage.getItem('token');

fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${myToken}`
  }
});

// 3. When logging out
localStorage.removeItem('token');
```

---

## Next Steps

Launch the Interactive Lab (`pnpm dev`) and try out the "Auth Portal". Register a user, login, and see how the token gets stored in your browser and used to fetch your private dashboard!
