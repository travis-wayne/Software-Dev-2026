# Exercise: Building a Portfolio Site with Next.js

In this exercise, you will build a mini portfolio site to practice Next.js file-system routing, SSG, SSR, and API routes. Work through the tasks in order — each one builds on the last.

---

## Prerequisites

- Node.js 18+ installed.
- A basic understanding of React components and props.
- Refer to `notes/student_notes.md` for all code patterns.

---

## Task 1 — Scaffold the Project

1. Open your terminal and run:
   ```bash
   npx create-next-app@latest my-portfolio --no-app --no-tailwind --no-eslint
   cd my-portfolio
   npm run dev
   ```
   > The `--no-app` flag uses the Pages Router, which this lesson covers.

2. Open `http://localhost:3000`. You should see the default Next.js welcome page.

3. Open `pages/index.js`. Delete all the default content. Replace it with:
   ```jsx
   export default function Home() {
     return (
       <main>
         <h1>Hi, I'm [Your Name] — Software Developer</h1>
         <p>Welcome to my portfolio.</p>
       </main>
     );
   }
   ```

4. Save and check the browser. **Notice: no page refresh needed** — Next.js Fast Refresh updates instantly.

**✅ Checkpoint:** `http://localhost:3000` displays your name.

---

## Task 2 — File-System Routing

Create two new pages using Next.js's file-system router:

1. Create `pages/about.js`:
   ```jsx
   export default function About() {
     return (
       <main>
         <h1>About Me</h1>
         <p>I am a software developer passionate about building web applications.</p>
       </main>
     );
   }
   ```

2. Navigate to `http://localhost:3000/about` in your browser. It works — **no configuration needed.**

3. Create a navigation bar in `pages/_app.js` (the global layout):
   ```jsx
   import Link from 'next/link';

   function MyApp({ Component, pageProps }) {
     return (
       <>
         <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
           <Link href="/">Home</Link>
           <Link href="/about">About</Link>
           <Link href="/projects">Projects</Link>
         </nav>
         <Component {...pageProps} />
       </>
     );
   }

   export default MyApp;
   ```

4. Click between the nav links. **Notice:** the navigation is instant — Next.js pre-fetches pages in the background.

**✅ Checkpoint:** All three nav links work, and navigation feels instant.

---

## Task 3 — Static Site Generation with `getStaticProps`

Create a projects listing page that fetches data at build time.

1. Create the file `pages/projects/index.js`.

2. Add a `getStaticProps` function that fetches a list of projects from a public API:
   ```jsx
   // We'll use JSONPlaceholder as a stand-in for a real project API
   export async function getStaticProps() {
     const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=6');
     const todos = await res.json();

     // Map the todos to look like portfolio projects
     const projects = todos.map(todo => ({
       id: todo.id,
       title: todo.title,
       completed: todo.completed,
     }));

     return { props: { projects } };
   }

   export default function ProjectsPage({ projects }) {
     return (
       <main style={{ padding: '2rem' }}>
         <h1>My Projects</h1>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
           {projects.map(project => (
             <a key={project.id} href={`/projects/${project.id}`} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: 8, textDecoration: 'none', color: 'inherit' }}>
               <h3 style={{ margin: 0 }}>{project.title}</h3>
               <p style={{ color: project.completed ? 'green' : 'orange' }}>
                 {project.completed ? '✅ Completed' : '🔧 In Progress'}
               </p>
             </a>
           ))}
         </div>
       </main>
     );
   }
   ```

3. Navigate to `http://localhost:3000/projects`. Your projects list should appear.

4. Open DevTools → Network tab → refresh the page. Notice: Next.js does **not** make a fetch request in the browser — the data was already embedded in the HTML at build time.

**✅ Checkpoint:** `http://localhost:3000/projects` shows 6 project cards with data fetched at build time.

---

## Task 4 — Dynamic Routes with `getStaticPaths`

Create individual project detail pages.

1. Create the file `pages/projects/[id].js`.

