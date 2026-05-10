# Student Notes — Lesson 18: Algorithms (Sorting & Searching)

## 1. What is an Algorithm?

An **algorithm** is simply a step-by-step procedure for solving a problem. Every time you write a function to calculate a total, find a user, or format a string, you are writing an algorithm.

Today, we will focus on formalising two of the most common tasks in computer science:
1. **Searching** — finding a specific item in a collection.
2. **Sorting** — arranging a collection in a specific order (e.g., ascending numbers).

We will use **Big O Notation** (from Lesson 16) to evaluate how efficient these algorithms are as the data size grows.

---

## 2. Searching Algorithms

### Linear Search

Linear Search is the most intuitive way to search: start at the beginning of the array and check every single element until you find what you're looking for.

**How it works:**
1. Start at index `0`.
2. Is the current element the target?
    - Yes: Return the index.
    - No: Move to the next index.
3. If you reach the end of the array and haven't found it, return `-1`.

**JavaScript Implementation:**
```javascript
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Found it!
        }
    }
    return -1; // Not found
}

// Usage:
const numbers = [10, 50, 30, 70, 80, 20, 90, 40];
console.log(linearSearch(numbers, 20)); // Returns 5
```

**Complexity Analysis:**
- **Best Case:** `O(1)` — The target is the very first element.
- **Worst Case:** `O(n)` — The target is at the very end, or not in the array at all. We have to check every element.
- **When to use it:** When the array is **unsorted**. It's the only way to be sure you've checked everything.

---

### Binary Search

Binary Search is incredibly fast, but it comes with a strict rule: **the array MUST be sorted first.**

Think of looking up a word in a physical dictionary. You don't read every word from page 1. You open the middle, see if your word is earlier or later, and ignore the half where the word cannot be. You repeat this until you find the word.

**How it works:**
1. Keep track of the `left` edge and `right` edge of the searchable area.
2. Calculate the `middle` index.
3. Compare the middle element to the target:
    - If it matches, return the middle index.
    - If the target is **smaller**, it must be in the left half. Move the `right` edge to `middle - 1`.
    - If the target is **larger**, it must be in the right half. Move the `left` edge to `middle + 1`.
4. Repeat until the `left` edge crosses the `right` edge (meaning the target is not in the array).

**JavaScript Implementation:**
```javascript
function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
        // Find the middle index (Math.floor handles decimal results)
        let mid = Math.floor((left + right) / 2);

        if (sortedArr[mid] === target) {
            return mid; // Found it!
        } else if (target < sortedArr[mid]) {
            // Target is smaller, ignore the right half
            right = mid - 1;
        } else {
            // Target is larger, ignore the left half
            left = mid + 1;
        }
    }
    return -1; // Not found
}

// Usage:
const sortedNumbers = [10, 20, 30, 40, 50, 70, 80, 90];
console.log(binarySearch(sortedNumbers, 20)); // Returns 1
```

**Complexity Analysis:**
- **Best Case:** `O(1)` — The target is exactly in the middle on the first check.
- **Worst Case:** `O(log n)` — We halve the search space every step. For 1,000,000 items, it takes at most 20 checks.
- **When to use it:** When searching frequently in a **sorted** array.

---

## 3. Sorting Algorithms

Sorting is the process of arranging data into a meaningful order. We will look at two beginner-friendly sorting algorithms.

*Note: In these algorithms, we need to swap two elements in an array. Here is the standard way to do that using a temporary variable:*
```javascript
// Swapping arr[a] and arr[b]
let temp = arr[a];
arr[a] = arr[b];
arr[b] = temp;
```

---

### Bubble Sort

Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. The largest elements "bubble" up to the end of the list.

**How it works:**
1. Loop through the array from start to finish.
2. Compare the current element to the next element.
3. If the current is greater than the next, swap them.
4. After one full pass, the largest element is guaranteed to be at the very end.
5. Repeat the process for the remaining unsorted portion until the whole array is sorted.

**Trace of Pass 1 on `[5, 3, 8, 2]`:**
- Compare 5 and 3: 5 > 3, so **swap** → `[3, 5, 8, 2]`
- Compare 5 and 8: 5 < 8, no swap → `[3, 5, 8, 2]`
- Compare 8 and 2: 8 > 2, so **swap** → `[3, 5, 2, 8]`
*(Notice how 8, the largest number, bubbled to the end!)*

