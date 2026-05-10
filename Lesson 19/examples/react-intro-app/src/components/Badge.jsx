// src/components/Badge.jsx
// A tiny inline badge component — demonstrates that even the
// smallest, simplest UI element can be its own component.
// Props: text (string), type ('success' | 'neutral' | 'warning')

function Badge({ text, type = 'neutral' }) {
  return (
    <span className={`badge badge--${type}`}>
      {text}
    </span>
  )
}

export default Badge
