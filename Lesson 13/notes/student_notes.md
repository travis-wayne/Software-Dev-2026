# Student Notes — Lesson 13: Arrays, Objects & ES6+

---

## 1. Arrays — Ordered Collections

An **array** is a single variable that holds a list of values. It is ordered — every item has a numbered position called an **index**.

> ⚠️ **CRITICAL RULE: JavaScript counts from 0, not 1.**
> The first item is always at index `0`.

### Anatomy of an Array

```
const fruits = ["Apple", "Banana", "Cherry"];
               //  [0]      [1]       [2]
```

```javascript
console.log(fruits[0]);              // "Apple"
console.log(fruits[1]);              // "Banana"
console.log(fruits[fruits.length - 1]); // "Cherry" (always the LAST item)
console.log(fruits[3]);              // undefined (doesn't exist!)
```

### Essential Array Methods — Mutation

These methods **change the original array** (they mutate it):

| Method | Action | Example | Original After |
|:---|:---|:---|:---|
| `.push(x)` | Adds `x` to the **end** | `arr.push(4)` | `[1,2,3,4]` |
| `.pop()` | Removes & returns last item | `let x = arr.pop()` | `[1,2]`, `x = 3` |
| `.unshift(x)` | Adds `x` to the **start** | `arr.unshift(0)` | `[0,1,2,3]` |
| `.shift()` | Removes & returns first item | `let x = arr.shift()` | `[2,3]`, `x = 1` |

```javascript
const crew = ["Alice", "Bob", "Charlie"];
crew.push("Diana");          // ["Alice", "Bob", "Charlie", "Diana"]

let last = crew.pop();       // last = "Diana", crew = ["Alice", "Bob", "Charlie"]
console.log(last);           // "Diana"
```

---

## 2. Objects — Labelled Data Collections

If arrays use **numbers** to find data, objects use **names** (called keys). This makes data self-describing and much easier to read.

```javascript
const user = {
    firstName: "Alex",    // key: "firstName",  value: "Alex"
    age: 28,              // key: "age",         value: 28
    isSubscribed: true    // key: "isSubscribed", value: true
};
```

### Accessing Object Properties

```javascript
// 1. DOT NOTATION — use this almost always
console.log(user.firstName);   // "Alex"
console.log(user.age);         // 28

// 2. BRACKET NOTATION — REQUIRED when the key is stored in a variable
const keyName = "firstName";
console.log(user[keyName]);    // "Alex"  ← Works!
console.log(user.keyName);     // undefined ← Looks for property literally called "keyName"
```

> **When to use bracket notation:** In a `for...in` loop when iterating over keys, or when the key name is dynamic (stored in a variable).

### Updating & Adding Properties

```javascript
user.age = 29;              // Update an existing property
user.city = "Lagos";        // Add a brand-new property
delete user.isSubscribed;   // Remove a property entirely
console.log(user);          // { firstName: "Alex", age: 29, city: "Lagos" }
```

---

## 3. Arrays of Objects — The Real-World Combination

In professional code, the most common data pattern is an **array OF objects**. Think of it as a spreadsheet: the array is the table, and each object is one row.

```javascript
const employees = [
    { id: 1, name: "Alice",   dept: "Engineering", salary: 80000 },
    { id: 2, name: "Bob",     dept: "Design",      salary: 65000 },
    { id: 3, name: "Charlie", dept: "Engineering", salary: 90000 },
];

// Get the first employee's name:
console.log(employees[0].name);     // "Alice"

// Get the second employee's department:
console.log(employees[1].dept);     // "Design"
```
This is also the format you'll receive data from any web API — a list of objects.

---

## 4. Higher-Order Methods: `.map()` and `.filter()`

These are modern alternatives to `for` loops for processing arrays. They are more readable and always produce a **brand new array**, leaving the original **unchanged**.

### `.map()` — Transform Every Item

Think of `.map()` as a factory assembly line — raw materials go in, finished products come out. Every single item is processed.

```javascript
const prices = [10, 20, 30];

// Apply 20% VAT to every price
const pricesWithTax = prices.map(price => price * 1.2);

console.log(pricesWithTax); // [12, 24, 36]
console.log(prices);        // [10, 20, 30]  ← ORIGINAL IS UNCHANGED
```

