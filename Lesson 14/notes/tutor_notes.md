# Tutor Session Guide – Lesson 14: Asynchronous JavaScript

## ⏱️ Session Outline (Total Time: ~90 mins)

| Phase | Topic | Time |
|---|---|---|
| 1 | Hook: The Freeze Demo + Callbacks | 15 min |
| 2 | Promises — States, Creation & Consumption | 20 min |
| 3 | Async/Await — The Modern Standard | 20 min |
| 4 | Fetch API — Working with Real Data | 25 min |
| 5 | Closing Quiz & Assignment Intro | 10 min |

---

## 🔁 Phase 1: The Hook — The Blocking Problem (≈ 15 min)

### Opening Script

**Tutor:** "Before we write any async code, I need to show you WHY it exists. Watch this."

Type this live in the browser console:
```javascript
console.log("Start");
const start = Date.now();
while (Date.now() - start < 3000) {}  // Burns 3 seconds
console.log("End");
```
**Tutor:** "Try to click the browser tab, try to scroll, try anything — you can't. The browser is frozen. That's the problem with blocking code. JavaScript can only do one thing at a time."

Then show the async solution with `setTimeout`:
```javascript
console.log("1. Start");
setTimeout(() => {
    console.log("3. Async task done (2s later)");
}, 2000);
console.log("2. End — script finished!"); // Prints BEFORE line 3!
```

**Tutor (Predict-then-run):** "Before I run this — what order will you see the three console.logs? Predict out loud." Let the student guess, then run it.

**Tutor:** "The key word is: JavaScript handed off the timer to the browser's Web APIs, then moved on immediately. This is the Event Loop in action."

### The Callback Pattern — And Its Problem

Show a simple, working callback first:
```javascript
function getUser(id, callback) {
    setTimeout(() => callback({ id, name: "Travis" }), 1000);
}

getUser(1, user => {
    console.log("Got user:", user.name);
});
```

**Tutor:** "Callbacks work for one level. But real apps need to chain operations. Watch what happens." Then show Callback Hell:
```javascript
// ❌ Callback Hell — the problem Promises solve
getUser(1, user => {
    getOrders(user.id, orders => {
        getInvoice(orders[0], invoice => {
            sendEmail(invoice, result => {
                console.log("Done!"); // 4 levels deep!
            });
        });
    });
});
```

**Tutor:** "This is called Callback Hell. It's unreadable, impossible to maintain, and hard to error-handle. Promises were invented specifically to solve this."

---

## 🛠️ Teaching Analogies

### 1. The Restaurant Pager (Promises)
> "You order food and they hand you a **pager — a Promise** that food will arrive. You don't stand at the counter blocking everyone. You sit down, do other things. When the pager buzzes (**Fulfilled**), you get your food. If they run out of ingredients (**Rejected**), they come tell you and you deal with it (`.catch`)."

### 2. The Amazon Delivery Order
> "You click Order Now and you have a **Promise** — a tracking number. It's **Pending** in the mail. You don't sit on your porch until it arrives. You continue your life. Eventually it's either **Fulfilled** (delivered) or **Rejected** (lost). The Promise object tracks which state it's in."

### 3. Async/Await — The Script Pause Button
> "Imagine a stage play director giving instructions. Without `await` they shout all directions at once. With `await` they say: 'Pause here, wait for the actor to enter, then continue the scene.' The audience (browser) stays responsive — only this particular scene (async function) is paused."

### 4. fetch() and the Two-Step
> "Fetching data is like receiving a letter in two steps. First the envelope arrives — you have the postmark and sender info (`Response` object with status/headers). Only after you **open the envelope** (`response.json()`) do you read the actual letter (JSON data). Both steps take time; that's why you need two `await`s."

---

## ⚠️ Common Mistakes & Troubleshooting Guide

### Callbacks
1. **Callback Hell:** Students nest callbacks instead of chaining. Show them that Promises flatten the pyramid.

### Promises
2. **Forgetting `.catch()`:** A rejected Promise with no `.catch()` silently swallows the error. In Node.js it gives "UnhandledPromiseRejection". Always handle failures.
3. **Nesting `.then()` inside `.then()`:** This recreates Callback Hell. Promises should be flat chains.
4. **Implicit rejection:** `throw new Error()` inside a `.then()` callback automatically triggers the `.catch()`.

### Async/Await
5. **Forgetting `await` before `fetch()`:** `const data = fetch(url)` — `data` is a Promise object, not JSON. This is the **#1 most common error**.
6. **Forgetting `async` on the function:** `await` is only valid inside an `async` function. Causes SyntaxError.
7. **Missing `try/catch`:** Async functions fail silently without try/catch. Unhandled rejections are very hard to debug.

