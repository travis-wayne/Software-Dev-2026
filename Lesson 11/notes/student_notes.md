# Student Notes – Lesson 11: Control Flow & Functions

## Overview

In Lesson 10 we learned that JavaScript stores data in variables. Today we make it *do things with that data* — making decisions, repeating tasks, and packaging logic into reusable blocks.

The three pillars of this lesson are:

| Concept | What It Does | Real-World Analogy |
|---|---|---|
| **Conditionals** | Runs different code depending on whether something is true or false | A traffic light — different actions per signal |
| **Loops** | Repeats a block of code a number of times | A dishwasher running multiple wash cycles |
| **Functions** | Groups code into a reusable named block | A recipe in a cookbook |

---

## 1. Conditional Statements (If / Else If / Else)

A conditional runs a specific block of code **only when a condition is true**. If the condition is false, it moves on.

### Basic Syntax

```javascript
if (condition) {
    // Runs ONLY if condition is true
} else if (anotherCondition) {
    // Runs if the first condition was false AND this one is true
} else {
    // Runs if ALL conditions above were false (the catch-all)
}
```

### Worked Example — Grading System

```javascript
let score = 85;

if (score >= 90) {
    console.log("Grade: A – Excellent!");
} else if (score >= 80) {
    console.log("Grade: B – Great job!");    // ◀ This one runs (85 >= 80 is true)
} else if (score >= 70) {
    console.log("Grade: C – You passed!");
} else {
    console.log("Grade: Needs Improvement.");
}
```

> **⚠️ Order matters!** JavaScript checks conditions from top to bottom and stops at the first `true` one. Always write your **most specific condition first**. If you put `score >= 70` at the top, a score of 95 would incorrectly print "Grade: C".

### Using Logical Operators Inside Conditions

You can combine conditions using `&&` (AND), `||` (OR), and `!` (NOT):

```javascript
let isWeekend = true;
let isSunny   = false;

if (isWeekend && isSunny) {
    console.log("Let's go to the beach!");       // Both must be true
} else if (isWeekend && !isSunny) {
    console.log("Movie day indoors!");            // Weekend but NOT sunny
} else {
    console.log("Back to work. 💼");
}
// Output: "Movie day indoors!" (isWeekend is true, !isSunny is true)
```

### Quick Reference — Conditions

| Operator | Meaning | Example |
|---|---|---|
| `===` | Strictly equal | `age === 18` |
| `!==` | Not equal | `status !== "banned"` |
| `>` / `<` | Greater / Less than | `score > 50` |
| `>=` / `<=` | Greater or equal / Less or equal | `score >= 90` |
| `&&` | AND — both must be true | `age >= 18 && hasId` |
| `\|\|` | OR — at least one true | `isAdmin \|\| isMod` |
| `!` | NOT — flips true/false | `!isLoggedIn` |

---

## 2. Loops (Repetition)

Loops let you run the same block of code multiple times, so you don't have to type the same line over and over.

### The `for` Loop

Use a `for` loop when you **know how many times** you want to loop.

```
for ( Initialization ; Condition ; Increment ) {
         ↓                  ↓            ↓
   let i = 1        i <= 5         i++
   "Start at 1"   "Keep going     "Add 1
                   while ≤ 5"      each time"
}
```

**Worked Example:**

```javascript
for (let i = 1; i <= 5; i++) {
    console.log("Iteration: " + i);
}
// Output:
// Iteration: 1
// Iteration: 2
// Iteration: 3
// Iteration: 4
// Iteration: 5
```

**How to read the three parts:**

| Part | Code | Runs When |
|---|---|---|
| Initialization | `let i = 1` | Once, at the very start |
| Condition | `i <= 5` | Checked BEFORE every iteration |
| Increment | `i++` | Runs AFTER each iteration |

**Useful `for` loop variations:**

```javascript
// Count backwards
for (let i = 10; i >= 1; i--) {
    console.log(i);
}

// Even numbers only (step by 2)
for (let i = 2; i <= 20; i += 2) {
    console.log(i + " is even");
}

// An if statement inside a loop (very common!)
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        console.log(i + " is even");
    } else {
        console.log(i + " is odd");
    }
}
```

---

### The `while` Loop

Use a `while` loop when you **do NOT know how many times** you need to loop — you just want it to keep going until some condition becomes false.

```javascript
while (condition) {
    // Runs as long as condition is true
    // Make sure something inside here changes the condition!
}
```

**Worked Example — Countdown:**

```javascript
let countdown = 5;

while (countdown > 0) {
    console.log("T-minus: " + countdown);
    countdown--;  // ⭐ CRITICAL: this changes countdown so the loop can end
}
console.log("Liftoff! 🚀");
// Output:
// T-minus: 5
// T-minus: 4
// T-minus: 3
// T-minus: 2
// T-minus: 1
// Liftoff! 🚀
```

> **⚠️ Infinite Loop Warning!** If your loop condition **never becomes false**, the loop runs forever and crashes the browser tab.
>
> ```javascript
> // ❌ DANGER — DO NOT RUN
> let x = 1;
> while (x > 0) {
>     console.log(x);
>     // x is never changed, so x > 0 is always true!
> }
> ```
>
> If this happens: close the browser tab. Your computer is fine.

### `for` vs `while` — When to Use Which

| Prefer `for` when… | Prefer `while` when… |
|---|---|
| You know the exact number of iterations | You don't know how many iterations in advance |
| Counting up or down through a range | Waiting for a user action or external event |
| Iterating through a list of items | Running until a specific condition changes |

