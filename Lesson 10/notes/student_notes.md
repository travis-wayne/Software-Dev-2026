# Student Notes – Lesson 10: JavaScript Fundamentals I: Variables, Data Types, Operators

Welcome to Lesson 10! For the past nine sessions you've been building web pages with HTML and styling them with CSS. Your pages look great — but they can't *do* anything. They can't respond to a button click, validate a form, or update content dynamically.

Today that changes. We're adding the **brain** to your web pages: **JavaScript**.

---

## 1. The Web Trinity: HTML, CSS, and JavaScript

Every web page is built from three technologies working together:

| Technology | Role | Analogy |
|---|---|---|
| **HTML** | Structure & Content | The skeleton and organs of a body |
| **CSS**  | Appearance & Layout | The clothes, hairstyle, and makeup |
| **JavaScript** | Behaviour & Interactivity | The brain and muscles — makes it *move* |

Without JavaScript:
- A button exists, but clicking it does nothing.
- A form has fields, but can't check if you typed a valid email.
- Content is static — it never changes after the page loads.

With JavaScript:
- Click a hamburger menu, it slides open.
- Type in a search bar, suggestions appear in real-time.
- Scroll down the page, elements animate into view.

**JavaScript is the most widely used programming language in the world.** Every website you've ever interacted with uses it.

---

## 2. The Developer Console — Your JS Playground

Before writing any files, let's use the browser's built-in JavaScript playground.

### Opening the Console:
- **Windows/Linux:** Press `F12`, then click the **Console** tab. Or press `Ctrl + Shift + J`.
- **Mac:** Press `Cmd + Option + J`.
- Or: Right-click anywhere on a page → **Inspect** → **Console** tab.

### Your First JavaScript:
Type this directly into the console and press `Enter`:
```javascript
console.log("Hello, JavaScript!");
```
✅ **Output:** `Hello, JavaScript!`

`console.log()` is JavaScript's way of printing a message. You will use it constantly.

Try this too:
```javascript
alert("Welcome to JavaScript!");
```
A popup appears! `alert()` shows a message to the user. It's annoying in production, but great for learning.

### Quick Math:
The console can act as a calculator:
```javascript
2 + 2       // 4
10 * 3      // 30
100 / 4     // 25
17 % 5      // 2 (the remainder of 17 ÷ 5)
```

---

## 3. Variables — Labelled Boxes for Your Data

A **variable** is a named container that stores a value. Think of it as a labelled box:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  studentName  │    │     age      │    │  isEnrolled   │
│  ┌──────────┐ │    │  ┌────────┐  │    │  ┌─────────┐ │
│  │ "Alice"  │ │    │  │   22   │  │    │  │  true   │ │
│  └──────────┘ │    │  └────────┘  │    │  └─────────┘ │
└──────────────┘    └──────────────┘    └──────────────┘
     (String)           (Number)           (Boolean)