### `.filter()` — Keep Only Matching Items

Think of `.filter()` as a bouncer: each item faces a test. If it passes (the function returns `true`), it gets in. If it fails (returns `false`), it's out.

```javascript
const scores = [45, 80, 95, 60, 72];

// Keep only scores that are 70 or higher
const passed = scores.filter(score => score >= 70);

console.log(passed); // [80, 95, 72]
console.log(scores); // [45, 80, 95, 60, 72] ← ORIGINAL UNCHANGED
```

### `.map()` + `.filter()` on Arrays of Objects

This is where the power really shows. Processing real-world data:

```javascript
const employees = [
    { name: "Alice", dept: "Engineering", salary: 80000 },
    { name: "Bob",   dept: "Design",      salary: 65000 },
    { name: "Carol", dept: "Engineering", salary: 90000 },
];

// Get only the Engineering staff
const engineers = employees.filter(emp => emp.dept === "Engineering");
// [{ name: "Alice", ... }, { name: "Carol", ... }]

// Get just a list of all names (from filtered result)
const engineerNames = engineers.map(emp => emp.name);
// ["Alice", "Carol"]

// Or CHAIN them in one line:
const names = employees.filter(e => e.dept === "Engineering").map(e => e.name);
```

---

## 5. Modern ES6+ Features

### A. Template Literals — Better String Building

Use **backticks** (`` ` ``) instead of quotes. Embed variables with `${}`.

```javascript
const name = "Sarah";
const score = 95;

// ❌ Old Way (error-prone with + signs)
console.log("Student " + name + " scored " + score + " points.");

// ✅ Modern Template Literal
console.log(`Student ${name} scored ${score} points.`);

// You can also put EXPRESSIONS inside ${}:
console.log(`Pass/Fail: ${score >= 70 ? "Pass" : "Fail"}`);
```

### B. Arrow Functions — Shorter Function Syntax

Arrow functions (`=>`) are a concise way to write functions. When the function body is a **single expression**, you can drop the curly braces `{}` AND the `return` keyword.

```javascript
// Evolution of a function — all four do the same thing:

// 1. Function declaration
function double(n)          { return n * 2; }

// 2. Function expression
const doubleB = function(n) { return n * 2; };

// 3. Arrow — explicit return
const doubleC = (n) => { return n * 2; };

// 4. Arrow — implicit return (most concise)
const doubleD = n => n * 2;

console.log(doubleD(5)); // 10
```

> ⚠️ **The most common arrow function mistake:**
> `n => { n * 2 }` — has curly braces but NO `return`. This always returns `undefined`.

### C. Object Destructuring — Unpack Properties Instantly

Instead of accessing each property one-by-one, pull multiple values out in a single line.

```javascript
const product = { title: "Laptop", price: 999, brand: "TechCo" };

// ❌ Old Way
const title = product.title;
const price = product.price;

// ✅ Destructuring (one line)
const { title, price } = product;

console.log(`${title} costs £${price}`); // "Laptop costs £999"
```

**Destructuring in function parameters** (very common in real code):
```javascript
function printProduct({ title, price }) {
    console.log(`${title}: £${price}`);
}
printProduct(product); // "Laptop: £999"
```

---

## 6. Quick Reference Cheat Sheet

| Concept | Syntax | Use When |
|:---|:---|:---|
| Create array | `const arr = [1,2,3]` | Ordered lists |
| Access item | `arr[0]` | Get by position |
| Last item | `arr[arr.length - 1]` | Dynamic length |
| Add to end | `arr.push(x)` | Appending items |
| Remove from end | `arr.pop()` | Stack behaviour |
| Create object | `const obj = {key: val}` | Labelled data |
| Get property | `obj.key` or `obj[var]` | Data access |
| Transform array | `arr.map(fn)` | New array, same length |
| Select from array | `arr.filter(fn)` | New array, shorter |
| Template string | `` `Hello ${name}` `` | String interpolation |
| Arrow function | `const fn = x => x * 2` | Short functions |
| Destructure | `const {a, b} = obj` | Extract properties |
