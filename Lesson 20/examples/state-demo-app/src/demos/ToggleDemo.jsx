// src/demos/ToggleDemo.jsx
// ─────────────────────────────────────────────────
// DEMO 2 — useState: Boolean & Controlled Input
// Demonstrates:
//  • Boolean state (flip with !)
//  • Conditional rendering with && and ternary
//  • Controlled input: value + onChange in sync
// ─────────────────────────────────────────────────

import { useState } from 'react'

function ToggleDemo() {
  const [isVisible, setIsVisible] = useState(false)
  const [text, setText] = useState('')

  return (
    <div className="demo-card">
      <h2>🟡 Toggle & Controlled Input — useState</h2>

      {/* ── Toggle section ───────────────────────── */}
      <section className="demo-section">
        <h3>Part A: Boolean Toggle</h3>
        <p className="demo-desc">
          <code>!isVisible</code> flips the boolean. React re-renders
          and the JSX uses the new value to show/hide the message.
        </p>

        <button
          className={`btn ${isVisible ? 'btn-danger' : 'btn-success'}`}
          onClick={() => setIsVisible(v => !v)}
        >
          {isVisible ? 'Hide Message' : 'Show Message'}
        </button>

        {/* Conditional render with && */}
        {isVisible && (
          <div className="message-box">
            🎉 Hello! <code>isVisible</code> is <strong>true</strong>.
          </div>
        )}

        <div className="state-pill">
          isVisible = <strong>{String(isVisible)}</strong>
        </div>
      </section>

      {/* ── Controlled input ─────────────────────── */}
      <section className="demo-section">
        <h3>Part B: Controlled Input</h3>
        <p className="demo-desc">
          <code>value={'{text}'}</code> makes React the single source of truth.
          Every keystroke fires <code>onChange</code>, which calls <code>setText</code>,
          which causes a re-render with the new value.
        </p>

        <input
          className="controlled-input"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type something here..."
        />

        <div className="state-pill">
          text = <strong>"{text}"</strong> &nbsp;|&nbsp; length = <strong>{text.length}</strong>
        </div>

        {text.length > 20 && (
          <div className="warning-box">⚠ Over 20 characters!</div>
        )}
      </section>
    </div>
  )
}

export default ToggleDemo
