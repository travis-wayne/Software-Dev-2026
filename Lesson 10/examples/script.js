// ============================================================
// JavaScript Fundamentals I — Complete Examples
// Lesson 10 | Software Dev 2026
// ============================================================
// Open js-basics.html in your browser, then open the
// Developer Console (F12 → Console tab) to see all output.
// ============================================================

console.log("🚀 Welcome to JavaScript Fundamentals I!");
console.log("==========================================\n");

// ============================================================
// SECTION 1: Variables — var vs let vs const
// ============================================================
console.log("--- SECTION 1: Variables (var vs let vs const) ---");

// const — value CANNOT be reassigned (use this by default)
const courseName = "Software Development 2026";
console.log("Course Name (const):", courseName);

// let — value CAN be reassigned (use when the value will change)
let currentLesson = 10;
console.log("Current Lesson (let):", currentLesson);

currentLesson = 11; // ✅ This is allowed with let
console.log("Updated Lesson (let):", currentLesson);

// var — the old way (AVOID in modern JavaScript)
// var allows accidental re-declaration:
var oldVariable = "I'm declared with var";
var oldVariable = "I just got silently overwritten!"; // ⚠️ No error!
console.log("var re-declaration (dangerous!):", oldVariable);

// 🛑 Uncommenting the line below would cause an error — and that's GOOD!
// const courseName = "Another Name"; // ❌ SyntaxError: already declared

console.log(""); // blank line for readability


// ============================================================
// SECTION 2: Data Types & typeof
// ============================================================
console.log("--- SECTION 2: Data Types & typeof ---");

// String — text wrapped in quotes
const studentName = "Alice";
console.log("studentName:", studentName, "→ typeof:", typeof studentName);

// Number — integers and decimals (no separate int/float in JS)
const age = 22;
const gpa = 3.85;
console.log("age:", age, "→ typeof:", typeof age);
console.log("gpa:", gpa, "→ typeof:", typeof gpa);

// Boolean — true or false
const isEnrolled = true;
console.log("isEnrolled:", isEnrolled, "→ typeof:", typeof isEnrolled);

// Undefined — variable declared but no value assigned
let middleName;
console.log("middleName:", middleName, "→ typeof:", typeof middleName);

// Null — intentionally set to "nothing"
const selectedCourse = null;
console.log("selectedCourse:", selectedCourse, "→ typeof:", typeof selectedCourse);
console.log("⚠️ typeof null is 'object' — this is a famous bug from 1995!");

// Symbol — unique identifier (advanced)
const uniqueId = Symbol("id");
console.log("uniqueId → typeof:", typeof uniqueId);

console.log("");


// ============================================================
// SECTION 3: String Concatenation vs Template Literals
// ============================================================
console.log("--- SECTION 3: String Concatenation vs Template Literals ---");

const firstName = "Alice";
const lastName = "Johnson";

// Old way — concatenation with +
console.log("Old way: " + "Hello, " + firstName + " " + lastName + "!");

// Modern way — template literals (backticks!)
console.log(`New way: Hello, ${firstName} ${lastName}!`);

// Template literals can embed expressions
console.log(`Next year, ${firstName} will be ${age + 1} years old.`);

console.log("");


// ============================================================
// SECTION 4: Type Coercion — JavaScript's Quirky Side
// ============================================================
console.log("--- SECTION 4: Type Coercion (⚠️ Watch carefully!) ---");

console.log('"5" + 3  =', "5" + 3);      // "53"  — string wins!
console.log('"5" - 3  =', "5" - 3);      // 2     — forced to number
console.log('"5" * 2  =', "5" * 2);      // 10    — forced to number
console.log('"5" / 2  =', "5" / 2);      // 2.5   — forced to number
console.log('true + 1 =', true + 1);     // 2     — true becomes 1
console.log('false + 1 =', false + 1);   // 1     — false becomes 0
console.log('"hello" - 1 =', "hello" - 1); // NaN — Not a Number!

// The fix: use Number() to convert explicitly
console.log('Number("5") + 3 =', Number("5") + 3); // 8

console.log();


// ============================================================
// SECTION 5: Arithmetic Operators
// ============================================================
console.log("--- SECTION 5: Arithmetic Operators ---");

