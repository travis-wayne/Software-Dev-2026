# JavaScript Fundamentals Practice Exercises – Lesson 10

Work through these exercises step by step. Use the browser's Developer Console or create a `script.js` file linked to an HTML page to run your code.

---

## Before You Begin

**1. Open the Interactive Reference**
Open `examples/js_interactive_reference.html` in your browser. Keep it open in a tab — use the Playground for quick experiments.

**2. Set Up Your Workspace**
Create a new folder for your practice work. Inside it, create two files:

**practice.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Practice</title>
</head>
<body>
    <h1>JavaScript Practice</h1>
    <p>Open the console (F12) to see output.</p>
    <script src="practice.js"></script>
</body>
</html>
```

**practice.js:**
```javascript
// JavaScript Fundamentals Practice
// Write your exercise code below each comment.
```

**3. Open the Console**
Open `practice.html` in your browser, then press `F12` (or `Ctrl + Shift + J`) to open the Developer Console. You'll see output here as you add code to `practice.js`.

---

## Exercise 1: Hello, Console!

**Goal:** Verify that your JS file is linked correctly.

Add this line to `practice.js`:
```javascript
console.log("Hello from practice.js!");
```

Save the file and refresh your browser.

✅ **Expected output:** `Hello from practice.js!`

If you see the message in the console, your setup is working. If not, check that:
- The `<script src="practice.js">` path matches your file name.
- Both files are in the same folder.

---

## Exercise 2: Declare Variables

**Goal:** Practice creating variables with `const` and `let`.

Add the following to `practice.js`:
```javascript
const myName = "YOUR NAME HERE";  // Replace with your actual name
const birthYear = 2004;           // Replace with your birth year
let currentYear = 2026;
let age = currentYear - birthYear;

console.log("Name:", myName);
console.log("Birth Year:", birthYear);
console.log("Current Year:", currentYear);
console.log("Age:", age);
```

Save and refresh.

✅ **Expected output:** Your name, birth year, year, and calculated age printed to the console.

**Checkpoint question:** Why did we use `const` for `myName` but `let` for `currentYear`?

---

## Exercise 3: The `const` Guard Rail

**Goal:** See what happens when you try to reassign a `const`.

Add this to `practice.js`:
```javascript
const favouriteColour = "blue";
console.log("Favourite colour:", favouriteColour);

// Now try to change it:
// favouriteColour = "green";  // ← Uncomment this line and save
```

**Step 3a:** Run the code with the line commented out. It should work fine.

**Step 3b:** Uncomment the `favouriteColour = "green";` line, save, and refresh.

✅ **Expected output:** `TypeError: Assignment to constant variable.`

**Step 3c:** Comment the line back out to fix the error. Understand: `const` protects you from accidentally overwriting values.

---

## Exercise 4: Inspect Data Types with `typeof`

**Goal:** Use `typeof` to identify what type each variable is.

```javascript
let testString = "Hello, World!";
let testNumber = 42;
let testDecimal = 3.14;
let testBoolean = true;
let testUndefined;
let testNull = null;

console.log("--- Data Type Inspection ---");
console.log("testString:", typeof testString);
console.log("testNumber:", typeof testNumber);
console.log("testDecimal:", typeof testDecimal);
console.log("testBoolean:", typeof testBoolean);
console.log("testUndefined:", typeof testUndefined);
console.log("testNull:", typeof testNull);
```

✅ **Expected output:**
```
--- Data Type Inspection ---
testString: string
testNumber: number
testDecimal: number
testBoolean: boolean
testUndefined: undefined
testNull: object
```

**Checkpoint question:** Why does `typeof testNull` say `"object"` instead of `"null"`?
*(Answer: It's a famous bug from 1995 that was never fixed for backwards compatibility.)*

---

## Exercise 5: Template Literals

**Goal:** Practice the modern way of combining strings and variables.

```javascript
const firstName = "Alice";
const lastName = "Johnson";
const course = "Software Development";

// Old way — concatenation
console.log("Old way: Hello, " + firstName + " " + lastName + "! Welcome to " + course + ".");

// New way — template literals (backticks)
console.log(`New way: Hello, ${firstName} ${lastName}! Welcome to ${course}.`);

