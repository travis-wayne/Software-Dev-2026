# Practice Exercises — Lesson 23: Intro to Testing (Vitest & RTL)

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 23/examples/react-testing-app"
pnpm install   # install dependencies
pnpm test      # Starts Vitest in watch mode
```
Open the code in VS Code. Keep the terminal running `pnpm test` visible so you can see your tests pass and fail in real-time.

---

## Exercise 1: Write a Simple Unit Test

**Goal:** Understand the basic structure of a unit test using the AAA pattern (Arrange, Act, Assert).

1. Open `src/utils/math.js`. You will see a `multiply` function that is currently exported.
2. Open `src/utils/math.test.js`.
3. Notice how the `add` function is currently being tested.
4. Add a new test case for the `multiply` function inside the same `describe` block.
   - Use `it('should multiply two numbers correctly', () => { ... })`
   - **Arrange:** Create two variables with numbers.
   - **Act:** Call the `multiply` function with those numbers.
   - **Assert:** Use `expect(result).toBe(expectedValue)` to verify the output.
5. Save the file. Look at your terminal running `pnpm test` to see if your test passed!

---

## Exercise 2: Testing Component Rendering

**Goal:** Learn how to render a React component in a test environment and verify its content.

1. Open `src/components/DisplayMessage.test.jsx`.
2. There is an empty test case: `it('renders the correct message prop', () => { ... })`.
3. Inside this test, use the `render` function from `@testing-library/react` to render the `<DisplayMessage>` component. Pass a `message` prop with the text `"Hello React Testing!"`.
   ```jsx
   render(<DisplayMessage message="Hello React Testing!" />);
   ```
4. Use `screen.getByText()` to find the element containing that exact text.
5. Assert that the element is in the document using `.toBeInTheDocument()`.

✅ **Test your test:** Intentionally change the text in `screen.getByText()` to something else (like `"Wrong text"`). Watch your terminal output turn red and read the error message. Then fix it so it passes again.

---

## Exercise 3: Testing User Interactions

**Goal:** Simulate a user clicking a button and verify that the component's state updates correctly.

1. Open `src/components/Counter.jsx` and review how the component works. It's a standard counter with an "Increment" button.
2. Open `src/components/Counter.test.jsx`.
3. You'll see a complete test that verifies the counter starts at 0.
4. Below that, write a new test: `it('increments the count when the button is clicked', async () => { ... })`
5. Inside your new test:
   - Call `const user = userEvent.setup();`
   - `render` the `<Counter />` component.
   - Find the button using `screen.getByRole('button', { name: /increment/i })`.
   - Wait for the user to click it: `await user.click(button);`
   - Assert that the new text is on the screen: `expect(screen.getByText('Count: 1')).toBeInTheDocument();`
6. Save and verify that your test passes in the terminal.

---

## Exercise 4: Testing an Edge Case (Optional / Bonus)

**Goal:** Tests aren't just for the "happy path" — they ensure your app handles edge cases gracefully.

1. Open `src/utils/math.js` and add a new function:
   ```javascript
   export function divide(a, b) {
     if (b === 0) return 'Cannot divide by zero';
     return a / b;
   }
   ```
2. In `src/utils/math.test.js`, write a test that verifies `divide(10, 0)` returns the string `'Cannot divide by zero'`.

---

## 📝 Final Check: Interactive Quiz
Once you have completed the exercises above, start your development server (`pnpm dev`) and click the **📝 Quiz** tab in the app to test your conceptual knowledge!
