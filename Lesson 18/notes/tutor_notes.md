# Tutor Notes — Lesson 18: Algorithms (Sorting & Searching)

## 🎯 Lesson Objectives
1. Explain what an algorithm is and why different algorithms exist for the same problem.
2. Implement Linear Search and Binary Search with correct complexity analysis.
3. Implement Bubble Sort and Selection Sort by tracing step-by-step.
4. Compare all four algorithms using Big O notation.

---

## ⏱️ Session Outline (90 Minutes)

| Time | Phase | Focus |
|:---|:---|:---|
| 00–08 | **Hook** | Sort a hand of cards — let the student do it physically first |
| 08–20 | **Searching** | Linear Search, then Binary Search (from Lesson 16 — now with full code) |
| 20–45 | **Sorting** | Bubble Sort (trace + code), then Selection Sort (trace + code) |
| 45–60 | **Visualizer** | Open `algorithms-visualizer.html` — race and step-by-step tabs |
| 60–75 | **Exercises** | Work through exercises together |
| 75–85 | **Big O Comparison** | Fill in the comparison table together |
| 85–90 | **Wrap-up** | When to use which, assignment brief |

---

## 🪝 Opening Hook: Sort This (Minutes 0–8)

> **Don't open code yet. Make it physical.**

Hand the student a shuffled set of numbered playing cards (or write 7 numbers on a whiteboard): `[5, 3, 8, 1, 9, 2, 7]`

Ask: *"Sort these into ascending order. Do it out loud — tell me every decision you make."*

Watch closely:
- Most students will scan the whole set first, find the smallest, put it at the front — that's **Selection Sort**.
- Some will do swaps with neighbours as they scan — that's **Bubble Sort**.
- A few do something else entirely — that's an opportunity to discuss intuition vs formal algorithm.

Then say: *"The exact procedure you just described — the step-by-step decisions — that IS an algorithm. Today we're formalising three patterns people naturally use, and one search pattern that only works on sorted data."*

---

## 🧠 Teaching Analogies

### Linear Search — The Shoebox Receipt
*"Finding a specific receipt in an unsorted shoebox. You pick up each one, look at it, put it down if it's wrong, pick up the next. In the worst case you check every single receipt."*

### Binary Search — The Dictionary
*"Looking up 'zebra' in a dictionary. You don't start at 'A'. You open to the middle, see you're in the M's, flip to the second half, keep halving. Works only because the dictionary is sorted."*

### Bubble Sort — The Bubble Bath
*"Heavy things sink and light things rise. Imagine bubbles floating upward through water — each pass moves the largest unsorted element all the way to its correct position at the end, like a bubble rising to the surface."*

### Selection Sort — The Trophy Cabinet
*"You're arranging trophies by height. On each pass you scan ALL remaining trophies, find the shortest, and place it at the front. Then scan again for the next shortest. You never move anything unless you've found the true minimum."*

---

## ⚠️ Common Pitfalls

### Pitfall 1: Bubble Sort — forgetting the inner loop boundary
```javascript
// ❌ Compares out-of-bounds OR repeats already-sorted positions
for (let j = 0; j < arr.length; j++) { ... }

// ✅ Inner loop shrinks each pass — last i elements are already sorted
for (let j = 0; j < arr.length - 1 - i; j++) { ... }
```

### Pitfall 2: Swap without a temp variable
```javascript
// ❌ Overwrites arr[j] before saving it
arr[j] = arr[j + 1];
arr[j + 1] = arr[j]; // Now both are arr[j+1]!

// ✅ Save first
const temp = arr[j];
arr[j]     = arr[j + 1];
arr[j + 1] = temp;
```

### Pitfall 3: Binary Search on an unsorted array
Students sometimes use Binary Search without sorting first. It will return wrong results silently — no error, just wrong answers. Emphasise: **sort before you search**.

