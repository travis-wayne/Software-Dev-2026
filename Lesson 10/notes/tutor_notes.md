# Tutor Notes – Lesson 10: JavaScript Fundamentals I: Variables, Data Types, Operators

## Learning Objectives

By the end of this session, the student will be able to:

- Explain the role of JavaScript in web development and how it fits alongside HTML and CSS.
- Open the browser's developer console and execute JavaScript statements directly.
- Declare variables using `let` and `const`, and understand why `var` is discouraged.
- Identify and work with JavaScript's primitive data types (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`) and use `typeof` to inspect them.
- Perform calculations using arithmetic operators and update values with assignment operators.
- Compare values using strict and loose equality and combine conditions with logical operators.
- Link an external `.js` file to an HTML document using the `<script>` tag.

## Materials Needed

- Computer with internet access.
- VS Code with the integrated terminal.
- A modern web browser (Chrome recommended for DevTools).
- The `examples/js_interactive_reference.html` visual guide open in a browser tab.
- The `examples/script.js` example file for live demo.

## Preparation Checklist

- [ ] Confirm the student has VS Code set up from previous lessons.
- [ ] Confirm the student knows how to open files in a browser (double-click or right-click → "Open with").
- [ ] Open the interactive visual reference (`examples/js_interactive_reference.html`) in a browser tab — you will use this throughout the session.
- [ ] Open `examples/js-basics.html` in a browser and verify the console output from `script.js` appears in DevTools.
- [ ] Mentally rehearse the merge of "Why JavaScript?" into the HTML/CSS context from previous lessons. The student has spent 9 sessions in HTML/CSS/Git — this is a **big transition**.
- [ ] Have a blank `script.js` ready in VS Code for live coding (separate from the pre-built example).

---

## Session Outline

### Part 1: The Web Trinity — Why JavaScript? (≈8 min)

1. **The Three Pillars**

   Draw or show on screen:

   ```
   ┌─────────────────────────────────────────────────┐
   │                  A Web Page                      │
   │                                                  │
   │   HTML  ──────→  Structure (the bones)           │
   │   CSS   ──────→  Style (the clothes & makeup)    │
   │   JS    ──────→  Behaviour (the brain & muscles) │
   │                                                  │
   └─────────────────────────────────────────────────┘
   ```

   Ask: *"We've built the skeleton with HTML and dressed it up with CSS. But can our pages DO anything? Can a user click something and have the page respond? Can we validate a form? Can we show a loading spinner?"*

   Answer: No. HTML and CSS are declarative — they describe what a page looks like. **JavaScript is imperative** — it tells the page what to DO.

2. **Real-World Examples**

   Show these examples in the browser:
   - Click a hamburger menu → it opens (JS listens for the click and toggles a CSS class).
   - Type in a search bar → suggestions appear in real-time (JS sends requests and updates the DOM).
   - Scroll down → elements animate into view (JS detects scroll position and triggers animations).

   *"Every single interactive thing you've ever experienced on a website was JavaScript."*

3. **Where Does JavaScript Run?**

   - In the **browser** (Chrome, Firefox, Edge) — this is what we'll do today.
   - On the **server** (Node.js) — we'll cover this in future lessons.
   - The browser has a built-in **JavaScript engine** (Chrome uses V8, Firefox uses SpiderMonkey).

### Part 2: The Developer Console — Your JS Playground (≈7 min)

4. **Opening the Console**

   Walk the student through opening DevTools:
   - **Windows/Linux:** `F12` or `Ctrl + Shift + J`
   - **Mac:** `Cmd + Option + J`
   - Or: Right-click → Inspect → Console tab

   Explain: *"The Console is like a sandbox. You can type any JavaScript statement and it will run immediately. Professional developers use it constantly for testing and debugging."*

5. **First Line of JavaScript**

   Have the student type directly in the console:
   ```javascript
   console.log("Hello, JavaScript!");
   ```

   ✅ **Expected output:** `Hello, JavaScript!`

   Then try:
   ```javascript
   alert("Welcome to JavaScript!");
   ```

   A popup dialog appears. Explain: `console.log()` prints to the console (for developers). `alert()` shows a popup to the user (rarely used in production but great for learning).

