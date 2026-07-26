import Link from 'next/link';
import { useRouter } from 'next/router';

// ── Dynamic Post Page (/posts/[id]) — SSG + DYNAMIC ROUTES ────────────────
//
// This page demonstrates TWO key Next.js patterns working together:
//
// 1. getStaticPaths — tells Next.js which [id] values exist.
//    At build time, Next.js will call getStaticProps once for EACH path.
//    The result: individual pre-built HTML files for /posts/1, /posts/2, etc.
//
// 2. getStaticProps — fetches the data for each specific [id].

// Step 1: Tell Next.js which paths to pre-render at build time.
export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
  const posts = await res.json();

  // Build an array of path objects. Each becomes its own pre-rendered HTML file.
  const paths = posts.map(post => ({
    params: { id: String(post.id) }, // ⚠️ params must always be strings
  }));

  return {
    paths,
    // fallback: false → any path NOT in `paths` above returns a 404.
    // Try visiting /posts/999 — you'll get a 404 page.
    // Change to 'blocking' to generate unknown pages on-demand the first time.
    fallback: false,
  };
}

// Step 2: Fetch the data for a specific path. Called once per path at build time.
export async function getStaticProps({ params }) {
  // params.id comes from the [id] in the filename and the paths array above.
  const [postRes, commentsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`),
    fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}/comments?_limit=3`),
  ]);

  const post = await postRes.json();
  const comments = await commentsRes.json();

  return {
    props: { post, comments },
  };
}

// Step 3: The page component receives the props generated above.
export default function PostDetailPage({ post, comments }) {
  const router = useRouter();

  return (
    <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <Link href="/posts" style={{ color: '#3498db', textDecoration: 'none' }}>← Back to all posts</Link>

      <div style={{ margin: '1.5rem 0 0.5rem', background: '#e3f2fd', padding: '0.6rem 1rem', borderRadius: 6, fontSize: '0.88rem' }}>
        <strong>🔍 Rendering: Static Site Generation — Dynamic Route</strong><br />
        This page (<code>/posts/{post.id}</code>) was pre-built at compile time using
        <code> getStaticPaths</code> + <code>getStaticProps</code>.
      </div>

      <article>
        <h1 style={{ textTransform: 'capitalize', marginTop: '1.5rem' }}>{post.title}</h1>
        <p style={{ lineHeight: 1.8, color: '#444' }}>{post.body}</p>
      </article>

      <section style={{ marginTop: '2.5rem' }}>
        <h2>Comments</h2>
        {comments.map(comment => (
          <div key={comment.id} style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 6, padding: '1rem', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '0.9rem' }}>{comment.name}</strong>
            <span style={{ fontSize: '0.82rem', color: '#999', marginLeft: '0.5rem' }}>— {comment.email}</span>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#555' }}>{comment.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
