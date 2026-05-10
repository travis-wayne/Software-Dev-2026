# Practice Exercises — Lesson 20: State Management

## ⚙️ Setup
These exercises use React. You need either:
- A running `create-react-app` or Vite React project, OR
- [CodeSandbox](https://codesandbox.io) → New Sandbox → React

Create a new file for each exercise (e.g. `Counter.jsx`) and import/render it in `App.jsx`.

---

## How to Use
1. **Predict first** — fill in the blank before running the code.
2. **Run it** to verify your answer.
3. **Explain your reasoning** — the why matters more than the answer.

---

## Part 1: useState Exercises

### Exercise 1: Trace the Re-renders
Without running the code, predict the sequence of events when a user clicks "+1" three times.

```jsx
function Counter() {
    const [count, setCount] = useState(0);
    console.log('Rendering! count =', count); // This runs on every render

    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}
```

```
// Predict before running:
// 1. On first render, the console shows: _______________________
// 2. After first click, the console shows: _______________________
// 3. After three clicks, the button displays: _______________________
// 4. How many times total did the component re-render (including initial)? ___
```

<details>
<summary>✅ Answer — Exercise 1</summary>

```
1. "Rendering! count = 0"
2. "Rendering! count = 1"
3. Count: 3
4. 4 times (1 initial render + 3 re-renders from clicks)
```
Every `setCount` call triggers a re-render. The `console.log` at the top of the function body runs every time.
</details>

---

### Exercise 2: Build the Toggle
Complete the component. A button toggles a message on and off.

```jsx
function ToggleMessage() {
    // TODO: Declare a boolean state variable `isVisible` starting as false
    const [___, ___] = useState(___);

    return (
        <div>
            {/* TODO: Button text should say "Show" when hidden, "Hide" when visible */}
            <button onClick={() => { /* TODO: flip the boolean */ }}>
                ___ Message
            </button>

            {/* TODO: Only render this paragraph when isVisible is true */}
            ___  <p>🎉 You toggled me!</p>
        </div>
    );
}
```

**Predict:**
```
// When isVisible is false, what does the button say? ___
// When isVisible is true, what does the button say? ___
// What operator flips a boolean? ___
```

---

### Exercise 3: Controlled Input
Build a controlled input that shows the typed value live.

```jsx
function LiveInput() {
    const [text, setText] = useState('');

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={/* TODO: call setText with the input's current value */}
                placeholder="Type something..."
            />
            {/* TODO: Show the character count: "Characters: 0" */}
            <p>Characters: ___</p>
            {/* TODO: Show a warning paragraph in red if text.length > 20 */}
        </div>
    );
}
```

**Analysis:**
```
// Why do we set value={text} on the input?
// Answer: _______________________________________________
// What is this pattern called in React?
// Answer: _______________________________________________
```

---

### Exercise 4: Multiple State Variables
Build a simple profile card with three independent state values.

```jsx
function ProfileCard() {
    // TODO: Three useState calls for: name (string ''), age (number 0), online (boolean false)

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Age"
                onChange={(e) => setAge(Number(e.target.value))}
            />
            <label>
                <input type="checkbox" onChange={(e) => setOnline(e.target.checked)} />
                Online
            </label>

            <hr />
            <p><strong>{name || 'Your Name'}</strong>, Age: {age}</p>
            <p>Status: {online ? '🟢 Online' : '🔴 Offline'}</p>
        </div>
    );
}
```

**Question:** Are these three state variables linked? What happens if you update `name` — does it reset `age`?
```
// Answer: _______________________________________________
```

---

## Part 2: useEffect Exercises

### Exercise 5: Identify the Pattern
For each `useEffect`, identify when it runs.

```jsx
// A:
useEffect(() => {
    console.log('A');
});

// B:
useEffect(() => {
    console.log('B');
}, []);

// C:
useEffect(() => {
    console.log('C');
}, [count]);

// D:
useEffect(() => {
    console.log('D');
    return () => console.log('D cleanup');
}, []);
```

```
// A runs: ___________________________________________________
// B runs: ___________________________________________________
// C runs: ___________________________________________________
// D runs effect: _____________________________________________
// D runs cleanup: ____________________________________________
```

<details>
<summary>✅ Answer — Exercise 5</summary>

```
A → After EVERY render (no dependency array)
B → Once, after the component mounts (empty array)
C → On mount AND whenever 'count' changes
D effect  → Once, after component mounts
D cleanup → Once, when the component unmounts
```
</details>

---

### Exercise 6: Document Title Sync
Complete the component so the document's browser tab title updates whenever `name` changes.

```jsx
function TitleSync() {
    const [name, setName] = useState('');

    useEffect(() => {
        // TODO: Set document.title to `Hello, ${name}!`
        // If name is empty, set it to 'React App'
    }, [/* TODO: what goes in the dependency array? */]);

    return (
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name..."
        />
    );
}
```

**After completing:** Type in the input and watch the browser tab title change live.

---

### Exercise 7: Data Fetch with Loading State
Complete the function so it:
1. Shows "Loading..." while the request is in-flight.
2. Shows the post title and body on success.
3. Shows an error message if the request fails.

```jsx
function PostViewer({ postId }) {
    const [post, setPost]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        // TODO: Reset loading to true and error to null at the start

        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(res => {
                // TODO: If res.ok is false, throw an Error
                return res.json();
            })
            .then(data => {
                // TODO: Set post to data and loading to false
            })
            .catch(err => {
                // TODO: Set error to err.message and loading to false
            });

    }, [/* TODO: what triggers a re-fetch? */]);

    // TODO: Return different JSX for loading, error, and success states
}

// Test in App.jsx:
// <PostViewer postId={1} />
// Then change to postId={2} — it should re-fetch automatically
```

**Questions:**
```
// Why do we reset loading and error at the START of the effect?
// Answer: _______________________________________________

// What happens if we put `post` in the dependency array instead of `postId`?
// Answer: _______________________________________________
```

---

### Exercise 8: Live Clock (Cleanup)
Build a live clock that ticks every second. Make sure the interval is properly cleaned up.

```jsx
function LiveClock() {
    const [time, setTime] = useState('');

    useEffect(() => {
        // TODO: Create an interval that updates `time` every 1000ms
        // Use: new Date().toLocaleTimeString()

        // TODO: Return a cleanup function that clears the interval
    }, []);

    return <p style={{ fontSize: '2rem' }}>🕐 {time}</p>;
}
```

**How to verify cleanup is working:**
1. Open React DevTools.
2. Render `<LiveClock />` — the clock ticks.
3. Conditionally render it with a toggle: `{show && <LiveClock />}`.
4. Hide it — the interval should stop. Open the DevTools console and confirm no more logs if you add a `console.log` inside the interval.

---

## 💡 Code Hints

<details>
<summary>Exercise 2 — Toggle Hint</summary>

```jsx
const [isVisible, setIsVisible] = useState(false);
<button onClick={() => setIsVisible(!isVisible)}>
{isVisible && <p>...</p>}
```
</details>

<details>
<summary>Exercise 3 — Controlled Input Hint</summary>

```jsx
onChange={(e) => setText(e.target.value)}
// The pattern is called a "Controlled Component" — React is the single source of truth
```
</details>

<details>
<summary>Exercise 7 — Data Fetch Hint</summary>

```jsx
useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
        .then(res => { if (!res.ok) throw new Error('Failed'); return res.json(); })
        .then(data => { setPost(data); setLoading(false); })
        .catch(err => { setError(err.message); setLoading(false); });
}, [postId]);
```
</details>

<details>
<summary>Exercise 8 — Clock Cleanup Hint</summary>

```jsx
const interval = setInterval(() => {
    setTime(new Date().toLocaleTimeString());
}, 1000);
return () => clearInterval(interval);
```
</details>
