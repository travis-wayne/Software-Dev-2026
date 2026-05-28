# Tutor Notes — Lesson 25: Intro to Node.js, NPM, Modules

---

## Session Objectives

By the end of this session, the student will be able to:
1. Explain what Node.js is (a runtime environment, not a language).
2. Understand the role of NPM and the `package.json` file.
3. Install third-party packages from the terminal.
4. Export and Import code using both **CommonJS** (`require`/`module.exports`) and **ES Modules** (`import`/`export`).
5. Run a JavaScript file using the Node.js CLI.

---

## Pre-Session Setup Checklist

- [ ] Ensure the student has Node.js installed (`node -v` in terminal).
- [ ] Open `Lesson 25/examples/node-basics`.
- [ ] Run `pnpm install`.
- [ ] Verify the interactive CLI works by running `pnpm start`.

---

## Pedagogical Context: The Backend Shift

This is a massive pivot for the student. Until now, JavaScript has meant "making things happen in the browser." The browser provided the `window` object, the `document` (DOM), and `alert()`. 

**Node.js has none of those.** Instead, Node provides access to the computer's file system, networks, and operating system. 

> **Analogy:** "JavaScript is an engine. For the last 24 lessons, that engine was bolted into a car (the browser). Node.js takes that exact same engine and bolts it into a helicopter (the server). The engine works the exact same way, but the vehicle can do completely different things."

---

## Lesson Flow (90-minute session)

### Phase 1 — Introduction via Interactive CLI (25 minutes)
Instead of lecturing, let the CLI do the teaching.
1. Have the student navigate to `examples/node-basics` in their terminal.
2. Tell them to run `pnpm install`, then `pnpm start`.
3. The beautiful `inquirer` and `boxen` CLI will appear. Have the student navigate through the **Read Concept** menus.
4. **Key Teaching Moment:** Explain that *this entire CLI* is built with JavaScript! Point out how different it feels from a React web app. 

### Phase 2 — NPM and package.json (20 minutes)
1. Open the `package.json` file in the `node-basics` project.
2. Explain the `"dependencies"` block. Point out `chalk`, `inquirer`, and `boxen` — these are what make the CLI look cool.
3. Explain the `node_modules` folder. Tell them to look inside it (it's huge).
4. **Golden Rule:** Reinforce *why* we never commit `node_modules` to Git. (It's too heavy; `package.json` is the instruction manual to rebuild it).

### Phase 3 — Modules: CommonJS vs ESM (30 minutes)
This is where students often get confused in modern JS. 

1. Go back to the CLI and run the **"Run Module Demo (CJS vs ESM)"** option.
2. Open `src/commonjs-math.cjs`. Explain that `module.exports` and `require()` was the original way Node shared code. It is still everywhere.
3. Open `src/esm-math.js`. Explain that `export` and `import` is the modern standard (which they already know from React).
4. Show how `package.json` has `"type": "module"` — this is what tells Node to allow the modern `import` syntax.

### Phase 4 — The Interactive Quiz (15 minutes)
1. Go back to the CLI main menu.
2. Have the student select **"Take the Interactive Quiz"**.
3. Let them answer the 5 questions. If they get one wrong, use the CLI's explanation output as a talking point.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `Cannot use import statement outside a module` | Forgot `"type": "module"` in `package.json` | Add `"type": "module"` to `package.json` |
| `require is not defined` | Trying to use `require()` in an ES Module | Use `import`, or create a `require` function using `createRequire(import.meta.url)` |
| `Cannot find module 'chalk'` | Forgot to run `pnpm install` | Run `pnpm install` to download dependencies |
| `SyntaxError: Unexpected identifier` | Mixing CJS and ESM syntaxes improperly | Ensure `.cjs` extension for CommonJS when inside a `"type": "module"` project |

---

## Key Questions to Check Understanding

1. *"If I want to build a React app, do I use Node.js?"* (Answer: Yes, the build tools like Vite run on Node.js, even though the final code runs in the browser.)
2. *"Why don't we push the `node_modules` folder to GitHub?"* (Answer: It's too big, and `package.json` provides all the instructions needed to recreate it via `npm install`.)
3. *"What is the modern equivalent of `module.exports = add;`?"* (Answer: `export default add;` or `export { add };`)

---

## Post-Session Assignment (For Student)
Direct the student to `Lesson 25/exercises/nodejs_practice.md` where they will initialize their own blank Node.js project, install the `axios` library, and fetch data from a public API.