// Template literals can embed expressions
const price = 5000;
const quantity = 3;
console.log(`Total: ₦${price * quantity}`);
```

✅ **Expected output:**
```
Old way: Hello, Alice Johnson! Welcome to Software Development.
New way: Hello, Alice Johnson! Welcome to Software Development.
Total: ₦15000
```

---

## Exercise 6: Arithmetic Operators

**Goal:** Use all six arithmetic operators.

```javascript
console.log("--- Arithmetic Operators ---");

let a = 17;
let b = 5;

console.log(`${a} + ${b} =`, a + b);
console.log(`${a} - ${b} =`, a - b);
console.log(`${a} * ${b} =`, a * b);
console.log(`${a} / ${b} =`, a / b);
console.log(`${a} % ${b} =`, a % b);   // Modulus (remainder)
console.log(`${a} ** ${b} =`, a ** b);  // Exponentiation
```

✅ **Expected output:**
```
--- Arithmetic Operators ---
17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3.4
17 % 5 = 2
17 ** 5 = 1419857
```

**Bonus:** Write a line that checks if 17 is an odd number using modulus:
```javascript
console.log("Is 17 odd?", a % 2 !== 0); // true
```

---

## Exercise 7: Assignment Operators

**Goal:** Practice shorthand assignment operators.

```javascript
console.log("--- Assignment Operators ---");

let points = 50;
console.log("Starting points:", points);

points += 20;   // Add 20
console.log("After += 20:", points);

points -= 10;   // Subtract 10
console.log("After -= 10:", points);

points *= 2;    // Double it
console.log("After *= 2:", points);

points /= 4;    // Divide by 4
console.log("After /= 4:", points);

points++;        // Add 1
console.log("After ++:", points);

points--;        // Subtract 1
console.log("After --:", points);
```

✅ **Expected output:**
```
--- Assignment Operators ---
Starting points: 50
After += 20: 70
After -= 10: 60
After *= 2: 120
After /= 4: 30
After ++: 31
After --: 30
```

**Checkpoint question:** Before looking at the output, try to predict each value on paper. Did your predictions match?

---

## Exercise 8: The Type Coercion Experiment

**Goal:** Discover JavaScript's automatic type conversion and understand why it matters.

```javascript
console.log("--- Type Coercion Experiments ---");

// String + Number
console.log("Test 1:", "5" + 3);
console.log("Test 2:", "5" - 3);
console.log("Test 3:", "5" * 2);
console.log("Test 4:", "10" / 2);

// Boolean coercion
console.log("Test 5:", true + 1);
console.log("Test 6:", false + 10);

// The tricky one
console.log("Test 7:", "Score: " + 50 + 10);
console.log("Test 8:", "Score: " + (50 + 10));
```

✅ **Expected output:**
```
--- Type Coercion Experiments ---
Test 1: 53
Test 2: 2
Test 3: 10
Test 4: 5
Test 5: 2
Test 6: 10
Test 7: Score: 5010
Test 8: Score: 60
```

**Checkpoint questions:**
1. Why does Test 1 give `"53"` instead of `8`?
2. Why is Test 7 different from Test 8?
3. What would `"hello" - 5` give? Try it!

---

## Exercise 9: Strict vs Loose Equality

**Goal:** See the critical difference between `==` and `===`.

```javascript
console.log("--- Equality Comparison ---");

// Strict equality (===) — checks VALUE and TYPE
console.log("5 === 5:", 5 === 5);         // true
console.log('5 === "5":', 5 === "5");     // false — different types!

// Loose equality (==) — checks VALUE only (AVOID!)
console.log('5 == "5":', 5 == "5");       // true — ⚠️ dangerous!
console.log("0 == false:", 0 == false);   // true — ⚠️ bizarre!
console.log('"" == false:', "" == false); // true — ⚠️ what?!

// The same with strict
console.log("0 === false:", 0 === false);   // false ✅
console.log('"" === false:', "" === false); // false ✅
```

✅ **Expected output:** Compare the `==` results (surprising!) with the `===` results (predictable).

Add a comment in your code: `// Rule: ALWAYS use === and !==. Never use ==.`

---

## Exercise 10: Logical Operators

**Goal:** Combine conditions with `&&` (AND), `||` (OR), and `!` (NOT).

