# Quiz — Lesson 20: State Management (useState & useEffect)

> **Instructions:** Answer all questions before checking the answer key.
> Estimated time: 20 minutes.

---

## Section A: Multiple Choice *(10 questions — 1 point each)*

**Q1.** Why can't you use a plain `let` variable instead of `useState` to make a component dynamic?
- A) `let` variables are not allowed inside React components
- B) React is not aware of plain variable changes, so it won't re-render the component when the value changes
- C) `let` variables reset to their initial value on every render
- D) `useState` is faster than `let`

---

**Q2.** What does calling the setter function (e.g., `setCount(5)`) do?
- A) Changes the variable directly and updates the DOM manually
- B) Schedules a re-render of the component with the new value
- C) Changes the value but does NOT trigger a re-render
- D) Sends the new value to the parent component

---

**Q3.** What is the initial value of `score` here: `const [score, setScore] = useState(100)`?
- A) `undefined`
- B) `0`
- C) `100`
- D) `null`

---

**Q4.** You have:
```jsx
const [items, setItems] = useState(['a', 'b']);
```
Which update correctly adds `'c'` to the array and triggers a re-render?
- A) `items.push('c');`
- B) `setItems(items.push('c'));`
- C) `setItems([...items, 'c']);`
- D) `items = [...items, 'c'];`

---

**Q5.** What is a "side effect" in the context of React?
- A) A bug caused by poor state management
- B) An operation that affects something outside the component's rendering (e.g., data fetch, DOM change, timer)
- C) A prop that is passed from child to parent
- D) Any function that returns JSX

---

**Q6.** When does this `useEffect` run?
```jsx
useEffect(() => {
    console.log('hello');
}, []);
```
- A) After every render
- B) Before the component mounts
- C) Once, after the component first mounts
- D) Whenever the component unmounts

---

**Q7.** When does this `useEffect` run?
```jsx
useEffect(() => {
    fetchData();
}, [userId]);
```
- A) Once only, when the component first mounts
- B) After every render, always
- C) Once on mount, and again whenever `userId` changes
- D) Only when `userId` is `null`

---

**Q8.** Why should you return a cleanup function from `useEffect`?
- A) To reset state to its initial value
- B) To stop ongoing side effects (timers, subscriptions, listeners) before the component unmounts or the effect re-runs
- C) To trigger a re-render after the effect completes
- D) It is required for every `useEffect` — you always must return a function

---

**Q9.** Which form of `setCount` is safest when the new state depends on the old state inside an async context (e.g., `setInterval`)?
- A) `setCount(count + 1)` — uses the current `count` variable
- B) `setCount(prev => prev + 1)` — uses the latest state value
- C) `count = count + 1` — direct mutation
- D) `setCount(0)` — reset and then re-increment

---

**Q10.** What would happen if you wrote this?
```jsx
useEffect(() => {
    setCount(count + 1);
}, [count]);
```
- A) `count` increments once and stops
- B) Nothing happens — `count` doesn't change
- C) Infinite loop — every state update triggers the effect, which updates state again
- D) A React error is thrown immediately

---

## Section B: Trace Questions *(2 questions — 5 points each)*

**Q11.** Predict the console output when this component first mounts AND after one button click.

```jsx
function Counter() {
    const [count, setCount] = useState(0);
    console.log('render — count:', count);

    useEffect(() => {
        console.log('effect ran — count:', count);
    }, [count]);

    return <button onClick={() => setCount(count + 1)}>Click</button>;
}
```

**On first mount:**
```
Console output (in order):
1. _______________________________________________
2. _______________________________________________
```

**After one button click:**
```
Console output (in order):
3. _______________________________________________
4. _______________________________________________
```

---

**Q12.** Match each `useEffect` pattern (A–D) to its description (1–4).

```
A. useEffect(() => { doSomething(); });

B. useEffect(() => { doSomething(); }, []);

C. useEffect(() => { doSomething(); }, [value]);

D. useEffect(() => {
       doSomething();
       return () => cleanup();
   }, []);
```

| Pattern | Match | Description |
|:---|:---|:---|
| A | ___ | 1. Runs once on mount; cleanup runs on unmount |
| B | ___ | 2. Runs on mount and every time `value` changes |
| C | ___ | 3. Runs after every single render |
| D | ___ | 4. Runs once on mount only |

---

## Section C: Short Answer *(1 question — 5 points)*

**Q13.** A student writes a data-fetching component:
```jsx
function DataFetcher() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/api/data')
            .then(res => res.json())
            .then(json => setData(json));
    }, [data]); // <-- student added 'data' as a dependency

    return <div>{JSON.stringify(data)}</div>;
}
```
Identify the bug and explain exactly why it occurs. What is the correct fix?

Answer: _______________________________________________

---

## Answer Key

| Q | Answer |
|:--|:-------|
| 1 | **B** — React only re-renders when state changes via `useState`; plain variables are invisible to React |
| 2 | **B** — Calling a setter schedules a re-render with the new value |
| 3 | **C** — The argument to `useState` is the initial value: `100` |
| 4 | **C** — `[...items, 'c']` creates a new array reference; React detects the change and re-renders |
| 5 | **B** — Side effects interact with things outside the React render cycle |
| 6 | **C** — Empty dependency array `[]` = runs once after first mount |
| 7 | **C** — With `[userId]`: runs on mount AND whenever `userId` changes |
| 8 | **B** — Cleanup prevents memory leaks and stale operations after a component unmounts |
| 9 | **B** — Functional update `prev => prev + 1` always uses the latest state, avoiding stale closures |
| 10 | **C** — Infinite loop: `setCount` updates `count`, which is in the dependency array, which triggers the effect again |

**Q11 — Trace:**

On first mount:
1. `"render — count: 0"` *(function body runs first)*
2. `"effect ran — count: 0"` *(effect runs after render)*

After one button click:
3. `"render — count: 1"` *(state changed → re-render, function body runs)*
4. `"effect ran — count: 1"` *(effect re-runs because `count` changed)*

**Q12 — Matching:**
| Pattern | Match |
|:---|:---|
| A | **3** — Runs after every single render (no dependency array) |
| B | **4** — Runs once on mount only (empty array) |
| C | **2** — Runs on mount and when `value` changes |
| D | **1** — Runs once on mount; cleanup runs on unmount |

**Q13 — Bug explanation:**
The bug is an **infinite loop**. Here is why: the effect fetches data → `setData(json)` updates the state → `data` changes → since `data` is in the dependency array, the effect runs again → fetches again → `setData` again → infinite loop.

**Fix:** Change the dependency array to `[]` (empty). The fetch should only run once when the component mounts, not every time `data` changes:
```jsx
useEffect(() => {
    fetch('/api/data')
        .then(res => res.json())
        .then(json => setData(json));
}, []); // ✅ Only fetch on mount
```