6. **Quick Math in the Console**

   ```javascript
   2 + 2
   10 * 3
   100 / 4
   ```

   Show that the console evaluates expressions immediately and shows the result. *"The console is a calculator on steroids."*

### Part 3: Variables — Storing Information (≈12 min)

7. **What is a Variable?**

   Use the analogy: *"A variable is a labelled box. You put something inside it — a number, a name, a true/false value — and later you can open the box to get it back out or put something new in."*

   ```
   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
   │  studentName  │    │     age      │    │  isEnrolled   │
   │  ┌──────────┐ │    │  ┌────────┐  │    │  ┌─────────┐ │
   │  │ "Alice"  │ │    │  │   22   │  │    │  │  true   │ │
   │  └──────────┘ │    │  └────────┘  │    │  └─────────┘ │
   └──────────────┘    └──────────────┘    └──────────────┘
        (String)           (Number)           (Boolean)
   ```

8. **The Three Keywords: `var`, `let`, `const`**

   Type in the console or in `script.js`:

   ```javascript
   var oldWay = "I'm the old way";   // ❌ Avoid — function-scoped, hoisted, confusing
   let canChange = "I can be updated"; // ✅ Use for values that will change
   const neverChange = "I'm locked";  // ✅ Use for values that should NOT change
   ```

   **Key teaching moment — WHY `var` is problematic:**

   ```javascript
   var x = 10;
   var x = 20;  // ❌ No error! var allows re-declaration — this is a bug factory
   console.log(x); // 20

   let y = 10;
   let y = 20;  // ✅ ERROR! let prevents accidental re-declaration
   ```

   Ask: *"If you accidentally used the same variable name twice in a 500-line file, would you want JavaScript to silently overwrite it, or throw an error?"*

   Rule of thumb for the student:
   - **`const` by default.** Only use `let` when you KNOW the value needs to change.
   - **Never use `var`** in modern JavaScript.

9. **Naming Rules**

   | Rule | Valid | Invalid |
   |---|---|---|
   | Must start with a letter, `_`, or `$` | `myName`, `_count`, `$price` | `1stPlace`, `-name` |
   | Cannot use reserved words | `myClass` | `class`, `return`, `let` |
   | Case-sensitive | `myAge` ≠ `myage` | — |
   | Use camelCase by convention | `firstName`, `totalScore` | `first_name` (OK but not standard JS) |

### Part 4: Data Types — What Kind of Data? (≈10 min)

10. **The Primitive Types**

    Type each in the console and use `typeof` to inspect:

    ```javascript
    // String — text, always in quotes
    let greeting = "Hello, World!";
    console.log(typeof greeting);  // "string"

    // Number — integers and decimals (no separate int/float!)
    let score = 95;
    let price = 19.99;
    console.log(typeof score);     // "number"

    // Boolean — true or false only
    let isLoggedIn = true;
    console.log(typeof isLoggedIn); // "boolean"

    // Undefined — variable declared but never assigned a value
    let middleName;
    console.log(typeof middleName); // "undefined"

    // Null — intentionally empty (the developer set it to "nothing")
    let selectedItem = null;
    console.log(typeof selectedItem); // "object" ← THIS IS A KNOWN BUG in JS!

    // Symbol — unique identifier (advanced, mention but don't dwell on it)
    let id = Symbol("id");
    console.log(typeof id);        // "symbol"
    ```

    **⚠️ The `typeof null` gotcha:** `typeof null` returns `"object"`. This is a famous bug from 1995 that was never fixed for backwards compatibility. Acknowledge it so the student isn't confused later.

11. **String Concatenation vs Template Literals**

    ```javascript
    let firstName = "Alice";
    let lastName = "Johnson";

    // Old way — concatenation with +
    console.log("Hello, " + firstName + " " + lastName + "!");

    // Modern way — template literals (backticks!)
    console.log(`Hello, ${firstName} ${lastName}!`);
    ```

    *"Template literals (backticks) are cleaner and less error-prone. Use them."*

