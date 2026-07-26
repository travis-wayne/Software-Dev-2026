# Lesson 38 — Advanced Frontend: Next.js (SSR, SSG & Routing)
# 🗂️ Tutor Notes (90-Minute Session)

> **Pages Router vs App Router:** This lesson teaches the **Pages Router** (`pages/` directory, `getServerSideProps`, `getStaticProps`). This is still widely used in professional codebases and is the right starting point for understanding Next.js rendering concepts. The App Router (Next.js 13+) builds on the same mental model, so once the student masters this, transitioning is straightforward.

---

## Session Objectives

By the end of this session the student will be able to:

1. Explain the difference between CSR, SSR, and SSG — and choose the right one for a given page.
2. Set up a Next.js project and navigate the `pages/` directory structure.
3. Implement `getStaticProps` + `getStaticPaths` for statically pre-rendered dynamic routes.
4. Implement `getServerSideProps` for server-rendered, per-request data.
5. Create a Next.js API Route as a lightweight serverless endpoint.
6. Use the `<Image>` component for automatic image optimization.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Demo Running | Have `examples/nextjs-blog-demo` installed (`npm install`) and `npm run dev` ready. |
| View Source Ready | Know how to View Page Source in the browser (Ctrl+U / Cmd+U). You'll use this to show SSR/SSG vs CSR output. |
| Network Tab | Have browser DevTools open on the Network tab to show the difference in response payloads. |
| CSR Reference | Have any previous React project (e.g., Lesson 37's Zustand demo) running at the same time to compare. |

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — The Problem: Why Next.js Exists (15 min)

**Goal**: Make the student feel the real pain of CSR before presenting the solution.

1. **Open a standard React SPA (5 min):**
   - Run the Lesson 37 Zustand demo or any previous React project.
   - Open View Page Source (Ctrl+U). Ask: *"What HTML does the browser receive?"*
   - Show the student: they'll see almost nothing — just `<div id="root"></div>`. The content is blank until JavaScript runs.

2. **The Two Real Problems with CSR (5 min):**

   | Problem | Why It Matters |
   |---------|----------------|
   | **SEO** | Search engine crawlers see the blank `<div id="root"></div>`. They can't index your content. Your pages don't appear in Google. |
   | **Initial Load Speed** | Users see nothing until the full JS bundle downloads, parses, and runs. On slow connections, this is 3–5 seconds of white screen. |

3. **Introduce Next.js as the Solution (5 min):**
   - Open the `nextjs-blog-demo` in View Page Source. Show them the **full HTML content** is already in the source — rendered on the server before JavaScript even runs.
   - Explain: *"This is what Google sees. This is what a slow-network user sees after 200ms. Content, not a blank page."*

---

### Phase 2 — File-System Routing (10 min)

**Goal**: Show how Next.js eliminates React Router configuration entirely.

1. **The Mapping (5 min):**

   Draw this on a whiteboard or in a shared doc:

   ```
   pages/index.js          →  /
   pages/about.js          →  /about
   pages/posts/index.js    →  /posts
   pages/posts/[id].js     →  /posts/1, /posts/2, /posts/42...
   pages/api/posts.js      →  /api/posts  (API endpoint, not a page)
   ```

   Ask: *"In React Router, how would you set up /posts/[id]? You'd need a Router, a Route, a useParams hook... In Next.js, you just create the file."*

2. **Live Demo (5 min):**
   - Open the running demo. Navigate to `/about`, then `/posts`, then `/posts/1`.
   - Create a new empty file `pages/test.js` live during the session and navigate to `/test` instantly. No configuration needed.

---

### Phase 3 — Data Fetching: SSG with `getStaticProps` (20 min)

**Goal**: Build the mental model for pre-rendering at build time.

1. **Explain the Concept (5 min):**
   - *"When you run `npm run build`, Next.js runs `getStaticProps` on the server. It fetches the data, renders the page to HTML, and saves the result as a static file. When a user requests that page, the server just sends the pre-built HTML file instantly — no database query needed."*
   - **Best for:** Blog posts, product listings, documentation, portfolio pages. Content that doesn't change per user.

2. **Open `pages/posts/index.js` in the demo (10 min):**
   ```javascript
   export async function getStaticProps() {
     // This runs at BUILD TIME on the server, never in the browser.
     // console.log here will appear in your TERMINAL, not the browser console.
     const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
     const posts = await res.json();
     return { props: { posts } };
   }
   ```
   - Point out: `getStaticProps` only ever runs on the **server at build time**. It is never sent to the client. The student can safely access databases, secrets, and file systems here.
   - Walk through the return value: `{ props: { posts } }` — Next.js passes these props into the page component automatically.

3. **Dynamic Routes: `getStaticPaths` (5 min):**
   - Open `pages/posts/[id].js`.
   - Explain: *"For a dynamic route like `/posts/[id]`, Next.js needs to know ahead of time which IDs exist so it can pre-build each one. That's `getStaticPaths`."*
   - Show the `paths` array: Next.js will call `getStaticProps` once for each path in the array and save an individual HTML file for each.
   - Show `fallback: false`: *"If someone requests `/posts/999` and it wasn't in paths, they get a 404. Set `fallback: 'blocking'` to generate it on-demand the first time."*

---

### Phase 4 — Data Fetching: SSR with `getServerSideProps` (15 min)

**Goal**: Show when you need fresh data on every request.

1. **Explain the Concept (5 min):**
   - *"Unlike `getStaticProps` (build time), `getServerSideProps` runs on the server on EVERY single request. It's slower than SSG but ensures data is always fresh."*
   - **Best for:** User dashboards, shopping carts, search results, any page with user-specific or rapidly changing content.

2. **Open `pages/profile.js` in the demo (10 min):**
   - Walk through how `getServerSideProps` receives `context` — including `context.req` (the full HTTP request), `context.query`, and `context.params`.
   - Show how you'd use `context.req.cookies` or a session token to determine which user's data to fetch.
   - Demonstrate: refresh the page and show in the Network tab that a server request is made each time (unlike SSG which would serve the same cached HTML).

   ```javascript
   export async function getServerSideProps(context) {
     // context.req — the HTTP request object (has headers, cookies, etc.)
     // This runs on EVERY request, never cached.
     const userId = 1; // In a real app: read from session/cookie
     const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
     const user = await res.json();
     return { props: { user } };
   }
   ```

---

### Phase 5 — API Routes & Image Component (15 min)

**Goal**: Round out the Next.js feature set.

1. **API Routes (8 min):**
   - Open `pages/api/posts.js`.
   - Explain: *"This is a serverless function. When the client calls `/api/posts`, this code runs on the server. You can put database queries, secrets, and any Node.js logic here — it's never exposed to the browser."*
   - Show how the demo's frontend fetches from its own `/api/posts` endpoint instead of directly calling JSONPlaceholder. Explain this is how you'd hide a database URL from the client.

2. **Image Optimization (7 min):**
   - Open any page that uses the `<Image>` component.
   - Compare `<img src="...">` vs `<Image src="..." width={} height={} alt={}>`.
   - Explain what Next.js does automatically:
     - Serves WebP format (30–40% smaller than PNG/JPG) to browsers that support it.
     - Lazy-loads images below the fold.
     - Generates multiple sizes (`srcSet`) for different screen widths.
   - *"Everything `<img>` does, `<Image>` does better — automatically."*

---

### Phase 6 — SSR vs SSG Decision Framework & Wrap-Up (15 min)

**Goal**: Leave the student with a clear mental model for choosing the right strategy.

Present the decision tree:

```
Does the page content change per user?  (e.g., dashboard, cart, profile)
  → YES → getServerSideProps (SSR)

Does the page content change frequently but is the same for all users?
  (e.g., news feed, stock prices)
  → Consider SSR with short revalidation, or client-side fetch after SSG load

Does the page content rarely change and is the same for all users?
  (e.g., blog posts, docs, product listings, portfolio)
  → getStaticProps (SSG)

Is there NO data fetching needed?  (e.g., /about, /contact)
  → Just export a regular component — Next.js auto-generates static HTML
```

Assign `exercises/nextjs_routing_practice.md`.

---

## Common Issues to Watch Out For

| Problem | Cause | Fix |
|---------|-------|-----|
| `getServerSideProps` must be exported from a page | Defining it inside a component instead of at the module level | Move it to the top level of the file |
| `window is not defined` error | Accessing browser APIs inside `getServerSideProps` or `getStaticProps` (they run server-side) | Move browser-only code into `useEffect` or guard with `typeof window !== 'undefined'` |
| Dynamic import / hydration mismatch | Server-rendered HTML differs from what React renders on the client | Ensure initial state is deterministic; avoid `Math.random()` or `Date.now()` in render |
| Images not loading with `<Image>` | External domain not configured in `next.config.js` | Add the domain to `images.domains` in `next.config.js` |
| `getStaticPaths` returning wrong shape | Missing `params` key in paths array | Ensure each path is `{ params: { id: '1' } }`, not `{ id: '1' }` |

---

## Homework / Take-Home

Assign `exercises/nextjs_routing_practice.md`.

Students will scaffold a Next.js portfolio site with SSG for the projects listing, dynamic routes for individual project pages, and a profile page using SSR.
