# Lesson 40 — Student Notes: Next.js Authentication (NextAuth.js / Auth.js)

## 1. Why Use NextAuth.js?

In Lesson 31, we built an authentication system from scratch using Express, Bcrypt, and JSON Web Tokens (JWT). While building from scratch is an invaluable learning exercise, doing so in production serverless environments like Next.js introduces significant complexity:
- **Cookie Encryption & Security:** Manually configuring `httpOnly`, `Secure`, and `SameSite` cookies across dynamic Vercel serverless domains is prone to vulnerabilities.
- **OAuth Social Logins:** Connecting to GitHub, Google, or Discord requires writing hundreds of lines of OAuth 2.0 handshake code, callback URL parsing, and token refresh logic.
- **Session Syncing across Tabs:** When a user logs out in Tab A, React components in Tab B need to detect the logout and update immediately without requiring a full page reload.

**NextAuth.js (also known as Auth.js)** is the complete open-source authentication framework for Next.js. It handles database session persistence, encrypted JWT cookies, social OAuth logins, password verification, and reactive React hooks in a single unified configuration file!

---

## 2. Setting Up Catch-All Authentication Routes

To install NextAuth in your Next.js project:

```bash
npm install next-auth bcryptjs
```

In Next.js Pages Router, create a file named `[...nextauth].js` inside the `pages/api/auth/` directory. The syntax `[...nextauth]` is a **Next.js Optional Catch-All Route**. It tells Next.js to intercept all web requests starting with `/api/auth/*` and route them to our NextAuth handler:

```text
pages/
└── api/
    └── auth/
        └── [...nextauth].js   --> Handles /api/auth/signin, /api/auth/signout, /api/auth/callback/*
```

---

## 3. Configuring Authentication Providers

Inside `pages/api/auth/[...nextauth].js`, we define an `authOptions` object containing our chosen authentication methods, called **Providers**.

### 1. The Credentials Provider (Email & Password)
The Credentials provider allows users to log in with arbitrary usernames/emails and passwords. Inside its `authorize` function, we check our database (Neon PostgreSQL or SQLite fallback) and verify their password hash with `bcryptjs`:

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db'; // Our dual-mode Neon/SQLite adapter from Lesson 39

export const authOptions = {
  providers: [
    // ─────────────────────────────────────────────────────────────
    // 1. CREDENTIALS PROVIDER (Email + Bcrypt Password)
    // ─────────────────────────────────────────────────────────────
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "travis@wayne.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        // Query database for user
        const users = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email.toLowerCase()]);
        const user = users[0];

        if (!user || !user.password_hash) {
          throw new Error('No user found with this email address');
        }

        // Verify password hash
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        // Return user object (MUST include an 'id' property!)
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        };
      }
    }),

    // ─────────────────────────────────────────────────────────────
    // 2. GITHUB OAUTH PROVIDER (Social Login)
    // ─────────────────────────────────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'mock_client_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_client_secret'
    })
  ],

  // Session configuration
  session: {
    strategy: 'jwt', // Store session data in an encrypted browser cookie
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_key_for_development_only',

  // Custom pages (optional - use our own sleek glassmorphism login UI)
  pages: {
    signIn: '/login',
    error: '/login'
  }
};

export default NextAuth(authOptions);
```

---

## 4. Customizing JWT & Session Callbacks

By default, NextAuth only sends public basic information (`name`, `email`, `image`) to the browser session for security reasons. If you want your React UI to know the user's database `id` or administrative `role`, you must explicitly pass them through NextAuth callbacks:

```javascript
// Add this inside authOptions in [...nextauth].js:
callbacks: {
  // 1. jwt() runs whenever a JWT is created or updated. We attach custom fields to the token.
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role || 'user';
    }
    return token;
  },

  // 2. session() runs whenever useSession() or getServerSession() is called. We copy from token to session.
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
    }
    return session;
  }
}
```

---

## 5. Client-Side Authentication (`useSession` & `<SessionProvider>`)

To let your React components reactively change based on who is logged in, wrap your root application in `<SessionProvider>` inside `pages/_app.js`:

```javascript
// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

Now, any React component in your application can call `useSession()`, `signIn()`, and `signOut()`:

```javascript
// components/Navbar.jsx
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <nav>Loading session...</nav>;

  return (
    <nav className="glass-card flex justify-between p-4">
      <div>My NextAuth App</div>
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <span>Welcome, <strong>{session.user.name}</strong> ({session.user.role})</span>
            <button onClick={() => signOut()} className="btn btn-rose">Sign Out</button>
          </div>
        ) : (
          <button onClick={() => signIn()} className="btn btn-emerald">Sign In</button>
        )}
      </div>
    </nav>
  );
}
```

---

## 6. Protecting API Routes & Pages (`getServerSession`)

Never rely solely on client-side React code (`if (!session) return ...`) to secure your application! A malicious user can easily open Postman or their browser console and send a `DELETE` request directly to your API routes.

To enforce real security on the Node.js server, use **`getServerSession`**:

