// ── About Page (/about) ────────────────────────────────────────────────────
// This page has no data fetching at all.
// Next.js automatically generates it as a static HTML file at build time.
// No getStaticProps, no getServerSideProps — just a plain exported component.

export default function AboutPage() {
  return (
    <main style={{ padding: '3rem 2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1>About This Demo</h1>

      <p style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
        This is a simple Next.js application demonstrating the three rendering
        strategies available in the Pages Router:
      </p>

      <ul style={{ lineHeight: 2, fontSize: '1rem' }}>
        <li><strong>Static Site Generation (SSG)</strong> — see the <a href="/posts">/posts</a> page.</li>
        <li><strong>Server-Side Rendering (SSR)</strong> — see the <a href="/profile">/profile</a> page.</li>
        <li><strong>Static Page (no data)</strong> — this page, right here.</li>
      </ul>

      <p style={{ lineHeight: 1.8 }}>
        This page itself is an example of a <strong>static page with no data fetching</strong>.
        Because there is no <code>getStaticProps</code> or <code>getServerSideProps</code> exported,
        Next.js treats it as a plain static HTML file — the fastest possible rendering strategy.
      </p>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f4ff', borderRadius: 8 }}>
        <strong>File-System Routing in action:</strong>
        <p style={{ margin: '0.5rem 0 0' }}>
          This page exists because the file <code>pages/about.js</code> exists.
          Creating a file <em>is</em> creating a route. No React Router config needed.
        </p>
      </div>
    </main>
  );
}