12. **Type Coercion — JavaScript's Quirky Side**

    ```javascript
    console.log("5" + 3);     // "53" — string wins, number is converted to string
    console.log("5" - 3);     // 2   — subtraction forces numeric conversion
    console.log("5" * 2);     // 10  — multiplication forces numeric conversion
    console.log(true + 1);    // 2   — true becomes 1
    console.log(false + 1);   // 1   — false becomes 0
    ```

    Ask: *"Why does `"5" + 3` give `"53"` but `"5" - 3` gives `2`?"*

    Answer: The `+` operator has two jobs — addition AND concatenation. If either side is a string, it concatenates. The `-`, `*`, `/` operators only do math, so they force conversion to numbers.

    *"This is the single biggest source of beginner bugs in JavaScript. Always know what type your data is."*

### Part 5: Operators — Doing Things with Data (≈10 min)

13. **Arithmetic Operators**

    ```javascript
    let a = 10;
    let b = 3;

    console.log(a + b);   // 13  Addition
    console.log(a - b);   // 7   Subtraction
    console.log(a * b);   // 30  Multiplication
    console.log(a / b);   // 3.333...  Division
    console.log(a % b);   // 1   Modulus (remainder of 10 ÷ 3)
    console.log(a ** b);  // 1000  Exponentiation (10 to the power of 3)
    ```

    Explain modulus: *"Modulus gives the remainder. It's extremely useful — for example, `number % 2 === 0` tells you if a number is even."*

14. **Assignment Operators (Shorthand)**

    ```javascript
    let score = 100;
    score += 10;  // score = score + 10  → 110
    score -= 5;   // score = score - 5   → 105
    score *= 2;   // score = score * 2   → 210
    score /= 3;   // score = score / 3   → 70
    score++;      // score = score + 1   → 71
    score--;      // score = score - 1   → 70
    ```

15. **Comparison Operators**

    ```javascript
    console.log(10 > 5);    // true
    console.log(10 < 5);    // false
    console.log(10 >= 10);  // true
    console.log(10 <= 9);   // false
    ```

    **The critical distinction — `==` vs `===`:**

    ```javascript
    console.log(5 == "5");   // true  ← Loose equality (checks VALUE only, ignores type)
    console.log(5 === "5");  // false ← Strict equality (checks VALUE and TYPE)

    console.log(0 == false);  // true  ← Loose: both are "falsy"
    console.log(0 === false); // false ← Strict: number vs boolean
    ```

    **Rule: ALWAYS use `===` and `!==`.** Forget `==` exists. Loose equality has too many bizarre edge cases.

16. **Logical Operators**

    ```javascript
    let age = 25;
    let hasLicense = true;

    // AND (&&) — BOTH must be true
    console.log(age >= 18 && hasLicense);  // true — can drive

    // OR (||) — AT LEAST ONE must be true
    console.log(age >= 65 || hasLicense);  // true — one condition met

    // NOT (!) — flips the value
    console.log(!hasLicense);  // false — negates true to false
    ```

    Real-world analogy: *"AND is like a security checkpoint with two guards — you need BOTH to let you through. OR is like having two doors — you only need one to be open."*

### Part 6: Linking JavaScript to HTML + Wrap-Up (≈8 min)

