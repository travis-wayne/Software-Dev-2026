# Quiz — Lesson 19: Intro to React — Components & Props

> **Instructions:** Answer all questions before checking the answer key.
> Estimated time: 15–20 minutes.

---

## Section A: Multiple Choice *(10 questions — 1 point each)*

**Q1.** In React, what is a Component?
- A) A CSS class that styles an element
- B) A JavaScript function that returns JSX
- C) An HTML file that contains JavaScript
- D) A global variable that holds the app state

---

**Q2.** Which of the following component names is valid in React?
- A) `function myButton() { ... }`
- B) `function MyButton() { ... }`
- C) `function my-button() { ... }`
- D) `function 1Button() { ... }`

---

**Q3.** What is JSX?
- A) A new programming language that replaces JavaScript
- B) A special React feature that makes components faster
- C) A syntax extension for JavaScript that lets you write HTML-like code within JS
- D) A version of HTML5

---

**Q4.** Why do we write `className` instead of `class` in JSX?
- A) React invented its own attribute names
- B) `class` is a reserved keyword in JavaScript, so JSX uses `className` to avoid conflicts
- C) `class` is deprecated in HTML5
- D) It is just a React naming convention — `class` also works

---

**Q5.** What will this component render on the screen?
```jsx
function Greeting() {
    const name = "Alex";
    return <h1>Hello, name!</h1>;
}
```
- A) `Hello, Alex!`
- B) `Hello, name!` *(the literal string "name")*
- C) A blank screen
- D) An error

---

**Q6.** A parent renders `<UserCard name="Travis" age={25} />`. How does the `UserCard` component receive these values?
- A) Through a global variable called `data`
- B) Through the `this` keyword
- C) As a single JavaScript object called `props` passed as the first function argument
- D) Through the browser's `localStorage`

---

**Q7.** Which JSX is **correct**?
- A) `<img src="logo.png">`
- B) `<img src="logo.png" />`
- C) `<IMG src="logo.png" />`
- D) `<image src="logo.png" />`

---

**Q8.** A component renders the following:
```jsx
function App() {
    return (
        <h1>Title</h1>
        <p>Body text</p>
    );
}
```
What happens?
- A) Both elements render correctly
- B) Only the `<h1>` renders
- C) A syntax error — JSX components must return a single root element
- D) The `<p>` renders on top of the `<h1>`

---

**Q9.** You have `<Button text="Submit" />`. Inside `Button`, a developer writes `props.text = "Loading"`. What happens?
- A) The button text changes to "Loading"
- B) It causes a runtime error — props are read-only
- C) The parent component re-renders
- D) Nothing — React silently ignores it

---

**Q10.** What does **declarative** programming mean in the context of React?
- A) You write step-by-step instructions telling the browser exactly how to build the DOM
- B) You describe what the UI should look like for the current data, and React handles the DOM updates
- C) You declare all variables at the top of the file
- D) You use `document.createElement` to build elements and React renders them

---

## Section B: Spot the Error *(3 questions — 3 points each)*

For each component, identify **all** JSX errors.

**Q11.**
```jsx
function Card() {
    const title = "Welcome";
    return (
        <div class="card">
            <h2>title</h2>
            <img src="photo.jpg">
        </div>
    );
}
```
Errors (list all):
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

**Q12.**
```jsx
function NavBar() {
    return (
        <nav>
            <a href="/home">Home</a>
        </nav>
        <footer>Footer text</footer>
    );
}
```
Error: _______________________________________________
Fix: _______________________________________________

---

**Q13.**
```jsx
function ProfileCard(name, role) {
    return (
        <div>
            <h2>{name}</h2>
            <p>{role}</p>
        </div>
    );
}

// Rendered as:
<ProfileCard name="Alice" role="Developer" />
```
Error: _______________________________________________
Fix: _______________________________________________

---

## Section C: Short Answer *(1 question — 5 points)*

**Q14.** Explain the difference between **Props** and **State** in React. You don't need to explain how to use `useState` (that's Lesson 20) — just explain what distinguishes props from state at a conceptual level.

Answer: _______________________________________________

---

## Answer Key

| Q | Answer |
|:--|:-------|
| 1 | **B** — A component is a JavaScript function that returns JSX |
| 2 | **B** — React component names MUST start with a capital letter |
| 3 | **C** — JSX is a syntax extension, not a separate language |
| 4 | **B** — `class` is reserved in JS (used for ES6 classes); JSX uses `className` |
| 5 | **B** — `name` is not wrapped in `{}`, so JSX renders the literal string "name" |
| 6 | **C** — All props are bundled into one object (`props`) passed as the first argument |
| 7 | **B** — JSX requires all tags to be self-closing or have a closing tag |
| 8 | **C** — Syntax error. Two sibling elements must be wrapped in a parent or Fragment |
| 9 | **B** — Props are read-only (immutable). Attempting to write to them throws a TypeError |
| 10 | **B** — Declarative = describe the *what*, not the *how* |

**Q11 — Three errors:**
1. `class` should be `className`
2. `title` should be `{title}` — missing curly braces (renders the literal string "title")
3. `<img src="photo.jpg">` — img tag is not self-closed; should be `<img src="photo.jpg" />`

**Q12 — Error:**
Returning two sibling elements (`<nav>` and `<footer>`) without a parent wrapper.
Fix: Wrap both in a `<div>` or a Fragment (`<>...</>`).

**Q13 — Error:**
`ProfileCard` is declared as `function ProfileCard(name, role)` — it accepts two separate parameters. React only passes **one** argument: the `props` object. So `name` receives the entire props object, and `role` is `undefined`.
Fix: `function ProfileCard({ name, role })` (destructuring) or `function ProfileCard(props)` and use `props.name`, `props.role`.

**Q14 — Model Answer:**
*Props are data passed **into** a component from its parent — they are controlled externally and the child component cannot change them (read-only). State is data that lives **inside** the component itself — the component creates it, owns it, and can update it. A prop is like a configuration parameter passed to a function; state is like a local variable inside the function that the function can change over time.*
