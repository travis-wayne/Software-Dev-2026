# Tutor Notes – Lesson 11: JavaScript Fundamentals I: Control Flow (If/Else, Loops), Functions

## Learning Objectives

By the end of this session, the student will be able to:

- Implement conditional logic using `if`, `else if`, and `else` statements.
- Identify when to use a `for` loop vs. a `while` loop and write both correctly.
- Recognize and avoid infinite loops.
- Define a function, pass arguments into it, and use the `return` keyword to produce a value.
- Understand function scope and explain why a variable defined inside a function cannot be accessed outside it.

## Materials Needed

- Computer with a modern web browser (Chrome recommended).
- VS Code with integrated terminal.
- `examples/control-flow.html` open in a browser tab.
- `examples/script.js` open in VS Code — the primary live-coding file.
- Developer Console open at all times during the lesson.

## Preparation Checklist

- [ ] Verify the student is comfortable with Lesson 10 concepts: `let`/`const`, data types, `===`, `&&`, `||`, `%`.
- [ ] Open `examples/control-flow.html` in the browser and confirm `script.js` output appears in the Console.
- [ ] Have a **second blank `test.js`** file ready in VS Code for scratch-pad live coding alongside the pre-built examples.
- [ ] Mentally rehearse the analogies below. Good analogies save 10 minutes of explanation.
- [ ] Bookmark the MDN pages for [if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) and [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) to share with the student at the end.

---

## Session Outline

### Part 1: Control Flow — Why Programs Need to Make Decisions (≈5 min)

**Opening hook:**
> *"Every line in our Lesson 10 script ran from top to bottom with zero choice. But what if we only want code to run WHEN something is true? Log a user in IF the password matches. Show an error IF a form field is empty. Give a discount IF the user has a promo code. That decision-making ability is called Control Flow."*

Draw or describe this model:

```
Without Control Flow              With Control Flow (if/else)
────────────────────              ──────────────────────────────────
Line 1 runs                       Condition? ──TRUE──▶ Block A runs
Line 2 runs                                 └─FALSE──▶ Block B runs
Line 3 runs                       Line after the block runs
```

---

### Part 2: If / Else If / Else Statements (≈15 min)

**Step 1 — The simplest possible `if`:**

Start in the console, not in the file. Type with the student:

```javascript
let age = 20;
if (age >= 18) {
    console.log("You may enter.");
}
```

Ask: *"What if `age` is 16? Try it."* Let them type. Nothing prints. Introduce `else`.

```javascript
if (age >= 18) {
    console.log("You may enter.");
} else {
    console.log("Access denied.");
}
```

**Step 2 — Adding `else if` for multiple branches:**

```javascript
let score = 85;

if (score >= 90) {
    console.log("Grade: A – Excellent!");
} else if (score >= 80) {
    console.log("Grade: B – Great job!");
} else if (score >= 70) {
    console.log("Grade: C – You passed!");
} else {
    console.log("Grade: Needs Improvement.");
}
```

**🎯 Teaching moment — Predict Before You Run:**
Before executing, always ask: *"What do you predict will print?"* Then run. If they're wrong, that IS the lesson. Change `score` to 95, then to 65. Have them predict each time.

**Step 3 — Combining with Logical Operators:**

```javascript
let isWeekend = true;
let isSunny = false;

if (isWeekend && isSunny) {
    console.log("Let's go to the beach!");
} else if (isWeekend && !isSunny) {
    console.log("Let's watch a movie indoors.");
} else {
    console.log("Time to work! 💼");
}
```

Ask: *"What does `!isSunny` mean?"* Reinforce the NOT operator from Lesson 10.

**⚠️ Critical teaching point — Order matters!**

```javascript
let x = 95;
// WRONG order — 95 >= 70 is checked first and matches, so "C" prints!
if (x >= 70) {
    console.log("C");
} else if (x >= 90) {
    console.log("A"); // This NEVER runs
}

// CORRECT order — More specific condition first
if (x >= 90) {
    console.log("A");
} else if (x >= 70) {
    console.log("C");
}
```

*"Always write your most specific condition at the top."*

---

### Part 3: Loops (≈15 min)

**Opening hook:**
> *"You need to print every item in a 100-product shopping cart. Would you write 100 `console.log` lines? No. You'd use a loop."*

#### The `for` Loop

Decompose the three parts carefully — students find the semicolons confusing at first.

