# Post-Session Assignment: JavaScript Fundamentals I

## Overview

This assignment tests your ability to work independently with JavaScript variables, data types, and operators. You will build three small programs from scratch and submit them for review.

## Setup

Create a new folder called `js-assignment/` in your workspace. Inside it, create:

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Assignment - Lesson 10</title>
</head>
<body>
    <h1>JavaScript Assignment - Lesson 10</h1>
    <p>Open the developer console (F12) to see the program output.</p>
    <script src="assignment.js"></script>
</body>
</html>
```

**assignment.js:**
```javascript
// Lesson 10 Assignment — JavaScript Fundamentals I
// Complete all three parts below.
```

All your work goes inside `assignment.js`. Open `index.html` in your browser and use the Developer Console to verify your output.

---

## Pre-Session Preparation

*If you haven't already, ensure you are comfortable with:*
- Basic HTML structure (`<!DOCTYPE>`, `<head>`, `<body>`).
- How to link external files (you've done this with CSS `<link>` — now it's `<script>`).
- How to open the browser's Developer Console (`F12` → Console tab).

---

## Tasks

### Part A: Rectangle Area Calculator

Write a program that calculates the area of a rectangle.

**Requirements:**
1. Declare a `const` variable called `length` and assign it a numerical value (e.g., `12`).
2. Declare a `const` variable called `width` and assign it a numerical value (e.g., `7`).
3. Calculate the `area` using the formula: `length × width`.
4. Print the result using `console.log()` and a template literal.

**✅ Expected console output:**
```
--- Rectangle Area Calculator ---
Length: 12
Width: 7
Area: 84
The area of the rectangle is: 84 square units
```

**Hints:**
- Use `const` because the values won't change.
- Use template literals: `` console.log(`The area is: ${area} square units`); ``

---

### Part B: The Type Coercion Experiment

Explore JavaScript's automatic type conversion and document what you find.

**Requirements:**
1. Log the result of each of these expressions:
   ```javascript
   "10" + 5
   "10" - 5
   "10" * 3
   true + true
   "hello" * 2
   ```
2. After each `console.log()`, add a **comment** explaining what happened and why.
3. Log the `typeof` the result of `"10" + 5` and the `typeof` the result of `"10" - 5`.
4. Demonstrate the fix: use `Number("10") + 5` to force numeric addition.

**✅ Expected console output:**
```
--- Type Coercion Experiment ---
"10" + 5 = 105
"10" - 5 = 5
"10" * 3 = 30
true + true = 2
"hello" * 2 = NaN
typeof ("10" + 5): string
typeof ("10" - 5): number
Fixed: Number("10") + 5 = 15
```

**Example of commenting:** 
```javascript
console.log("10" + 5);  // "105" — the + operator concatenates because one side is a string
```

---

### Part C: Voter Eligibility Checker

Build a program that determines whether a person can vote based on multiple conditions.

**Requirements:**
1. Declare a `let` variable `age` and assign a value (e.g., `20`).
2. Declare a `const` variable `isCitizen` and assign `true` or `false`.
3. Declare a `const` variable `isRegistered` and assign `true` or `false`.
4. Using comparison (`>=`) and logical (`&&`) operators, determine if the person can vote:
   - They must be 18 or older **AND**
   - They must be a citizen **AND**
   - They must be registered.
5. Log each variable and the final result.
6. Test with at least **three different scenarios** (change variable values and re-run):
   - Scenario 1: All conditions met (should be `true`).
   - Scenario 2: Too young (should be `false`).
   - Scenario 3: Not registered (should be `false`).

**✅ Expected console output (Scenario 1):**
```
--- Voter Eligibility Checker ---
Age: 20
Is Citizen: true
Is Registered: true
Can Vote: true
```

**✅ Expected console output (Scenario 2):**
```
--- Voter Eligibility Checker ---
Age: 16
Is Citizen: true
Is Registered: true
Can Vote: false
```

---

## Submission Checklist

Before submitting, verify:
- [ ] `index.html` opens in the browser without errors.
- [ ] All three parts (A, B, C) have output in the console.
- [ ] Part B includes comments explaining type coercion behaviour.
- [ ] Part C has been tested with at least three different scenarios.
- [ ] All variables use `const` or `let` (not `var`).
- [ ] You used `===` and `!==` (not `==` or `!=`).

Save your `index.html` and `assignment.js` files. Show your code and console output to your tutor in the next session or submit via the designated course portal.

---

## Reflection Questions

Write your answers as comments at the bottom of `assignment.js`:

1. What is the difference between `const` and `let`? When should you use each?
2. Why does `"10" + 5` give `"105"` but `"10" - 5` gives `5`?
3. Why should you always use `===` instead of `==`?
4. What is the value of `typeof null` and why is it unexpected?

---

## Bonus Challenges ⭐

Complete these for extra practice:

- **Bonus 1:** Extend Part A to also calculate the **perimeter** of the rectangle (formula: `2 * (length + width)`).
- **Bonus 2:** Create a **temperature converter** that converts 37°C (body temperature) to Fahrenheit using the formula: `F = C * 9/5 + 32`.
- **Bonus 3:** Use the modulus operator (`%`) inside Part C to also check if the person's age is an even or odd number, and log the result.
