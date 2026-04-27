# Tutor Session Guide – Lesson 13: Arrays, Objects & ES6+ Features

## ⏱️ Session Outline (Total Time: ~90 mins)

| Phase | Topic | Time |
|---|---|---|
| 1 | Welcome & Recap | 10 min |
| 2 | Arrays — Creation, Indexing, Basic Methods | 20 min |
| 3 | Objects — Key-Value Pairs, Dot vs Bracket Notation | 20 min |
| 4 | Higher-Order Methods — `.map()` and `.filter()` | 15 min |
| 5 | ES6+ — Arrow Functions, Destructuring, Template Literals | 15 min |
| 6 | Q&A and Assignment Walkthrough | 10 min |

---

## 🔁 Opening Recap Questions (≈ 10 min)

Ask the student these before opening any new code:

1. "If I write `const score = 100`, can I store three scores in that one variable?"
2. "What did we use loops for last session? Say we have 50 students — how would we store all their names without an array?"
3. "What is the difference between a function that uses `console.log` inside versus one that uses `return`?"

These should reveal any gaps before introducing new material.

---

## 🛠️ Teaching Analogies

### 1. Variables vs Arrays — The Filing Cabinet
> "A single variable is like one folder on your desk. If you have 50 students, you don't want 50 loose folders. An **array** is a filing cabinet drawer — all items are stored in order. You just say 'give me folder number 3.' The key insight: one variable, unlimited items, accessed by a numbered position."

### 2. Arrays vs Objects — The Contact Card
> "Arrays are great when **order** matters — like a music playlist or a leaderboard. But imagine storing someone's details in an array: `['Alex', 25, 'Lagos', true]`. Is index 2 their city or their job title? You've lost the label. An **Object** is a contact card — each field has a permanent name (key) like `city:` or `isSubscribed:`. No guessing required."

### 3. `.map()` — The Factory Assembly Line
> "Imagine a factory assembly line. Raw items go in one end, each one gets transformed in the same way (painted, packaged, welded), and finished products come out the other end. `.map()` is that assembly line. You tell it: 'for EVERY item in this array, apply this transformation'. It NEVER changes the original — it always produces a BRAND NEW array."

### 4. `.filter()` — The Bouncer at the Door
> "A `.filter()` is a bouncer at a club door. Every person (array item) walks up and the bouncer checks one thing: 'Does this person pass the rule?' Yes → they're in. No → they're turned away. The result is a new guest list of only the people who passed."

### 5. ES6 Arrow Functions — The Shorthand Note
> "Writing a normal function is like writing a formal letter: Dear `function`, I would like to `return` a value, Yours sincerely. An arrow function is a text message: 'n => n * 2'. Same meaning, far less noise."

---

## ⚠️ Common Mistakes & Troubleshooting Guide

### Array Pitfalls
1. **Off-by-one error:** `arr[arr.length]` is ALWAYS `undefined`. The last item is always at `arr[arr.length - 1]`. Use a *predict-then-run* moment: "What does `fruits[3]` return for a 3-item array?" Watch them say 3 and then see `undefined`.
2. **`const` confusion with mutation:** Students assume `const fruits = []` means nothing can change. Clarify: `const` locks the **label on the box**, not the **contents of the box**. You can't reassign `fruits = []` but you CAN `fruits.push("mango")`.
3. **`pop()` returns the removed item:** Students often forget the return value. Ask: "What does `let x = fruits.pop()` give you?" Many will say `undefined`.

