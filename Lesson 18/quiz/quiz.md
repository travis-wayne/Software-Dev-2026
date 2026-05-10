# Quiz — Lesson 18: Algorithms (Sorting & Searching)

> **Instructions:** Complete all questions before checking the answer key.
> Estimated time: 20 minutes.

---

## Section A: Multiple Choice *(10 questions — 1 point each)*

**Q1.** What is the worst-case Big O of Linear Search on an array of `n` items?
- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n²)

---

**Q2.** What is the **strict requirement** for Binary Search to work correctly?
- A) The array must contain only numbers
- B) The array must be sorted in ascending order
- C) The array must have no duplicates
- D) The array must have fewer than 1,000 elements

---

**Q3.** You run Binary Search on a sorted array of 1,000,000 items. Approximately how many comparisons does it need in the worst case?
- A) 1,000,000
- B) 500,000
- C) 1,000
- D) 20

---

**Q4.** In Bubble Sort, what is guaranteed after **one complete pass** through the array?
- A) The entire array is sorted
- B) The smallest element is at the front
- C) The largest element is in its final position at the end
- D) All adjacent elements are in order

---

**Q5.** What is the worst-case Big O of Bubble Sort?
- A) O(n)
- B) O(n log n)
- C) O(n²)
- D) O(log n)

---

**Q6.** In Selection Sort, what happens at the end of each outer loop iteration?
- A) The largest unsorted element is swapped to the back
- B) Adjacent pairs are compared and swapped
- C) The minimum unsorted element is placed at the start of the unsorted portion
- D) The array is split in half

---

**Q7.** What is the best-case Big O of the **optimised** Bubble Sort (with a `swapped` flag)?
- A) O(n²)
- B) O(n log n)
- C) O(log n)
- D) O(n) — if the array is already sorted, only one pass is needed

---

**Q8.** You have an array: `[100, 20, 3]`. You run `arr.sort()` without a comparator. What is the result?
- A) `[3, 20, 100]`
- B) `[100, 20, 3]`
- C) `[100, 20, 3]` — sorted lexicographically: "100" < "20" < "3"
- D) An error is thrown

---

**Q9.** Which algorithm makes the **fewest swaps** for the same input?
- A) Bubble Sort — it swaps adjacent pairs throughout
- B) Selection Sort — it swaps at most once per outer loop pass
- C) They always make the same number of swaps
- D) Linear Search

---

**Q10.** Your friend suggests using Binary Search on an unsorted array to save time. What is the problem?
- A) Binary Search only works on strings
- B) Binary Search eliminates half the array each step — on unsorted data it may eliminate the half containing the target, giving incorrect results
- C) Binary Search is slower than Linear Search
- D) There is no problem; Binary Search works on any array

---

## Section B: Step Traces *(2 questions — 5 points each)*

**Q11.** Trace **Bubble Sort** on `[6, 3, 8, 2]`.
Complete the table showing the array state after each comparison in Pass 1.

*Note: Bubble Sort compares adjacent pairs `(arr[j], arr[j+1])` and swaps if `arr[j] > arr[j+1]`.*

| Step | Comparing | Swap? | Array After |
|:---|:---|:---|:---|
| Start | — | — | `[6, 3, 8, 2]` |
| 1 | `arr[0]=6` vs `arr[1]=3` | | |
| 2 | `arr[1]=? ` vs `arr[2]=8` | | |
| 3 | `arr[2]=8` vs `arr[3]=2` | | |
| End of Pass 1 | — | — | |

After Pass 1, which element is guaranteed to be in its correct final position? ___

---

**Q12.** Trace **Binary Search** for target `35` on `[10, 20, 25, 30, 35, 40, 50]`.

| Step | `left` | `right` | `mid` | `arr[mid]` | Action |
|:---|:---|:---|:---|:---|:---|
| 1 | 0 | 6 | | | |
| 2 | | | | | |
| 3 (found!) | | | | 35 | Return mid |

Fill in the table.

---

## Section C: Short Answer *(2 questions — 2 points each)*

**Q13.** Explain in your own words why `arr.sort((a, b) => a - b)` correctly sorts numbers, but `arr.sort()` does not. What does the comparator `(a, b) => a - b` tell JavaScript?

Answer: _______________________________________________

---

**Q14.** You are building a contact book with 50,000 names stored in alphabetical order. A user can search for any name. Which algorithm would you use, and why? Mention the Big O.

Answer: _______________________________________________

---

## Answer Key

| Q | Answer |
|:--|:-------|
| 1 | **C** — O(n): in the worst case, the target is at the end or not present |
| 2 | **B** — The array must be sorted; Binary Search relies on eliminating halves |
| 3 | **D** — log₂(1,000,000) ≈ 20 |
| 4 | **C** — The largest element "bubbles" to its final position at the end |
| 5 | **C** — O(n²) for a reverse-sorted array |
| 6 | **C** — Selection Sort finds the minimum and places it at the front of the unsorted section |
| 7 | **D** — O(n) if the array is already sorted; the flag detects zero swaps and exits |
| 8 | **C** — Without a comparator, `.sort()` converts to strings. "100" < "20" < "3" lexicographically |
| 9 | **B** — Selection Sort swaps at most once per outer loop (n-1 total swaps maximum) |
| 10 | **B** — Binary Search assumes sorted order; it may eliminate the exact half containing the target |

**Q11 — Bubble Sort Pass 1 on `[6, 3, 8, 2]`:**
| Step | Comparing | Swap? | Array After |
|:---|:---|:---|:---|
| 1 | 6 vs 3 | **Yes** | `[3, 6, 8, 2]` |
| 2 | 6 vs 8 | No | `[3, 6, 8, 2]` |
| 3 | 8 vs 2 | **Yes** | `[3, 6, 2, 8]` |

Guaranteed in final position: **8** (the largest element).

**Q12 — Binary Search for 35 in `[10, 20, 25, 30, 35, 40, 50]`:**
| Step | `left` | `right` | `mid` | `arr[mid]` | Action |
|:---|:---|:---|:---|:---|:---|
| 1 | 0 | 6 | 3 | 30 | 35 > 30 → move left to mid+1 (4) |
| 2 | 4 | 6 | 5 | 40 | 35 < 40 → move right to mid-1 (4) |
| 3 | 4 | 4 | 4 | 35 | **Found! Return 4** |

**Q13:** Without a comparator, `.sort()` converts numbers to strings and sorts alphabetically — so `"100"` comes before `"20"` because `"1"` < `"2"` in Unicode. The comparator `(a, b) => a - b` tells JavaScript: *"return a negative number if `a` should come first, zero if equal, positive if `b` should come first."* So when `a=3, b=20`: `3 - 20 = -17` (negative) → 3 comes first. This gives correct numeric ordering.

**Q14:** **Binary Search, O(log n).** The data is already sorted alphabetically. Binary Search will find any name in at most log₂(50,000) ≈ 16 comparisons. Linear Search would take up to 50,000 comparisons in the worst case. Binary Search is the clear choice here.
