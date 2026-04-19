# Post-Session Assignment: Lesson 11 – Control Flow & Functions

## Overview

This assignment tests your ability to apply conditional logic, loops, and functions independently. You will build small, focused programs from scratch. Each part has a single clear goal — read the requirement carefully before writing a single line of code.

## Setup

Create a folder called `assignment-lesson11/` in your workspace. Inside it:

**`index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Assignment – Lesson 11</title>
</head>
<body>
    <h1>Lesson 11 Assignment</h1>
    <p>Open the Developer Console (F12) to see your output.</p>
    <script src="assignment.js"></script>
</body>
</html>
```

**`assignment.js`:**
```javascript
// Lesson 11 Assignment — Control Flow & Functions
// Complete Parts A, B, C and D below.
// Add console.log("--- Part A ---") etc. to separate your output.
```

All your work goes in `assignment.js`. Open `index.html` in your browser and use the Developer Console to check your output after every part.

---

## Pre-Session Preparation

Before this session, make sure you can confidently answer:
- What is the modulus (`%`) operator and how does it tell you if a number is divisible by another?
- What is the difference between `=` (assignment), `==` (loose equality), and `===` (strict equality)?
- What are comparison and logical operators? (Review Lesson 10 if needed.)

---

## Part A: Function Fundamentals

Prove your understanding of function syntax, parameters, and the critical difference between `console.log` and `return`.

**Requirements:**
1. Create a function named `sayWelcome` that accepts a parameter `username`. It should use `console.log()` to print:`"Welcome back, [username]! 👋"`
2. Create a function named `multiply` that takes two parameters, `a` and `b`. It must **`return`** the product — do NOT use `console.log` inside it.
3. Outside the functions, test them:
   - Call `sayWelcome("Alex")`.
   - Call `multiply(7, 8)`, capture the result in a variable, and `console.log` it.
   - Call `multiply(7, 8)` WITHOUT capturing it and log the raw call — show that you can use the return value directly.

**✅ Expected console output:**
```
--- Part A ---
Welcome back, Alex! 👋
56
56
```

**Reflection (add as a comment in your code):**
> *Why does `multiply` use `return` instead of `console.log`? What would happen to the value if we used `console.log` inside instead?*

---

## Part B: The Classic FizzBuzz

FizzBuzz is the most famous beginner programming challenge in existence — it appears in real technical interviews. It tests whether you can combine loops, conditionals, and functions.

**Requirements:**
1. Create a function named `fizzBuzz` that accepts one parameter: `limit`.
2. Inside the function, write a `for` loop that starts at `1` and goes up to and including `limit`.
3. For each number in the loop:
   - If divisible by **both** 3 and 5 → print `"FizzBuzz"`
   - If divisible by **only** 3 → print `"Fizz"`
   - If divisible by **only** 5 → print `"Buzz"`
   - Otherwise → print the number itself
4. Call `fizzBuzz(15)`.