### Pitfall 4: Selection Sort — updating `minIndex` not the value
```javascript
// ❌ Student stores the minimum VALUE, not its index — can't swap correctly
let minVal = arr[i];
// ✅ Store the INDEX so you can swap positions
let minIndex = i;
```

### Pitfall 5: Thinking `Array.sort()` is O(n log n) always
`arr.sort()` without a comparator sorts *lexicographically* — `[10, 2, 3].sort()` gives `[10, 2, 3]`. Always pass a comparator: `arr.sort((a, b) => a - b)`.

---

## 📝 Checking for Understanding

1. *"What is the worst-case Big O of Linear Search?"*
   → O(n). If the target is at the end or not present, you check every element.

2. *"I have a sorted array of 1,000,000 numbers. How many steps does Binary Search need at most?"*
   → ⌈log₂(1,000,000)⌉ ≈ 20 steps.

3. *"After 3 complete passes of Bubble Sort on a 7-element array, how many elements are guaranteed to be in their final position?"*
   → 3. Each pass "bubbles up" one more element to its correct position at the end.

4. *"Bubble Sort and Selection Sort are both O(n²). Are they equally fast in practice?"*
   → Not exactly. Selection Sort does fewer *swaps* (at most n-1). Bubble Sort can do up to n²/2 swaps. But comparisons are the same O(n²). Selection Sort is typically faster in practice when writes are expensive.

5. *"Can you use Binary Search on `['banana', 'apple', 'cherry']`?"*
   → No — the array is not sorted. Binary Search on unsorted data returns wrong results.

6. *"What does the optimised Bubble Sort do differently from the basic version?"*
   → It tracks whether ANY swap happened during a pass. If no swaps happened, the array is already sorted — exit early. This gives Bubble Sort O(n) best case.

---

## 📊 Big O Comparison Table (fill this in with the student)

| Algorithm | Best Case | Average Case | Worst Case | Space |
|:---|:---|:---|:---|:---|
| Linear Search | O(1) | O(n) | O(n) | O(1) |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) |
| Bubble Sort | **O(n)** optimised | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| JavaScript `.sort()` | — | O(n log n) | O(n log n) | O(log n) |

---

## 🗺️ When to Use Which

```
Searching:
├── Is the array sorted?
│   ├── YES → Binary Search O(log n)
│   └── NO  → Linear Search O(n)
│             (or sort first if you'll search many times)

Sorting:
├── Small array (< 20 items)?  → Bubble or Selection (simple to write, fine for small n)
├── Nearly sorted array?       → Bubble Sort with optimisation (O(n) best case)
├── Large dataset?             → Use JavaScript's built-in .sort() — it's O(n log n)
└── Learning / interview?      → Know Bubble + Selection; research Merge Sort / Quick Sort
```

---

## 🔴 Live Debug Scenarios

**Scenario 1:** Bubble Sort produces a partially sorted array.
- Cause: Outer loop runs only `arr.length - 1` iterations but inner loop doesn't adjust `j < arr.length - 1 - i`.
- Fix: The inner loop boundary must shrink with each outer pass.

**Scenario 2:** Binary Search always returns -1 even when the value is present.
- Cause: `mid` calculation overflows in some languages, but in JS more likely the student used `left + right / 2` (missing parentheses) → `left + (right / 2)` — wrong!
- Fix: `Math.floor((left + right) / 2)`.

**Scenario 3:** Selection Sort swaps on every iteration, not just at the end of each inner loop.
- Cause: Student placed the swap inside the inner loop instead of after it.
- Fix: The swap should happen ONCE per outer iteration, after the inner loop finds `minIndex`.

**Scenario 4:** `arr.sort()` gives wrong results on numbers.
- Cause: Default sort is lexicographic — `[100, 20, 3]` becomes `[100, 20, 3]` (sorted as strings: "1..." < "2..." < "3...").
- Fix: `arr.sort((a, b) => a - b)`.