```

### The Three Declaration Keywords

JavaScript has three ways to create a variable:

```javascript
var oldWay = "Avoid me";         // ❌ The OLD way — don't use this
let canChange = "I can update";  // ✅ Use when the value WILL change
const locked = "I'm permanent";  // ✅ Use when the value should NOT change
```

### Why NOT `var`?

`var` allows you to accidentally re-declare the same variable without any error:
```javascript
var name = "Alice";
var name = "Bob";    // No error! Silently overwrites — BUG FACTORY 🐛
console.log(name);   // "Bob"
```

`let` protects you from this mistake:
```javascript
let name = "Alice";
let name = "Bob";    // ❌ SyntaxError: 'name' has already been declared
```

### The Rule
> **Use `const` by default. Only use `let` when the value needs to change. Never use `var`.**

### Naming Rules

| Rule | ✅ Valid | ❌ Invalid |
|---|---|---|
| Start with a letter, `_`, or `$` | `myName`, `_count`, `$price` | `1stPlace`, `-name` |
| No reserved words | `myClass`, `totalScore` | `class`, `return`, `let` |
| Case-sensitive | `myAge` ≠ `myage` | — |
| Use **camelCase** | `firstName`, `isLoggedIn` | `first_name` (works, but not JS convention) |

---

## 4. Data Types — What Kind of Value?

Every value in JavaScript has a **type**. JavaScript has 7 primitive types and 1 structural type:

### Primitive Types

| Type | Example | Description |
|---|---|---|
| `string` | `"Hello"`, `'World'`, `` `Hi` `` | Text — always wrapped in quotes |
| `number` | `42`, `3.14`, `-7` | Numbers (integers and decimals — no separate types) |
| `boolean` | `true`, `false` | Logical — only two possible values |
| `undefined` | `undefined` | Variable was declared but never assigned a value |
| `null` | `null` | Intentionally set to "nothing" by the developer|
| `symbol` | `Symbol("id")` | A unique identifier (advanced — we'll revisit later) |
| `bigint` | `9007199254740991n` | Very large integers (advanced) |

### Non-Primitive Type

| Type | Example | Description |
|---|---|---|
| `object` | `{ name: "Alice", age: 22 }` | Collections of related data (covered in a future lesson) |

### Using `typeof` to Check Types

You can always inspect a value's type:
```javascript
console.log(typeof "Hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof null);        // "object"  ← ⚠️ KNOWN BUG since 1995!
console.log(typeof Symbol("x")); // "symbol"
```

> ⚠️ **The `typeof null` Bug:** `typeof null` returns `"object"`. This is a famous mistake from JavaScript's creation in 1995 that was never fixed. To check for `null`, use `value === null` instead of `typeof`.

### `undefined` vs `null`

These two are easy to confuse:
- **`undefined`** = *"JavaScript says: you never gave this a value."*
- **`null`** = *"The developer says: I intentionally set this to nothing."*

```javascript
let middleName;              // undefined — never assigned
let selectedItem = null;     // null — deliberately empty
```

---

## 5. String Concatenation & Template Literals

You can combine strings together:

### The Old Way — Concatenation with `+`
```javascript
let firstName = "Alice";
let lastName = "Johnson";
console.log("Hello, " + firstName + " " + lastName + "!");
// Output: "Hello, Alice Johnson!"
```

### The Modern Way — Template Literals (Backticks)
```javascript
let firstName = "Alice";
let lastName = "Johnson";
console.log(`Hello, ${firstName} ${lastName}!`);
// Output: "Hello, Alice Johnson!"
```

Template literals use **backticks** (`` ` ``) instead of regular quotes. Inside the backticks, `${...}` injects the value of any expression.

> **Use template literals.** They're cleaner, easier to read, and less error-prone than concatenation.

---

## 6. Type Coercion — JavaScript's Quirkiest Feature

**Type coercion** is when JavaScript automatically converts one type to another during an operation. This is the single biggest source of beginner bugs.

```javascript
console.log("5" + 3);     // "53"  — ⚠️ String wins! Number becomes a string
console.log("5" - 3);     // 2     — Subtraction forces numeric conversion
console.log("5" * 2);     // 10    — Multiplication forces numeric conversion
console.log(true + 1);    // 2     — true becomes 1
console.log(false + 1);   // 1     — false becomes 0
```

### Why `"5" + 3` = `"53"` but `"5" - 3` = `2`?

The `+` operator has **two jobs**: addition (numbers) AND concatenation (strings). If either side is a string, it concatenates.

The `-`, `*`, `/` operators only do math, so they force conversion to numbers.

### The Fix — Be Explicit

Use `Number()` to force conversion when needed:
```javascript
console.log(Number("5") + 3);   // 8 — forced to number first
console.log(parseInt("42px"));  // 42 — extracts the number from a string
```

---

## 7. Operators — Doing Things with Data

### Arithmetic Operators

| Operator | Name | Example | Result |
|---|---|---|---|
| `+` | Addition | `10 + 3` | `13` |
| `-` | Subtraction | `10 - 3` | `7` |
| `*` | Multiplication | `10 * 3` | `30` |
| `/` | Division | `10 / 3` | `3.333...` |
| `%` | Modulus (remainder) | `10 % 3` | `1` |
| `**` | Exponentiation | `10 ** 3` | `1000` |

> **Modulus tip:** `number % 2 === 0` tells you if a number is even. This is incredibly useful.

### Assignment Operators (Shorthand)

| Operator | Longhand | Shorthand |
|---|---|---|
| `+=` | `x = x + 5` | `x += 5` |
| `-=` | `x = x - 5` | `x -= 5` |
| `*=` | `x = x * 2` | `x *= 2` |
| `/=` | `x = x / 2` | `x /= 2` |
| `++` | `x = x + 1` | `x++` |
| `--` | `x = x - 1` | `x--` |