```javascript
//     Initialization   Condition    Increment
//          ↓               ↓            ↓
for (  let i = 1;    i <= 5;      i++    ) {
    console.log("Iteration: " + i);
}
```

**Walk through it step-by-step out loud:**
1. `let i = 1` → i is now 1. Run once, never again.
2. Is `1 <= 5`? Yes → enter block → print "Iteration: 1"
3. `i++` → i is now 2.
4. Is `2 <= 5`? Yes → print "Iteration: 2"
5. …continue until i = 6…
6. Is `6 <= 5`? **No** → loop exits.

**Modify together:**
- "Now print only even numbers." → Change `i = 1` to `i = 2`, `i++` to `i += 2`
- "Count backwards from 10." → `let i = 10; i >= 1; i--`

#### The `while` Loop

```javascript
let password = "";
let attempts = 0;

while (password !== "opensesame") {
    attempts++;
    password = "wrongguess"; // In a real app this would be user input
    if (attempts >= 3) break; // Safety valve for demo only
}
console.log(`Took ${attempts} attempt(s).`);
```

Use this better analogy: *"A `for` loop is like telling your dishwasher 'run 3 cycles'. A `while` loop is like telling it 'run until the dishes are clean' — you might not know exactly how many cycles it needs."*

**Simpler classroom demo:**
```javascript
let countdown = 5;
while (countdown > 0) {
    console.log("T-minus: " + countdown);
    countdown--;
}
console.log("Liftoff! 🚀");
```

**⚠️ Infinite Loop Warning:**
Point to the `countdown--` line. Say:

> *"Remove that for one second and look at what would happen. The condition `countdown > 0` would always be true, the loop would never end, and your browser tab would freeze. This WILL happen to you at some point — it happens to every developer. When it does, close the tab. Your computer is fine."*

**Do NOT actually run it without `countdown--`** in the browser — kill the tab instead.

For loops vs while loops — when to use which:

| Situation | Use |
|---|---|
| You know exactly how many times to loop | `for` |
| You're iterating through a list of items | `for` |
| You loop until a user does something | `while` |
| You don't know how many iterations upfront | `while` |

---

### Part 4: Functions — Writing Reusable Code (≈20 min)

**Analogy:**
> *"A function is a recipe in a cookbook. Writing the recipe (the declaration) doesn't cook the food. You have to actively decide to cook it (calling/invoking the function). And the same recipe can be used for 10 different dinners (calling the same function multiple times)."*

#### Step 1 — A Function That Does Nothing Special

```javascript
function sayHello() {
    console.log("Hello from inside a function!");
}

// Just declaring it did nothing. Call it:
sayHello();
sayHello(); // Call it again — same recipe, twice
```

#### Step 2 — Parameters and Arguments

*"Our recipe only makes vanilla cake. Parameters make it flexible."*

```javascript
function greetUser(name) {   // 'name' is the parameter (placeholder)
    console.log(`Welcome, ${name}!`);
}

greetUser("Alice");  // 'Alice' is the argument (the actual value)
greetUser("Bob");
```

**🧠 The distinction:** Parameters are in the function definition (like variables). Arguments are the actual values passed in when you call it.

#### Step 3 — The Return Statement (Hardest Concept This Lesson)

This is where most beginners get confused. Address it directly.

> *"There's a BIG difference between a function that SHOWS you something and a function that GIVES you something back. `console.log()` only prints to your screen — that data is gone. `return` sends the value back to the code that called the function, so you can store it and use it."*

**Without `return` — the data is lost:**
```javascript
function addWrong(a, b) {
    console.log(a + b);  // Prints 8 on screen but doesn't GIVE it back
}

let result = addWrong(3, 5);
console.log(result); // undefined — nothing was returned!
```

**With `return` — the data comes back:**
```javascript
function addCorrect(a, b) {
    return a + b;  // Sends 8 back to the caller
}

let result = addCorrect(3, 5); // result is now 8
console.log(result * 2);  // 16 — you can now DO things with the result
```

*"Think of `return` like a vending machine. You put in money (arguments), press a button (the function call), and the machine gives you a snack back (the return value). `console.log` inside a function is like a TV screen on the vending machine — it only shows you something, it doesn't give you anything."*

#### Step 4 — Functions + Loops Together

Show the power of combining concepts:

```javascript
function isEven(num) {
    return num % 2 === 0; // Returns true or false
}

for (let i = 1; i <= 10; i++) {
    if (isEven(i)) {
        console.log(`${i} is even`);
    }
}
```

