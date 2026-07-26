# Lesson 38 — Advanced Frontend: Next.js (SSR, SSG & Routing)
# Student Reference Notes

---

## 1. The Problem with Client-Side Rendering (CSR)

Every React app you have built so far uses **Client-Side Rendering (CSR)**. When a user requests your page, the server sends back a nearly empty HTML file:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

The browser then downloads `bundle.js`, parses it, and finally runs React, which inserts your content into `<div id="root">`. Only then does the user see anything.

This creates two significant problems:

### Problem 1: Poor SEO

Search engine bots crawl your HTML.
- **Before (CSR):** When bots visit your CSR React app, they see an empty `<div id="root"></div>`. There is no content to index. Your page will not rank in Google search results.
- **After (SSR/SSG):** Bots see the full HTML content, properly structured, ready to be indexed.

### Problem 2: Slow Initial Load (Time to First Contentful Paint)

A typical React app ships a 400–600KB JavaScript bundle. On a 4G connection (common in Lagos), this takes 2–4 seconds to download. On 3G (common in smaller cities), it can take 8–15 seconds. The user sees nothing during this time. Users leave.

### The Solution: Next.js

Next.js is a React framework that renders your components on the **server** before sending them to the browser. The user receives a complete HTML page — with all content already visible — in the first response. React then "hydrates" it on the client to make it interactive.

---

## 2. The Three Rendering Strategies

