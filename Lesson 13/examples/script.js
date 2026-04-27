// ==========================================
// LESSON 13: Arrays, Objects, & ES6
// ==========================================

console.log("--- 1. Arrays ---");

// Array declaration
const fruits = ["Apple", "Banana", "Cherry"];
console.log("Original Array:", fruits);

// Accessing items by index
console.log("First item:", fruits[0]); // Apple
console.log("Last item:", fruits[fruits.length - 1]); // Cherry

// Modifying Arrays (Mutation)
fruits.push("Date");       // Adds to end
console.log("After push:", fruits);

let removed = fruits.pop(); // Removes from end
console.log("Popped item:", removed);

fruits.unshift("Avocado"); // Adds to start
console.log("After unshift:", fruits);

// TASK: Use .shift() to remove the first item in the array and log both the removed item and the new array.


console.log("\n--- 2. Objects ---");

// Object declaration
const user = {
    firstName: "Sarah",
    lastName: "Connor",
    age: 35,
    role: "Admin"
};

// Accessing Object Properties
console.log("Dot notation:", user.firstName);
console.log("Bracket notation:", user["role"]);

// Modifying Objects
user.age = 36;          // Update existing
user.status = "Active"; // Add new
console.log("Updated user:", user);

// TASK: Create a 'movie' object with title, director, and year. Log the title using dot notation.


console.log("\n--- 3. Iteration (Map & Filter) ---");

const prices = [10, 20, 30, 40];

// .map() - Creates a new array by transforming every item
const withTax = prices.map(function(price) {
    return price * 1.2; 
});
console.log("Original Prices:", prices);
console.log("Prices + 20% Tax:", withTax);

// .filter() - Creates a new array with items that pass a test
const scores = [45, 80, 95, 60, 72];
const passedScores = scores.filter(function(score) {
    return score >= 70;
});
console.log("Scores over 70:", passedScores);

// TASK: Create an array of numbers. Use .filter() to create a new array called 'evenNumbers' that only contains the even numbers from your array. (Hint: use the modulo operator %)


console.log("\n--- 4. ES6+ Features ---");

// A. Arrow Functions
// Old way: function(a, b) { return a + b; }
const add = (a, b) => a + b; // Implicit return
console.log("Arrow function add(5, 3):", add(5, 3));

// B. Template Literals
const product = "Laptop";
const cost = 999;
// Old way: console.log("The " + product + " costs $" + cost + ".");
console.log(`The ${product} costs $${cost}.`);

// C. Object Destructuring
const car = { make: "Toyota", model: "Corolla", year: 2022 };
// Old way: const make = car.make; const model = car.model;
const { make, model } = car; 
console.log(`Car details: ${make} ${model}`);

// TASK: Completely rewrite the .filter() example from Section 3 using an Arrow Function and log the result.

console.log("\n--- End of Script ---");