2. Add `getStaticPaths` to tell Next.js which IDs to pre-build, and `getStaticProps` to fetch each project's data:
   ```jsx
   export async function getStaticPaths() {
     const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=6');
     const todos = await res.json();

     const paths = todos.map(todo => ({
       params: { id: String(todo.id) },
     }));

     return { paths, fallback: false };
   }

   export async function getStaticProps({ params }) {
     const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${params.id}`);
     const project = await res.json();
     return { props: { project } };
   }

   export default function ProjectDetailPage({ project }) {
     return (
       <main style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
         <a href="/projects">← Back to Projects</a>
         <h1>{project.title}</h1>
         <p><strong>Status:</strong> {project.completed ? '✅ Completed' : '🔧 In Progress'}</p>
         <p><strong>Project ID:</strong> {project.id}</p>
       </main>
     );
   }
   ```

3. From the Projects page, click on any project card. You should navigate to `/projects/1`, `/projects/2`, etc.

4. Try navigating to `/projects/999`. Since it's not in `getStaticPaths` and `fallback` is `false`, you should get a 404 page.

**✅ Checkpoint:** Each project card links to its own detail page, all pre-built at compile time.

---

## Task 5 — Server-Side Rendering with `getServerSideProps`

Create a "Contact" page that is rendered server-side and shows request-specific information.

1. Create `pages/contact.js`:
   ```jsx
   export async function getServerSideProps(context) {
     // context.req is the raw HTTP request
     const userAgent = context.req.headers['user-agent'] || 'Unknown';
     const timestamp = new Date().toUTCString();

     return {
       props: {
         userAgent,
         timestamp,
       },
     };
   }

   export default function ContactPage({ userAgent, timestamp }) {
     return (
       <main style={{ padding: '2rem' }}>
         <h1>Contact Me</h1>
         <p>Reach me at: <a href="mailto:hello@example.com">hello@example.com</a></p>
         <hr />
         <small style={{ color: '#aaa' }}>
           <p>This page was server-rendered at: <strong>{timestamp}</strong></p>
           <p>Your browser: {userAgent}</p>
         </small>
       </main>
     );
   }
   ```

2. Add `/contact` to your `_app.js` nav.

3. Navigate to `http://localhost:3000/contact`. Refresh the page several times. Notice that the **timestamp changes on every refresh** — this page is rendered fresh on the server for each request.

4. View Page Source (Ctrl+U). Confirm the timestamp is already in the HTML — it was not fetched by JavaScript in the browser.

**✅ Checkpoint:** The contact page shows a timestamp that updates on every refresh.

---

## Task 6 — API Route

Create a simple API endpoint inside your Next.js project.

1. Create `pages/api/contact.js`:
   ```javascript
   export default function handler(req, res) {
     if (req.method === 'POST') {
       const { name, message } = req.body;

       if (!name || !message) {
         return res.status(400).json({ error: 'Name and message are required' });
       }

       // In a real app, you'd send an email or save to a database here
       console.log(`📧 New contact from ${name}: ${message}`);
       return res.status(200).json({ success: true, message: `Thanks, ${name}! We'll be in touch.` });
     }

     res.setHeader('Allow', ['POST']);
     res.status(405).json({ error: `Method ${req.method} not allowed` });
   }
   ```

2. Update `pages/contact.js` to add a contact form that calls your new API route:
   - Add a `useState` for name, message, and status.
   - On form submit, `fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, message }) })`.
   - Display the success or error message from the response.

3. Test the form. Check your terminal — you should see the `📧 New contact from...` log.

**✅ Checkpoint:** The contact form submits to `/api/contact` and displays a success message.

---

## Bonus Challenge

Add the Next.js `<Image>` component to your Home page:

```jsx
import Image from 'next/image';

// Add a profile picture to your Home page
<Image
  src="https://via.placeholder.com/200"
  alt="Profile photo"
  width={200}
  height={200}
/>
```

Then add `via.placeholder.com` to the `images.domains` array in `next.config.js`. Confirm the image loads without errors.

Finally, deploy your portfolio to Vercel:
```bash
npm install -g vercel
vercel
```

Vercel is built by the team that created Next.js — deployment is one command.