### Client-Side Rendering (CSR)
- HTML is empty. JS runs in the browser to generate content.
- **When to use:** Dashboards behind a login, interactive tools (where SEO doesn't matter and content is highly dynamic per user).

### Static Site Generation (SSG) ✅ Default in Next.js
- HTML is generated **at build time** (`npm run build`).
- The pre-built HTML is served from a CDN — blazing fast.
- **When to use:** Blog posts, documentation, portfolios, product listings. Any content that is the same for all users and doesn't change every few minutes.

### Server-Side Rendering (SSR)
- HTML is generated **on the server on every request**.
- Always fresh, but slower than SSG (a server must do work for every user).
- **When to use:** User profile pages, shopping cart, search results, anything personalized per user.

| Strategy | When HTML is built | Data freshness | Performance |
|----------|--------------------|----------------|-------------|
| **CSR** | In the browser | Always fresh | Slowest (TTFP) |
| **SSR** | On each request | Always fresh | Medium |
| **SSG** | At build time | As fresh as last build | Fastest |

---

## 3. Setting Up a Next.js Project

```bash
npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
npm run dev
```

### The `pages/` Directory

Next.js uses the **file system as the router**. Every file inside `pages/` automatically becomes a route:

```
pages/index.js           →   http://localhost:3000/
pages/about.js           →   http://localhost:3000/about
pages/blog/index.js      →   http://localhost:3000/blog
pages/blog/[slug].js     →   http://localhost:3000/blog/any-slug-here
pages/api/users.js       →   http://localhost:3000/api/users  (API route, not a page)
```

No React Router. No `<Route>` components. No configuration. Just create the file.

---

## 3.5 Pages Router vs App Router: Which Should I Use?

Next.js 13 introduced a new "App Router" (the `app/` directory) with React Server Components.
This lesson teaches the Pages Router (`pages/` directory) because:
1. Most production codebases you'll work in still use Pages Router
2. The core concepts (SSR, SSG, API Routes) work identically in both
3. Pages Router is simpler to learn first

| Feature | Pages Router (this lesson) | App Router (Next.js 13+) |
|---------|--------------------------|------------------------|
| Directory | `pages/` | `app/` |
| Data fetching | `getStaticProps`, `getServerSideProps` | `async` component functions, `fetch()` with cache options |
| Loading states | Manual (useState) | Built-in `loading.js` files |
| Server Components | No | Yes — components are server-rendered by default |
| Learning curve | Gentler | Steeper, but more powerful |

**When to use App Router:** Starting a brand new project in 2025+.
**When to use Pages Router:** Working on an existing codebase or learning the fundamentals.

---

## 4. Static Site Generation with `getStaticProps`

`getStaticProps` is a special async function you export from a page file. Next.js calls it **once at build time on the server** to fetch data and pass it as props to your page component.

```javascript
// pages/posts/index.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// This runs at BUILD TIME on the server — NEVER in the browser.
// You can safely put database credentials, secrets, and file-system access here.
export async function getStaticProps() {
  // If DATABASE_URL is not configured, the example falls back to sample data so you can run the demo without a database setup.
  let posts = [];
  if (process.env.DATABASE_URL) {
    const { rows } = await pool.query(
      'SELECT id, title, excerpt, created_at FROM posts ORDER BY created_at DESC'
    );
    posts = rows;
  } else {
    // Fallback data
    posts = [{ id: 1, title: 'Demo Post', excerpt: 'Demo excerpt' }];
  }

  return {
    props: {
      posts, // These props are passed to the PostsPage component below
    },
    // revalidate: 3600 tells Next.js to re-generate this page in the background
    // at most once every hour (3600 seconds) if a new request comes in.
    revalidate: 3600,
  };
}

// The component receives `posts` as a prop — automatically injected by Next.js
export default function PostsPage({ posts }) {
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={`/posts/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### The "Brochure Analogy" for ISR
- **SSG:** Printing 1000 brochures at the start of the year. Fast to hand out, but the phone number on page 3 might change.
- **ISR (Incremental Static Regeneration):** Same, but you auto-reprint a fresh batch every month. Customers always get a pre-printed copy (fast), and it's never more than a month out of date. This is what `revalidate: 3600` (1 hour) does.

### Key Rules for `getStaticProps`

- ✅ **Runs on the server at build time.** Never in the browser.
- ✅ **Code is never sent to the client.** Safe for secrets and DB queries.
- ✅ **Must return `{ props: { ... } }`.** This is how Next.js passes data to the component.
- ❌ **Cannot access request-specific data** (cookies, headers, query strings). Use `getServerSideProps` for that.

---

## 5. Dynamic Routes with `getStaticPaths`

For dynamic routes like `/posts/[id]`, Next.js needs to know which IDs to pre-build at build time. You tell it using `getStaticPaths`.

```javascript
// pages/posts/[id].js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Step 1: Tell Next.js which paths to pre-render
export async function getStaticPaths() {
  let posts = [];
  if (process.env.DATABASE_URL) {
    const { rows } = await pool.query('SELECT id FROM posts LIMIT 10');
    posts = rows;
  } else {
    posts = [{ id: 1 }];
  }

  // Build an array of { params: { id: '1' } }, { params: { id: '2' } }, etc.
  const paths = posts.map(post => ({
    params: { id: String(post.id) }, // params must be strings
  }));

  return {
    paths,
    fallback: false, // 404 for any path not in this list
    // fallback: 'blocking' — generate on-demand the first time, then cache it
  };
}

// Step 2: Fetch data for each individual path
export async function getStaticProps({ params }) {
  let post = null;
  if (process.env.DATABASE_URL) {
    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [params.id]);
    post = rows[0];
  } else {
    post = { id: params.id, title: 'Demo Post', body: 'Demo body' };
  }

  return {
    props: { post },
  };
}

// Step 3: The page component
export default function PostPage({ post }) {
  if (!post) return <p>Post not found</p>;
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}
```

### How `fallback` Works

| Value | Behaviour |
|-------|-----------|
| `false` | Any path not in `paths` returns 404. |
| `'blocking'` | Unrecognised paths are SSR'd on first request, then cached as static. Best for large datasets you can't fully pre-build. |
| `true` | Immediately shows a loading state, then fetches data client-side. Component must handle the loading case. |

---

## 6. Server-Side Rendering with `getServerSideProps`

`getServerSideProps` runs on the server **on every request**. It has access to the full HTTP request (headers, cookies, query string), making it ideal for user-specific content.

```javascript
// pages/profile.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function getServerSideProps(context) {
  // context gives you access to the raw HTTP request
  const { req, params, query } = context;

  // In a real app, you'd read a session cookie or JWT from req.headers.cookie
  // to determine which user is logged in.
  const userId = 1; // Hardcoded for demo purposes

  let user = null;
  if (process.env.DATABASE_URL) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    user = rows[0];
  } else {
    user = { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Corp' };
  }

  if (!user) {
    // Return a redirect if the user is not found/authenticated
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}

export default function ProfilePage({ user }) {
  return (
    <main>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Company:</strong> {user.company}</p>
    </main>
  );
}
```

### `getServerSideProps` vs `getStaticProps`

| | `getStaticProps` | `getServerSideProps` |
|--|-----------------|---------------------|
| **Runs** | Once at build time | On every request |
| **Access to `req`/`res`** | ❌ No | ✅ Yes |
| **Access to cookies/sessions** | ❌ No | ✅ Yes |
| **Speed** | ⚡ Fastest (pre-built) | 🐢 Slower (per request) |
| **Use when** | Content same for all users | Content specific to the user |

---

## 7. Next.js API Routes

You can create **backend API endpoints** directly inside your Next.js project — no separate Express server needed.

```javascript
// pages/api/posts.js
// This is a serverless function. URL: GET /api/posts
// It runs on the server — never in the browser.

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // You could query a database here
    return res.status(200).json([{ id: 1, title: 'Demo Post' }]);
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET']);
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
```

API routes are great for:
- **Hiding secrets**: Your `DATABASE_URL` stays on the server.
- **Proxying external APIs**: Call a third-party service with a secret key without exposing it to the browser.
- **Form submissions**: Process contact forms, file uploads, etc.

---

## 8. Client-Side Navigation with `<Link>`

Always use Next.js's `<Link>` component for internal navigation. It prefetches pages in the background when they appear in the viewport — making navigation feel instant.

```jsx
import Link from 'next/link';

function Navbar() {
  return (
    <nav>
      {/* ✅ Use Link for internal navigation */}
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/posts">Blog</Link>

      {/* ✅ Use <a> for external links */}
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
        Next.js Docs
      </a>
    </nav>
  );
}
```

For programmatic navigation (e.g., after a form submission), use `useRouter`:

```javascript
import { useRouter } from 'next/router';

function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    // ... perform login logic
    router.push('/dashboard'); // Redirect after login
  };
}
```

---

## 9. Google Fonts with `next/font`

Never add Google Fonts via a `<link>` tag in Next.js — it causes a layout shift and a slow network request.
Instead, use `next/font/google`:

```javascript
// pages/_app.js
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
```

Then in your CSS: `font-family: var(--font-inter);`

**Why this is better:** The font is downloaded at build time and served from the same domain as your app. Zero layout shift. Zero external network request.

---

## 10. Image Optimization with `<Image>`

Replace every `<img>` tag with Next.js's `<Image>` component for automatic optimization:

```jsx
import Image from 'next/image';

// ❌ Old way — no optimization
<img src="/my-photo.jpg" alt="My Photo" />

// ✅ Next.js way — automatic optimization
<Image
  src="/my-photo.jpg"
  alt="My Photo"
  width={800}       // Required: intrinsic width in pixels
  height={600}      // Required: intrinsic height in pixels
  priority          // Add for above-the-fold images (disables lazy loading)
/>
```

What `<Image>` does automatically:
- **Converts to WebP** — 30–40% smaller than PNG/JPG on modern browsers.
- **Lazy-loads** — Images below the fold only load when the user scrolls near them.
- **Serves responsive sizes** — Generates multiple sizes for different screen widths (`srcSet`).
- **Prevents layout shift** — Reserves space before the image loads (requires `width` + `height`).

For external images (e.g., a URL from an API), add the domain to `next.config.js`:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jsonplaceholder.typicode.com', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;
```

---

## 11. Common Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| Using `<a>` tags for internal links | Full page reload on every click | Use `<Link href="/about">` from `next/link` |
| Adding Google Fonts via `<link>` in `_document.js` | Layout shift, slow load | Use `next/font/google` |
| Running `npm run dev` to test SSG behaviour | SSG pages regenerate on every request in dev mode | Run `npm run build && npm start` to test true static behaviour |
| Forgetting external image domains in `next.config.js` | `<Image>` throws an error for external URLs | Add the domain to `images.remotePatterns` in config |
| Using `getServerSideProps` for static content | Every user request hits the server — slow | Use `getStaticProps` + `revalidate` (ISR) for mostly-static content |

---

## 12. Assignments

### Pre-session
- Review React components, props, and how `useEffect` + `fetch` works in a standard React app.
- Read the [Next.js Getting Started docs](https://nextjs.org/docs/getting-started) (Pages Router section).

### Post-session

Convert your personal portfolio React app into a Next.js application:

- [ ] Scaffold a new Next.js project: `npx create-next-app@latest portfolio`.
- [ ] Create these pages in `pages/`: `index.js` (Home), `about.js` (About Me).
- [ ] Create a `pages/projects/index.js` page that uses `getStaticProps` to fetch/load your project list.
- [ ] Create a `pages/projects/[slug].js` dynamic route with `getStaticPaths` + `getStaticProps` for individual project detail pages.
- [ ] Create a `pages/api/contact.js` API route that accepts a `POST` request (simulating a contact form).
- [ ] Replace all `<img>` tags with `<Image>` from `next/image`.
- [ ] Deploy your Next.js portfolio to Vercel (it's built for Next.js — one-click deploy).

---

## 13. Resources & Links

### Reading Materials
- [Next.js Docs: Getting Started (Pages Router)](https://nextjs.org/docs/getting-started)
- [Next.js Docs: Data Fetching](https://nextjs.org/docs/basic-features/data-fetching)
- [Vercel: What is Server-Side Rendering?](https://vercel.com/docs/concepts/rendering/server-side-rendering)

### Video Tutorials
- [Next.js Crash Course — Traversy Media](https://www.youtube.com/watch?v=mTz0GXj8IR0)
- [Next.js 13 Tutorial for Beginners — Codevolution](https://www.youtube.com/watch?v=A6da_JzJ_h8)

### Tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download)
- [Next.js](https://nextjs.org/)

---

## 14. Quick Reference

```javascript
// SSG — runs at build time
export async function getStaticProps(context) {
  return { props: { data }, revalidate: 60 }; // revalidate is optional (ISR)
}

// SSG Dynamic Routes — tells Next.js which paths to pre-build
export async function getStaticPaths() {
  return { paths: [{ params: { id: '1' } }], fallback: false };
}

// SSR — runs on every request
export async function getServerSideProps(context) {
  // context.req, context.res, context.query, context.params available
  return { props: { data } };
}

// API Route (pages/api/anything.js)
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from the API' });
}

// Navigation
import Link from 'next/link';
<Link href="/about">About</Link>

// Programmatic navigation
import { useRouter } from 'next/router';
const router = useRouter();
router.push('/dashboard');

// Image
import Image from 'next/image';
<Image src="/img.jpg" width={800} height={600} alt="Description" />
```
