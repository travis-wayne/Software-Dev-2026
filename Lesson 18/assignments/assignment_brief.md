# Assignment Brief — Lesson 18: Algorithms

## Setup
Create a new file called `algorithms.js` in your workspace. You will write all your functions in this file.

---

## Task 1: Research and Implement Insertion Sort

We covered Bubble Sort and Selection Sort in class. Another very common O(n²) sorting algorithm is **Insertion Sort**.

**Your Task:**
1. Research how Insertion Sort works.
2. Implement it in JavaScript as `function insertionSort(arr)`.
3. Add a comment explaining its approach in your own words.
4. Compare it to Bubble Sort: In what specific scenario is Insertion Sort faster?

```javascript
// Explanation: Insertion sort works by...
// It is faster than Bubble Sort when...

function insertionSort(arr) {
    // TODO: Implement insertion sort
}

console.log(insertionSort([5, 2, 9, 1, 5, 6]));
// Expected: [1, 2, 5, 5, 6, 9]
```

---

## Task 2: Binary Search — First Occurrence

Standard Binary Search finds *any* occurrence of a target. However, if the array has duplicate values, standard Binary Search might not return the *first* occurrence.

**Your Task:**
Modify the Binary Search algorithm to find the **first** occurrence of a target value.
*(Hint: When you find the target at `mid`, you can't just return immediately. There might be another instance of that target to the left! You need to keep searching the left half while remembering the index you just found.)*

```javascript
function findFirstOccurrence(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    let result = -1; // Store the best index found so far here

    // TODO: Write the binary search loop
    // When sortedArr[mid] === target, update `result = mid`, but don't return!
    // Instead, force the search to continue to the left by updating `right = mid - 1`

    return result;
}

// Tests:
const duplicates = [10, 20, 20, 20, 30, 40, 50];
console.log(findFirstOccurrence(duplicates, 20)); // Expected: 1 (not 2 or 3)
console.log(findFirstOccurrence(duplicates, 25)); // Expected: -1
```

---

## Task 3: Real-World Scenarios

Algorithms are tools. Knowing when to use which tool is as important as knowing how to build them.

Fill in the blanks below with a specific real-world example, and justify your choice based on Time Complexity (Big O) or the properties of the algorithm.

```text
SCENARIO 1: Searching Algorithm
Real-world application: ____________________________________________________
Algorithm chosen: _________________________
Why this is the right choice: 
Because the data in this system is [sorted/unsorted] and the time complexity of this algorithm is O(___), meaning it can handle a dataset of this size efficiently.

---

SCENARIO 2: Sorting Algorithm
Real-world application: ____________________________________________________
Algorithm chosen: _________________________
Why this is the right choice: 
Because [e.g., the array is usually small / almost sorted / very large], this algorithm is appropriate. Its worst-case time complexity is O(___).
```

---

## Submission Checklist

- [ ] `insertionSort` implemented and works correctly.
- [ ] Comment added explaining Insertion Sort vs Bubble Sort.
- [ ] `findFirstOccurrence` implemented using a modified Binary Search logic.
- [ ] Returns the index of the *first* occurrence, not just any occurrence.
- [ ] Task 3 scenarios filled out with specific examples and correct Big O analysis.
- [ ] All code placed in `algorithms.js` and pushed to GitHub with a `README.md`.
