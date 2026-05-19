# Tutor Notes — Lesson 23: Intro to Testing (Jest/Vitest & RTL)

## Session Objectives
By the end of this session, the student will be able to:
- Explain the importance of software testing (Unit, Component, E2E).
- Write basic unit tests for JavaScript functions using Vitest (which shares the exact API of Jest).
- Write simple component tests using React Testing Library (`render`, `screen`).
- Test user interactions in components using `@testing-library/user-event`.

## Pedagogical Context (Vitest vs Jest)
The curriculum template specifically calls out **Jest**. However, since we are working within modern Vite-based React apps, configuring Jest is notoriously complex (it requires babel plugins, environment setups, and doesn't understand Vite's module resolution). 
**Action for Tutor:** We will use **Vitest**. Vitest is the modern standard for Vite apps and was intentionally designed to be a drop-in replacement for Jest. 
*Explain to the student:* "We are using Vitest as our test runner today. Vitest uses the exact same API as Jest (`describe`, `it`, `expect`), but it's built to work seamlessly with Vite. Everything you learn today applies exactly to Jest!"

## Key Teaching Points
1. **The "Why":** Before touching code, ensure the student understands that testing is not a chore — it is a safety net. Ask them: "Have you ever fixed a bug in one file, only to realize later that your fix broke something in another file?" Tests prevent this.
2. **The Test Runner (Vitest/Jest):** Teach the Anatomy of a Test:
   - `describe()`: The suite (the "what" we are testing).
   - `it()` / `test()`: The individual case.
   - `expect()`: The assertion.
3. **The AAA Pattern:** Teach **A**rrange, **A**ct, **A**ssert as a structural pattern for writing clean unit tests.
4. **React Testing Library (RTL) Philosophy:** Emphasize that RTL explicitly prevents you from testing *implementation details* (like the internal state variables). RTL forces you to test *what the user sees* (e.g. `screen.getByText()`, `screen.getByRole()`). This makes tests resilient to refactoring.
5. **Asynchronous Events:** When using `userEvent.click()`, remind them that state updates in React are asynchronous, so we must `await userEvent.click()`.

## Live Demo Guide
1. Run `pnpm test` in the `Lesson 23/examples/react-testing-app` to show tests passing in watch mode.
2. Intentionally break the logic in `src/utils/math.js` (e.g. change `+` to `-`) and watch the terminal turn red immediately. This is the "Aha!" moment for students regarding test feedback.
3. Open `src/components/Counter.test.jsx` and explain how `userEvent` perfectly mimics human interaction.

## Common Pitfalls to Watch For
- **Importing Jest globals:** In Vitest, you must explicitly import `describe`, `it`, and `expect` from `'vitest'`, whereas in Jest they are globally available.
- **Forgetting `await`:** Students often forget to `await userEvent.click(button)`.
- **Query Confusion:** Students might struggle between `getByText`, `queryByText`, and `findByText`. Keep it simple for this intro: stick to `getByText` and `getByRole`.
