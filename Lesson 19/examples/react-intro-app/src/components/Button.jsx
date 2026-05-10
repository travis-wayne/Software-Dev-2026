// src/components/Button.jsx
// ─────────────────────────────────────────────────
// TEACHING MOMENT 2 — A reusable component with multiple prop types.
//
// Props:
//   text     (string)  — the button label
//   variant  (string)  — 'primary' | 'secondary' | 'danger'
//   disabled (boolean) — whether the button is interactive
//   onClick  (function)— callback when clicked (optional)
//
// Key learning:
//  • Default prop values using ES6 default parameters.
//  • Boolean props: <Button disabled /> is the same as disabled={true}
//  • Passing a function as a prop (onClick).
// ─────────────────────────────────────────────────

function Button({ text, variant = 'primary', disabled = false, onClick }) {
  return (
    <button
      className={`btn btn--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