let a = 10;
let b = 3;

console.log("a =", a, "| b =", b);
console.log("a + b  =", a + b);   // 13   Addition
console.log("a - b  =", a - b);   // 7    Subtraction
console.log("a * b  =", a * b);   // 30   Multiplication
console.log("a / b  =", a / b);   // 3.33 Division
console.log("a % b  =", a % b);   // 1    Modulus (remainder)
console.log("a ** b =", a ** b);  // 1000 Exponentiation (10³)

// Useful modulus trick: check if a number is even
console.log("Is 10 even?", 10 % 2 === 0); // true
console.log("Is 7 even?", 7 % 2 === 0);   // false

console.log("");


// ============================================================
// SECTION 6: Assignment Operators (Shorthand)
// ============================================================
console.log("--- SECTION 6: Assignment Operators ---");

let score = 100;
console.log("Starting score:", score);

score += 10;  // score = score + 10
console.log("After += 10:", score);  // 110

score -= 5;   // score = score - 5
console.log("After -= 5:", score);   // 105

score *= 2;   // score = score * 2
console.log("After *= 2:", score);   // 210

score /= 3;   // score = score / 3
console.log("After /= 3:", score);   // 70

score++;      // score = score + 1
console.log("After ++:", score);     // 71

score--;      // score = score - 1
console.log("After --:", score);     // 70

console.log("");


// ============================================================
// SECTION 7: Comparison Operators (== vs ===)
// ============================================================
console.log("--- SECTION 7: Comparison Operators ---");

// Strict Equality (===) — checks VALUE and TYPE
console.log('5 === 5   →', 5 === 5);     // true  (same value, same type)
console.log('5 === "5" →', 5 === "5");   // false (same value, DIFFERENT type)

// Loose Equality (==) — checks VALUE only (avoids!)
console.log('5 == "5"  →', 5 == "5");    // true  (⚠️ dangerous!)
console.log('0 == false →', 0 == false); // true  (⚠️ bizarre!)

// Strict Inequality (!==)
console.log('5 !== "5" →', 5 !== "5");   // true

// Greater/Less than
console.log("10 > 5  →", 10 > 5);     // true
console.log("10 < 5  →", 10 < 5);     // false
console.log("10 >= 10 →", 10 >= 10);  // true
console.log("9 <= 10  →", 9 <= 10);   // true

console.log("");


// ============================================================
// SECTION 8: Logical Operators (&&, ||, !)
// ============================================================
console.log("--- SECTION 8: Logical Operators ---");

let userAge = 25;
let hasLicense = true;
let isVIP = false;

// AND (&&) — BOTH sides must be true
console.log("Can drive? (age >= 18 && hasLicense):", userAge >= 18 && hasLicense);    // true

// OR (||) — AT LEAST ONE side must be true
console.log("Gets priority? (isVIP || age >= 65):", isVIP || userAge >= 65);         // false

// NOT (!) — flips true to false, false to true
console.log("Is NOT a VIP (!isVIP):", !isVIP);                                        // true

// Combining them — real world example
let isCitizen = true;
console.log(`\nVoting eligibility check:`);
console.log(`  Age: ${userAge}, Citizen: ${isCitizen}`);
console.log(`  Can vote? (age >= 18 && isCitizen):`, userAge >= 18 && isCitizen);    // true

console.log("");


// ============================================================
// SECTION 9: Putting It All Together
// ============================================================
console.log("--- SECTION 9: Putting It All Together ---");

// A mini program that uses variables, types, and operators
const productName = "Wireless Headphones";
const unitPrice = 15000;     // in Naira
let quantity = 3;
const taxRate = 0.075;       // 7.5% VAT

const subtotal = unitPrice * quantity;
const tax = subtotal * taxRate;
const total = subtotal + tax;

console.log(`Product: ${productName}`);
console.log(`Unit Price: ₦${unitPrice.toLocaleString()}`);
console.log(`Quantity: ${quantity}`);
console.log(`Subtotal: ₦${subtotal.toLocaleString()}`);
console.log(`VAT (7.5%): ₦${tax.toLocaleString()}`);
console.log(`Total: ₦${total.toLocaleString()}`);

console.log("\n==========================================");
console.log("✅ All examples complete! Great work! 🎉");