### Comparison Operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `===` | Strict equality (value AND type) | `5 === "5"` | `false` |
| `!==` | Strict inequality | `5 !== "5"` | `true` |
| `==` | Loose equality (value only) | `5 == "5"` | `true` |
| `!=` | Loose inequality | `5 != "5"` | `false` |
| `>` | Greater than | `10 > 5` | `true` |
| `<` | Less than | `10 < 5` | `false` |
| `>=` | Greater than or equal | `10 >= 10` | `true` |
| `<=` | Less than or equal | `9 <= 10` | `true` |

> ⚠️ **Critical Rule:** **ALWAYS use `===` and `!==`.** Forget `==` exists. Loose equality has too many bizarre edge cases that will cause bugs.

### Logical Operators

| Operator | Name | Meaning | Example |
|---|---|---|---|
| `&&` | AND | Both must be true | `age >= 18 && hasID` |
| `\|\|` | OR | At least one must be true | `isStudent \|\| isElder` |
| `!` | NOT | Flips true↔false | `!isBlocked` |

**Real-world analogy:**
- **AND (`&&`)** is like a security checkpoint with two guards — you need BOTH to let you through.
- **OR (`||`)** is like having two doors — you only need one to be open.
- **NOT (`!`)** is like flipping a light switch — on becomes off, off becomes on.

---

## 8. Linking JavaScript to HTML

Just like CSS uses `<link>` to connect a stylesheet, JavaScript uses `<script>` to connect a JS file.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>Welcome</h1>
    <p>Check the console for output!</p>

    <!-- JS goes at the BOTTOM of body -->
    <script src="script.js"></script>
</body>
</html>
```

### Why at the bottom of `<body>`?

The browser reads HTML from top to bottom. If JavaScript runs before the HTML is loaded, it can't find the elements it needs to interact with. Placing `<script>` at the bottom ensures the HTML is fully loaded first.

---

## 9. Quick Reference Cheat Sheet

### Data Types

| Type | Example | `typeof` Result |
|---|---|---|
| String | `"hello"` | `"string"` |
| Number | `42` | `"number"` |
| Boolean | `true` | `"boolean"` |
| Undefined | `undefined` | `"undefined"` |
| Null | `null` | `"object"` ⚠️ |
| Symbol | `Symbol()` | `"symbol"` |

### Variable Declaration

| Keyword | Re-assignable? | Re-declarable? | Use When |
|---|---|---|---|
| `const` | ❌ No | ❌ No | Value should never change (default choice) |
| `let` | ✅ Yes | ❌ No | Value will be updated later |
| `var` | ✅ Yes | ✅ Yes | ❌ Never — legacy only |

### Operators at a Glance

| Category | Operators |
|---|---|
| Arithmetic | `+`  `-`  `*`  `/`  `%`  `**` |
| Assignment | `=`  `+=`  `-=`  `*=`  `/=`  `++`  `--` |
| Comparison | `===`  `!==`  `>`  `<`  `>=`  `<=` |
| Logical | `&&`  `||`  `!` |

---

## 10. Tips for Success

- **Practice in the console.** It's the fastest way to test ideas. Type, hit enter, see the result.
- **Always use `===`, never `==`.** This one rule will prevent countless bugs.
- **JavaScript is case-sensitive.** `myVariable` and `myvariable` are two completely different variables.
- **Read error messages.** They tell you exactly what's wrong and which line the problem is on. Don't panic — read.
- **Break things on purpose.** Try `const x = 5; x = 10;` and read the error. Try `"hello" - "world"` and see what happens (`NaN` — Not a Number). Experimentation is the best teacher.

---

## Resources & Links

- **Reading Materials:**
  - [MDN Web Docs: JavaScript basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction)
  - [W3Schools: JavaScript Variables](https://www.w3schools.com/js/js_variables.asp)
  - [JavaScript.info: Data types](https://javascript.info/data-types)
- **Video Tutorials:**
  - [JavaScript Crash Course for Beginners](https://www.youtube.com/watch?v=hdI2bqO0rbM) by freeCodeCamp (Focus on first 30-45 minutes)
  - [JavaScript Operators Tutorial](https://www.youtube.com/watch?v=c_J-g_0g28U)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Browser Developer Tools (Console)](https://developer.chrome.com/docs/devtools/)
