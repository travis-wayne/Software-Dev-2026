# Tutor Notes — Lesson 20: State Management (useState, useEffect)

## 🎯 Lesson Objectives
1. Explain what state is and why plain variables fail for dynamic UIs.
2. Use `useState` to declare, read, and update state.
3. Differentiate props (external data) from state (internal data).
4. Use `useEffect` for side effects with correct dependency arrays.
5. Write cleanup functions to prevent memory leaks.

---

## ⏱️ Session Outline (90 Minutes)

| Time | Phase | Focus |
|:---|:---|:---|
| 00–10 | **Hook** | The broken counter — show why plain variables don't work in React |
| 10–30 | **useState** | Concept, syntax, counter demo, toggle demo |
| 30–40 | **Props vs State** | Table comparison, live question round |
| 40–65 | **useEffect** | Side effects concept, 3 dependency patterns, data fetch |
| 65–75 | **Cleanup Functions** | Timer/listener teardown demo |
| 75–85 | **Visualizer** | Open `state-visualizer.html`, explore all three tabs |
| 85–90 | **Wrap-up** | Common mistakes table, assignment brief |

---

## 🪝 Opening Hook: The Broken Counter (Minutes 0–10)

> **Show the student code that *looks* like it should work — and doesn't.**

Open VS Code and create this component, then render it:

```jsx
// ❌ THIS DOES NOT WORK — and understanding WHY is the whole point of today
function BrokenCounter() {
    let count = 0; // Plain JavaScript variable

    function increment() {
        count = count + 1;
        console.log('count is now:', count); // Log shows it's changing...
    }

    return (
        <div>
            <p>Count: {count}</p>  {/* ...but this never updates! */}
            <button onClick={increment}>+1</button>
        </div>
    );
}
```

Click the button several times. The console log shows `count` increasing — but the UI stays at 0.

Ask: *"The variable IS changing — you can see it in the console. So why doesn't the screen update?"*

Let the student think. Then explain:

> *"React only re-renders a component when it knows something has changed. A plain `let` variable is invisible to React — it has no idea you changed it. `useState` creates a special variable that React IS watching. When you call the setter function, React knows: 'Something changed — re-render this component.'"*

---

## 🧠 Teaching Analogies

### useState — The Whiteboard
*"Imagine React is a whiteboard in a meeting room. The text on the whiteboard is what the user sees. You can shout words across the room all you like — but the whiteboard won't change until someone physically walks up and erases and rewrites it. `useState` is the marker and eraser. Calling the setter function is the act of walking up to the whiteboard and rewriting it. React sees the change and re-renders."*

### useEffect — The Side Hustle
*"Your component's main job is to return JSX — to describe what the UI looks like. But sometimes a component needs to do something extra: fetch data, update the page title, listen for keyboard events. These 'extra jobs' are side effects — they're not about rendering, they're about interacting with the world outside React. `useEffect` is the hook for these side jobs, and it runs after the component has rendered."*

### Dependency Array — The Trigger List
*"The dependency array is a list of things `useEffect` is watching. If you walk past a motion sensor, it triggers. If you walk past again, it triggers again. But if you set the sensor to only respond to a specific person's badge — it only triggers when that badge is detected. An empty dependency array `[]` means 'only trigger once when I first appear'. A dependency `[count]` means 'only trigger when count changes'."*

---

## ⚠️ Common Pitfalls — Know These Before the Session

### Pitfall 1: Infinite Loop with useEffect
```jsx
// ❌ INFINITE LOOP — effect updates state, state triggers re-render, re-render triggers effect
useEffect(() => {
    setCount(count + 1); // Never do this without a condition
});
```
**The Fix:** Always include a dependency array. If the effect updates state, ensure that state is NOT in the dependency array, or add a condition to stop it.

### Pitfall 2: Stale State in setTimeout / setInterval
```jsx
// ❌ STALE CLOSURE — count is captured as 0 at the time the effect runs
useEffect(() => {
    const interval = setInterval(() => {
        setCount(count + 1); // 'count' is always 0 here!
    }, 1000);
    return () => clearInterval(interval);
}, []); // Empty array = effect runs once, count is frozen at 0
```
**The Fix:** Use the **functional update form**: `setCount(prev => prev + 1)`. This uses the latest value instead of the captured one.

