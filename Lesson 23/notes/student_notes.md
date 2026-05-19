# Student Notes — Lesson 23: Intro to Testing (Vitest & React Testing Library)

> **Open the app first!** Run `pnpm dev` inside `examples/react-testing-app/` and start on the **📖 Concepts** tab before reading these notes.

---

## 1. Why We Test Code

Before you write a single test, you need to understand *why* testing matters. Think about this scenario:

> You built a `calculateTax()` function. It worked perfectly. Three weeks later, you added a currency conversion feature. Now `calculateTax()` returns wrong numbers — but you didn't notice until a user complained.

A test would have caught that the **second** you made the change.

Testing gives you three superpowers:

| Superpower | What it means |
|---|---|
| **Confidence** | Change anything, anywhere — your tests tell you instantly if something broke |
| **Documentation** | A test is a living spec that says exactly what a function is supposed to do |
| **Speed** | Fixing a bug you catch yourself takes minutes. Fixing one a user reports takes days |

---

## 2. The Testing Pyramid

Not all tests are equal. The industry uses a **pyramid model** to guide how many of each type you should write:

```
         /\
        /  \     ← E2E Tests (fewest, slowest)
       /----\       Playwright, Cypress
      /      \    ← Component Tests (medium)
     /--------\     React Testing Library
    /          \  ← Unit Tests (most, fastest)
   /____________\   Vitest / Jest
```

### Unit Tests
- Test a **single function** in complete isolation.
- No browser, no React, no database — just input → output.
- Example: `add(2, 3)` should return `5`.
- **You write the most of these.**

### Component Tests
- Render a **single React component** into a virtual DOM.
- Verify what the user would *see* and how the component responds to *interaction*.
- Example: Click the "Increment" button, the count should increase.

### End-to-End (E2E) Tests
- Control a **real browser** and simulate an entire user journey.
- Example: Open the app → log in → add a product → checkout → verify order confirmation.
- **You write the fewest of these** (they are slow and expensive to run).

---

## 3. Our Tools

### Tool 1: Vitest (The Test Runner)
Vitest is what **finds, runs, and reports** your tests. You may have heard of **Jest** — Vitest uses the exact same API but is built specifically for Vite projects. Everything you learn here applies to Jest too.

Vitest gives you these three global functions:

```javascript
import { describe, it, expect } from 'vitest';

describe('Name of the thing being tested', () => {
  //       ↑ groups related test cases together

  it('should do something specific', () => {
    // ↑ one single test case

    expect(someValue).toBe(expectedValue);
    //     ↑ makes the actual assertion (the check)
  });
});
```

**Common `expect` matchers:**

| Matcher | What it checks |
|---|---|
| `.toBe(value)` | Strict equality (like `===`) |
| `.toEqual(object)` | Deep equality (for objects/arrays) |
| `.toBeTruthy()` | Value is truthy |
| `.toContain(item)` | Array or string contains item |
| `.toBeInTheDocument()` | DOM element exists (from jest-dom) |

### Tool 2: React Testing Library (RTL)
RTL lets you render React components and interact with them exactly as a user would.

**The Golden Rule of RTL:**
> *"The more your tests resemble the way your software is used, the more confidence they can give you."*
> — Kent C. Dodds, Creator of React Testing Library

This means: **don't test component internals** (state variables, private functions). Test what the **user sees and does**.

**Key RTL functions:**

```javascript
import { render, screen } from '@testing-library/react';

// 1. render() — Puts the component into the virtual DOM
render(<MyComponent prop="value" />);

// 2. screen — Query the DOM like a user would
screen.getByText('Submit')         // finds element with that exact text
screen.getByRole('button')         // finds by ARIA role (button, heading, etc.)
screen.getByPlaceholderText('...') // finds an input by placeholder
screen.queryByText('...')          // returns null if not found (doesn't throw)
screen.findByText('...')           // async version (waits for element to appear)
```

---

## 4. The AAA Pattern

Every well-written test follows the **AAA pattern**. Always structure your tests this way:

