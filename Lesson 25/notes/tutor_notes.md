# Tutor Notes — Lesson 25: Intro to Node.js, NPM & Modules

---

## Session Objectives

By the end of this session the student will be able to:
1. Articulate what Node.js is and why it enabled JavaScript to become a full-stack language.
2. Explain the non-blocking, event-driven model at a conceptual level.
3. Initialise a project with `pnpm init`, install packages, and explain what `package.json` contains.
4. Write and import a module using both **CommonJS** (`require`/`module.exports`) and **ES Modules** (`import`/`export`).
5. Navigate the interactive CLI and complete the quiz with ≥ 70%.

---

## Pre-Session Setup Checklist

- [ ] `node -v` returns a version ≥ 18 on the student's machine.
- [ ] `cd "Lesson 25/examples/node-basics" && pnpm install` succeeds.
- [ ] `pnpm start` launches the CLI without errors (figlet header + menu visible).
- [ ] VS Code is open to the `node-basics/src/` folder.

---

## Pedagogical Context: The Frontend-to-Backend Shift

This session demands a mental model reset. The student has spent 24 lessons thinking "JavaScript = browser". You must break that assumption concretely and early.

**Use this framing:**
> "Everything we've built so far runs *inside* a browser — on someone else's computer. Today we flip the script. We write JavaScript that runs on *our* server. Node.js is the tool that makes that possible."

Do not start with code. Do this instead:

1. Open a terminal. Run `node` to enter the REPL.
2. Type `console.log('Hello from Node.js!')` — explain that no browser is involved.
3. Type `process.platform` — show that Node gives you access to the OS.
4. Exit the REPL (`.exit`), then run `node -e "console.log('One-liner!')"`.

This concretely demonstrates: JavaScript is running outside a browser, right now.

---

## Lesson Flow (90-minute session)

### Phase 1 — Concept Tour via CLI (25 minutes)

Run `pnpm start` together. Navigate the three concept screens:

1. **What is Node.js?** — After reading, pause on the Event Loop section.
   - **Key question to ask:** *"If Node.js is single-threaded, how can it handle 10,000 simultaneous users?"*
   - Expected answer: Callbacks + Event Loop. Slow tasks don't block — they register a callback and control returns immediately.
   
2. **NPM & package.json** — Open `package.json` in VS Code side-by-side.
   - Walk through every field: `name`, `version`, `type`, `scripts`, `dependencies`.
   - Open `node_modules/chalk/` — show that it's just a folder of JavaScript files.
   - **Demonstrate the Golden Rule:** Run `git status` and show that `node_modules` appears in `.gitignore` and is not staged.

3. **CommonJS vs ES Modules** — The concept card gives a clean side-by-side view.
   - After reading, say: *"Open both files: `commonjs-math.cjs` and `esm-math.js`. What's the only functional difference?"* → The import/export syntax.

### Phase 2 — Live Demo (15 minutes)

Select **"🛠  Live Demo — Run CJS & ESM side by side"** from the menu.

Key teaching moments during the demo:
- `divide(10, 0)` returns `'Cannot divide by zero'` in **red** — ask: *"Why is this good API design?"*
- Point to `src/index.js` lines 13–15 where `createRequire` is used to load a `.cjs` file inside an ES Module project — explain that this is a real-world pattern students will encounter.

### Phase 3 — The Quiz (20 minutes)

Navigate to **"🧠 Take the Quiz"**.
- 7 questions with a live progress bar.
- Every answer — correct or incorrect — now shows a detailed explanation panel.
- **Let the student answer alone** — resist the urge to hint.
- After the quiz, revisit any question they got wrong and trace the answer back to the concept card or source file.

### Phase 4 — Exercise Preview (10 minutes)

Open `exercises/nodejs_practice.md`. Walk through exercises 1–2 together (init + install). Assign exercises 3–5 as the post-session task.

---

## The CommonJS vs ESM Confusion — How to Resolve It

| Student confuses… | Correct explanation |
|---|---|
| Thinks `.cjs` extension is mandatory for CommonJS | `.cjs` is only needed when `"type": "module"` is set. In a plain project, `.js` defaults to CommonJS. |
| Uses `require()` in an ESM file | Only works via `createRequire`. Tell them: "Pick one system per project. ESM for new code." |
| Forgets the `.js` extension in ESM imports | In Node.js, ESM imports MUST include the file extension. Browser bundlers like Vite resolve it for you, but raw Node does not. |
| Confused about `devDependencies` vs `dependencies` | Simple rule: If it's only used to *build or develop* the project (nodemon, eslint, vitest), it's a devDependency. If the app needs it to *run in production*, it's a dependency. |

---

## Common CLI Errors & Fixes

| Error message | Cause | Fix |
|---|---|---|
| `TypeError: chalk.indigo is not a function` | Using an invalid Chalk colour name | Only use `chalk.hex('#...')` for custom colours or named colours like `chalk.cyan` |
| `Cannot find package 'inquirer'` | `pnpm install` not run | Run `pnpm install` in the project directory |
| `SyntaxError: Cannot use import statement` | Missing `"type": "module"` in `package.json` | Add `"type": "module"` |
| `Error: require is not defined` | Using `require()` in an ESM file | Use `createRequire(import.meta.url)` or switch to `import` syntax |

---

## Key Analogies to Keep Handy

| Concept | Analogy |
|---|---|
| Node.js runtime | A car engine — it makes things *run* |
| V8 Engine | The petrol — the actual power source (same as Chrome's) |
| NPM packages | Lego bricks — pre-built pieces you add to your project |
| `package.json` | A recipe card — tells anyone how to recreate the project |
| `node_modules` | The baked cake — recreatable from the recipe, so you don't post it |
| Event Loop | A chef juggling multiple dishes — starts each one, checks back when they beep |

---

## Post-Session Assignment

1. Complete `exercises/nodejs_practice.md` (exercises 3–5 — writing the factorial module and fetching from an API with Axios).
2. Research: What is the difference between `dependencies` and `devDependencies` in `package.json`? Why does it matter for deployment?
3. Explore `npmjs.com` — find one package that looks interesting and explain in 2 sentences what it does.
