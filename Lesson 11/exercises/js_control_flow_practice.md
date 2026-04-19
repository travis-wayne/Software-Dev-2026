# Guided Exercises – Lesson 11: Control Flow & Functions

## How to Use This File

Work through each challenge **in order** inside your `examples/script.js` file (or a new `practice.js` file linked to `control-flow.html`). Each challenge builds on the last.

**Before you write any code:** Read the challenge, then ask yourself — *"What should the output be?"* Write your prediction as a comment first. Then code it and check.

> **Tip:** Use `console.log("--- Challenge 1 ---")` between each challenge to keep your console output organised and easy to read.

---

## 🟢 Beginner Challenges (Conditionals)

### Challenge 1: The Temperature Check
**Concept:** `if / else if / else`

**Scenario:** Build the logic for a smart thermostat.

**Steps:**
1. Declare a variable `temperature` and set it to `18`.
2. Write an `if/else if/else` chain:
   - If `temperature < 16` → log `"❄️ Heater ON – it's cold!"`
   - If `temperature > 26` → log `"🌡️ AC ON – it's hot!"`
   - Otherwise → log `"✅ Temperature is comfortable."`
3. Test all three branches by changing the value of `temperature`.

**✅ Expected outputs (test one at a time):**
```
temperature = 18  →  ✅ Temperature is comfortable.
temperature = 10  →  ❄️ Heater ON – it's cold!
temperature = 30  →  🌡️ AC ON – it's hot!
```

---

### Challenge 2: The Cinema Ticket Pricer
**Concept:** `if / else if / else` + `&&` / `||`

**Scenario:** A cinema sets ticket prices based on age and student status.

**Steps:**
1. Declare a variable `age` (e.g., `22`) and `isStudent` (e.g., `true`).
2. Write conditions:
   - Age `< 12` OR age `>= 65` → log `"🎟️ Ticket price: £5 (Concession)"`
   - Age between `12` and `64` (inclusive) AND `isStudent` is `true` → log `"🎟️ Ticket price: £8 (Student)"`
   - Otherwise → log `"🎟️ Ticket price: £15 (Standard)"`
3. Test **three different scenarios** (change `age`/`isStudent` each time).

**⚠️ Gotcha:** Write the most specific conditions first. Check your `else if` order carefully — who might accidentally fall into the wrong bucket?

**✅ Expected outputs:**
```
age=8,  isStudent=false  →  🎟️ Ticket price: £5 (Concession)
age=20, isStudent=true   →  🎟️ Ticket price: £8 (Student)
age=35, isStudent=false  →  🎟️ Ticket price: £15 (Standard)
age=70, isStudent=true   →  🎟️ Ticket price: £5 (Concession)
```

---

## 🟡 Intermediate Challenges (Loops)

### Challenge 3: Inventory Counter
**Concept:** Basic `for` loop

**Scenario:** A warehouse manager needs to log every item in stock.

**Steps:**
1. Write a `for` loop starting at `1`, ending at `10`.
2. Inside the loop, log: `"Item #[i] has been counted."`

**✅ Expected output:**
```
Item #1 has been counted.
Item #2 has been counted.
...
Item #10 has been counted.
```

---

### Challenge 4: Even Numbers Only
**Concept:** `for` loop + `if` statement (combining loops and conditionals)

**Scenario:** Your app only needs to process even-numbered records.

**Steps:**
1. Write a `for` loop from `1` to `20`.
2. Inside the loop, use an `if/else` with the modulus operator `%`:
   - If the number IS even → log `"[number] ✅ EVEN"`
   - If the number is NOT even → log `"[number] ⬜ odd"` (lowercase to make the output visually distinct)

**✅ Expected output (first 4 lines):**
```
1 ⬜ odd
2 ✅ EVEN
3 ⬜ odd
4 ✅ EVEN
...
```

> **Bonus:** After the loop, add `console.log("Done! Processed 20 items.")` to confirm the loop completed.

---

### Challenge 5: Rocket Countdown
**Concept:** `while` loop

**Scenario:** NASA needs a countdown sequence before launch.

**Steps:**
1. Declare `let countdown = 10`.
2. Write a `while` loop that runs as long as `countdown > 0`.
3. Inside the loop: log `"T-minus [countdown]"` then decrease `countdown` by 1.
4. After the loop ends: log `"🚀 Liftoff!"`

**✅ Expected output:**
```
T-minus 10
T-minus 9
T-minus 8
...
T-minus 1
🚀 Liftoff!
```