```javascript
console.log("--- Logical Operators ---");

let age = 25;
let isCitizen = true;
let isBanned = false;

// AND (&&) — all conditions must be true
let canVote = age >= 18 && isCitizen && !isBanned;
console.log(`Age: ${age}, Citizen: ${isCitizen}, Banned: ${isBanned}`);
console.log("Can vote?", canVote);

// OR (||) — at least one condition must be true
let getsDiscount = age < 12 || age >= 65;
console.log("Gets age discount?", getsDiscount);

// NOT (!) — flips the value
console.log("Is NOT banned:", !isBanned);
console.log("Is NOT a citizen:", !isCitizen);
```

**After getting it working:** Change `age` to `10`, then to `70`. Observe how the results change. Then set `isBanned = true` and check `canVote` again.

---

## Exercise 11: Build a Mini Calculator

**Goal:** Combine everything you've learned into a working program.

```javascript
console.log("--- Mini Calculator ---");

const productName = "Wireless Headphones";
const unitPrice = 15000;     // Naira
let quantity = 3;
const vatRate = 0.075;       // 7.5% VAT

const subtotal = unitPrice * quantity;
const vat = subtotal * vatRate;
const total = subtotal + vat;

console.log(`Product: ${productName}`);
console.log(`Unit Price: ₦${unitPrice.toLocaleString()}`);
console.log(`Quantity: ${quantity}`);
console.log(`Subtotal: ₦${subtotal.toLocaleString()}`);
console.log(`VAT (7.5%): ₦${vat.toLocaleString()}`);
console.log(`Total: ₦${total.toLocaleString()}`);
```

✅ **Expected output:**
```
--- Mini Calculator ---
Product: Wireless Headphones
Unit Price: ₦15,000
Quantity: 3
Subtotal: ₦45,000
VAT (7.5%): ₦3,375
Total: ₦48,375
```

**Challenge:** Change the `quantity` to `10` and verify the total is correct by calculating manually.

---

## Exercise 12: Eligibility Checker

**Goal:** Use comparison and logical operators together to make decisions.

```javascript
console.log("--- Eligibility Checker ---");

let applicantAge = 20;
let applicantIsCitizen = true;
let applicantHasConviction = false;

// Voting eligibility: age >= 18 AND citizen AND no conviction
let canApplicantVote = applicantAge >= 18 && applicantIsCitizen && !applicantHasConviction;

console.log(`Applicant Age: ${applicantAge}`);
console.log(`Is Citizen: ${applicantIsCitizen}`);
console.log(`Has Conviction: ${applicantHasConviction}`);
console.log(`Can Vote: ${canApplicantVote}`);

// Driving eligibility: age >= 18
let canDrive = applicantAge >= 18;
console.log(`Can Drive: ${canDrive}`);

// Senior discount: age >= 65 OR under 12
let getsSeniorDiscount = applicantAge >= 65 || applicantAge < 12;
console.log(`Gets Discount: ${getsSeniorDiscount}`);
```

**After getting it working:** Test with these scenarios:
1. Set `applicantAge = 16` — what changes?
2. Set `applicantHasConviction = true` — can they still vote?
3. Set `applicantAge = 70` — do they get a discount?

---

## Reflection Questions

1. What is the difference between `let` and `const`? When would you use each one?
2. Why is `===` preferred over `==` in JavaScript?
3. What does `typeof` return for `null`, and why is this unexpected?
4. Explain in your own words why `"5" + 3` gives `"53"` but `"5" - 3` gives `2`.
5. Give a real-world example where you would use the `&&` (AND) operator and one where you would use `||` (OR).

---

## Bonus Challenges ⭐

- **Challenge 1:** Write code that converts a temperature from Celsius to Fahrenheit. Formula: `F = C * 9/5 + 32`. Test with body temp (37°C), water boiling (100°C), and freezing (0°C).

- **Challenge 2:** Use `typeof` and `===` to write a series of checks: is a given variable a string? A number? A boolean? Log the results.

- **Challenge 3:** Try these in the console and explain the results:
  ```javascript
  console.log([] + []);      // ???
  console.log([] + {});      // ???
  console.log({} + []);      // ???
  console.log("b" + "a" + +"a" + "a");  // ???
  ```
  *(These are famous JS quirks — see if you can figure out why!)*

- **Challenge 4:** Create a grade calculator. Given a `score` between 0 and 100, use comparison operators to log which letter grade the student receives (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: below 60). *(Hint: you'll need `if/else if` — peek ahead to the next lesson if needed!)*
