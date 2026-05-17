// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────
// 🎓 Teaching Note:
// This page demonstrates the #1 benefit of SPAs — state is NOT
// lost on navigation. The click counter below will keep counting
// even as you navigate to other pages and come back. In a traditional
// website, going to "About" and coming back would reset the counter to 0.
// ─────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {
  // This state SURVIVES navigation because the page never reloads!
  const [clicks, setClicks] = useState(0)

  return (
    <div className="page fade-in">
      <h1>🏠 Home Page</h1>
      <p className="page-desc">
        This is a <strong>Single Page Application (SPA)</strong>. The browser only loaded one HTML
        file when you first arrived. All navigation happens instantly, in JavaScript, without
        ever hitting the server again.
      </p>

      {/* ── DEMO: State survives navigation ─────────── */}
      <div className="concept-box">
        <h3>🧪 Proof: State Survives Navigation</h3>
        <p>Click the button a few times, then navigate to <strong>About</strong> and come back.</p>
        <p style={{marginTop: '0.5rem'}}>
          The counter will still be at <strong style={{color: 'var(--success)'}}>{clicks}</strong>. 
          That's because the React app never reloaded — the component state was kept alive in memory.
        </p>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem'}}>
          <button className="btn btn-primary" onClick={() => setClicks(c => c + 1)}>
            Click me: {clicks}
          </button>
          <span style={{color: 'var(--muted)', fontSize: '0.9rem'}}>← Navigate away and come back!</span>
        </div>
      </div>

      <div className="action-cards" style={{marginTop: '2rem'}}>
        <div className="card">
          <h3>Static Routing</h3>
          <p>See how a static page maps to a fixed URL path like <code>/about</code>.</p>
          <Link to="/about" className="btn btn-primary mt-3">Go to About</Link>
        </div>
        
        <div className="card">
          <h3>Dynamic Routing</h3>
          <p>See how URL parameters like <code>/products/:id</code> work.</p>
          <Link to="/products" className="btn btn-secondary mt-3">View Products</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
