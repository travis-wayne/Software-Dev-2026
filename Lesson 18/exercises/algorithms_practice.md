# Practice Exercises — Lesson 18: Algorithms

## How to Use These Exercises
1. **Predict first** — trace the algorithm manually and write your answer before running anything.
2. **Run it** in your browser console or VS Code to verify.
3. **Check the answer keys** provided in the `<details>` blocks.

---

## Part 1: Searching

### Exercise 1: Linear vs Binary Trace
You are searching for the number **70** in this array:
`[10, 20, 30, 40, 50, 60, 70, 80, 90]`

**A) Linear Search:**
List every number Linear Search checks before finding 70.
```
// Checks: ___, ___, ___, ___, ___, ___, ___
```

**B) Binary Search:**
Trace the `left`, `right`, and `mid` indexes for each step.
```
// Step 1:
// left: 0  (val: 10)
// right: 8 (val: 90)
// mid: ___ (val: ___) → Action: _____________

// Step 2:
// left: ___ (val: ___)
// right: ___ (val: ___)
// mid: ___ (val: ___) → Action: _____________

// Step 3:
// left: ___ (val: ___)
// right: ___ (val: ___)
// mid: ___ (val: ___) → Found it!
```

<details>
<summary>✅ Answers — Exercise 1</summary>

**A) Linear Search:**
Checks: 10, 20, 30, 40, 50, 60, 70 (7 checks total)

**B) Binary Search:**
Step 1:
`mid`: 4 (val: 50) → 70 is greater, so move `left` to `mid + 1`

Step 2:
`left`: 5 (val: 60)
`right`: 8 (val: 90)
`mid`: 6 (val: 70) → Found it! (Only 2 checks total!)
</details>

---

### Exercise 2: Unsorted Binary Search Trap
Trace what happens if you run Binary Search for **40** on this UNSORTED array:
`[60, 20, 90, 40, 10, 80, 30]`

```
// Step 1:
// left: 0 (val 60)
// right: 6 (val 30)
// mid: ___ (val: ___)

// Because the target (40) is _______ than the mid value, 
// the algorithm will look in the _______ half.

// Result: Will it find the 40? (Yes/No) _____
```

<details>
<summary>✅ Answer — Exercise 2</summary>

`mid` is 3 (val: 40). Wait, it actually finds it on the first try!

*However*, let's trace finding **10**:
- `mid` is 3 (val: 40). Target 10 is less than 40, so look left.
- New range: indices 0 to 2 (`[60, 20, 90]`).
- `mid` is 1 (val: 20). Target 10 is less than 20, so look left.
- New range: index 0 (`[60]`).
- `mid` is 0 (val: 60). Target 10 is less than 60, look left.
- `right` crosses `left`. Loop ends. Returns `-1`.
- **Result:** It completely missed the 10 because it assumed values to the right of 40 were larger.
</details>

---

## Part 2: Sorting

### Exercise 3: Bubble Sort Trace
Trace **Pass 1** of Bubble Sort on this array: `[4, 2, 7, 1, 3]`
For each step, show the array after the comparison/swap.

```
// Start:   [4, 2, 7, 1, 3]
// Compare 4 & 2: Swap? Yes  → [2, 4, 7, 1, 3]
// Compare 4 & 7: Swap? ___  → ________________
// Compare 7 & 1: Swap? ___  → ________________
// Compare 7 & 3: Swap? ___  → ________________

// Array after Pass 1: ________________
// Which element is guaranteed to be in the correct final position? ___
```

<details>
<summary>✅ Answers — Exercise 3</summary>

Compare 4 & 7: No swap → `[2, 4, 7, 1, 3]`
Compare 7 & 1: Swap! → `[2, 4, 1, 7, 3]`
Compare 7 & 3: Swap! → `[2, 4, 1, 3, 7]`

After Pass 1: `[2, 4, 1, 3, 7]`.
The element **7** is guaranteed to be in the correct position.
</details>

---

### Exercise 4: Selection Sort Trace
Trace **Pass 1** and **Pass 2** of Selection Sort on the same array: `[4, 2, 7, 1, 3]`

```
// Start: [4, 2, 7, 1, 3]

// PASS 1:
// Scan from index 0 to 4. What is the minimum value found? ___
// Swap index 0 (val 4) with the minimum.
// Array after Pass 1: ________________

// PASS 2:
// We now ignore index 0. Scan from index 1 to 4.
// What is the minimum value found? ___
// Swap index 1 (val ___) with the minimum.
// Array after Pass 2: ________________
```

<details>
<summary>✅ Answers — Exercise 4</summary>

**Pass 1:** Minimum is 1. Swap index 0 (val 4) with index 3 (val 1).
Array: `[1, 2, 7, 4, 3]`

**Pass 2:** Minimum from index 1 onwards is 2. Since 2 is already at index 1, swap it with itself (no change).
Array: `[1, 2, 7, 4, 3]`
</details>

---

## Part 3: Coding Practice

### Exercise 5: Implement Optimised Bubble Sort
Write a Bubble Sort function that stops early if the array becomes sorted before all passes are complete. Add a `console.log` to count how many passes were made.

```javascript
function bubbleSort(arr) {
    let passCount = 0;
    
    // TODO: Write outer loop
        passCount++;
        // TODO: Declare a boolean flag 'swapped' = false
        
        // TODO: Write inner loop
            // TODO: If arr[j] > arr[j+1], swap them, and set swapped = true
            
        // TODO: If swapped is still false, break out of the outer loop!

    console.log(`Finished in ${passCount} passes`);
    return arr;
}

// Test on a nearly sorted array:
console.log(bubbleSort([1, 2, 3, 5, 4]));
// Standard Bubble Sort takes 5 passes. How many does yours take?
```

---

### Exercise 6: Sorting Objects using `.sort()`
You have an array of student objects.

```javascript
const students = [
    { name: "Alice", score: 85 },
    { name: "Bob", score: 92 },
    { name: "Charlie", score: 88 }
];
```

Write the code to sort this array in **descending** order by `score` (highest first) using JavaScript's built-in `.sort()` method.

```javascript
// TODO: Write the sorting logic
students.sort((a, b) => {
    // ???
});
console.log(students);
// Expected: [Bob, Charlie, Alice]
```
