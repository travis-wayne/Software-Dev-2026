# Student Notes — Lesson 23: Intro to Testing (Vitest & React Testing Library)

## 1. Why Do We Test?
In software development, writing tests is just as important as writing the code itself.
- **Confidence:** When you change old code or add new features, tests prove that you didn't accidentally break anything.
- **Documentation:** A well-written test explains exactly what a component or function is *supposed* to do.
- **Time Saving:** Catching bugs early on your own machine is much faster (and cheaper) than catching them after users complain!

## 2. Types of Tests
1. **Unit Tests:** Testing a single, isolated piece of logic (like a math function or a helper utility).
2. **Component Tests / Integration Tests:** Testing how a single React component renders and reacts to user input (e.g., clicking a button).
3. **End-to-End (E2E) Tests:** Simulating a real user opening a browser, clicking through pages, and testing the entire system from front to back.

In this lesson, we are focusing on **Unit Tests** and **Component Tests**.

## 3. The Tools: Vitest + React Testing Library

### Vitest (The Test Runner)
We use a tool called **Vitest** to run our tests. (Note: You may often hear about **Jest** — Vitest is a modern, faster replacement built specifically for Vite that uses the *exact same* API as Jest. If you know one, you know the other!)
Vitest gives us the functions we use to structure our tests:
- `describe()`: Groups related tests together.
- `it()` or `test()`: Defines a single test case.
- `expect()`: Makes assertions (e.g., "I expect 2 + 2 to equal 4").

### React Testing Library (RTL)
React Testing Library (RTL) provides utilities for testing React components. 
**The Golden Rule of RTL:** "The more your tests resemble the way your software is used, the more confidence they can give you."
Instead of testing the component's internal state or implementation details, we test what the user actually sees and interacts with (e.g., "Find the button with the text 'Submit' and click it").

---

## 4. Writing a Unit Test (Standard JS)
Let's test a standard JavaScript function:

```javascript
// math.js
export function add(a, b) {
  return a + b;
}
```

```javascript
// math.test.js
import { describe, it, expect } from 'vitest';
import { add } from './math';

describe('Math utilities', () => {
  it('should correctly add two numbers', () => {
    // 1. Arrange
    const num1 = 5;
    const num2 = 10;
    
    // 2. Act
    const result = add(num1, num2);
    
    // 3. Assert
    expect(result).toBe(15);
  });
});
```

---

## 5. Writing a Component Test (React Testing Library)
To test a React component, we use the `render` function from RTL to render it into a virtual DOM (JSDOM), and then use the `screen` object to find elements.

### A. Testing Rendering
```jsx
import { render, screen } from '@testing-library/react';
import DisplayMessage from './DisplayMessage';

describe('DisplayMessage', () => {
  it('renders the passed message', () => {
    // 1. Render the component
    render(<DisplayMessage message="Hello World" />);
    
    // 2. Find the element exactly how a user would (by text)
    const element = screen.getByText('Hello World');
    
    // 3. Assert it exists in the document
    expect(element).toBeInTheDocument();
  });
});
```

### B. Testing User Interaction (Events)
To simulate a user clicking a button or typing into an input, we use `userEvent`.

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  it('increments the count when clicked', async () => {
    // Set up the user event simulator
    const user = userEvent.setup();
    
    render(<Counter />);
    
    // Find the button (e.g. by its accessible role and text)
    const button = screen.getByRole('button', { name: /increment/i });
    
    // The count should initially be 0
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    // Simulate a user click (this is asynchronous!)
    await user.click(button);
    
    // The count should now be 1
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

## Summary
- **Vitest / Jest:** Provides `describe`, `it`, and `expect` to structure tests.
- **RTL (`render`, `screen`):** Renders components and helps you find elements by their visible text or role.
- **RTL (`userEvent`):** Simulates actual user clicks and typing.
