# Student Notes — Lesson 25: Intro to Node.js, NPM & Modules

> **Launch the interactive CLI first!**
> ```bash
> cd examples/node-basics
> pnpm install   # only needed once
> pnpm start
> ```
> Navigate all 5 menu options before reading these notes — the CLI is the lesson.

---

## 1. The Big Shift: JavaScript Leaves the Browser

For the first 24 lessons, every line of JavaScript you wrote ran inside a web browser. The browser gave you `document`, `window`, `alert()` — tools for building UIs. That is called **client-side** JavaScript.

**Node.js changes everything.**

In 2009, Ryan Dahl took the **V8 Engine** — the same lightning-fast JavaScript interpreter that powers Google Chrome — and wrapped it in a standalone program that could run directly on your computer's operating system. No browser required.

The result is **Node.js**: a **runtime environment** that executes JavaScript as a server-side language — capable of reading files, connecting to databases, listening on network ports, and running as a web server.

> 🎓 **Key distinction:** JavaScript is the *language*. Node.js is the *runtime*. It's the same relationship as: Java (language) → JVM (runtime).

---

## 2. Why Node.js Became So Popular

### Single Language, Full Stack
Before Node.js, a typical web team might use JavaScript on the frontend and Python, Ruby, or Java on the backend. Node.js means you can be a **full-stack developer** using only one language. Your React skills are directly transferable.

### The Event Loop — Non-Blocking I/O
This is what makes Node.js technically special. Here's the problem it solves:

Imagine a restaurant server (a traditional, blocking server) who takes your order, walks to the kitchen, and **stands there waiting** until your food is ready before taking another table's order. That's slow.

Node.js works differently. It **never waits**. When it hits a slow operation (like a database query or reading a file), it:
1. Registers a **callback** function (a "when this is done, run this").
2. Immediately moves on to handle the next request.
3. When the database responds, the **Event Loop** picks up the callback and runs it.

This is **non-blocking, event-driven I/O** — why Node.js can handle thousands of simultaneous users on a single thread.

```
Browser Request ──→  Node.js  ──→  Starts DB query  ──→  Handles other requests...
                                                ↓
                              DB responds  ──→  Callback fires  ──→  Sends response
```

---

## 3. NPM: The World's Largest Code Library

**NPM (Node Package Manager)** ships with every Node.js installation. It gives you access to over **2 million open-source packages** — collections of pre-written code you can drop into your project.

### Key Commands

| Command | What it does |
|---|---|
| `pnpm init` | Creates a `package.json` to start a new project |
| `pnpm install chalk` | Downloads `chalk` into `node_modules/` and saves it as a dependency |
| `pnpm install -D nodemon` | Installs as a **dev dependency** (only for development, not production) |
| `node filename.js` | Runs a file with the Node.js runtime |

### The `package.json` Manifest
This file is the **single source of truth** for your project. It records:
- Your project name and version.
- Run scripts (e.g., `"start": "node src/index.js"`).
- Every package your project needs — both `dependencies` and `devDependencies`.

### The Golden Rule: Never Commit `node_modules`
The `node_modules` folder can be hundreds of megabytes. Instead, your `.gitignore` excludes it, and `package.json` acts as the recipe. Any developer who clones your repo just runs `pnpm install` to rebuild `node_modules` exactly.

---

## 4. Modules: Sharing Code Across Files

Real-world applications are never one file. You split code into **modules** — files that export specific functions, and other files that import what they need.

Node.js supports **two** module systems. You must know both.

### A. CommonJS — The Original Node Standard

```javascript
// ── FILE: math.cjs ────────────────────────────────────────────────────────

function add(a, b)      { return a + b; }
function subtract(a, b) { return a - b; }

//  Attach what you want to share to module.exports
module.exports = { add, subtract };
```

```javascript
// ── FILE: app.cjs ─────────────────────────────────────────────────────────

const math = require('./math.cjs'); //  require() brings it in

console.log(math.add(5, 3));      // → 8
console.log(math.subtract(10, 4)); // → 6
```

You will see CommonJS everywhere: older codebases, Node tool configs (`postcss.config.cjs`), and libraries that haven't migrated.

### B. ES Modules — The Modern Standard (Same as React!)

```javascript
// ── FILE: math.js ─────────────────────────────────────────────────────────

//  Named exports — use the export keyword
export function multiply(a, b) { return a * b; }
export function divide(a, b)   {
  if (b === 0) return 'Cannot divide by zero';
  return a / b;
}
```

```javascript
// ── FILE: app.js ──────────────────────────────────────────────────────────

//  Named imports — destructure from the path
import { multiply, divide } from './math.js';  // .js extension is required in Node!

console.log(multiply(4, 5)); // → 20
console.log(divide(20, 4));  // → 5
```

**To enable ES Modules in Node.js:** add `"type": "module"` to your `package.json`.

### Comparison at a Glance

| Feature | CommonJS | ES Modules |
|---|---|---|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| File extension | `.js` or `.cjs` | `.js` or `.mjs` |
| Enabled by default in Node? | ✅ Yes | ❌ Need `"type": "module"` |
| Same syntax as React? | ❌ No | ✅ Yes |
| Works in browser? | ❌ No | ✅ Yes (natively) |

---

## 5. Running the Live Demo

Inside the CLI app, select **"🛠  Live Demo — Run CJS & ESM side by side"** to see both module systems produce results from the same functions. Then open the source files:

- [`src/commonjs-math.cjs`](../examples/node-basics/src/commonjs-math.cjs) — the CommonJS module
- [`src/esm-math.js`](../examples/node-basics/src/esm-math.js) — the ES Module
- [`src/index.js`](../examples/node-basics/src/index.js) — how both are imported together

---

## 6. Exercises

Open [`exercises/nodejs_practice.md`](../exercises/nodejs_practice.md) and work through the 5-exercise project:

| Exercise | Goal | Key concept |
|---|---|---|
| 1 | Initialize a blank project | `pnpm init`, `package.json` |
| 2 | Install `axios` + `chalk` | `pnpm install`, `node_modules` |
| 3 | Write a `factorial()` module | ES Module `export` |
| 4 | Build the main script | `import`, `async/await` |
| 5 | Fetch a live API with Axios | Real HTTP request from Node |

---

## Quick Reference

```bash
node -v                    # Check Node.js version
pnpm init                  # Start a new project
pnpm install <package>     # Install a dependency
pnpm install -D <package>  # Install a dev dependency
node index.js              # Run a script
```