17. **The `<script>` Tag**

    Open `js-basics.html` and show the student how the JavaScript file is linked:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>JavaScript Basics</title>
    </head>
    <body>
        <h1>JavaScript Fundamentals I</h1>

        <!-- Link to the external JavaScript file -->
        <script src="script.js"></script>
    </body>
    </html>
    ```

    **Key points:**
    - The `<script>` tag goes at the **bottom of `<body>`**, not in `<head>`. Why? Because the HTML needs to load first before JS tries to interact with it.
    - `src="script.js"` is similar to CSS `href="style.css"` — it's a path to an external file.
    - You CAN write JavaScript directly inside `<script>` tags (inline), but external files are the standard for maintainability.

18. **Recap**

    - **JavaScript** = the behaviour layer of the web (alongside HTML for structure and CSS for style).
    - **Variables** = named containers. Use `const` by default, `let` when the value changes, never `var`.
    - **Data Types** = the kind of data (string, number, boolean, null, undefined). Use `typeof` to check.
    - **Operators** = arithmetic (`+`, `-`, `*`, `/`, `%`), comparison (`===`, `!==`, `>`, `<`), logical (`&&`, `||`, `!`).
    - **Always use `===`**, never `==`.
    - **Type coercion** is JavaScript's quirkiest feature — always know your types.

---

## Tips for Tutor

- **This is a paradigm shift.** The student has spent 9 sessions with HTML/CSS, which are declarative. JavaScript is imperative and procedural. Expect it to feel harder. Be patient and encouraging.
- **Use the interactive reference HTML** (`js_interactive_reference.html`) as your primary visual throughout. It has clickable examples and live output areas.
- **Live code everything.** Don't just show the pre-built `script.js`. Open a blank file, type from scratch, save, refresh the browser. Let the student see the full cycle.
- **Let them break things.** If a student tries `const name = "Alice"; name = "Bob";` and gets an error — GREAT. That's exactly how `const` should work. Let the error teach.
- **Predict-then-run.** Before executing ANY `console.log()`, ask the student: "What do you think this will print?" Then run it. If they're wrong, that's the learning moment (especially for type coercion).
- **The Console is king today.** The console should be open for the entire session. Every concept should be demonstrated live.

---

## Common Mistakes & Troubleshooting

### Variable Mistakes

1. **Using `var` out of habit or from copying older tutorials**
   - ❌ Student writes `var name = "Alice";` because a YouTube tutorial from 2015 used it.
   - ✅ Gently redirect: *"That works, but modern JavaScript uses `let` and `const`. Let's use `const` here since the name won't change."*

2. **Trying to reassign a `const` variable**
   - ❌ `const age = 20; age = 21;` → `TypeError: Assignment to constant variable.`
   - ✅ Explain: `const` means the binding is constant — you can't reassign it. If the value needs to change (like a score), use `let`.

3. **Forgetting to declare a variable before using it**
   - ❌ `score = 100;` (no `let` or `const`) — in sloppy mode, JS creates a global variable silently.
   - ✅ Always declare: `let score = 100;`. Mention that `"use strict";` at the top of a file would catch this.

4. **Using a reserved word as a variable name**
   - ❌ `let class = "Math";` → `SyntaxError: Unexpected token`
   - ✅ Use descriptive alternatives: `let className = "Math";` or `let subject = "Math";`

### Data Type Mistakes

5. **Confusing `undefined` and `null`**
   - ❌ Student treats them as the same thing.
   - ✅ `undefined` means "I forgot to give this a value" (JavaScript's default). `null` means "I deliberately set this to nothing" (the developer's choice).

6. **Forgetting that `typeof null` returns `"object"`**
   - ❌ Student uses `typeof` to check for `null` and gets confused when it says `"object"`.
   - ✅ To check for null, use `value === null` directly instead of `typeof`.

7. **Mixing up quotes**
   - ❌ `let greeting = "Hello, World!';` → mismatched quotes cause a `SyntaxError`.
   - ✅ Be consistent. Double quotes `"..."` or single quotes `'...'` — pick one and stick with it. Template literals use backticks `` `...` ``.

### Operator Mistakes

8. **Using `=` instead of `===` for comparison**
   - ❌ `if (age = 18)` — this ASSIGNS 18 to `age` and always evaluates to true.
   - ✅ `if (age === 18)` — this COMPARES. One `=` assigns, three `===` compares.

9. **String + Number concatenation surprises**
   - ❌ `console.log("Score: " + 50 + 10);` → `"Score: 5010"` (not 60!).
   - ✅ Use parentheses to force order: `console.log("Score: " + (50 + 10));` → `"Score: 60"`.
   - ✅ Or use template literals: `` console.log(`Score: ${50 + 10}`); ``

10. **Forgetting that `%` is modulus, not percentage**
    - ❌ Student thinks `50 % 100` means "50% of 100" = 50.
    - ✅ `50 % 100` = 50 (remainder of 50 ÷ 100). For percentage: `(50 / 100) * total`.
