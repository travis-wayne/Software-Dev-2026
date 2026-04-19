/**
 * Lesson 11: Control Flow & Functions
 * ─────────────────────────────────────────────────────────────────────────
 * Open examples/control-flow.html in your browser.
 * Press F12 to open DevTools → Console tab.
 * Edit this file in VS Code, save it (Ctrl+S), and refresh the browser
 * to see your changes appear in the console.
 *
 * Each section below covers one major concept from today's lesson.
 * Follow along with your tutor — modify values, predict outputs, then run!
 * ─────────────────────────────────────────────────────────────────────────
 */

console.log("🚀 Lesson 11 — Control Flow & Functions");
console.log("═══════════════════════════════════════════");


// ════════════════════════════════════════════════════════════════════════
// SECTION 1: IF / ELSE IF / ELSE STATEMENTS
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 1: Conditionals (If/Else)");
console.log("─────────────────────────────────────");

// --- Example 1A: Basic if/else ---
// TASK: Change the value of 'score' to 95, then to 60. Predict what prints first!
let score = 85;

if (score >= 90) {
    console.log("Grade: A – Excellent! 🏆");
} else if (score >= 80) {
    console.log("Grade: B – Great job! ✅");
} else if (score >= 70) {
    console.log("Grade: C – You passed.");
} else {
    console.log("Grade: Needs Improvement. Keep going! 💪");
}

// --- Example 1B: Why order matters — DON'T do this ---
// If we put the wider condition first (>= 70), a score of 95 would
// match it immediately and incorrectly print "C". Always go specific → general.

// --- Example 1C: Combining Logical Operators (&&, ||, !) ---
let isWeekend = true;
let isSunny   = false;

console.log("\nWeekend planner:");
if (isWeekend && isSunny) {
    console.log("  → Let's go to the beach! 🏖️");
} else if (isWeekend && !isSunny) {
    console.log("  → Movie day indoors! 🎬");  // ◀ This runs: weekend=true, !sunny=true
} else {
    console.log("  → Back to work. 💼");
}

// TASK: Try changing isWeekend to false. Which branch runs now?

// --- Example 1D: Practical use — Access control ---
let userAge        = 17;
let hasParentCode  = true;

if (userAge >= 18) {
    console.log("\nAccess granted — adult user.");
} else if (userAge >= 13 && hasParentCode) {
    console.log("\nAccess granted — teen with parental approval."); // ◀ Runs
} else {
    console.log("\nAccess denied.");
}


// ════════════════════════════════════════════════════════════════════════
// SECTION 2: FOR LOOPS
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 2: For Loops");
console.log("────────────────────────");

// --- Example 2A: Basic for loop —--
// Three parts:  Initialization  |  Condition  |  Increment
//               let i = 1       |  i <= 5     |  i++
console.log("Counting 1 to 5:");
for (let i = 1; i <= 5; i++) {
    console.log("  Iteration: " + i);
}

// --- Example 2B: Counting backwards ---
console.log("\nCounting backwards from 5:");
for (let i = 5; i >= 1; i--) {
    console.log("  " + i);
}

// --- Example 2C: If statement INSIDE a for loop (very common pattern!) ---
console.log("\nEven/Odd check for 1–10:");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        console.log(`  ${i} is EVEN`);
    } else {
        console.log(`  ${i} is ODD`);
    }
}

// TASK: Modify Example 2C to only print EVEN numbers (skip odds entirely).
// Hint: use `continue` or change the starting value + step.

// --- Example 2D: Looping to calculate a total ---
console.log("\nAdding up cart items:");
let prices = [12.99, 5.50, 8.00, 22.49]; // An array of prices
let cartTotal = 0;

for (let i = 0; i < prices.length; i++) {
    cartTotal += prices[i]; // Add each price to the running total
    console.log(`  After item ${i + 1}: $${cartTotal.toFixed(2)}`);
}
console.log(`  🛒 Cart total: $${cartTotal.toFixed(2)}`);


// ════════════════════════════════════════════════════════════════════════
// SECTION 3: WHILE LOOPS
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 3: While Loops");
console.log("──────────────────────────");

// --- Example 3A: Countdown ---
// Use while when you don't know how many iterations you'll need in advance,
// or when the stopping condition depends on something that changes inside the loop.
let countdown = 5;

console.log("Rocket launch countdown:");
while (countdown > 0) {
    console.log("  T-minus: " + countdown);
    countdown--;  // ⭐ NEVER forget this — without it, the loop runs forever!
}
console.log("  🚀 Liftoff!");

// --- Example 3B: Simulating until a condition is met ---
// Imagine a game where we "roll a die" until we get a 6.
console.log("\nRolling a die until we hit 6:");
let roll       = 0;
let rollCount  = 0;

