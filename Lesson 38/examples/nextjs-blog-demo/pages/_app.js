import Link from 'next/link';

// _app.js is the global layout wrapper for every page in the application.
// Styles and components added here appear on every page.

const navStyles = {
  display: 'flex',
  gap: '1.5rem',
  padding: '1rem 2rem',
  background: '#1a1a2e',
  color: '#fff',
  alignItems: 'center',
};

const linkStyles = {
  color: '#a8dadc',
  textDecoration: 'none',
  fontWeight: 500,
};

const footerStyles = {
  textAlign: 'center',
  padding: '2rem',
  borderTop: '1px solid #eee',
  color: '#aaa',
  fontSize: '0.85rem',
  marginTop: '4rem',
};

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* ── Global Navigation ───────────────────────────────────────────── */}
      <nav style={navStyles}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '1rem' }}>📝 Next.js Demo</span>
        {/* Use <Link> for all internal navigation — it prefetches in the background */}
        <Link href="/" style={linkStyles}>Home</Link>
        <Link href="/about" style={linkStyles}>About</Link>
        <Link href="/posts" style={linkStyles}>Blog (SSG)</Link>
        <Link href="/profile" style={linkStyles}>Profile (SSR)</Link>
      </nav>

      {/* ── Page Content ────────────────────────────────────────────────── */}
      <Component {...pageProps} />

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={footerStyles}>
        <p>Next.js Blog Demo — Lesson 38 | Data from JSONPlaceholder API</p>
      </footer>
    </>
  );
}
