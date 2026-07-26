# Lesson 40 — Practice Exercises: Next.js Authentication (NextAuth.js)

These scaffolded exercises will take you step-by-step through configuring authentication providers, customizing session tokens, building dynamic UI states, and securing serverless database mutations.

---

## Exercise 1: Configuring Catch-All Routing Boilerplate

### Objective
Create the foundational NextAuth configuration handler inside the Next.js Pages Router file system.

### Problem Statement
You are initializing a new Next.js portfolio application. Set up the dynamic catch-all route file `pages/api/auth/[...nextauth].js`. Define a basic NextAuth instance with an empty `providers` array and specify `jwt` as the session strategy.

### Scaffold Starter Code
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';

// TODO: Export authOptions configuration object
export const authOptions = {
  // TODO: Add empty providers array
  // TODO: Configure session strategy as 'jwt'
  // TODO: Add secret from environment variables
};

// TODO: Export default NextAuth handler
```

### Complete Solution
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';

export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'development_fallback_secret_do_not_use_in_prod'
};

export default NextAuth(authOptions);
```

---

## Exercise 2: Credentials Provider with Bcrypt & SQL

### Objective
Implement email and password verification backed by a database query and bcrypt hashing.

### Problem Statement
Add `CredentialsProvider` from `next-auth/providers/credentials` to your `authOptions`. In the `authorize` callback, query the `users` table for matching email, compare password hashes using `bcrypt.compare()`, and return the authenticated user object. Remember that NextAuth requires an `id` string!

### Complete Solution
```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "student@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const users = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email.toLowerCase()]);
        const user = users[0];

        if (!user || !user.password_hash) {
          throw new Error('No user registered with this email.');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error('Invalid credentials.');
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || 'user'
        };
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
```

---

## Exercise 3: Adding GitHub OAuth Social Login

### Objective
Integrate GitHub OAuth social login alongside the Credentials provider without writing manual handshake code.

### Problem Statement
Import `GitHubProvider` from `next-auth/providers/github` and append it to the `providers` array. Configure it to read `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from environment variables.

### Complete Solution
```javascript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

export const authOptions = {
  providers: [
    CredentialsProvider({ /* ... from Exercise 2 ... */ }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'mock_github_id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'mock_github_secret'
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);
```

---

## Exercise 4: Customizing Callbacks for Role-Based Access Control (RBAC)

### Objective
Inject custom database attributes (`id` and `role`) into the JWT token and expose them onto the React browser session.

### Problem Statement
By default, calling `useSession()` in React only returns `session.user.name` and `session.user.email`. Add the `callbacks` configuration object to `authOptions` with both `jwt` and `session` functions so that `session.user.id` and `session.user.role` are populated.

### Complete Solution
```javascript
export const authOptions = {
  providers: [ /* ... */ ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // 1. Store database user attributes into the JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    // 2. Relay token properties onto the browser session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  }
};
```

---

## Exercise 5: Building a Reactive Navigation Bar (`useSession`)

### Objective
Use the `<SessionProvider>` wrapper and `useSession()` hook to display personalized UI navigation elements.

### Problem Statement
1. In `pages/_app.js`, wrap `<Component {...pageProps} />` with `<SessionProvider session={pageProps.session}>`.
2. Create a `<Navbar />` component that checks `status` and `session`. If logged in, display the user's name, role badge, and a Sign Out button. If logged out, display a Sign In button.

### Complete Solution
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

```javascript
// components/Navbar.jsx
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="glass-card flex justify-between items-center p-4 mb-6">
      <div className="font-bold text-lg text-emerald-400">Portfolio Dev</div>
      
      <div>
        {status === 'loading' ? (
          <span className="text-slate-400 text-sm">Checking session...</span>
        ) : session ? (
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Logged in as <strong className="text-white">{session.user.name}</strong>
            </span>
            <span className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded-full font-mono">
              {session.user.role}
            </span>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-rose text-sm py-1 px-3">
              Sign Out
            </button>
          </div>
        ) : (
          <button onClick={() => signIn()} className="btn btn-emerald text-sm py-1 px-4">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
```

---

## Exercise 6: Securing a Server-Side Page (`getServerSideProps`)

### Objective
Enforce strict server-side page guards so unauthenticated users cannot access administrative dashboards.

### Problem Statement
In `pages/dashboard.js`, implement `getServerSideProps` using `getServerSession(req, res, authOptions)`. If the session is missing, return a server redirect to `/login`. If present, pass the user object as a page prop.

### Complete Solution
```javascript
// pages/dashboard.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import Navbar from '../components/Navbar';

export default function DashboardPage({ user }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
      <Navbar />
      <main className="max-w-4xl mx-auto glass-card p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome to your secure management console, {user.name}!</p>
        <div className="mt-4 p-4 bg-slate-950/60 rounded border border-slate-800 font-mono text-sm">
          <p>User ID: <span className="text-emerald-400">{user.id}</span></p>
          <p>Email: <span className="text-emerald-400">{user.email}</span></p>
          <p>Permission Level: <span className="text-violet-400">{user.role}</span></p>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
      user: session.user
    }
  };
}
```

---

## Exercise 7: Bulletproofing Mutation API Routes (`POST /api/projects`)

### Objective
Protect serverless database endpoints from unauthorized execution using backend session guards.

### Problem Statement
In `pages/api/projects/index.js`, write an API route handler that handles `GET` (public read) and `POST` (protected create). For `POST`, use `await getServerSession(req, res, authOptions)` to verify identity. If anonymous, return `401 Unauthorized`. If authenticated, insert the project into the database attaching the logged-in user's email.

### Complete Solution
```javascript
// pages/api/projects/index.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import db from '../../../lib/db';

export default async function handler(req, res) {
  // ─────────────────────────────────────────────────────────────
  // GET: Public Read (No Auth Required)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const projects = await db.query('SELECT * FROM projects ORDER BY id DESC');
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // POST: Protected Creation (Session Guard Required!)
  // ─────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: You must be logged in to publish new projects.'
      });
    }

    const { title, description, tech_stack } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    try {
      await db.execute(
        'INSERT INTO projects (title, description, tech_stack, created_by, created_at) VALUES (?, ?, ?, ?, ?)',
        [title, description, tech_stack || 'React, Next.js', session.user.email, new Date().toISOString()]
      );

      return res.status(201).json({
        success: true,
        message: `Project created successfully by ${session.user.email}`
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
```
