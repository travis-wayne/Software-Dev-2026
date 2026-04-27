# Guided Exercises – Lesson 13: Arrays, Objects & ES6+

## How to Use This File

Work through each challenge **in order** inside a new `practice13.js` file linked to a simple `index.html`. Use `console.log("--- Challenge 1 ---")` separators to keep your console readable.

**The predict-then-run rule:** Before running any code, write your expected output as a comment. Seeing the difference between your prediction and reality is where the real learning happens.

---

## 🟢 Beginner: Arrays & Objects

### Challenge 1 — The Shopping List
**Concept:** Array creation, `push`, `pop`, index access

1. Create an array called `shoppingList` with 3 items: `"Milk"`, `"Bread"`, `"Eggs"`.
2. Add `"Butter"` to the **end** using a method.
3. Remove the last item using a method. Store it in `let forgottenItem`.
4. Log: the item you removed, then the 2nd item in the list (index 1).

**Your prediction first:**
```javascript
// I think forgottenItem will be: ???
// I think shoppingList[1] will be: ???
```

**✅ Expected output:**
```
Butter
Bread
```

> **✅ Checkpoint:** Why is `forgottenItem` "Butter" and NOT "Eggs"? (You added Butter with push, making it the last item, then pop removed it.)

---

### Challenge 2 — The Player Profile
**Concept:** Object creation, dot notation, updating and adding properties

1. Create a `player` object with:
   - `username`: your choice (string)
   - `level`: `1` (number)
   - `isOnline`: `true` (boolean)
2. Increase `level` by 1 (do NOT just write `level: 2` — use an assignment).
3. Add a brand-new property `highScore` set to `2500`.
4. Log: `username`, `level`, `highScore`.

**✅ Expected output pattern:**
```
YourUsername
2
2500
```

> **⚠️ Gotcha:** What happens if you type `player.Level` (capital L) to read the level? Try it. What does JS return?

---

### Challenge 3 — Dot vs Bracket Notation Experiment
**Concept:** When bracket notation is *required*

```javascript
const car = { make: "Toyota", model: "Supra", year: 2022 };
```

1. Use **dot notation** to log the `make`.
2. Create a variable: `const prop = "model"`.
3. Use **bracket notation** with `prop` to log the model.
4. Try `car.prop` — log it. What prints? Why?

**✅ Expected output:**
```
Toyota
Supra
undefined
```

> **Reflection (write as a comment):** `car.prop` returns `undefined` because dot notation looks for a property literally called `"prop"`. The variable `prop` is ignored — only bracket notation evaluates the variable.

---

## 🟡 Intermediate: Map, Filter & Arrays of Objects

### Challenge 4 — The Temperature Converter
**Concept:** `.map()` to transform every item

1. Start with: `const celsius = [0, 10, 20, 30, 100]`
2. Use `.map()` to create a `fahrenheit` array. Formula: `(c * 9/5) + 32`.
3. Log both `celsius` and `fahrenheit`.
4. Confirm that `celsius` was **NOT changed**.

**✅ Expected output:**
```
Celsius:    [0, 10, 20, 30, 100]
Fahrenheit: [32, 50, 68, 86, 212]
```

---

### Challenge 5 — Filtering Email Addresses
**Concept:** `.filter()` with `.includes()`

1. Create this array:
   ```javascript
   const emails = ["hello@test.com", "spam@bot.com", "user@test.com", "spam@scam.com", "admin@site.com"];
   ```
2. Use `.filter()` to produce a `cleanInbox` array that **excludes** any email containing the word `"spam"`. *(Hint: `str.includes("spam")` returns `true` if "spam" is in the string.)*
3. Log both arrays.

**✅ Expected output:**
```
All emails:  ["hello@test.com", "spam@bot.com", "user@test.com", "spam@scam.com", "admin@site.com"]
Clean inbox: ["hello@test.com", "user@test.com", "admin@site.com"]
```

---

