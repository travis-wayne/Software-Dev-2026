# Student Notes — Lesson 19: Intro to React, Components, Props

## 1. What is React?

React is a JavaScript library created by Facebook for building User Interfaces (UIs). 

Before React, developers built websites using "Vanilla JavaScript" by manually finding elements and updating them (e.g., `document.getElementById('name').textContent = 'Alice'`). This is called **Imperative Programming** — you write exact, step-by-step instructions on *how* to do things. It gets very messy as applications grow.

React uses **Declarative Programming**. You write code that describes *what* the UI should look like right now, and React handles the messy work of actually updating the browser's DOM behind the scenes.

---

## 2. Component-Based Architecture

In React, you don't build "pages". You build **Components**.

Think of a UI like a Lego castle. A Component is a single Lego block.
- A Button is a component.
- A User Profile Card is a component.
- A Navigation Bar is a component (which contains Button components!).

### Writing a Component
Technically, a React component is just a standard JavaScript function that returns UI code.

```jsx
// 1. Function name MUST start with a Capital Letter
function Welcome() {
    
    // 2. It MUST return JSX (HTML-like syntax)
    return (
        <div>
            <h1>Hello, World!</h1>
            <p>Welcome to React.</p>
        </div>
    );
}
```

### Using a Component
You use a component by writing it like a custom HTML tag. You can reuse it as many times as you want!

```jsx
function App() {
    return (
        <div>
            <Welcome />
            <Welcome />
            <Welcome />
        </div>
    );
}
```

---

## 3. JSX: JavaScript XML

The HTML-like code inside the return statement is called **JSX**. It is a syntax extension for JavaScript. It looks like HTML, but it is much more powerful because you can write real JavaScript directly inside it.

### The 4 Rules of JSX

**Rule 1: Return a single root element**
You cannot return two sibling elements at the top level.
```jsx
// ❌ WRONG
return (
    <h1>Title</h1>
    <p>Subtitle</p>
);

// ✅ RIGHT (Wrap them in a div or a Fragment <>)
return (
    <>
        <h1>Title</h1>
        <p>Subtitle</p>
    </>
);
```

**Rule 2: Close all tags**
In HTML, `<img src="...">` or `<br>` are valid. In JSX, every tag MUST close.
```jsx
// ✅ RIGHT
<img src="pic.jpg" />
<br />
<input type="text" />
```

**Rule 3: camelCase property names**
Because JSX turns into JavaScript, you cannot use reserved JavaScript words like `class`. You must use camelCase.
- `class` → `className`
- `onclick` → `onClick`
- `tabindex` → `tabIndex`

```jsx
// ✅ RIGHT
<button className="btn-primary" onClick={doSomething}>Click Me</button>
```

**Rule 4: JavaScript goes in { curly braces }**
Any time you want to use a JavaScript variable, do math, or call a function inside JSX, wrap it in `{}`.

```jsx
function Greeting() {
    const name = "Alice";
    const age = 25;
    
    return (
        <div>
            <h1>Hello, {name}!</h1>
            <p>You will be {age + 1} next year.</p>
            <p>The time is {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
```

---

## 4. Props (Properties)

Components are great, but they are boring if they always look exactly the same. We need a way to pass data into a component to customise it.

**Props** (short for properties) are how you pass data from a Parent component down to a Child component. They act exactly like arguments passed to a standard JavaScript function.

### Passing Props
You pass props just like you add attributes to an HTML tag.

```jsx
function App() {
    return (
        <div>
            {/* We are passing a prop called 'name' */}
            <UserCard name="Alice" role="Admin" />
            <UserCard name="Bob" role="User" />
        </div>
    );
}
```

### Receiving Props
React gathers all the properties you pass and puts them into a single JavaScript object. The component function receives this object as its first parameter (usually called `props`).

```jsx
function UserCard(props) {
    return (
        <div className="card">
            <h2>{props.name}</h2>
            <p>Role: {props.role}</p>
        </div>
    );
}
```

### Destructuring Props (The Modern Way)
Writing `props.whatever` gets tedious. Because `props` is just an object, we usually use ES6 Object Destructuring right inside the function parameters to grab exactly what we need.

```jsx
// Exactly the same as above, but much cleaner!
function UserCard({ name, role }) {
    return (
        <div className="card">
            <h2>{name}</h2>
            <p>Role: {role}</p>
        </div>
    );
}
```

### ⚠️ The Golden Rule of Props
**Props are Read-Only.** A child component can NEVER change the props it receives from its parent. If it needs to change data, it must use State (which we will learn next lesson).

```jsx
function UserCard({ name }) {
    // ❌ ERROR! You cannot change a prop.
    name = "Hacked!"; 
    
    return <h2>{name}</h2>;
}
```

---

## 5. Setting up a React Project with Vite

While you can write React in a single HTML file using script tags (like our playground), real React apps require a "build step" to translate JSX into browser-readable JavaScript.

The modern standard tool for creating React apps is **Vite** (French for "fast").

**Step 1: Create the project**
Open your terminal and run:
```bash
npm create vite@latest my-react-app -- --template react
```

**Step 2: Enter the folder and install dependencies**
```bash
cd my-react-app
npm install
```

**Step 3: Start the development server**
```bash
npm run dev
```

Vite will give you a local URL (like `http://localhost:5173`). Open that in your browser, and every time you save a file in VS Code, the browser will instantly update!

---

## ✅ Summary Checklist

- [ ] I can explain the difference between imperative Vanilla JS and declarative React.
- [ ] I know that a React Component is just a JS function that returns JSX.
- [ ] I know that Component names must start with a Capital Letter.
- [ ] I can fix common JSX errors (missing parent wrapper, unclosed tags, using `class` instead of `className`).
- [ ] I know how to use `{}` to write JavaScript inside JSX.
- [ ] I can pass props from a Parent to a Child.
- [ ] I can destructure props in the Child's function parameters.
- [ ] I understand that props are strictly read-only.
- [ ] I can start a new React project using Vite.