**JavaScript Implementation:**
```javascript
function bubbleSort(arr) {
    // Outer loop dictates how many passes we make
    for (let i = 0; i < arr.length; i++) {
        
        // Inner loop does the adjacent comparisons.
        // We do (arr.length - 1 - i) because the last 'i' elements are already sorted!
        for (let j = 0; j < arr.length - 1 - i; j++) {
            
            if (arr[j] > arr[j + 1]) {
                // Swap them
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}
```

**Optimised Bubble Sort:**
If we go through an entire pass and make zero swaps, the array is already sorted! We can add a flag to stop early.
```javascript
function optimisedBubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let noSwaps = true; // Assume it's sorted
        
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                noSwaps = false; // We made a swap!
            }
        }
        
        if (noSwaps) break; // If no swaps happened, stop looping
    }
    return arr;
}
```

**Complexity Analysis:**
- **Best Case:** `O(n)` — (Only with the optimised version) if the array is already sorted, it makes one pass and stops.
- **Worst Case:** `O(n²)` — A reverse-sorted array requires comparing every pair for every pass.
- **When to use it:** Mostly for educational purposes, or if you know the data is already almost sorted.

---

### Selection Sort

Selection Sort works by dividing the array into a sorted and an unsorted part. It repeatedly finds the minimum element from the unsorted part and puts it at the beginning.

**How it works:**
1. Assume the first unsorted element is the minimum.
2. Scan the rest of the unsorted array to find if there is a smaller element.
3. If a smaller element is found, update the minimum index.
4. At the end of the scan, swap the true minimum element with the first unsorted element.
5. Move the boundary of the sorted/unsorted parts one step right and repeat.

**Trace of Pass 1 on `[5, 3, 8, 2]`:**
- We are at index 0 (value 5). Assume `minIdx = 0`.
- Scan 3: 3 < 5. Update `minIdx = 1`.
- Scan 8: 8 > 3. `minIdx` stays 1.
- Scan 2: 2 < 3. Update `minIdx = 3`.
- End of pass. Swap index 0 (value 5) with `minIdx` (value 2).
- Array is now `[2, 3, 8, 5]`. (2 is sorted).

**JavaScript Implementation:**
```javascript
function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        // Assume the current position holds the minimum value
        let minIdx = i;

        // Scan the rest of the array to find the true minimum
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j; // Update the index of the minimum
            }
        }

        // If the minimum isn't the value we started with, swap them
        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
    return arr;
}
```

**Complexity Analysis:**
- **Best/Worst/Average Case:** `O(n²)` — It always scans the entire unsorted portion to find the minimum, even if the array is already sorted.
- **When to use it:** Simple to write, and performs fewer *swaps* than Bubble Sort. Still mostly for educational purposes on small datasets.

---

## 4. Big O Comparison Table

| Algorithm | Best Case | Average Case | Worst Case | Space | Notes |
|:---|:---|:---|:---|:---|:---|
| Linear Search | O(1) | O(n) | O(n) | O(1) | Checks every item. Works on unsorted data. |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) | Divides search space in half. **Must be sorted.** |
| Bubble Sort | O(n)* | O(n²) | O(n²) | O(1) | *O(n) best case only if optimised with a swap flag. |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | Always scans remaining items. Makes fewer swaps than Bubble Sort. |
| JavaScript `.sort()`| O(n log n) | O(n log n) | O(n log n) | O(log n) | Fast. Always use a comparator function for numbers! |

---

## 5. JavaScript's Built-in Sort

In real-world JavaScript, you rarely write your own sorting algorithm. You use `Array.prototype.sort()`.

⚠️ **Crucial Trap:** The default `.sort()` converts everything to strings and sorts alphabetically!

```javascript
const numbers = [10, 2, 30, 4];

numbers.sort(); 
console.log(numbers); // [10, 2, 30, 4] — Wait, what?! "10" comes before "2" alphabetically!
```

To sort numbers correctly, you must provide a **comparator function**:
```javascript
// Ascending (smallest to largest)
numbers.sort((a, b) => a - b);
console.log(numbers); // [2, 4, 10, 30]

// Descending (largest to smallest)
numbers.sort((a, b) => b - a);
console.log(numbers); // [30, 10, 4, 2]
```

---

## ✅ Summary Checklist

- [ ] I can explain the steps of Linear Search and Binary Search.
- [ ] I know why Binary Search requires a sorted array.
- [ ] I can trace the steps of Bubble Sort on a small array.
- [ ] I can trace the steps of Selection Sort on a small array.
- [ ] I understand the difference: Bubble Sort swaps adjacent items continuously; Selection Sort finds the minimum and swaps once per pass.
- [ ] I can write the comparator function `(a, b) => a - b` to correctly sort numbers using JavaScript's `.sort()`.
