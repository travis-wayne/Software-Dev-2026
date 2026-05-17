// src/pages/About.jsx
// ─────────────────────────────────────────────────────────────────
// 🎓 Teaching Note:
// This page demonstrates the "Navbar outside <Routes>" pattern.
// Notice how the Navbar above DIDN'T re-mount when you navigated here.
// It stayed alive. The click counter on the Home page is still counting
// from where you left it — navigate back to prove it!
// ─────────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="page fade-in">
      <h1>ℹ️ About This App</h1>
      <p className="page-desc">
        You navigated here from the Home page. Notice the Navbar didn't flicker — 
        it was never unmounted. This is the key power of the Layout Pattern.
      </p>

      <div className="concept-box">
        <h3>📐 The Layout Pattern</h3>
        <p>
          In <code>App.jsx</code>, the <code>&lt;Navbar /&gt;</code> component sits <em>outside</em> the 
          <code>&lt;Routes&gt;</code> block. This means React never destroys and re-creates it
          during navigation — only the content inside <code>&lt;Routes&gt;</code> swaps.
        </p>
        <pre style={{background:'#000',padding:'1rem',borderRadius:'6px',marginTop:'1rem',fontSize:'0.85rem',color:'#a5b4fc',overflow:'auto'}}>{`function App() {
  return (
    <div>
      <Navbar />   {/* ← OUTSIDE Routes, always renders */}
      
      <Routes>     {/* ← INSIDE Routes, only one renders */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}`}</pre>
      </div>

      <div className="concept-box" style={{marginTop:'1.25rem'}}>
        <h3>↩️ Navigate Back</h3>
        <p>
          Go back to Home. Is the click counter still at the number you left it on? If yes, 
          that proves no page reload occurred.
        </p>
        <Link to="/" className="btn btn-primary mt-3">← Back to Home</Link>
      </div>
    </div>
  )
}

export default About
