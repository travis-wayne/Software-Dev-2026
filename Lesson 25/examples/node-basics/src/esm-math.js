/**
 * 🎓 LESSON GUIDE — ES Modules (ESM)
 *
 * This is the modern, standardized way to share code in JavaScript.
 * It's the same syntax you use in React (import/export).
 * 
 * - We use the `export` keyword in front of anything we want to share.
 * - Or we use `export default` for the main export of a file.
 */

// Named export
export function multiply(a, b) {
  return a * b;
}

// Named export
export function divide(a, b) {
  if (b === 0) return 'Cannot divide by zero';
  return a / b;
}

// Default export (optional, but good to know)
const mathInfo = {
  version: "1.0.0",
  description: "Modern ES Module Math Library"
};
export default mathInfo;