### Protecting an API Route (`pages/api/projects/[id].js`)
```javascript
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '../../../lib/db';

export default async function handler(req, res) {
  // 1. Check session on the backend server before executing any SQL
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. You must be logged in to modify portfolio items.' 
    });
  }

  // 2. Safe to execute database mutation
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: `Project ${id} deleted by ${session.user.email}` });
  }
}
```

### Protecting a Server-Rendered Page (`pages/dashboard.js`)
If you want to prevent unauthorized users from even loading the HTML of `/dashboard`, intercept the request in `getServerSideProps`:

```javascript
// pages/dashboard.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export default function Dashboard({ user }) {
  return <h1>Secure Admin Dashboard for {user.name}</h1>;
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If anonymous user, redirect immediately to login page
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: { user: session.user }
  };
}
```

---

## 7. NextAuth v4 (Pages Router) vs. Auth.js v5 (App Router)

As you build professional projects, you will encounter both Next.js Pages Router and the newer Next.js App Router. Here is how NextAuth adapts between both:

| Feature | NextAuth.js v4 (Pages Router) | Auth.js v5 / NextAuth v5 (App Router) |
|---|---|---|
| **Route File Path** | `pages/api/auth/[...nextauth].js` | `app/api/auth/[...nextauth]/route.ts` |
| **Server-Side Session Check** | `await getServerSession(req, res, authOptions)` | `await auth()` (universal server helper) |
| **Route Protection Guard** | `getServerSideProps` redirect | Next.js Edge `middleware.ts` / Server Actions |
| **Session Cookie Name** | `next-auth.session-token` | `authjs.session-token` (or `__Secure-authjs...`) |

---

## 8. Common Mistakes & Quick Fixes

| Mistake | Why It Happens | How to Fix It |
|---|---|---|
| **`Error: useSession must be wrapped in <SessionProvider />`** | Calling `useSession()` without wrapping root app. | Wrap `<Component {...pageProps} />` inside `<SessionProvider>` in `pages/_app.js`. |
| **`id` is undefined in `session.user`** | NextAuth strips ID from default session for security. | Configure `jwt` and `session` callbacks in `authOptions` to pass `user.id`. |
| **Login button silently redirects without logging in** | In Credentials `authorize()`, returning an object without an `.id` property. | Always ensure `authorize()` returns an object containing `{ id: String(user.id), ... }`. |
| **Using `getSession({ req })` inside API routes** | Client-oriented `getSession` makes unnecessary loopback network requests when used on servers. | Use `await getServerSession(req, res, authOptions)` in all backend code. |
| **OAuth Error: `redirect_uri_mismatch` in GitHub console** | The callback URL in GitHub developer console doesn't match NextAuth's pattern. | Set OAuth callback URL precisely to: `http://localhost:3000/api/auth/callback/github`. |
| **Storing JWT token in localStorage** | XSS attack can steal token from localStorage — any injected script reads it | Use httpOnly cookies (NextAuth default) — JS cannot access httpOnly cookies |
| **Forgetting to add production domain to GitHub OAuth app** | OAuth callback returns 404 or redirect_uri_mismatch error in production | Add all deployment domains (Vercel, custom domain) to GitHub OAuth App authorized callback URLs |
| **Using getStaticProps with getServerSession** | Build-time crash: getServerSession only works in runtime server context | Use getServerSideProps for authenticated pages, or check session client-side with useSession |

---

## 9. NextAuth v4 vs Auth.js v5 — What Changed?

NextAuth.js was rebranded to 'Auth.js' in version 5 and the API changed significantly to support Next.js App Router and React Server Components natively.

### Key Differences:
- **v4 Setup:** `import NextAuth from 'next-auth'` in `pages/api/auth/[...nextauth].js`
- **v5 Setup:** `import NextAuth from 'next-auth'` in an `auth.ts` config file, and `app/api/auth/[...nextauth]/route.ts` just exports handlers.
- **v4 Server Session:** `getServerSession(authOptions)` is used in `getServerSideProps` or API routes.
- **v5 Server Session:** A unified `auth()` helper can be used seamlessly in Server Components, Middleware, and API Routes.

> **Migration Note:** We use v4 in this lesson (Pages Router), but you should use v5 for new greenfield App Router projects.

### v5 `auth.ts` Example
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        // DB verify logic here
        return { id: "1", name: "Travis" }
      },
    }),
  ],
})
```

---

## 10. OAuth Callback URL Checklist

Configuring OAuth callback URLs incorrectly is the #1 deployment failure for authentication. Use this step-by-step checklist:

1. **Local dev:** Ensure callback URL `http://localhost:3000/api/auth/callback/github` is in your GitHub OAuth App settings.
2. **Staging:** Add `https://your-staging-domain.com/api/auth/callback/github`.
3. **Production:** Add `https://your-production-domain.com/api/auth/callback/github`.
4. **Vercel Preview Deployments:** Use the `NEXTAUTH_URL_INTERNAL` environment variable to dynamically map preview URLs.
5. **Security Rule:** Never use the same OAuth App credentials for dev and production! Create separate OAuth apps for each environment.

> **Testing Without GitHub OAuth:** Start with the Credentials provider — it requires ZERO external setup and allows you to test your session logic locally before wrestling with OAuth developer consoles!