```javascript
it('should add two numbers', () => {

  // ── ARRANGE ──────────────────────────────
  // Set up everything your test needs
  const a = 5;
  const b = 10;

  // ── ACT ──────────────────────────────────
  // Do the one thing you are testing
  const result = add(a, b);

  // ── ASSERT ───────────────────────────────
  // Verify the result is what you expected
  expect(result).toBe(15);

});
```

---

## 5. Writing Your First Unit Test

**The function (`math.js`):**
```javascript
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

**The test file (`math.test.js`):**
```javascript
import { describe, it, expect } from 'vitest';
import { add, multiply } from './math';

describe('Math utilities', () => {

  it('should correctly add two numbers', () => {
    const result = add(5, 10);
    expect(result).toBe(15);      // ✅ passes
  });

  it('should return 0 when adding with zero', () => {
    expect(add(7, 0)).toBe(7);    // ✅ edge case
  });

  it('should multiply two numbers', () => {
    // 🎓 YOUR TURN — fill this in! (Exercise 1)
  });

});
```

---

## 6. Writing a Component Test

### A. Testing Rendering (Does it show the right thing?)

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DisplayMessage from './DisplayMessage';

describe('DisplayMessage', () => {

  it('renders the fallback when no message is given', () => {
    render(<DisplayMessage />);
    // Use the exact text the user would see
    expect(screen.getByText('No message provided.')).toBeInTheDocument();
  });

  it('renders the correct message prop', () => {
    render(<DisplayMessage message="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    // 🎓 YOUR TURN — complete this test! (Exercise 2)
  });

});
```

### B. Testing User Interaction (Does clicking work?)

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {

  it('increments the count when the button is clicked', async () => {
    // ① Set up the userEvent simulator (always do this first)
    const user = userEvent.setup();

    // ② Render the component
    render(<Counter />);

    // ③ Verify the initial state
    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // ④ Simulate the click — MUST be awaited!
    const button = screen.getByRole('button', { name: /increment/i });
    await user.click(button);

    // ⑤ Assert the new state
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

});
```

> ⚠️ **Always `await` userEvent calls!**
> React state updates are asynchronous. If you forget `await`, your assertion runs before the DOM has updated and the test will fail unexpectedly.

---

## 7. Running Your Tests

```bash
# In your terminal, inside the react-testing-app folder:

pnpm test        # Starts Vitest in WATCH mode — re-runs on every file save
pnpm test --run  # Runs all tests once and exits
```

**Reading the output:**
```
✓ src/utils/math.test.js         (2 tests)  ← green = all passing
✗ src/components/Counter.test.jsx           ← red = something failed

FAIL src/components/Counter.test.jsx
  ✗ increments the count when clicked
    AssertionError: expected "Count: 0" to be "Count: 1"
    ↑ This tells you exactly what was expected vs what you got
```

**The "break it" exercise:** Open `math.js` and change `return a + b` to `return a - b`. Watch your terminal turn red instantly. Now fix it — and watch it go green. That's the testing feedback loop!

---

## 8. Exercises

Open `exercises/testing_practice.md` for the step-by-step coding exercises. The exercises map to the files in `src/`:

| Exercise | File to edit |
|---|---|
| 1 — Unit test `multiply()` | `src/utils/math.test.js` |
| 2 — Test `DisplayMessage` renders props | `src/components/DisplayMessage.test.jsx` |
| 3 — Test `Counter` click interaction | `src/components/Counter.test.jsx` |
| 4 (Bonus) — Test a `divide()` edge case | `src/utils/math.test.js` |

---

## Quick Reference Summary

| Tool | What it does | Key functions |
|---|---|---|
| **Vitest** | Finds and runs tests | `describe`, `it`, `expect` |
| **RTL `render`** | Puts components in virtual DOM | `render(<Component />)` |
| **RTL `screen`** | Queries the DOM | `getByText`, `getByRole`, `queryByText` |
| **userEvent** | Simulates real user actions | `userEvent.setup()`, `await user.click()` |
| **jest-dom** | Extra matchers for the DOM | `.toBeInTheDocument()`, `.toBeDisabled()` |
