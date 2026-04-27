# Guided Exercises – Lesson 14: Asynchronous JS & Fetch

## How to Use This File

Work through each challenge **in order** inside a new `practice14.js` file linked to a simple `index.html`.

**The Predict-then-Run Rule:** Before running each challenge, write your expected output as a comment. The gap between your prediction and reality is where the real learning happens.

---

## 🟢 Beginner: Timing & Promise Basics

### Challenge 1 — The Timeout Race
**Concept:** Understanding non-blocking execution order.

1. Log `"Start"`.
2. Use `setTimeout` to log `"Async Task Done"` after 2 seconds (2000ms).
3. Log `"End"` immediately after the `setTimeout` call.

**Your prediction first:**
```javascript
// What order will these print, and when?
// Line 1: ???  (instant or 2s later?)
// Line 2: ???  (instant or 2s later?)
// Line 3: ???  (instant or 2s later?)
```

**✅ Expected output:**
```
Start                      ← instant
End                        ← instant (before the timeout!)
Async Task Done            ← 2 seconds later
```

> **Checkpoint:** Did you expect "End" before "Async Task Done"? This is the core insight of asynchronous JS — `setTimeout` does not pause the program.

---

### Challenge 2 — Creating a Simple Promise
**Concept:** Promise constructor syntax and consumption.

1. Create a `const p = new Promise(...)`.
2. Inside the executor, use `setTimeout` to wait **1 second**.
3. After 1 second, call `resolve("Data loaded successfully!")`.
4. Chain `.then(data => console.log(data))` to consume it.

**✅ Expected output (after 1 second):**
```
Data loaded successfully!
```

---

### Challenge 3 — Promise Rejection
**Concept:** Handling failures with `.catch()`.

1. Copy Challenge 2 but call `reject("Server offline.")` instead of `resolve`.
2. Add `.catch(err => console.error("Error:", err))` to handle it.

**✅ Expected output (after 1 second):**
```
Error: Server offline.
```

> **⚠️ Gotcha:** Without `.catch()`, a rejected Promise silently fails in some environments but throws an "Unhandled Promise Rejection" warning in Node.js. Always handle rejections.

---

### Challenge 4 — The `.finally()` Block
**Concept:** Code that always runs regardless of outcome.

1. Build a promise that **randomly** resolves or rejects (use `Math.random() > 0.5`).
2. Chain `.then(...)`, `.catch(...)`, AND `.finally(() => console.log("Cleanup done."))`.
3. Run it multiple times. The `.finally()` should always print.

**✅ Expected output patterns:**
```
// Success run:      // Failure run:
Data arrived!       Error caught!
Cleanup done.       Cleanup done.
```

---

## 🟡 Intermediate: Async / Await

### Challenge 5 — Refactoring to Async/Await
**Concept:** Converting `.then()` to `async/await`.

Take the promise from Challenge 2. Instead of using `.then()`, write an `async function waitAndLog()` that uses `await` to wait for the result, then logs it.

> **🔑 Reminder:** The function must be declared with `async` for `await` to work inside it.

**✅ Expected output (after 1 second):**
```
Data loaded successfully!
```

---

### Challenge 6 — Error Handling with Try/Catch
**Concept:** `try...catch` as the async/await error handler.

1. Write an `async` function.
2. Inside it, `await` a Promise that **rejects** with `"Something went wrong."`.
3. Wrap the `await` in `try { ... } catch (err) { ... }`.
4. Log a friendly message in the `catch` block.
5. Add a `finally` block that logs `"Function finished."`.

**✅ Expected output:**
```
Caught error: Something went wrong.
Function finished.
```

---

### Challenge 7 — The Double Wait (Sequential vs Parallel)
**Concept:** Sequential async operations and timing.

1. Write an `async` function.
2. Manually `await` a 1-second delay, then log `"Step 1 complete"`.
3. Manually `await` another 1-second delay, then log `"Step 2 complete"`.
4. Note the total time — it should be ~2 seconds total.

```javascript
// Helper: creates a delay promise
const delay = ms => new Promise(r => setTimeout(r, ms));
```

**✅ Expected output:**
```
Step 1 complete   ← after 1s
Step 2 complete   ← after 2s total
```

> **Reflection:** Why does this take 2 seconds and not 0? Because `await` pauses the function until each delay resolves before moving to the next line.

---

## 🔴 Advanced: Fetch API

### Challenge 8 — My First Fetch (with `.then()`)
**Concept:** Basic GET request the old way.

1. Call `fetch('https://jsonplaceholder.typicode.com/posts/1')`.
2. Chain `.then(res => res.json())` to parse the body.
3. Chain `.then(post => console.log("Title:", post.title))`.
4. Chain `.catch(...)` to handle errors.

**✅ Expected output:**
```
Title: sunt aut facere repellat provident occaecati excepturi optio reprehenderit
```

---

### Challenge 9 — Fetch with Async/Await (The Modern Way)
**Concept:** The two-step fetch pattern.

Rewrite Challenge 8 as an `async function fetchPost()`:
1. `await fetch(...)` → store as `response`.
2. Check `if (!response.ok) throw new Error(...)`.
3. `await response.json()` → store as `post`.
4. Log `post.body`.
5. Wrap all in `try/catch`.

**✅ Expected output:**
```
quia et suscipit
suscipit recusandae consequuntur expedita et cum
reprehenderit molestiae ut ut quas totam...
```

---

### Challenge 10 — Handling a 404 Gracefully
**Concept:** Detecting server errors with `response.ok`.

1. Fetch from `https://jsonplaceholder.typicode.com/posts/99999` (doesn't exist).
2. Inside your async function, check `if (!response.ok)`.
3. Throw `new Error("Post not found — status: " + response.status)`.
4. Catch and log the error.

**✅ Expected output:**
```
Error: Post not found — status: 404
```

> **Key lesson:** `fetch()` did NOT automatically throw. If you removed the `response.ok` check, the code would try to parse the 404 response and give you confusing results. Always check `response.ok`.

---

## 🌟 Bonus Stretch Challenges

### Challenge 11 — Building a Dynamic List
Fetch all posts from `https://jsonplaceholder.typicode.com/posts`. Use `.slice(0, 5)` to get the first 5. Use `.map()` to build an array of title strings. Log the array.

**✅ Expected output:**
```
["sunt aut facere...", "qui est esse", "ea molestiae...", ...]
```

### Challenge 12 — Parallel Fetching with `Promise.all()`
Research `Promise.all()`. Fetch posts 1, 2, and 3 **all at the same time** and log all three titles only once all three have arrived.

```javascript
// Hint:
const [post1, post2, post3] = await Promise.all([
    fetch(url1).then(r => r.json()),
    fetch(url2).then(r => r.json()),
    fetch(url3).then(r => r.json()),
]);
```

> **Reflection Questions (write as comments):**
> 1. What is the difference between `fetch(url)` and `await fetch(url)`?
> 2. Why does a 404 response NOT trigger the `.catch()` block?
> 3. What does `await` actually do to the function while it waits?
> 4. Why is `Promise.all()` faster than three sequential `await` calls?