### Fetch API
8. **Not checking `response.ok`:** `fetch()` only rejects on network failure. A 404 from the server **resolves** — the student must check `response.ok` manually.
9. **Forgetting the second `await`:** `const data = await fetch(url)` — `data` is the Response object, not JSON. You must also `await response.json()`.
10. **CORS errors:** When fetching from a different domain without permission, the browser blocks the request. JSONPlaceholder has CORS enabled, so it's safe for practice.

---

## 🎬 Live Teaching Script (Phase by Phase)

### Phase 2: Promises (≈ 20 min)

**Tutor:** "A Promise is an object that says: 'I promise to give you a value eventually. Right now it's pending, but I'll be back with either a success or a failure.'"

```javascript
const myPromise = new Promise((resolve, reject) => {
    const success = true;
    setTimeout(() => {
        if (success) resolve("Data arrived! ✅");
        else         reject("Server error ❌");
    }, 2000);
});

myPromise
    .then(data  => console.log("Success:", data))
    .catch(err  => console.error("Failed:", err))
    .finally(() => console.log("Always runs, good for cleanup."));
```

**Tutor:** "Notice: the code after this block runs immediately. If I put a `console.log('Script continues...')` right after, it prints before the promise resolves. Put a `console.log` after the chain and show the student."

**Tutor (Predict-then-run moment):** "Change `success` to `false`. Before I run it — which method fires now? `.then()` or `.catch()`?"

---

### Phase 3: Async/Await (≈ 20 min)

**Tutor:** "Now let me show you why `async/await` is the modern standard. Same logic, but reads like a recipe."

Show the side-by-side difference:
```javascript
// ❌ .then() chain
myPromise
    .then(data => processData(data))
    .then(result => saveResult(result))
    .catch(err => handleError(err));

// ✅ async/await — reads top to bottom like synchronous code
async function run() {
    try {
        const data    = await myPromise;
        const result  = await processData(data);
        await saveResult(result);
    } catch (err) {
        handleError(err);
    }
}
```

**Tutor:** "Same logic. Same power. But which is easier to follow? The async/await version reads like a list of instructions. Do step 1, then step 2, then step 3."

Then demonstrate `finally`:
```javascript
async function handleData() {
    try {
        console.log("Loading...");
        const result = await myPromise;
        console.log("Success:", result);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        console.log("Cleanup — e.g. hide loading spinner");
    }
}
handleData();
```

**Tutor:** "Ask the student: 'If the promise rejects, does `finally` still run?' Yes. Always. This is where you hide loading spinners regardless of outcome."

---

### Phase 4: Fetch API (≈ 25 min)

**Tutor:** "Now let's do something real. Two `await`s to get the data — don't forget either one."

```javascript
async function getPost() {
    try {
        // Step 1: Fetch the response envelope
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

        // Step 1b: MUST check — fetch() doesn't throw on 404!
        if (!response.ok) throw new Error("Status: " + response.status);

        // Step 2: Open the envelope — parse JSON body
        const post = await response.json();

        console.log("Title:", post.title);
        console.log("ID:", post.id);
    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}
getPost();
```

**Tutor (Predict-then-run):** "What happens if I change the URL to `.../posts/99999`? Does `fetch()` throw automatically? Let the student predict, then remove the `if (!response.ok)` check and run it — show them it does NOT throw, and they get unexpected data."

Then add the check back and show the proper error message.

**Tutor:** "Show the Network tab. Open DevTools → Network. Run the fetch. Find the request in the list. Show the student the response status, headers, and body. This is the data flowing across the internet in real time."

---

## ✅ Session Closing Check (≈ 5 min)

Ask verbally before showing answers:

1. "What are the three states of a Promise?" → Pending, Fulfilled, Rejected
2. "I write `const data = fetch(url)`. What is `data`?" → A Promise object, not the JSON data
3. "The server returns a 404. Does `fetch()` automatically throw an error?" → No. You must check `response.ok` manually.
4. "Does `await` freeze the whole browser?" → No — only that specific async function pauses.
5. "Where does error handling go in an async/await block?" → Inside `try { ... } catch (err) { ... }`

---

## 📋 Session Notes & Tips

- **Use JSONPlaceholder freely** — it's a free fake API perfect for teaching. URLs to know:
  - Posts: `https://jsonplaceholder.typicode.com/posts`
  - Users: `https://jsonplaceholder.typicode.com/users`
  - Single item: add `/1`, `/2`, etc.
- **Run everything live** — async JS is much harder to understand from slides alone.
- **Show the Network tab** for at least one fetch call — seeing the real HTTP request land makes it tangible.
- **Common breakthrough moment:** When the student sees `console.log('Script continues')` print *before* the async result. That's when async JS clicks.
