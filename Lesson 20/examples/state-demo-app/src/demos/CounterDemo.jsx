// src/demos/CounterDemo.jsx
// ─────────────────────────────────────────────────
// DEMO 1 — useState: The Counter
// Demonstrates:
//  • useState initialisation
//  • Calling the setter to update state
//  • React re-renders on every state change
//  • The render log shows exactly when React re-renders
// ─────────────────────────────────────────────────

import { useState } from 'react'

function CounterDemo() {
  const [count, setCount] = useState(0)
  const [renderLog, setRenderLog] = useState([])

  // This runs every render — we capture it in a log
  // (In a real component you'd just use console.log)
  const currentLog = [...renderLog, `Render #${renderLog.length + 1} — count: ${count}`]

  return (
    <div className="demo-card">
      <h2>🔵 Counter — useState</h2>
      <p className="demo-desc">
        Every call to <code>setCount()</code> tells React to re-render.
        Watch the render log update with every click.
      </p>

      {/* The number display */}
      <div className="counter-display">{count}</div>

      {/* Controls */}
      <div className="btn-row">
        <button className="btn btn-danger"   onClick={() => setCount(c => c - 1)}>− Decrement</button>
        <button className="btn btn-success"  onClick={() => setCount(c => c + 1)}>+ Increment</button>
        <button className="btn btn-muted"    onClick={() => { setCount(0); setRenderLog([]); }}>Reset</button>
      </div>

      {/* Render log */}
      <div className="render-log">
        <div className="log-label">Render Log</div>
        {currentLog.slice(-5).reverse().map((entry, i) => (
          <div key={i} className={`log-entry ${i === 0 ? 'log-entry--latest' : ''}`}>
            {entry}
          </div>
        ))}
      </div>

      {/* Key concept box */}
      <div className="concept-box">
        <strong>Why not just use <code>let count = 0</code>?</strong><br />
        A plain variable changes in memory, but React has no way to know.
        <code>useState</code> creates a <em>reactive</em> variable — React
        watches it and re-renders the component when it changes.
      </div>
    </div>
  )
}

export default CounterDemo
