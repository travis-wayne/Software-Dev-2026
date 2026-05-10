# Student Notes — Lesson 20: State Management (useState, useEffect)

## 1. Why React Needs State

You already know how to build React components that display data passed in as props. But what happens when your component needs to *remember* something — like how many times a button has been clicked, whether a menu is open, or what a user typed in a form?

A plain JavaScript variable won't work:

```jsx
// ❌ This looks right — but the screen never updates
function BrokenCounter() {
    let count = 0;

    function increment() {
        count = count + 1; // The variable changes, but React doesn't know!
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+1</button>
        </div>
    );
}
```

React only re-draws (re-renders) a component when it detects a change it is aware of. A plain `let` variable is **invisible to React**. To make React aware of changing data, you need **state**.

---

## 2. useState — Making Components Remember

### Syntax

```jsx
import { useState } from 'react';

const [stateVariable, setterFunction] = useState(initialValue);
```

- `stateVariable` — the current value. Read this to display data.
- `setterFunction` — call this to update the value. Naming convention: `set` + variable name.
- `initialValue` — what the state starts as (a number, string, boolean, array, object, etc.)

### The Counter — The Simplest useState Example

```jsx
import { useState } from 'react';

function Counter() {
    const [count, setCount] = useState(0); // Initial value: 0

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

**How it works:**
1. React renders the component. `count` is `0`.
2. User clicks "+1". `setCount(1)` is called.
3. React sees the state changed → re-renders the component.
4. The new render reads `count` as `1` — the screen updates.

### Toggle — Boolean State

```jsx
function ToggleMessage() {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div>
            <button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? 'Hide' : 'Show'} Message
            </button>
            {isVisible && <p>Hello! I appear and disappear.</p>}
        </div>
    );
}
```

### Form Input — String State

```jsx
function NameInput() {
    const [name, setName] = useState('');

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} // Update state on every keystroke
                placeholder="Type your name..."
            />
            <p>Hello, {name || 'stranger'}!</p>
        </div>
    );
}
```

> **Key rule:** Never modify state directly. Always use the setter function.
> ```jsx
> // ❌ Wrong — React won't see this
> count = count + 1;
>
> // ✅ Correct — triggers re-render
> setCount(count + 1);
> ```

### Multiple State Variables

You can call `useState` multiple times in one component — each call is independent:

```jsx
function ProfileForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [age, setAge]             = useState(0);

    return (/* ...form JSX... */);
}
```

---

## 3. Props vs State — The Key Distinction

This is one of the most important concepts in React. Knowing which to use prevents a whole class of bugs.

| | **Props** | **State** |
|:---|:---|:---|
| **Where it comes from** | Passed in from a parent component | Created and owned inside the component |
| **Who controls it** | The parent | The component itself |
| **Can you change it?** | No — read only | Yes — using the setter function |
| **What triggers re-render** | Parent re-renders with new props | Calling the setter function |
| **Analogy** | Arguments passed to a function | Local variables inside a function |

```jsx
// Props: parent controls the data
function Greeting({ name }) {            // name is a PROP — from outside
    return <h1>Hello, {name}!</h1>;
}

// State: component controls its own data
function LikeButton() {
    const [likes, setLikes] = useState(0); // likes is STATE — internal
    return <button onClick={() => setLikes(likes + 1)}>👍 {likes}</button>;
}
```

**Decision rule:** If the data needs to change in response to something the user does or data that arrives, it's **state**. If it's passed in from a parent to configure or display, it's a **prop**.

---

## 4. useEffect — Doing Things Outside of Rendering

Your component's primary job is to return JSX — to describe what the screen looks like. But components often need to do things that aren't about rendering:

- Fetch data from an API when the page loads
- Update `document.title` to show the current state
- Set up a timer or event listener
- Read from / write to localStorage

These are called **side effects** — they reach outside of the component into the browser or network. `useEffect` is the React hook for side effects.

### Syntax

```jsx
import { useEffect } from 'react';

