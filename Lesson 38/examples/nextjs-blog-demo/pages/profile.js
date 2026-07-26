// ── Profile Page (/profile) — SERVER-SIDE RENDERING ──────────────────────
// getServerSideProps runs on the server on EVERY request.
// It has access to the full HTTP request (headers, cookies, etc.)
// making it ideal for user-specific, personalized content.
//
// Notice: refresh this page repeatedly — the "Rendered at" timestamp
// will update every time, proving new server execution per request.

export async function getServerSideProps(context) {
  // context gives you access to the HTTP request
  const { req } = context;

  // In a real app, you'd read a JWT from req.headers.cookie or req.headers.authorization
  // to identify the logged-in user. Here we hardcode userId = 1 for the demo.
  const userId = 1;

  const [userRes, postsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}&_limit=3`),
  ]);

  if (!userRes.ok) {
    // You can redirect from getServerSideProps if auth fails
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await userRes.json();
  const posts = await postsRes.json();

  // The timestamp is added server-side so it changes on every request
  const renderedAt = new Date().toUTCString();

  return {
    props: {
      user,
      posts,
      renderedAt,
    },
  };
}

export default function ProfilePage({ user, posts, renderedAt }) {
  return (
    <main style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ background: '#fff3e0', padding: '0.75rem 1rem', borderRadius: 6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <strong>🔍 Rendering: Server-Side Rendering (SSR)</strong><br />
        This page is rendered fresh on the server for <em>every request</em> using
        <code> getServerSideProps</code>. Refresh the page — the "Rendered at" timestamp below will change.
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* ── User Card ─────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 260, background: '#f9f9f9', padding: '1.5rem', borderRadius: 8, border: '1px solid #eee' }}>
          <h1 style={{ marginTop: 0 }}>👤 {user.name}</h1>
          <table style={{ fontSize: '0.9rem', width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Username', user.username],
                ['Email', user.email],
                ['Phone', user.phone],
                ['Website', user.website],
                ['Company', user.company?.name],
                ['City', user.address?.city],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.4rem 0.75rem 0.4rem 0', color: '#888', fontWeight: 500 }}>{label}</td>
                  <td style={{ padding: '0.4rem 0' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Recent Posts ───────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2>Recent Posts</h2>
          {posts.map(post => (
            <div key={post.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <a href={`/posts/${post.id}`} style={{ fontWeight: 'bold', color: '#1a1a2e', textTransform: 'capitalize', textDecoration: 'none' }}>
                {post.title}
              </a>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#777' }}>
                {post.body.slice(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SSR Proof ─────────────────────────────────────────────────────── */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff8e1', borderRadius: 6, fontSize: '0.85rem', color: '#777' }}>
        <strong>Server rendered at:</strong> {renderedAt}
        <br />
        <small>Refresh the page — this timestamp updates on every request, proving server execution each time.</small>
      </div>
    </main>
  );
}