### Pitfall 3: Missing Dependency Array (runs every render)
```jsx
// ⚠️ Runs after EVERY render — probably not what you want for data fetching
useEffect(() => {
    fetchData();
}); // No dependency array at all!
```
**The Fix:** Add `[]` to fetch only on mount, or `[searchQuery]` to fetch when the query changes.

### Pitfall 4: Direct State Mutation
```jsx
const [items, setItems] = useState([]);
// ❌ Mutating the array directly — React won't see the change
items.push('new item');
setItems(items); // Same reference — no re-render triggered

// ✅ Create a new array
setItems([...items, 'new item']);
```

### Pitfall 5: Forgetting the Cleanup Function
When a component using `setInterval` or an event listener unmounts, the effect keeps running in the background. This causes memory leaks and state-update-after-unmount warnings.

---

## 📝 Checking for Understanding

1. *"I have `const [name, setName] = useState('Alice')`. I call `setName('Bob')`. What happens?"*
   → React re-renders the component. `name` is now `'Bob'` in the new render.

2. *"What is the difference between props and state?"*
   → Props are passed in from a parent (read-only). State is managed inside the component (can be updated).

3. *"I write `useEffect(() => { console.log('hello') }, [])`. When does 'hello' log?"*
   → Once, after the component first mounts. The empty array means no dependencies to watch.

4. *"I write `useEffect(() => { fetchUser() }, [userId])`. When does `fetchUser` run?"*
   → Once on mount, and again whenever `userId` changes value.

5. *"Why do we return a function from useEffect sometimes?"*
   → The returned function is the cleanup. It runs before the component unmounts (or before the effect runs again). Used to clear timers, remove event listeners, cancel subscriptions.

6. *"I push a value directly into a state array: `myArray.push(x); setMyArray(myArray)`. Will React re-render?"*
   → No. React does a shallow reference check. The array reference didn't change. Use `setMyArray([...myArray, x])` instead.

---

## 🗺️ When to Use Which Pattern

Draw this for the student at the 65-minute mark:

```
useEffect(() => {
    // your effect
});                    → Runs after EVERY render. Rarely what you want.

useEffect(() => {
    // your effect
}, []);                → Runs ONCE on mount. Good for: initial data fetch, 
                         setting up global listeners.

useEffect(() => {
    // your effect
}, [value]);           → Runs on mount AND when 'value' changes. Good for:
                         fetching when a search term changes, syncing state
                         to localStorage.

useEffect(() => {
    // your effect
    return () => {
        // cleanup
    };
}, []);                → Runs once on mount, cleanup runs on unmount.
                         Good for: timers, event listeners, WebSocket connections.
```

---

## 🔴 Live Debug Scenarios

**Scenario 1:** Counter displays 0 and never changes.
- Cause: Student used `let count = 0` instead of `useState(0)`.
- Fix: Replace with `const [count, setCount] = useState(0)` and call `setCount(count + 1)`.

**Scenario 2:** Data fetch runs in an infinite loop — network tab shows constant requests.
- Cause: `useEffect` has no dependency array, or has `data` (the fetched result) as a dependency.
- Fix: Add `[]` as dependency array. Never put the fetched data itself in the dependency array.

**Scenario 3:** Component shows stale data after a timer runs.
- Cause: Stale closure — state value was captured at the time the effect ran.
- Fix: Use functional update: `setCount(prev => prev + 1)`.

**Scenario 4:** Console shows "Warning: Can't perform a React state update on an unmounted component."
- Cause: An async operation (fetch, timer) completes after the component has unmounted and tries to call a setter.
- Fix: Use a cleanup function with an `isMounted` flag or `AbortController` to cancel pending work.

**Scenario 5:** Updating state inside `useEffect` that depends on that same state → infinite loop.
- Cause: `useEffect(() => { setX(x + 1) }, [x])` — every update triggers the effect again.
- Fix: Either remove `x` from deps (use functional update) or add a condition: `if (x < 10) setX(x + 1)`.
