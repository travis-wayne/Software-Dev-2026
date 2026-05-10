// src/demos/ClockDemo.jsx
// ─────────────────────────────────────────────────
// DEMO 4 — useEffect: Cleanup Functions
// Demonstrates:
//  • setInterval inside useEffect
//  • Cleanup with clearInterval on unmount
//  • Functional state update: prev => prev + 1 (avoids stale closure)
// ─────────────────────────────────────────────────

import { useState, useEffect } from 'react'

function ClockDemo() {
  const [time, setTime]       = useState(new Date().toLocaleTimeString())
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [cleanupLog, setCleanupLog] = useState([])

  function addLog(msg) {
    setCleanupLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 6))
  }

  useEffect(() => {
    if (!isRunning) return // Don't start interval if paused

    addLog('▶ useEffect ran — setInterval started')

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
      // Functional update: uses the LATEST value of seconds, not the captured closure value
      setSeconds(prev => prev + 1)
    }, 1000)

    // Cleanup function — runs when:
    // 1. The component unmounts
    // 2. The effect re-runs (when isRunning changes)
    return () => {
      clearInterval(interval)
      addLog('🧹 Cleanup ran — clearInterval called')
    }
  }, [isRunning]) // Re-runs when isRunning changes

  return (
    <div className="demo-card">
      <h2>🕐 Live Clock — Cleanup Functions</h2>
      <p className="demo-desc">
        A <code>setInterval</code> runs inside <code>useEffect</code>.
        The <strong>cleanup function</strong> (the returned function) calls{' '}
        <code>clearInterval</code> to prevent memory leaks when the component
        pauses or unmounts.
      </p>

      {/* Clock display */}
      <div className="clock-display">{time}</div>
      <p className="seconds-counter">Running for {seconds} seconds</p>

      {/* Controls */}
      <div className="btn-row">
        <button
          className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`}
          onClick={() => setIsRunning(r => !r)}
        >
          {isRunning ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button className="btn btn-muted" onClick={() => setSeconds(0)}>
          Reset Counter
        </button>
      </div>

      {/* Cleanup log */}
      <div className="render-log">
        <div className="log-label">Effect & Cleanup Log</div>
        {cleanupLog.map((entry, i) => (
          <div key={i} className={`log-entry ${i === 0 ? 'log-entry--latest' : ''}`}>{entry}</div>
        ))}
      </div>

      <div className="concept-box">
        <strong>Why <code>prev =&gt; prev + 1</code>?</strong><br />
        The interval's callback captures <code>seconds</code> at the moment the
        effect ran. Using the functional form <code>prev =&gt; prev + 1</code> always
        uses the <em>latest</em> value — avoiding stale closures.
      </div>
    </div>
  )
}

export default ClockDemo