useEffect(() => {
    // Your side effect goes here
    return () => {
        // Optional cleanup — runs before the component unmounts
    };
}, [/* dependency array */]);
```

---

## 5. The Three Dependency Array Patterns

### Pattern 1: Run once on mount — `[]`

```jsx
useEffect(() => {
    console.log('Component mounted!');
    // Fetch initial data, set up a subscription, etc.
}, []); // Empty array = no dependencies = runs once only
```

Use this for: **initial data fetching, setting up event listeners once, one-time logging.**

---

### Pattern 2: Run on every render — *(no array)*

```jsx
useEffect(() => {
    console.log('Component rendered!');
}); // No array at all = runs after every single render
```

Use this for: **rarely needed. Mostly used for debugging.**

> ⚠️ If this effect sets state, you will cause an infinite loop.

---

### Pattern 3: Run when a specific value changes — `[value]`

```jsx
function SearchResults({ query }) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;
        fetchResults(query).then(data => setResults(data));
    }, [query]); // Runs on mount AND whenever `query` changes

    return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}
```

Use this for: **fetching data when a search term changes, syncing state with localStorage, responding to prop changes.**

---

## 6. Data Fetching with useEffect

This is the most common use of `useEffect` in real applications.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]); // Re-fetches whenever userId changes

    if (loading) return <p>Loading...</p>;
    if (error)   return <p>Error: {error}</p>;
    if (!user)   return null;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
    );
}
```

> **Always handle three states when fetching:** loading, error, and success. Your UI should display something useful in each case.

---

## 7. Cleanup Functions

When a component unmounts (is removed from the screen), any ongoing side effects should be stopped. Without cleanup, you get memory leaks and errors.

### Cleaning up a Timer

```jsx
function LiveClock() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);

        // Cleanup: stop the interval when component unmounts
        return () => clearInterval(interval);
    }, []); // Empty array: set up once, clean up on unmount

    return <p>Current time: {time}</p>;
}
```

### Cleaning up an Event Listener

```jsx
function WindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        // Cleanup: remove the listener when component unmounts
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <p>Window width: {width}px</p>;
}
```

---

## 8. The Functional Update Form

When your new state depends on the previous state, always use the **functional update form** to avoid stale values:

```jsx
// ❌ Can be stale in async contexts
setCount(count + 1);

// ✅ Always uses the latest value
setCount(prevCount => prevCount + 1);

// This matters especially inside setInterval:
useEffect(() => {
    const interval = setInterval(() => {
        setCount(prev => prev + 1); // ✅ Safe — uses the latest count
    }, 1000);
    return () => clearInterval(interval);
}, []);
```

---

## 9. Common Mistakes

| Mistake | Why it's wrong | Fix |
|:---|:---|:---|
| Using `let` instead of `useState` | React can't detect the change — no re-render | Use `const [x, setX] = useState(...)` |
| Calling `setX()` inside render (not in a handler or effect) | Causes immediate re-render → infinite loop | Only call setters in event handlers or inside `useEffect` |
| No dependency array on a fetching effect | Fetches on every single render | Add `[]` for mount-only, or `[deps]` for conditional |
| Mutating state directly (`arr.push()`) | React sees the same reference — no re-render | Use `[...arr, newItem]` to create a new array |
| Forgetting cleanup for timers/listeners | Memory leaks; errors after unmount | Return a cleanup function from `useEffect` |

---

## ✅ Summary Checklist

- [ ] I understand why plain JavaScript variables don't trigger re-renders in React.
- [ ] I can use `useState` to declare state with an initial value.
- [ ] I always use the setter function — never mutate state directly.
- [ ] I know the difference: props come from parents; state lives inside the component.
- [ ] I can write all three `useEffect` dependency patterns (`[]`, no array, `[value]`).
- [ ] I can write a `useEffect` that fetches data with loading/error/success states.
- [ ] I can return a cleanup function from `useEffect` to clear timers and listeners.
- [ ] I know to use `prev => prev + 1` functional updates to avoid stale state in async code.
