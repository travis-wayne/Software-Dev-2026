# Tutor Notes — Lesson 23: Intro to Testing (Vitest & React Testing Library)

---

## Session Objectives

By the end of this session, the student will be able to:

1. Articulate **why** testing is a professional practice, not a chore.
2. Distinguish between **Unit**, **Component**, and **E2E** tests and know when to use each.
3. Write a **unit test** for a pure JavaScript function using Vitest, following the AAA pattern.
4. Write a **component test** using React Testing Library to verify rendering.
5. Write an **interaction test** using `userEvent` to simulate a button click and assert state changes.

---

## Pre-Session Setup Checklist

- [ ] Student's machine has Node.js ≥ 18 installed.
- [ ] Project dependencies installed: `cd "Lesson 23/examples/react-testing-app" && pnpm install`
- [ ] Verify tests run: `pnpm test --run` — all 6 tests should pass (2 intentionally empty stubs awaiting student work).
- [ ] Open VS Code with the `react-testing-app` folder active and a terminal visible.

---

## Pedagogical Context: Vitest vs Jest

The session brief mentions Jest. We deliberately use **Vitest** for all Vite-based projects.

**Why Vitest and not Jest?**
- Jest requires Babel transpilation and complex configuration to work with Vite's ESM module system.
- Vitest is a **drop-in replacement** — identical `describe`, `it`, and `expect` API.
- It starts instantly (no cold-boot like Jest) and runs in the same Vite pipeline the student already understands.

**How to explain this to the student:**
> "We are using Vitest today. You'll see it referenced as 'similar to Jest' in most tutorials. They use the exact same functions — `describe`, `it`, `expect` — so everything you learn right now is directly transferable to any Jest project."

---

## Lesson Flow (90-minute session)

### Phase 1 — The "Why" (15 minutes)
**Do NOT open code yet.** Start with a conversation:

Ask the student: *"Have you ever fixed a bug only to discover it broke something else somewhere in the project?"*

Introduce the concept of **regressions** — bugs that silently reappear when you make unrelated changes. Explain that tests are a **safety net**: they run automatically every time you save a file and scream immediately if something breaks.

Then open the app (`pnpm dev`) and navigate to the **📖 Concepts** tab. Walk through the Testing Pyramid visually with the student. Emphasise:
- You write **many unit tests** (fast, cheap, isolated).
- You write **some component tests** (medium cost).
- You write **few E2E tests** (slow, expensive — but highest confidence).

### Phase 2 — Unit Testing with Vitest (25 minutes)
1. Open `src/utils/math.js`. Read the `add()` function together.
2. Open `src/utils/math.test.js`. Walk through the anatomy line by line:
   - `describe()` — "This is the **suite** — what are we testing?"
   - `it()` — "This is one **case** — a specific behaviour."
   - `expect().toBe()` — "This is the **assertion** — the actual check."
3. Run `pnpm test` in the terminal. Show the green output.
4. **The "Break It" Moment** — change `return a + b` to `return a - b` in `math.js`. Save. Watch the terminal go red *instantly*. This is the most powerful teaching moment of the session. Let the student experience it themselves.
5. Fix it. Watch it go green again.
6. **Student Exercise 1:** Have the student write the `multiply` test on their own.

### Phase 3 — Component Testing with RTL (30 minutes)
1. Switch to the **🕹️ Demos** tab in the app. Show the `DisplayMessage` component.
2. Explain: *"When we test a React component, we render it into a fake browser environment called jsdom, then ask questions about what's on the screen — exactly like a user would."*
3. Open `DisplayMessage.test.jsx`. Show the passing test for the fallback.
4. Walk through the **`render → screen → expect`** pattern:
   - `render(<DisplayMessage />)` — puts it in the virtual DOM.
   - `screen.getByText('...')` — finds the element by what the user sees.
   - `.toBeInTheDocument()` — confirms it exists.
5. **Student Exercise 2:** Student completes the `renders the correct message prop` test.

### Phase 4 — Interaction Testing with userEvent (20 minutes)
1. Show the `Counter` component in the Demos tab. Interact with the button.
2. Open `Counter.test.jsx`. Show the starter test.
3. Explain `userEvent`:
   - *"RTL ships with a `fireEvent` utility, but `userEvent` is much more realistic — it simulates how a real human uses a pointer and keyboard, including focus events, mouse movement, etc."*
4. **Critical point:** `await user.click(button)` — explain why `async/await` is needed (React state updates are asynchronous; the DOM re-renders after the microtask queue clears).
5. **Student Exercise 3:** Student completes the increment click test.

### Phase 5 — Bonus & Wrap-Up (5 minutes)
- If time permits, introduce the **Bonus Exercise 4**: the `divide()` edge case test (testing the `'Cannot divide by zero'` return value).
- Run the full quiz tab together to cement conceptual understanding.

---

## Common Student Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `describe is not defined` | Missing Vitest import | Add `import { describe, it, expect } from 'vitest'` |
| Test passes when it shouldn't | Forgot `await` before `user.click()` | Always `await` userEvent calls |
| `Unable to find element with text...` | Text doesn't exactly match | Check casing, punctuation, and that the component is actually rendering |
| All tests pass even though code is wrong | Not importing the correct function | Check the `import` path at the top of the test file |
| `toBeInTheDocument is not a function` | `@testing-library/jest-dom` not imported | Ensure `import '@testing-library/jest-dom'` is in `setupTests.js` |

---

## Key Concepts to Reinforce Verbally

1. **RTL's philosophy — test behaviour, not implementation.** If you refactor a component from class-based to functional but the UI is identical, your tests should still pass. If they don't, your tests were testing the wrong thing.

2. **`getByText` vs `queryByText` vs `findByText`:**
   - `getByText` → throws if not found (use when element MUST be there).
   - `queryByText` → returns `null` if not found (use to assert element is ABSENT).
   - `findByText` → async, waits up to 1s (use for elements that appear after a delay).

3. **The test file lives next to the source file.** `Counter.jsx` and `Counter.test.jsx` are siblings. This is the most common convention.

---

## Post-Session Assignment (For Student)

1. In their **personal portfolio React project**, identify a small utility function and write **at least 3 unit tests** for it covering different inputs, including at least one edge case.
2. Choose a simple component (e.g. a `Button`) and write **2 component tests** — one for rendering, one for a click interaction.
3. Research: What is the difference between `screen.getByRole('button', { name: /submit/i })` and `screen.getByText('Submit')`? When would you prefer one over the other?
