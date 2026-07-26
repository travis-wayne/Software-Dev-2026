import Link from 'next/link';

// ── Blog Post Listing (/posts) — STATIC SITE GENERATION ───────────────────
// getStaticProps runs ONCE at build time on the server.
// The result is saved as a static HTML file and served from a CDN.
// No database or API is called when a user visits this page — the work was
// already done at build time.

export async function getStaticProps() {
  // This code runs on the server at BUILD TIME — never in the browser.
  // You can safely use: secrets, DB queries, file system access, etc.
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Incremental Static Regeneration (ISR): After the initial build, if a request
    // comes in for this page and it's been more than 60 seconds since the last
    // regeneration, Next.js will regenerate this page in the background.
    // The stale version is served until the new one is ready.
    revalidate: 60,
  };
}

export default function PostsPage({ posts }) {
  return (
    <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>Blog Posts</h1>
        <div style={{ background: '#e8f5e9', padding: '0.75rem 1rem', borderRadius: 6, fontSize: '0.9rem' }}>
          <strong>🔍 Rendering: Static Site Generation (SSG)</strong><br />
          This data was fetched at <em>build time</em> using <code>getStaticProps</code>.
          View the page source — the posts are already in the HTML!
          No API call is made when you visit this page.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {posts.map(post => (
          <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
            <article style={{
              border: '1px solid #e0e0e0', borderRadius: 8, padding: '1rem',
              height: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s',
            }}>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', color: '#1a1a2e', textTransform: 'capitalize' }}>
                {post.title}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#777', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {post.body}
              </p>
              <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: '#3498db' }}>
                Read more →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