---

## 3. Functions (Reusable Code Blocks)

A function is a **named block of code** that performs a specific task. You define it once, then call it as many times as you need. It's the most powerful tool in programming for avoiding repetition.

### Anatomy of a Function

```
function  greet  ( name )  {
    ↓        ↓      ↓
keyword   name   parameter   console.log(`Hello, ${name}!`);
                             }
```

- **`function`** — keyword that declares a function
- **`greet`** — the name you give it (camelCase by convention)
- **`name`** — a parameter (a placeholder for data passed in)
- **`{ ... }`** — the function body — the code that runs when called

### Step 1 — A Function Without Parameters

```javascript
function sayHello() {
    console.log("Hello, World!");
}

// Just writing the function above did nothing.
// You must CALL it to make it run:
sayHello();   // Output: Hello, World!
sayHello();   // Output: Hello, World! (again)
```

### Step 2 — Passing Data In: Parameters & Arguments

```javascript
function greetUser(name) {       // 'name' is the PARAMETER (a placeholder)
    console.log(`Welcome, ${name}!`);
}

greetUser("Alice");              // 'Alice' is the ARGUMENT (the actual value)
greetUser("Bob");                // Output: Welcome, Bob!
```

**Parameters vs Arguments — the distinction:**
- **Parameter** = the variable name in the function definition (`name`)
- **Argument** = the actual value you pass when calling the function (`"Alice"`)

### Step 3 — Getting Data Back Out: The `return` Statement

This is one of the most important concepts in programming. There are two ways a function can produce output:

| | `console.log()` inside a function | `return` |
|---|---|---|
| **What it does** | Prints to the screen | Sends a value BACK to the caller |
| **Can you store it?** | ❌ No — it's just a display | ✅ Yes — save it in a variable |
| **Can you do math with it?** | ❌ No | ✅ Yes |
| **Returns value** | `undefined` | Whatever value you specify |

```javascript
// ❌ Using console.log — the data is displayed but LOST
function addWrong(a, b) {
    console.log(a + b);       // Shows 8, but gives nothing back
}
let result = addWrong(3, 5);
console.log(result);          // undefined — nothing was returned!

// ✅ Using return — the data comes back to the caller
function addCorrect(a, b) {
    return a + b;             // Sends 8 back
}
let result2 = addCorrect(3, 5); // result2 is now 8
console.log(result2 * 2);       // 16 — you can use the value!
```

**Step-by-step worked example:**

```javascript
function calculateTax(price, rate) {
    let tax    = price * rate;    // e.g. 1000 * 0.075 = 75
    let total  = price + tax;     // e.g. 1000 + 75    = 1075
    return total;                 // Sends 1075 back to the caller
}

let phoneCost = calculateTax(1000, 0.075);
console.log(`Total cost: $${phoneCost}`);  // Total cost: $1075
```

### Step 4 — Functions + Loops Together

```javascript
function isEven(num) {
    return num % 2 === 0;   // Returns true or false
}

for (let i = 1; i <= 10; i++) {
    if (isEven(i)) {
        console.log(i + " is EVEN");
    } else {
        console.log(i + " is ODD");
    }
}
// This calls isEven() 10 times — one for each number in the loop.
```

---

## 4. Function Scope

**Scope** determines where a variable is accessible in your code. Variables declared inside a function are **local** to that function. They exist only while the function is running, and they cannot be accessed from outside it.

```javascript
function calculateBonus() {
    let bonus = 5000;                      // Local variable — trapped inside
    console.log("Bonus inside: " + bonus); // ✅ Works fine
}

calculateBonus();
console.log("Bonus outside: " + bonus);   // ❌ ReferenceError: bonus is not defined
```

> **Why is this a good thing?** Scope protects your code. If every function shared all its variables, a function in one part of your app could accidentally overwrite a variable used in another. Local scope keeps things isolated and predictable.

**Global vs Local:**

```javascript
let playerName = "Alice";          // Global — accessible everywhere

function showPlayer() {
    let score = 100;               // Local — only accessible inside this function
    console.log(playerName);       // ✅ Can access global from inside function
    console.log(score);            // ✅ Can access local
}

showPlayer();
console.log(playerName);           // ✅ Global — still accessible
console.log(score);                // ❌ ReferenceError — 'score' is local
```

---

## Summary Cheat Sheet

### Conditionals
```javascript
if (a === b) { ... }
else if (a > b) { ... }
else { ... }
```

### `for` Loop
```javascript
for (let i = 0; i < 10; i++) {
    // Repeats 10 times
}
```

### `while` Loop
```javascript
while (condition) {
    // Runs until condition is false
    // Update condition inside!
}
```

### Functions
```javascript
// Define
function functionName(param1, param2) {
    return param1 + param2;
}

// Call
let result = functionName(5, 10); // result = 15
```

## Session Checklist
- [ ] Understand how `if / else if / else` chains work, and why condition order matters.
- [ ] Be able to write a `for` loop and trace through its execution step-by-step.
- [ ] Know the difference between `for` and `while` and when to choose each.
- [ ] Understand how to avoid an infinite loop.
- [ ] Be able to define a function with parameters and call it with arguments.
- [ ] Understand the difference between `console.log` and `return` inside a function.
- [ ] Explain why a variable declared inside a function cannot be used outside it.
