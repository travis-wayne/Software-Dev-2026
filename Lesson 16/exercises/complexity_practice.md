# Practice Exercises — Lesson 16: Big O Notation

## How to Use This File

Work through each exercise **in order**. For each snippet:
1. **Predict first.** Write your answer *before* running the code.
2. **Then run it** in your browser console or VS Code to verify your thinking.
3. **Explain your reasoning.** The explanation matters as much as the answer.

> 💡 **Hints are available** at the bottom of this file, but try each exercise yourself first!

---

## Part 1: Identify the Complexity

For each snippet, determine the **Time Complexity** and **Space Complexity** and fill in the blanks.

---

### Exercise 1: The Short-Circuit

```javascript
function getStatusMessage(statusCode) {
    if (statusCode === 200) return "OK";
    if (statusCode === 404) return "Not Found";
    if (statusCode === 500) return "Server Error";
    return "Unknown";
}
```

```
// MY PREDICTION (before checking):
// Time Complexity:  O( __ )
// Space Complexity: O( __ )
//
// My Reasoning:
// _______________________________________________
```

**Question to think about:** Does the size of `statusCode` affect how many `if` statements run?

---

### Exercise 2: The Simple Counter

```javascript
function sumArray(numbers) {
    let total = 0;                       // Line A
    for (let i = 0; i < numbers.length; i++) {  // Line B
        total += numbers[i];             // Line C
    }
    return total;                        // Line D
}
```

```
// MY PREDICTION:
// Time Complexity:  O( __ )
// Space Complexity: O( __ )
//
// Which line(s) make this NOT O(1)? 
// _______________________________________________
```

**Hint to consider:** How many times does Line C execute if `numbers` has 5 items? 500 items?

---

### Exercise 3: The Mapper

```javascript
function getNames(users) {
    return users.map(user => user.name);
}
```

```
// MY PREDICTION:
// Time Complexity:  O( __ )
// Space Complexity: O( __ )  ← Think carefully about this one!
//
// My Reasoning:
// _______________________________________________
```

**Question to think about:** `.map()` returns a *new* array. If `users` has 1,000 items, how big is the returned array?

---

### Exercise 4: The Pair Finder

```javascript
function findMatchingPairs(array1, array2) {
    let pairs = 0;
    for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
            if (array1[i] === array2[j]) {
                pairs++;
            }
        }
    }
    return pairs;
}
```

```
// MY PREDICTION:
// Time Complexity:  O( __ )
// Space Complexity: O( __ )
//
// If array1 has 100 items and array2 has 100 items,
// how many times does the `if` on line 5 run?
// Answer: _______
```

---

### Exercise 5: The Double Pass (Tricky!)

```javascript
function logMinAndMax(numbers) {
    let min = numbers[0];
    let max = numbers[0];

    for (let i = 0; i < numbers.length; i++) { // Loop 1
        if (numbers[i] < min) min = numbers[i];
    }

    for (let i = 0; i < numbers.length; i++) { // Loop 2
        if (numbers[i] > max) max = numbers[i];
    }

    console.log(`Min: ${min}, Max: ${max}`);
}
```

```
// MY PREDICTION:
// Time Complexity:  O( __ )
// Space Complexity: O( __ )
//
// Is this O(2n) or O(n)? What rule applies here?
// _______________________________________________
```

---

### Exercise 6: The Hidden Trap

```javascript
function hasUserWithEmail(users, email) {
    return users.includes(email);
}
```

```
// MY PREDICTION:
// Time Complexity:  O( __ )
// Space Complexity: O( __ )
//
// Common mistake: many students say O(1) because it's one line.
// Why is that wrong?
// _______________________________________________
```

---

## Part 2: Identify the Bottleneck and Optimize

### Challenge: The Slow Duplicate Finder

The function below finds if an array contains any duplicate values.

```javascript
// THE SLOW VERSION - O(n²)
function hasDuplicatesSlow(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j]) {
                return true;
            }
        }
    }
    return false;
}
```

**Step 1: Confirm the complexity**
```
// Why is this O(n^2)? Explain in one sentence:
// _______________________________________________
```

**Step 2: Prove the problem**
```javascript
// Copy this into your browser console and run it.
// The array has 50,000 items. Watch what happens.

const bigArray = Array.from({ length: 50000 }, (_, i) => i);
bigArray.push(1); // Add a duplicate at the end (worst case)

console.time('Slow');
hasDuplicatesSlow(bigArray);
console.timeEnd('Slow');
```

```
// How long did it take? _______________
```

**Step 3: Rewrite it to be O(n)**

Use a JavaScript `Set` to store numbers you have already seen. Since `Set.has()` is `O(1)`, your loop only needs to run once.

```javascript
// YOUR OPTIMIZED VERSION - O(n)
function hasDuplicatesFast(array) {
    const seen = new Set();

    for (let i = 0; i < array.length; i++) {
        // TODO: If seen already contains array[i], return true
        // TODO: Otherwise, add array[i] to seen

    }

    return false;
}
```

**Step 4: Measure the improvement**
```javascript
// Now test the fast version with the SAME big array:
console.time('Fast');
hasDuplicatesFast(bigArray);
console.timeEnd('Fast');

// What was the difference in milliseconds? _______________
```

---

## 💡 Hints (Check only after trying yourself!)

<details>
<summary>Exercise 1 Hint</summary>
The function always runs a fixed number of `if` checks, regardless of the value passed in. Does the input `statusCode` make the number of checks grow?
</details>

<details>
<summary>Exercise 2 Hint</summary>
Count how many "operations" happen as `numbers.length` grows. The `for` loop runs `n` times, so the time complexity scales with `n`. Extra variables like `total` are just one variable — they don't grow.
</details>

<details>
<summary>Exercise 3 Hint</summary>
Time complexity: `.map()` loops once. Space complexity: `.map()` creates a **new array** the same size as `users`. So you're creating `n` new items in memory.
</details>

<details>
<summary>Exercise 4 Hint</summary>
For each of the `n` items in `array1`, the inner loop runs `n` times through `array2`. Total = n × n = n². If both arrays have 100 items, the `if` runs 100 × 100 = 10,000 times.
</details>

<details>
<summary>Exercise 5 Hint</summary>
The two loops run sequentially (one after the other), not inside each other. So the total is O(n) + O(n) = O(2n). We then apply Rule 1: Drop Constants → **O(n)**.
</details>

<details>
<summary>Exercise 6 Hint</summary>
`.includes()` is a built-in method, but that doesn't mean it's O(1). Under the hood, JavaScript has to loop through every item in the array to check if the value is there. It's O(n). One line of code ≠ one operation.
</details>

<details>
<summary>Optimization Hint</summary>

```javascript
function hasDuplicatesFast(array) {
    const seen = new Set();
    for (let i = 0; i < array.length; i++) {
        if (seen.has(array[i])) return true; // O(1) lookup
        seen.add(array[i]);
    }
    return false;
}
```
</details>
