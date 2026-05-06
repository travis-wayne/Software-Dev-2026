# Assignment Brief — Lesson 16: Big O Notation & Complexity

## Overview
You have learned how to read Big O notation and why it matters. Now you will **write** the algorithms. This assignment has three tasks — two mandatory and one bonus. For every function you write, you must also **explain its complexity** in a comment.

---

## Task 1: Linear Search — O(n)

Write a function that searches an **unsorted** array of numbers for a target value. Return its index if found, or `-1` if not found.

**Rules:** Do NOT use `.indexOf()`, `.findIndex()`, or `.includes()`. Write the `for` loop yourself.

```javascript
function linearSearch(array, target) {
    // TODO: Loop through every item.
    // If array[i] === target, return i.
    // If the loop finishes without finding it, return -1.
}

// ── Test Cases ──
console.log(linearSearch([10, 20, 30, 40, 50], 30));  // Expected: 2
console.log(linearSearch([10, 20, 30, 40, 50], 99));  // Expected: -1
console.log(linearSearch([7, 3, 1, 9, 5], 9));        // Expected: 3

// ── Your Analysis ──
// Time Complexity:  O(___)
// Reason: 
// Space Complexity: O(___)
// Reason:
```

---

## Task 2: Binary Search — O(log n)

Write a function that searches a **sorted** array of numbers for a target value using the split-in-half approach.

**Rules:** Do NOT use any built-in search methods. Use a `while` loop with `left`, `right`, and `mid` pointers.

### How Binary Search Works (Step-by-Step)

Before coding, understand the algorithm:

```
Sorted array: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
Target: 70

Step 1: left=0, right=9, mid=4 → array[4]=50. 70 > 50, so move left = mid+1 = 5
Step 2: left=5, right=9, mid=7 → array[7]=80. 70 < 80, so move right = mid-1 = 6
Step 3: left=5, right=6, mid=5 → array[5]=60. 70 > 60, so move left = mid+1 = 6
Step 4: left=6, right=6, mid=6 → array[6]=70. ✅ Found! Return 6.

Result: Found in 4 steps, not 7 (linear). Advantage grows with array size.
```

```javascript
function binarySearch(sortedArray, target) {
    let left  = 0;
    let right = sortedArray.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (sortedArray[mid] === target) {
            return mid;          // ✅ Found it! Return the index.
        } else if (sortedArray[mid] < target) {
            left = mid + 1;      // Target is in the RIGHT half
        } else {
            // TODO: What do you do if target < sortedArray[mid]?
            // Hint: The target must be in the LEFT half.
        }
    }

    return -1; // Not found
}

// ── Test Cases ──
const sorted = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
console.log(binarySearch(sorted, 70));  // Expected: 6
console.log(binarySearch(sorted, 10));  // Expected: 0
console.log(binarySearch(sorted, 55));  // Expected: -1

// ── Your Analysis ──
// Time Complexity:  O(___)
// Reason:
// Space Complexity: O(___)
// Reason:
```

### Question 2A — Explain the Difference
In your own words, complete this explanation as if writing to a non-technical manager:

```
// "If we have a database of 1,000,000 records...
//
// Linear Search would need up to _______ checks in the worst case.
//
// Binary Search would need up to _______ checks in the worst case.
//
// This means Binary Search is roughly _______ times more efficient.
//
// The trade-off is that Binary Search only works if the data is _______."
```

---

## Task 3 (Bonus): The Optimizer — O(n²) → O(n)

The function below finds whether an array contains any duplicate values. It currently uses nested loops, making it **O(n²)**. Your goal is to rewrite it to run in **O(n)** time.

```javascript
// ❌ SLOW — O(n²). DO NOT MODIFY THIS. Just study it.
function hasDuplicatesSlow(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return true;
        }
    }
    return false;
}

// ✅ YOUR FAST VERSION — O(n)
// Strategy: Use a Set to remember items you have already seen.
// A Set lookup (.has()) is O(1), so you only need ONE loop.
function hasDuplicatesFast(arr) {
    const seen = new Set();

    for (let i = 0; i < arr.length; i++) {
        // TODO: If `seen` already contains arr[i], return true (duplicate found)
        // TODO: Otherwise, add arr[i] to `seen` and continue
    }

    return false;
}

// ── Test Cases ──
console.log(hasDuplicatesFast([1, 2, 3, 4, 5]));    // Expected: false
console.log(hasDuplicatesFast([1, 2, 3, 2, 5]));    // Expected: true
console.log(hasDuplicatesFast(['a', 'b', 'c', 'a'])); // Expected: true

// ── Benchmark (paste into browser console) ──
const big = Array.from({ length: 50000 }, (_, i) => i);
big.push(1); // duplicate at the end = worst case

console.time('Slow O(n²)');
hasDuplicatesSlow([...big]);
console.timeEnd('Slow O(n²)');

console.time('Fast O(n)');
hasDuplicatesFast([...big]);
console.timeEnd('Fast O(n)');

// What difference in milliseconds did you observe? _______________

// ── Your Analysis ──
// Why is `hasDuplicatesFast` O(n) and not O(n²)?
// Answer:
```

---

## Submission Checklist

- [ ] `linearSearch` implemented with a manual `for` loop
- [ ] Time & Space complexity answered for Task 1
- [ ] `binarySearch` implemented with `left`, `right`, `mid` pointers
- [ ] Question 2A answered (the manager explanation)
- [ ] Time & Space complexity answered for Task 2
- [ ] **Bonus:** `hasDuplicatesFast` implemented using a `Set`
- [ ] **Bonus:** Benchmark run and time difference noted
- [ ] All code pushed to GitHub with a `README.md` noting what each function does
