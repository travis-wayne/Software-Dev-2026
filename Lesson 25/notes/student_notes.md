# Student Notes — Lesson 25: Intro to Node.js, NPM & Modules

> **Open the interactive CLI first!** 
> 1. Open your terminal in `examples/node-basics`.
> 2. Run `pnpm install`.
> 3. Run `pnpm start` to launch the interactive Node.js lesson! 🚀

---

## 1. What is Node.js?

For a long time, JavaScript could only run in one place: **the web browser**. You couldn't use JavaScript to read files on your computer, connect directly to a database, or build a web server.

In 2009, Ryan Dahl took the V8 JavaScript Engine (the ultra-fast core of Google Chrome) and wrapped it in a C++ program that could run on your computer's operating system. **That is Node.js.**

Node.js is **NOT** a programming language. It is a **runtime environment** that executes JavaScript code outside a web browser.

### Why is Node.js so popular?
- **Single Language Full-Stack:** You can write your frontend (React) and your backend (Node.js/Express) using the exact same language.
- **Event-Driven & Non-Blocking:** Unlike older languages (like PHP) that wait for a database query to finish before doing anything else, Node.js fires off the query and moves on to handle the next user. When the database finishes, Node.js comes back to it. This makes it incredibly fast for web servers.

---

## 2. What is NPM?

**NPM (Node Package Manager)** is the default package manager for Node.js. It is two things:
1. An online repository of open-source JavaScript packages (over 2 million of them!).
2. A command-line tool you use to install those packages into your project.

### The `package.json` file
Every Node.js project starts with a `package.json` file. You generate it by running `npm init` (or `pnpm init`). 

This file is your project's **manifest**. It tracks:
- Your project name and version.
- Scripts you can run (e.g., `"start": "node src/index.js"`).
- **Dependencies** — the third-party code your project needs to run.

### The `node_modules` folder
When you run `pnpm install chalk`, NPM downloads the `chalk` library from the internet and puts it in a folder called `node_modules`. 

> ⚠️ **Golden Rule:** NEVER commit `node_modules` to Git! It's too big. Instead, Git tracks your `package.json`. When another developer downloads your code, they just run `pnpm install`, and NPM looks at `package.json` to download exactly what is needed.

---

## 3. Modules: Sharing Code Between Files

When building real applications, you don't write all your code in one file. You split it into multiple files called **Modules**.

Node.js has two different module systems. You need to know both, as you will see both in the real world.

### A. CommonJS (The Older Node Standard)
This is how Node.js originally handled modules. You will see this in older codebases or when configuring tools (like `postcss.config.js`).

**Exporting (math.cjs):**
```javascript
function add(a, b) {
  return a + b;
}

// Attach the function to module.exports
module.exports = {
  add: add
};
```

**Importing (app.cjs):**
```javascript
// Use require() to bring it in
const math = require('./math.cjs');

console.log(math.add(5, 5)); // 10
```

### B. ES Modules (The Modern Standard)
This is the official JavaScript standard. It is the exact same syntax you use in React. To use this in Node.js, you must add `"type": "module"` to your `package.json`.

**Exporting (math.js):**
```javascript
// Use the export keyword
export function multiply(a, b) {
  return a * b;
}
```

**Importing (app.js):**
```javascript
// Use the import keyword
import { multiply } from './math.js';

console.log(multiply(4, 5)); // 20
```

---

## 4. Your First Node.js Script

In the exercises, you are going to write your own Node.js script. Here are the basic commands you need:

| Command | What it does |
|---|---|
| `pnpm init` | Creates a new `package.json` file to start a project. |
| `pnpm install <package>` | Downloads a package from NPM and adds it to your project. |
| `node filename.js` | Runs your JavaScript file using the Node.js runtime. |

---

## Next Steps
Head over to the `exercises/nodejs_practice.md` file to build your first Node.js module and use third-party NPM packages!
