# Tutor Notes — Lesson 19: Intro to React, Components, Props

## 🎯 Lesson Objectives
1. Understand the shift from imperative vanilla DOM to declarative React.
2. Define a React Component and understand Component-Based Architecture.
3. Write valid JSX and understand how it differs from standard HTML.
4. Pass data between components using Props.
5. Set up a React project using Vite.

---

## ⏱️ Session Outline (90 Minutes)

| Time | Phase | Focus |
|:---|:---|:---|
| 00–10 | **Hook** | The Vanilla DOM pain — build a card manually vs React |
| 10–25 | **The Concept** | What is React? Declarative vs Imperative, Components as Lego |
| 25–45 | **JSX & Components** | Writing functions that return JSX, rules of JSX |
| 45–60 | **Props** | Passing data down, destructuring props, rendering multiple cards |
| 60–70 | **Visualizer** | Open `react-playground.html` — live zero-build component editing |
| 70–85 | **Vite Setup** | Run `npm create vite@latest`, explore folder structure |
| 85–90 | **Wrap-up** | React DevTools extension, assignment brief |

---

## 🪝 Opening Hook: The Vanilla DOM Pain (Minutes 0–10)

> **Show them the pain before selling the cure.**

Open VS Code, create a blank `index.html` with a `<div id="app"></div>` and a `<script>` tag. Ask the student: *"How would we create a user card with a name, an image, and a button using vanilla JavaScript?"*

Write this out quickly:
```javascript
const app = document.getElementById('app');
const card = document.createElement('div');
card.className = 'user-card';

const name = document.createElement('h2');
name.textContent = 'Alice';

const btn = document.createElement('button');
btn.textContent = 'Follow';

card.appendChild(name);
card.appendChild(btn);
app.appendChild(card);
```

Ask: *"What if I need 50 of these? What if the data comes from an API? What if I need to change 'Follow' to 'Following' when clicked?"*

Explain: *"This is **imperative** programming — you are micro-managing the browser, telling it exactly HOW to build the UI step-by-step. It gets messy fast. React is **declarative**. You just declare WHAT you want it to look like, and React handles the messy DOM updates for you."*

---

## 🧠 Teaching Analogies

### Components — Lego Blocks
*"Imagine building a toy castle. You don't mold one giant piece of plastic. You use Lego blocks: a door block, a wall block, a roof block. You can reuse the wall block 50 times. In React, a UI is just a collection of Lego blocks called Components. A Navbar is a component, a Button is a component, a Tweet is a component."*

### Props — Customising the Lego Blocks
*"If a Component is a Lego block, Props are the paint you put on that block. A `Button` component is the same shape everywhere, but you use props to paint one red with 'Delete' text, and another blue with 'Submit' text. You pass instructions to the component from the outside."*

### React vs Vanilla JS — The Restaurant
*"Vanilla JS is like going into a restaurant kitchen and cooking your own meal step by step. React is like ordering from a menu. You just tell the waiter (React) what you want (the declarative UI), and the chef (React DOM) figures out how to make it and put it on your table."*

---

## ⚠️ Common Pitfalls

### Pitfall 1: Returning multiple elements without a parent
```jsx
// ❌ Syntax Error: Adjacent JSX elements must be wrapped in an enclosing tag
function User() {
    return (
        <h1>Alice</h1>
        <p>Developer</p>
    );
}

// ✅ Fix: Wrap in a div or Fragment <> </>
function User() {
    return (
        <>
            <h1>Alice</h1>
            <p>Developer</p>
        </>
    );
}
```

### Pitfall 2: Using HTML attributes instead of camelCase JSX
```jsx
// ❌ Will cause browser console warnings
<div class="card" onclick={doSomething}>

// ✅ JSX uses camelCase
<div className="card" onClick={doSomething}>
```

### Pitfall 3: Forgetting curly braces for JavaScript inside JSX
```jsx
// ❌ Renders the literal string "user.name"
<p>Hello, user.name</p>

// ✅ Renders the variable value
<p>Hello, {user.name}</p>
```

### Pitfall 4: Modifying Props
Props are strictly **read-only**.
```jsx
function Button(props) {
    // ❌ TypeError! Cannot assign to read only property
    props.text = "Loading..."; 
    return <button>{props.text}</button>;
}
```

---

## 📝 Checking for Understanding

1. *"What is a React Component technically? Just in terms of JavaScript."*
   → It's just a JavaScript function that returns JSX.

2. *"If a parent passes `<Card title="Hello" />`, how does the child access that string?"*
   → Through the `props` object: `props.title`.

3. *"Why do we use `className` instead of `class` in JSX?"*
   → Because JSX compiles down to JavaScript, and `class` is a reserved keyword in JavaScript (used for making classes).

4. *"Can a child component change the props it receives from its parent?"*
   → No. Props are read-only (immutable). If data needs to change, it requires State (next lesson).

5. *"What does declarative mean in the context of React?"*
   → You describe *what* the UI should look like for a given state, rather than writing step-by-step instructions on *how* to construct the DOM.

---

## 🔴 Live Debug Scenarios

**Scenario 1:** The screen goes completely blank.
- Cause: Usually a syntax error in JSX, like an unclosed tag, or returning multiple root elements without a fragment wrapper `<>...</>`.
- Fix: Check the browser console. Teach the student to always look at the console first in React.

**Scenario 2:** `[object Object]` appears on the screen instead of text.
- Cause: The student tried to render a full JavaScript object directly in JSX: `<p>{user}</p>`.
- Fix: React cannot render objects. You must render strings, numbers, or arrays. Change it to `<p>{user.name}</p>`.

**Scenario 3:** Props are undefined.
- Cause: Student destructured the props wrong. E.g., `function Card(title) { ... }` instead of `function Card({ title }) { ... }`.
- Fix: Remind them that React passes ONE object called `props`. They must either use `props.title` or destructure the object properly with curly braces.

**Scenario 4:** Vite dev server won't start.
- Cause: Student ran `npm run dev` in the root folder instead of inside the newly created Vite folder.
- Fix: `cd my-react-app` then `npm run dev`.
