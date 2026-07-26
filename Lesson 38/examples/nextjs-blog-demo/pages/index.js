import Link from 'next/link';

// ── Home Page (/) ──────────────────────────────────────────────────────────
// No getStaticProps needed here — the page has no external data.
// Next.js automatically renders it as a static page at build time.

export default function HomePage() {
  return (
    <main style={{ padding: '3rem 2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1>Next.js Rendering Strategies Demo</h1>

      <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.7 }}>
        This demo app illustrates the three main rendering strategies in Next.js.
        Each page in this app uses a different approach — explore them all and
        compare the HTML source and network requests in your browser DevTools.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        <Card
          href="/posts"
          title="📄 Blog Posts (SSG)"
          description="Data fetched at BUILD TIME with getStaticProps. Fast, cacheable, great for SEO."
          color="#e8f5e9"
        />
        <Card
          href="/posts/1"
          title="📝 Single Post (SSG + Dynamic)"
          description="Dynamic route /posts/[id] pre-built with getStaticPaths + getStaticProps."
          color="#e3f2fd"
        />
        <Card
          href="/profile"
          title="👤 Profile (SSR)"
          description="Data fetched on every REQUEST with getServerSideProps. Fresh, personalized content."
          color="#fff3e0"
        />
        <Card
          href="/about"
          title="ℹ️ About (Static)"
          description="No data fetching at all. Just a plain component — auto-rendered as static HTML."
          color="#f3e5f5"
        />
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: 8, borderLeft: '4px solid #3498db' }}>
        <strong>💡 Tip:</strong> Right-click any page → <em>View Page Source</em>. You will see the full HTML
        content already present — not just a blank <code>&lt;div id="root"&gt;</code> like a standard React SPA.
        This is the core benefit of Next.js for SEO and performance.
      </div>
    </main>
  );
}

function Card({ href, title, description, color }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: color, padding: '1.5rem', borderRadius: 8,
        border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer',
        transition: 'transform 0.15s', height: '100%',
      }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#555' }}>{description}</p>
      </div>
    </Link>
  );
}