> **Checkpoint:** Can you explain line-by-line what happens on the LAST iteration? (countdown = 1, logs "T-minus 1", countdown becomes 0, condition `0 > 0` is false, loop exits, "Liftoff!" logs.)

---

### Challenge 6: Sum of Numbers
**Concept:** `for` loop + accumulator variable

**Scenario:** Calculate the sum of all numbers from 1 to 100.

**Steps:**
1. Declare `let total = 0` (this is your accumulator).
2. Write a `for` loop from `1` to `100`.
3. Inside the loop, add the current `i` to `total`.
4. After the loop, log: `"The sum of 1 to 100 is: [total]"`

**✅ Expected output:**
```
The sum of 1 to 100 is: 5050
```

> **Why 5050?** The mathematician Gauss famously calculated this mentally as a child. n(n+1)/2 = 100×101/2 = 5050. Your loop should confirm this!

---

## 🔴 Advanced Challenges (Functions)

### Challenge 7: Your First Function
**Concept:** Function declaration + parameters

**Steps:**
1. Define a function called `introduce` that accepts two parameters: `name` and `role`.
2. Inside the function, log: `"Hi! I'm [name] and I work as a [role]."`
3. Call the function at least **three times** with different arguments.

**✅ Expected output:**
```
Hi! I'm Alice and I work as a Designer.
Hi! I'm Bob and I work as a Developer.
Hi! I'm Carol and I work as a Project Manager.
```

---

### Challenge 8: The Return Statement
**Concept:** `return` vs `console.log` inside a function

**Steps:**
1. Write a function called `calculateArea` that accepts `width` and `height`.
2. The function must **return** the area (`width * height`). Do NOT use `console.log` inside the function.
3. Store the returned value in a variable called `roomArea`.
4. Use `console.log` OUTSIDE the function to print: `"The room area is [roomArea] sq m."`
5. Then, call `calculateArea` twice more with different dimensions and log both results.

**✅ Expected output (your numbers may differ):**
```
The room area is 150 sq m.
The room area is 24 sq m.
The room area is 90 sq m.
```

> **Why not `console.log` inside?** Because you can't reuse the data. `return` gives it back to the caller — you can store it, pass it to another function, or do more maths with it.

---

### Challenge 9: Combining Functions + Loops
**Concept:** Calling a function inside a loop

This is one of the most powerful patterns in programming.

**Steps:**
1. Write a function called `double` that takes one parameter `num` and **returns** `num * 2`.
2. Write a `for` loop from `1` to `5`.
3. Inside the loop, call `double(i)`, capture the result, and log: `"double([i]) = [result]"`

**✅ Expected output:**
```
double(1) = 2
double(2) = 4
double(3) = 6
double(4) = 8
double(5) = 10
```

---

### Challenge 10: Scope Explorer
**Concept:** Local vs global scope

This challenge is about reading code — predict the output before running it.

**Given this code:**
```javascript
let city = "Lagos";

function describeCity() {
    let population = "22 million";
    console.log("City: " + city);
    console.log("Population: " + population);
}

describeCity();
console.log("City outside function: " + city);
// console.log("Population outside function: " + population); // Line X
```

**Questions to answer as comments in your code:**
1. What does `describeCity()` print?
2. What does the `console.log` after the call print?
3. What would happen if you **uncommented** Line X? Why?
4. Is `city` local or global? How can you tell?

**Run the code** and verify your predictions. Then uncomment Line X and observe the error.

---

## 🌟 Bonus Stretch Challenge

### Challenge 11: Temperature Converter Function
Combine everything — a function, a loop, and a conditional.

**Steps:**
1. Write a function `convertTemp` that takes `celsius` as a parameter and **returns** the Fahrenheit value. Formula: `F = (C × 9/5) + 32`.
2. Create an array of Celsius temperatures: `[0, 20, 37, 100]`.
3. Write a `for` loop through the array.
4. Inside the loop, call `convertTemp` and log: `"[C]°C = [F]°F"`.
5. **Bonus inside the loop:** Add an `if/else` that also classifies each temperature:
   - Below 0°C → `"🧊 Freezing"`
   - 0–15°C → `"🧥 Cold"`
   - 16–25°C → `"😊 Comfortable"`
   - Above 25°C → `"☀️ Hot"`

**✅ Expected output:**
```
0°C = 32°F   🧊 Freezing
20°C = 68°F  😊 Comfortable
37°C = 98.6°F ☀️ Hot
100°C = 212°F ☀️ Hot
```
