// src/demos/FetchDemo.jsx
// ─────────────────────────────────────────────────
// DEMO 3 — useEffect: Data Fetching
// Demonstrates:
//  • useEffect with a dependency [postId]
//  • The 3 states: loading / error / success
//  • Resetting state at the start of each fetch
//  • AbortController cleanup
// ─────────────────────────────────────────────────

import { useState, useEffect } from 'react'

function FetchDemo() {
  const [postId, setPostId]   = useState(1)
  const [post, setPost]       = useState(null)
  const [status, setStatus]   = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [effectLog, setEffectLog] = useState([])

  function addLog(msg) {
    setEffectLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8))
  }

  useEffect(() => {
    // AbortController lets us cancel in-flight requests
    // when postId changes before the previous fetch completes
    const controller = new AbortController()

    setStatus('loading')
    setPost(null)
    addLog(`useEffect fired — fetching post #${postId}`)

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setPost(data)
        setStatus('success')
        addLog(`✅ Success — post "${data.title.slice(0, 30)}..."`)
      })
      .catch(err => {
        if (err.name === 'AbortError') {
          addLog('🔄 Previous request cancelled (AbortController)')
          return
        }
        setStatus('error')
        addLog(`❌ Error — ${err.message}`)
      })

    // Cleanup: cancel request if postId changes before it completes
    return () => {
      controller.abort()
    }
  }, [postId]) // ← Re-runs whenever postId changes

  return (
    <div className="demo-card">
      <h2>🌐 Data Fetching — useEffect</h2>
      <p className="demo-desc">
        <code>useEffect(() =&gt; {'{ ... }'}, [postId])</code> runs on mount and
        whenever <code>postId</code> changes. Click the buttons to change the ID
        and watch the effect fire.
      </p>

      {/* Controls */}
      <div className="btn-row">
        <button className="btn btn-muted"    onClick={() => setPostId(id => Math.max(1, id - 1))}>← Prev</button>
        <span className="post-id-label">Post #{postId}</span>
        <button className="btn btn-muted"    onClick={() => setPostId(id => Math.min(100, id + 1))}>Next →</button>
        <button className="btn btn-danger"   onClick={() => setPostId(999)}>Trigger Error (ID 999)</button>
      </div>

      {/* The 3 states */}
      <div className="fetch-result">
        {status === 'idle'    && <p className="state-idle">Click a button to fetch.</p>}
        {status === 'loading' && <div className="state-loading"><span className="spinner">⏳</span> Loading post #{postId}...</div>}
        {status === 'error'   && <div className="state-error">⚠ Failed to load post. (Try a valid ID 1–100)</div>}
        {status === 'success' && post && (
          <div className="state-success">
            <p className="post-id">Post #{post.id}</p>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-body">{post.body}</p>
          </div>
        )}
      </div>

      {/* Effect log */}
      <div className="render-log">
        <div className="log-label">Effect Log</div>
        {effectLog.map((entry, i) => (
          <div key={i} className={`log-entry ${i === 0 ? 'log-entry--latest' : ''}`}>{entry}</div>
        ))}
      </div>
    </div>
  )
}

export default FetchDemo
