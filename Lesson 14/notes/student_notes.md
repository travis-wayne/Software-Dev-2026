# Student Notes — Lesson 14: Asynchronous JavaScript

## 1. The Problem — Blocking Code

JavaScript is **single-threaded**: it executes one line at a time on one thread. If a slow task runs, everything else waits.

```javascript
console.log("Start");
for (let i = 0; i < 2_000_000_000; i++) {} // Blocks for ~2 seconds
console.log("End");  // Only prints after loop
```

In a browser this means: no scrolling, no button clicks, nothing — the page is frozen.

### The Event Loop (How Async Works)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  CALL STACK  │ --> │   WEB APIs   │ --> │  CALLBACK QUEUE  │
│              │     │              │     │                  │
│  main()      │     │ setTimeout   │     │  callback()  ──> │--> Call Stack
│              │     │ fetch()      │     │                  │
└──────────────┘     └──────────────┘     └──────────────────┘
```

1. **Call Stack** — where your code runs right now.
2. **Web APIs** — where async tasks (setTimeout, fetch) wait in the background.
3. **Callback Queue** — where finished tasks wait to return to the Call Stack.

The **Event Loop** constantly checks: "Is the Call Stack empty? If yes, move the next callback from the queue."

---

## 2. Callbacks — The Old Way (And Why They're Painful)

The first solution was passing functions as arguments:

```javascript
// Simple callback — fine for one level
setTimeout(() => {
    console.log("Done!");
}, 2000);
```

The problem: **Callback Hell** — when you need to sequence async operations.

```javascript
// ❌ Callback Hell — unreadable pyramid of doom
getUserData(userId, function(user) {
    getOrders(user.id, function(orders) {
        getInvoice(orders[0].id, function(invoice) {
            sendEmail(invoice, function(result) {
                console.log("Done!"); // buried 4 levels deep
            });
        });
    });
});
```

Promises and Async/Await solve this completely.

---

## 3. Promises — The Modern Foundation

A **Promise** is an object representing the eventual result of an async operation. It is always in one of three states:

| State | Meaning | Analogy |
|:---|:---|:---|
| **Pending** | Waiting for result | Package is in the mail |
| **Fulfilled** | Operation succeeded | Package delivered |
| **Rejected** | Operation failed | Package lost |

### Creating a Promise
```javascript
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        if (success) resolve("Data arrived! ✅");
        else         reject("Server error ❌");
    }, 2000);
});
```

### Consuming a Promise
```javascript
myPromise
    .then(data  => console.log("Success:", data))   // runs if Fulfilled
    .catch(err  => console.error("Error:", err))     // runs if Rejected
    .finally(() => console.log("Always runs"));      // runs regardless
```

> ⚠️ **Chain flat, never nest:** Each `.then()` returns a new Promise, so you chain horizontally — not inside each other.

---

## 4. Async / Await — The Cleanest Syntax

`async/await` is "syntactic sugar" for Promises. It makes async code look like synchronous code.

### The Rules
1. Mark a function with `async` to make it asynchronous.
2. Inside it, `await` any Promise — execution pauses here **for this function only** (the browser stays responsive).
3. Always wrap `await` calls in `try...catch`.

### Old `.then()` Chain vs Modern Async/Await

```javascript
// ❌ .then() chain — workable but verbose
fetch(url)
    .then(res  => res.json())
    .then(data => console.log(data.name))
    .catch(err => console.error(err));

// ✅ async/await — reads like synchronous code
async function getName() {
    try {
        const res  = await fetch(url);
        const data = await res.json();
        console.log(data.name);
    } catch (err) {
        console.error(err);
    }
}
```

### try / catch / finally
```javascript
async function doWork() {
    try {
        const result = await someAsyncOp();
        console.log("Success:", result);
    } catch (err) {
        console.error("Failed:", err.message);
    } finally {
        console.log("This always runs — good for cleanup");
    }
}
```

---

## 5. The Fetch API — Getting Real Data

`fetch()` is the standard browser API for making HTTP requests. It returns a Promise.

### ⚠️ The Critical Rule: `response.ok`
`fetch()` **only rejects** if there is a network error (no internet, bad URL).
A `404` or `500` from the server **still resolves** — you must check `response.ok` yourself.

```javascript
async function getUser(id) {
    try {
        // Step 1: Fetch the response (headers + status)
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

        // Step 1b: Check if server returned success (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // Step 2: Parse the JSON body (also async!)
        const user = await response.json();

        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
    } catch (err) {
        console.error("Could not load user:", err.message);
    }
}
getUser(1);
```

### HTTP Status Codes to Know

| Code | Meaning | `response.ok` |
|:---|:---|:---|
| 200 | OK — success | ✅ true |
| 201 | Created — success | ✅ true |
| 400 | Bad Request — your fault | ❌ false |
| 401 | Unauthorized | ❌ false |
| 404 | Not Found | ❌ false |
| 500 | Server Error | ❌ false |

---

## 6. Working with JSON

JSON is the universal data format for APIs. It looks like a JS object but it is a **string**.

```javascript
// Converting JS Object → JSON string
const str = JSON.stringify({ name: "Alex", age: 28 });
// '{"name":"Alex","age":28}'

// Converting JSON string → JS Object
const obj = JSON.parse('{"name":"Alex","age":28}');
// { name: "Alex", age: 28 }

// response.json() does the parse for you automatically
const data = await response.json();
```

---

## 7. Async Cheat Sheet

| Task | Syntax |
|:---|:---|
| Async function | `async function myFn() { ... }` |
| Await a promise | `const val = await somePromise;` |
| Handle errors | `try { ... } catch (err) { ... }` |
| Manual delay | `await new Promise(r => setTimeout(r, 1000))` |
| Fetch JSON | `const res = await fetch(url); const data = await res.json();` |
| Check success | `if (!response.ok) throw new Error(response.status)` |
| Run in parallel | `const [a, b] = await Promise.all([fetch(url1), fetch(url2)])` |

---

## 8. Pro Tips

- **Loading states:** Show a spinner before `await` — hide it in `finally`.
- **`const data = fetch(url)` (no await)** gives you a **Promise object**, not data. This is the #1 beginner mistake.
- **`await` only pauses the current async function** — the rest of the browser stays responsive.
- **Never swallow errors silently:** Always log or display caught errors, even if just to the console during development.
