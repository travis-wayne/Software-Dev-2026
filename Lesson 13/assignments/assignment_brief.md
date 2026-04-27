# Post-Session Assignment: Lesson 13 – Arrays, Objects & ES6+

## Overview

This assignment tests your ability to model real-world data using arrays of objects, process that data with modern array methods, and write clean ES6+ JavaScript. You will build a small **Library System** from scratch.

## Setup

**1. Create the folder structure:**
```
assignment-lesson13/
  ├── index.html
  └── assignment.js
```

**2. Use this `index.html` — do not modify it:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lesson 13 Assignment</title>
</head>
<body>
    <h1>Lesson 13 Assignment – Library System</h1>
    <p>Open the Developer Console (F12) to see your output.</p>
    <script src="assignment.js"></script>
</body>
</html>
```

**3.** Write ALL your code in `assignment.js`. Open `index.html` in your browser, then press F12 to view the console after each part.

---

## Part A: Build the Data Structure (Arrays of Objects)

**Goal:** Create a properly structured dataset.

**Requirements:**
1. Create a `const` array called `library`.
2. Initialise it with **three** book objects inside. Each book must have:
   - `title` (string) — the book title
   - `author` (string) — the author's full name
   - `year` (number) — year of publication
   - `genre` (string) — e.g. `"Fiction"`, `"Non-Fiction"`, `"Sci-Fi"`
   - `isRead` (boolean) — whether you have read it
3. Add a **fourth** book to the array using `.push()` (do this as a separate line after the array declaration).
4. Log the **entire** `library` array to confirm you have 4 books.
5. Log the **title** of the first book using dot notation.

**✅ Expected console output sample:**
```
[{...}, {...}, {...}, {...}]    ← 4 objects
The Hobbit                     ← (or whatever your first book is)
```

**Reflection (add as a comment in your code):**
> *Why is this data structure better than using separate arrays like `const titles = [...]` and `const authors = [...]`?*

---

## Part B: Filtering — Find What You Need

**Goal:** Use `.filter()` with arrow functions to extract subsets of your data.

**Requirements:**
1. Create `unreadBooks` — an arrow-function `.filter()` returning only books where `isRead` is `false`.
2. Create `modernBooks` — a `.filter()` returning only books published **after the year 2000**.
3. Log a heading, then each filtered array.

**✅ Expected console output pattern:**
```
--- Unread Books ---
[{title: "...", ...}, ...]

--- Modern Books ---
[{title: "...", ...}, ...]
```

**Reflection (as a comment):**
> *What does `.filter()` return if NO items pass the test? Try it: create a filter for books published after 2100 and log the result.*

---

## Part C: Mapping — Transform the Data

**Goal:** Use `.map()` to produce a new array derived from your data.

**Requirements:**
1. Create a `catalog` array using `.map()`. Each item in `catalog` should be a **string** (not an object) formatted as a template literal:
   - Format: `` `"${title}" by ${author} (${year})` ``
2. Log the `catalog` array.
3. Log the `library` array again to **prove** `.map()` did NOT change the original.

**✅ Expected console output pattern:**
```
--- Catalog ---
['"The Hobbit" by J.R.R. Tolkien (1937)', '"Dune" by Frank Herbert (1965)', ...]

--- Library (unchanged) ---
[{title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, ...}, ...]
```

---

## Part D: Functions with Destructuring

**Goal:** Write a reusable function that uses modern JS syntax internally.

**Requirements:**
1. Write a function called `describeBook` that accepts **one book object** as its argument.
2. Inside the function, use **object destructuring** on a single line to extract `title`, `author`, `genre`, and `isRead`.
3. The function must **`return`** (not `console.log`) a template literal string formatted as:
   `` `[Genre] | "${title}" by ${author} — ${isRead ? "✅ Read" : "📖 Unread"}` ``
4. Call `describeBook()` for each book in your `library` — use a loop or `.forEach()`.
5. Log each result.

**✅ Expected console output pattern:**
```
Fiction | "The Hobbit" by J.R.R. Tolkien — ✅ Read
Sci-Fi  | "Dune" by Frank Herbert — 📖 Unread
...
```

---

## Submission Checklist

Before finishing, verify each item:
- [ ] Part A: `library` contains exactly 4 objects with all 5 required properties.
- [ ] Part A: Fourth book is added using `.push()` as a separate line (not inside the initial `[]`).
- [ ] Part B: Both filters use **arrow functions** (not the old `function` keyword).
- [ ] Part C: `catalog` contains **strings**, not objects.
- [ ] Part C: Original `library` is logged and confirmed unchanged after `.map()`.
- [ ] Part D: `describeBook` uses **destructuring** AND **`return`** (not `console.log` inside).
- [ ] Zero use of `var` — only `const` and `let`.
- [ ] Zero use of string `+` concatenation — only template literals.
- [ ] All comparisons use `===` (strict equality).

---

## Reflection Questions

Write your answers as comments at the bottom of `assignment.js`:

1. What is the key difference between `.map()` and `.filter()`?
2. Why does `.map()` on an array of 4 items always return an array of 4 items, but `.filter()` might return fewer?
3. What is the difference between using `return` inside a function vs `console.log`?
4. What does `const { title } = book` do, and how is it different from `const title = book.title`?
5. In Part B, what would happen if you wrote `book.isRead == false` instead of `book.isRead === false`? Why does the difference matter?

---

## Bonus Challenges ⭐

- **Bonus 1 — Chaining:** Solve Part B and Part C in **one single chained line** each. Get an array of catalog strings for ONLY unread books: `library.filter(...).map(...)`.
- **Bonus 2 — `.find()`:** Research the `.find()` method. How is it different from `.filter()`? Use it to find the **first** book from your library that was published before 1970.
- **Bonus 3 — `.reduce()`:** Research `.reduce()`. Use it to calculate the **total year sum** of all books (add all `year` values together). This is more advanced — it's OK to spend time on it.