### Challenge 6 — Array of Objects: The Inventory
**Concept:** Creating and reading arrays of objects

1. Create a `warehouse` array with 4 product objects, each having: `name` (string), `price` (number), `inStock` (boolean).
2. Use a `for...of` loop to log each product's `name` and `price`.
3. Use `.filter()` to create an `available` array of only the products where `inStock` is `true`.
4. Log the count of available products: `"Available: X items"`.

**✅ Expected output pattern:**
```
Widget A: £10
Widget B: £25
Widget C: £5
Widget D: £50
Available: 3 items
```
*(Your names/prices will differ — the PATTERN is what matters.)*

---

### Challenge 7 — Map + Objects: The Name Extractor
**Concept:** `.map()` applied to an array of objects

1. Use the same `warehouse` array from Challenge 6.
2. Use `.map()` to create a new array called `productNames` that contains **only the name string** of each product.
3. Log `productNames`.

**✅ Expected output pattern:**
```
["Widget A", "Widget B", "Widget C", "Widget D"]
```

> **Checkpoint:** Your `.map()` callback receives a full object. The callback's job is to return ONLY the specific value you want: `product => product.name`.

---

## 🔴 Advanced: ES6+ Features

### Challenge 8 — Template Literal Upgrade
**Concept:** Template Literals

1. Create a `city` object: `{ name: "Lagos", country: "Nigeria", population: 15000000 }`.
2. Using a **template literal**, log this exact sentence:
   `"Lagos is located in Nigeria with a population of 15,000,000."`
   *(Hint: `Number.toLocaleString()` formats numbers with commas: `city.population.toLocaleString()`)*

---

### Challenge 9 — Arrow Function Evolution
**Concept:** Rewriting functions as arrow functions

Rewrite this normal function as an arrow function in **three progressively shorter versions**:
```javascript
function calculateTip(bill, percentage) {
    return bill * (percentage / 100);
}
```

**Version A:** Arrow function with curly braces and explicit `return`.
**Version B:** Arrow function with implicit return (no curly braces, no `return`).

Call each version and confirm they produce the same result:
`calculateTip(50, 20)` should give `10`.

---

### Challenge 10 — Destructuring Deep Dive
**Concept:** Object destructuring

1. Create a `subscription` object:
   ```javascript
   const subscription = {
       plan: "Pro",
       price: 3500,
       currency: "NGN",
       billingCycle: "monthly",
       isActive: true
   };
   ```
2. On a **single line**, destructure `plan`, `price`, and `isActive`.
3. Log a template literal: `` `Plan: ${plan} | Price: ₦${price} | Active: ${isActive}` ``

**✅ Expected output:**
```
Plan: Pro | Price: ₦3500 | Active: true
```

---

## 🌟 Bonus Stretch Challenges

### Challenge 11 — The Data Pipeline (Chaining)
Combine `.filter()` and `.map()` as a **single chained expression**.

```javascript
const products = [
    { name: "Laptop",  category: "Tech",     price: 800 },
    { name: "T-Shirt", category: "Clothing", price: 25  },
    { name: "Phone",   category: "Tech",     price: 600 },
    { name: "Jacket",  category: "Clothing", price: 80  },
    { name: "Tablet",  category: "Tech",     price: 400 },
];
```

**Task:** In ONE chained expression, get the **names** of only the **Tech** products that cost **over £500**.

**✅ Expected output:**
```
["Laptop", "Phone"]
```

---

### Challenge 12 — Putting It All Together
1. Build an array of 3 `student` objects: `{ name, grade, passed }`.
2. Use `.filter()` to get only passing students (`passed === true`).
3. Use `.map()` with destructuring in the callback to return a template literal for each:  `` `${name} earned a grade of ${grade}` ``
4. Log the final array of strings.

> **Reflection questions (write as comments):**
> 1. What is the difference between `.map()` and `.filter()`?
> 2. What does `.map()` return if your callback has `{}` but no `return`?
> 3. When MUST you use bracket notation instead of dot notation?