while (roll !== 6) {
    roll = Math.floor(Math.random() * 6) + 1; // Random number 1-6
    rollCount++;
    console.log(`  Roll #${rollCount}: ${roll}`);
}
console.log(`  🎲 Hit 6 after ${rollCount} rolls!`);

// This is impossible to write as a for loop because we don't know
// how many rolls it will take beforehand. This is the perfect use case for while.


// ════════════════════════════════════════════════════════════════════════
// SECTION 4: FUNCTIONS — DECLARATION, PARAMETERS & RETURN
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 4: Functions");
console.log("────────────────────────");

// --- Example 4A: A basic function (no parameters) ---
function sayHello() {
    console.log("Hello from inside a function!");
}

// Just writing the function above does NOTHING. You must CALL it.
sayHello();  // ◀ This is the "call" — the () tells JS to run it
sayHello();  // You can call the same function as many times as you want

// --- Example 4B: Function with parameters ---
// Parameters are placeholders. Arguments are the real values passed in.
function greetUser(firstName, lastName) {
    console.log(`\nWelcome back, ${firstName} ${lastName}!`);
}

greetUser("Alice", "Johnson");  // "Alice" and "Johnson" are arguments
greetUser("Bob", "Smith");

// TASK: Call greetUser() with your own name.

// --- Example 4C: console.log vs return — THE most important distinction ---
console.log("\n--- console.log vs return ---");

// ❌ This function prints but gives nothing back
function addAndLog(a, b) {
    console.log(a + b); // Shows on screen, but the data is LOST
}

let resultWrong = addAndLog(3, 5); // Shows "8" in console
console.log("Captured value (wrong):", resultWrong); // undefined — nothing returned!

// ✅ This function sends the result back to whoever called it
function addAndReturn(a, b) {
    return a + b; // Sends the value BACK — caller can use it
}

let resultCorrect = addAndReturn(3, 5); // resultCorrect is now 8
console.log("Captured value (correct):", resultCorrect);    // 8
console.log("Captured value doubled:", resultCorrect * 2);  // 16 — reusable!

// --- Example 4D: A practical function with return ---
function calculateTotal(price, taxRate) {
    let tax   = price * taxRate;
    let total = price + tax;
    return total; // Only one value can be returned
}

let laptopPrice = calculateTotal(1200, 0.075); // 7.5% tax
let phonePrice  = calculateTotal(450, 0.075);

console.log(`\nLaptop total: $${laptopPrice}`);
console.log(`Phone total:  $${phonePrice}`);
console.log(`Combined:     $${laptopPrice + phonePrice}`);


// ════════════════════════════════════════════════════════════════════════
// SECTION 5: FUNCTIONS + LOOPS COMBINED
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 5: Functions & Loops Working Together");
console.log("─────────────────────────────────────────────────");

// Functions and loops are most powerful when combined.
// You can call a function INSIDE a loop.

function isEven(num) {
    return num % 2 === 0; // Returns true or false
}

console.log("Numbers 1-10 classified:");
for (let i = 1; i <= 10; i++) {
    let label = isEven(i) ? "EVEN" : "ODD"; // Ternary shorthand for if/else
    console.log(`  ${i} → ${label}`);
}

// --- A FizzBuzz style example ---
function classify(num) {
    if (num % 15 === 0) return "FizzBuzz";  // Divisible by BOTH 3 and 5
    if (num % 3  === 0) return "Fizz";      // Divisible by 3
    if (num % 5  === 0) return "Buzz";      // Divisible by 5
    return String(num);                     // Otherwise, just the number
}

console.log("\nFizzBuzz (1–15):");
for (let i = 1; i <= 15; i++) {
    console.log("  " + classify(i));
}


// ════════════════════════════════════════════════════════════════════════
// SECTION 6: FUNCTION SCOPE
// ════════════════════════════════════════════════════════════════════════
console.log("\n📌 SECTION 6: Function Scope");
console.log("────────────────────────────");

// Variables declared inside a function are LOCAL — they cannot be
// accessed from outside that function.

let globalPlayer = "Alice"; // Global scope — visible everywhere

function runGame() {
    let localScore = 100;   // Local scope — visible ONLY inside runGame()
    console.log("Inside function — player:", globalPlayer); // ✅ Can access global
    console.log("Inside function — score: ", localScore);   // ✅ Can access local
}

runGame();
console.log("Outside function — player:", globalPlayer);    // ✅ Global still works

// Uncomment the line below to see the ReferenceError:
// console.log("Outside function — score:", localScore);     // ❌ ReferenceError!

// WHY? Because localScore only EXISTED while runGame() was running.
// Once the function finished, it was deleted. This is called "variable lifetime".


console.log("\n═══════════════════════════════════════════");
console.log("✅ Lesson 11 Script Complete — Great work!");
console.log("═══════════════════════════════════════════");