### Object Pitfalls
4. **Colon vs equals in object literals:** `{ name = "Alex" }` is a syntax error. Inside `{}`, you ALWAYS use a colon — `{ name: "Alex" }`. Equals is for assignment, colon is for pairing.
5. **Dot notation with a variable:** If `let key = "age"`, then `user.key` looks for a property literally called "key" (doesn't exist → `undefined`). You MUST use `user[key]`. This bites students during loops.
6. **Reading an undefined property doesn't crash:** `user.salary` gives `undefined` silently. This is dangerous because it can cause bugs far downstream before you trace the root cause.

### `.map()` and `.filter()` Pitfalls
7. **Forgetting to return inside `{}` callbacks:** `[1,2,3].map(n => { n * 2 })` produces `[undefined, undefined, undefined]`. Curly braces require an explicit `return`. Without braces, the expression is implicitly returned. Make sure the student understands BOTH syntax forms before moving on.
8. **Using `.map()` when they want `.forEach()`:** If they don't want a new array — they just want to LOG each item — they want `.forEach()`. Using `.map()` then ignoring the result wastes memory. Introduce `.forEach()` as "map's cousin that doesn't return anything".

### ES6 Pitfalls
9. **Using regular quotes for template literals:** `'Hello ${name}'` prints the literal text `${name}`. BACKTICKS are required. Have them find the backtick key on their keyboard right now.
10. **Implicit vs explicit return in arrow functions:** `n => n * 2` (no braces) implicitly returns. `n => { return n * 2 }` (braces + explicit return) works. `n => { n * 2 }` (braces, NO return) silently returns `undefined`. Test them with all three.
11. **Destructuring mismatch keys:** `const { Username } = user` — capital U — won't match `user.username` with a lowercase u. Object destructuring is case-sensitive.

---

## 🎬 Live Teaching Script (Phase by Phase)

### Phase 1: Arrays (≈ 20 min)

**Tutor:** "Last session we had to write 3 separate variables to store 3 names. What happens when a school needs to store 300 student names?"
*(Student: that's impossible with individual variables.)*

**Tutor:** "Exactly. We use an array. One variable. Any number of items."
```javascript
const students = ["Alice", "Bob", "Charlie"];
```
**Tutor (Predict-then-run):** "What index do I use to get 'Bob'? Write your answer as a comment before we run it."
```javascript
console.log(students[1]); // Most guess '2' first — correct this.
```
**Tutor:** "Now, how many items are there? We use `.length`. What do you think stops us from doing `students[3]`?"
```javascript
console.log(students.length); // 3
console.log(students[3]);     // undefined — IMPORTANT discussion point
```

**Tutor — Array Methods:**
"Arrays have built-in tools. Let's add and remove items."
```javascript
students.push("Diana");   // Ask first: "Does this change the original or creates new?"
console.log(students);    // [Alice, Bob, Charlie, Diana] — yes, it mutates

let removed = students.pop();
console.log(removed);     // "Diana" — pop RETURNS the removed item
console.log(students);    // [Alice, Bob, Charlie]
```

---

### Phase 2: Objects (≈ 20 min)

**Tutor:** "Arrays use numbers to find data. But what if we want LABELS? What if we want to look up a person's EMAIL, not 'item at index 2'?"
```javascript
const user = {
    name: "Alex",
    age: 28,
    email: "alex@code.dev",
    isSubscribed: true
};
```
**Tutor:** "This is a KEY-VALUE pair. Every piece of data has a name. How do I get the age?"
```javascript
console.log(user.age);      // 28 — dot notation
```
**Tutor (Predict-then-run):** "What if I make a typo? `user.Age` — capital A. What do we get?"
```javascript
console.log(user.Age); // undefined — not an error, just silence
```

**Tutor — Updating Objects:**
"Objects are mutable even with `const`. We can add and update properties."
```javascript
user.age = 29;        // Update existing
user.city = "Lagos";  // Add new property
delete user.email;    // Remove a property
console.log(user);
```

---

### Phase 3: `.map()` and `.filter()` (≈ 15 min)

**Tutor:** "We know `for` loops. But there's a smarter, more modern way to process every item in an array."
```javascript
const prices = [10, 20, 30, 40];
```
**Tutor:** "I want every price multiplied by 1.2 for VAT. Old way?"
```javascript
// Ask student to write a for loop first — let them try
const withTax = [];
for (let i = 0; i < prices.length; i++) {
    withTax.push(prices[i] * 1.2);
}
```
**Tutor:** "Now with `.map()`: same result, one line."
```javascript
const withTaxModern = prices.map(price => price * 1.2);
console.log(withTaxModern); // [12, 24, 36, 48]
console.log(prices);        // [10, 20, 30, 40] — original UNCHANGED
```
**Tutor (Critical point):** "`.map()` NEVER changes the original. Always produces a NEW array. This is what we call immutability — a crucial concept in modern development."

**Tutor — filter:**
```javascript
const scores = [45, 80, 95, 60, 72];
const passed = scores.filter(score => score >= 70);
console.log(passed); // [80, 95, 72]
```
**Tutor:** "The test function must return true or false. If true — item is included. If false — item is excluded."

---

### Phase 4: ES6+ (≈ 15 min)

**Tutor:** "Let's look at three features that clean up your code dramatically."

**Template Literals:** *(show old vs new side by side)*
```javascript
const name = "Sarah";
// Old:
console.log("Hello " + name + ", welcome!");
// New:
console.log(`Hello ${name}, welcome!`);
```

**Arrow Functions:** *(show the evolution line by line)*
```javascript
// Step 1: Normal function
function double(n) { return n * 2; }

// Step 2: Function expression
const doubleB = function(n) { return n * 2; };

// Step 3: Arrow function
const doubleC = (n) => { return n * 2; };

// Step 4: Implicit return (most concise)
const doubleD = n => n * 2;
```

**Destructuring:** *(show the "before" first so student appreciates the "after")*
```javascript
const product = { title: "Laptop", price: 999, brand: "TechCo" };

// Old:
const title = product.title;
const price = product.price;

// New (one line):
const { title, price } = product;
console.log(`${title} costs £${price}`);
```

---

## ✅ Session Closing Check (≈ 5 min)

Before ending, ask verbally:
1. "What is the index of the FIRST item in any array?"
2. "If you use `.map()` and log the ORIGINAL array after, what do you expect to see?"
3. "Write a template literal that prints: 'User [name] is [age] years old.' using variables."
4. "What symbol do arrow functions use instead of the word `function`?"

If any answers are shaky, spend 2 minutes revisiting that specific point using the interactive HTML reference.