*"See how we called the function INSIDE the loop? This is what makes code elegant and reusable."*

#### Step 5 — Scope

```javascript
function calculateBonus() {
    let bonus = 5000;  // Local — lives here only
    console.log("Inside function, bonus is: " + bonus);
}

calculateBonus();
console.log(bonus); // ReferenceError: bonus is not defined
```

> *"Variables inside a function are private. They come to life when the function is called and disappear when the function finishes. This is a feature, not a bug — it prevents different parts of your program from accidentally interfering with each other."*

---

### Part 5: Recap & Bridge to Next Lesson (≈5 min)

**Rapid-fire recap questions (ask the student, don't tell):**
- *"What's the difference between `if` and `else if`?"*
- *"What are the three parts of a `for` loop called?"*
- *"What's the risk with a `while` loop?"*
- *"What's the difference between `console.log` inside a function and `return`?"*
- *"If I define `let x = 10` inside a function, can I use `x` outside it?"*

**Bridge:** *"Next lesson we'll use functions even more — calling them with different inputs to solve real problems. The FizzBuzz assignment is designed to use BOTH a function AND a loop together."*

---

## Tips for Tutor

- **Predict-then-run for EVERY example.** Before any `console.log` runs, ask: "What will this print?" The student being wrong is actually the best possible teaching moment.
- **Live-code in a blank file.** Don't just walk through the pre-built `script.js`. Open a blank file, type from scratch. The student should SEE you make typos and fix them — it's reassuring.
- **`return` vs `console.log`** is the hardest concept in this lesson. Budget time for it. The vending machine analogy works well. If needed, show the "wrong" function that returns `undefined` before showing the correct version.
- **Don't rush scope.** Even if you run out of time on other topics, do not skip the scope `ReferenceError` demo. Scope bugs are among the most confusing for self-learners later.
- **Let them break things.** If the student accidentally causes an infinite loop, close the tab and talk through what happened. That experience is worth more than reading about infinite loops.
- **If a function returns nothing, ask.** After defining a function without a return statement, ask: "What do you think gets stored in a variable if we capture the call?" Then show `undefined`. It's a memorable moment.

---

## Common Mistakes & Troubleshooting

### Conditional Mistakes

1. **Using `=` (assignment) instead of `===` (comparison) inside an `if`**
   - ❌ `if (score = 90)` → Always `true` (assigns 90 to score!)
   - ✅ `if (score === 90)` → Compares correctly

2. **Wrong order of `else if` conditions**
   - ❌ Putting wider conditions first means specific ones never match.
   - ✅ Always order from most specific → least specific.

3. **Missing `else` — forgetting the fallback**
   - ❌ Every condition is `false` → code silently does nothing, student can't find the bug.
   - ✅ Always add an `else` during development, even if just `console.log("No condition matched")`.

4. **Forgetting curly braces `{}` on multi-line blocks**
   - ❌ Omitting braces makes only the next single line conditional — the rest always runs.
   - ✅ Use braces even for single-line blocks while learning. Build the habit.

### Loop Mistakes

5. **Off-by-one errors**
   - ❌ `for (let i = 1; i < 5; i++)` prints 4 numbers, not 5.
   - ✅ Use `i <= 5` to be inclusive of the end.

6. **Modifying the loop counter inside the body**
   - ❌ Student writes `i++` inside the for-loop body AND in the header → i jumps by 2.
   - ✅ Only increment in the for-loop's third clause.

7. **Infinite while loop — forgetting to update the condition variable**
   - ❌ `while (count > 0) { console.log(count); }` → Never ends.
   - ✅ `count--` must be inside the loop body.

### Function Mistakes

8. **Calling a function without parentheses**
   - ❌ `greetUser;` → Returns the function object itself, doesn't execute it.
   - ✅ `greetUser();` → The parentheses are what invoke/call the function.

9. **Confusing `return` with `console.log`**
   - ❌ Student uses `console.log` inside a function, then expects to do math with the "result".
   - ✅ Show that `console.log` returns `undefined`. The data is displayed, not returned.

10. **Forgetting that `return` exits the function immediately**
    - ❌ Student writes code after `return` expecting it to run.
    - ✅ Anything after `return` in the same function block is unreachable and will never execute.

11. **Accessing a locally scoped variable from outside the function**
    - ❌ Declaring `let x` inside a function and trying to use `x` outside.
    - ✅ Show the `ReferenceError` and explain that the variable's "lifetime" is tied to the function.