**✅ Expected console output for `fizzBuzz(15)`:**
```
--- Part B ---
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

**⚠️ Critical Hint — Order of conditions matters!**
If you check `num % 3 === 0` before checking `num % 15 === 0`, then the number 15 will print `"Fizz"` instead of `"FizzBuzz"` — because 15 IS divisible by 3, so the first condition matches first. Always check the **most specific** case (both) first.

**Reflection (add as a comment):**
> *What happens if you move the `num % 15 === 0` check to the bottom? Test it and write what you observe.*

---

## Part C: Factorial Calculator

A factorial is a mathematical operation: `5! = 5 × 4 × 3 × 2 × 1 = 120`. This part tests that you can use a `while` loop and think about how loops accumulate a result.

**Requirements:**
1. Create a function called `calculateFactorial` that accepts one parameter: `num`.
2. Inside the function:
   - Declare a variable `result` initialized to `1`.
   - Use a `while` loop: as long as `num > 0`, multiply `result` by `num`, then decrease `num` by 1.
   - After the loop, `return` the `result`.
3. Outside the function, test it with three values and `console.log` the results:

**✅ Expected console output:**
```
--- Part C ---
Factorial of 5: 120
Factorial of 4: 24
Factorial of 3: 6
Factorial of 1: 1
Factorial of 0: 1
```

**Step-by-step trace (for `calculateFactorial(4)`):**

| Loop Stage | `num` | `result` |
|---|---|---|
| Start | 4 | 1 |
| Iteration 1 | 3 | 1 × 4 = 4 |
| Iteration 2 | 2 | 4 × 3 = 12 |
| Iteration 3 | 1 | 12 × 2 = 24 |
| Iteration 4 | 0 | 24 × 1 = 24 |
| Loop ends (`0 > 0` is false) | — | **24 returned** |

**Reflection (add as a comment):**
> *What is `calculateFactorial(0)` expected to return, and why does your code return that value? (Hint: think about what `result` is initialized to.)*

---

## Part D: Number Guessing Game *(Optional Challenge)*

Build a fully interactive browser game. This ties together `while`, `if/else`, functions, and the `Math.random()` utility.

**Requirements:**
1. Inside your script, generate a secret random number between 1 and 10:
   ```javascript
   const secret = Math.floor(Math.random() * 10) + 1;
   ```
2. Write a function called `checkGuess` that accepts `guess` and `target`. It should:
   - Return `"too high"` if guess > target
   - Return `"too low"` if guess < target
   - Return `"correct"` if guess === target
3. Declare `let guess = 0` and `let attempts = 0`.
4. Write a `while` loop that runs as long as `guess !== secret`.
5. Inside the loop:
   - Increment `attempts`.
   - Use `prompt()` to get input: `Number(prompt("Guess a number between 1 and 10:"))`
   - Call `checkGuess(guess, secret)` and store the result in `let hint`.
   - If hint is not `"correct"`, show an `alert()` with the hint.
6. After the loop, show: `alert("🎉 Correct! The number was ${secret}. You got it in ${attempts} guess(es).")`.

**⚠️ Note:** `prompt()` and `alert()` only work in a browser — not in Node.js. Open your `index.html` in Chrome to play.

---

## Submission Checklist

Before you submit, verify each item:

- [ ] `index.html` opens in the browser without errors shown in the console.
- [ ] Part A: Both functions work, `multiply` uses `return` (not `console.log` inside).
- [ ] Part B: `fizzBuzz(15)` output exactly matches the expected output above.
- [ ] Part C: Factorial values are mathematically correct (`5! = 120`, `4! = 24`, `3! = 6`).
- [ ] All variables use `const` or `let` (never `var`).
- [ ] All comparisons use `===` or `!==` (never `==` or `!=`).
- [ ] No infinite loops — every loop has a clear exit condition.

---

## Reflection Questions

Write your answers as comments at the bottom of `assignment.js`:

1. What is the difference between a `for` loop and a `while` loop? Give one example of when you'd prefer each.
2. What does the `return` keyword do? How is it different from `console.log`?
3. In the FizzBuzz challenge, why must you check `num % 15 === 0` BEFORE checking `num % 3 === 0`?
4. If you declare `let score = 100` inside a function, can you access `score` outside that function? Why or why not?

---

## Bonus Challenges ⭐

Complete these for extra practice:

- **Bonus 1:** Extend Part B — call `fizzBuzz(30)` to confirm the pattern continues correctly. You should see `FizzBuzz` at the number 30.
- **Bonus 2:** Write a function `isPrime` that takes a number and returns `true` if it is a prime number, `false` if not. (Hint: a prime number is only divisible by 1 and itself. Use a `for` loop to check all divisors from 2 up to the number.)
- **Bonus 3:** Use your `isPrime` function inside a `for` loop to print all prime numbers between 1 and 50.
