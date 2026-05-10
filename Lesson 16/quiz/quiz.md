# Quiz — Lesson 16: Big O Notation & Complexity

> **Instructions:** Answer all questions before checking the answer key at the bottom.
> Estimated time: 15–20 minutes.

---

## Section A: Multiple Choice *(10 questions — 1 point each)*

**Q1.** What does Big O Notation measure?
- A) The exact number of seconds a function takes to run
- B) The rate at which an algorithm's resource usage grows as input size grows
- C) The number of lines of code in a function
- D) The amount of RAM a computer has

---

**Q2.** You access an element in an array by its index: `arr[42]`. What is the Big O?
- A) O(n)
- B) O(log n)
- C) O(1)
- D) O(n²)

---

**Q3.** Which of the following built-in JavaScript methods is **NOT** O(1)?
- A) `arr[0]`
- B) `obj.name`
- C) `arr.includes(x)`
- D) `arr.length`

---

**Q4.** What is the Big O of this function?
```javascript
function mystery(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
    for (let j = 0; j < arr.length; j++) {
        console.log(arr[j]);
    }
}
```
- A) O(n²)
- B) O(2n), which simplifies to O(n)
- C) O(log n)
- D) O(n²) because there are two loops

---

**Q5.** What is the Big O of this function?
```javascript
function pairs(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            console.log(arr[i], arr[j]);
        }
    }
}
```
- A) O(n)
- B) O(2n)
- C) O(n log n)
- D) O(n²)

---

**Q6.** An algorithm has complexity `O(n² + n)`. After applying simplification rules, what is the final Big O?
- A) O(n² + n)
- B) O(n)
- C) O(n²)
- D) O(2n²)

---

**Q7.** Binary Search runs in O(log n) time. On a sorted array of **1,024 items**, what is the maximum number of comparisons it needs?
- A) 512
- B) 1,024
- C) 10
- D) 100

---

**Q8.** Which complexity grows the fastest as input size increases?
- A) O(n)
- B) O(n log n)
- C) O(log n)
- D) O(n²)

---

**Q9.** This function creates a new array the same size as its input. What is its **Space Complexity**?
```javascript
function doubleAll(arr) {
    return arr.map(x => x * 2);
}
```
- A) O(1) — it only calls one method
- B) O(n) — the result array grows with the input
- C) O(n²)
- D) O(log n)

---

**Q10.** You replace a nested loop (O(n²)) with a `Set` lookup (O(1)) inside a single loop. What is the new complexity?
- A) O(n²) — you still have a loop
- B) O(n log n)
- C) O(n) — a single loop with O(1) work inside
- D) O(1)

---

## Section B: Code Reading *(5 questions — 2 points each)*

**Q11.** Identify the complexity and explain **why**:
```javascript
function countVowels(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let count = 0;
    for (let char of str) {
        if (vowels.has(char)) count++;
    }
    return count;
}
```
- Time Complexity: `O(___)`  
- Space Complexity: `O(___)`  
- Explain: _______________________________________________

---

**Q12.** What is the complexity of this function, and what rule did you apply?
```javascript
function process(arr) {
    let sum = 0;
    for (let x of arr) sum += x;       // Loop A
    for (let x of arr) sum *= x;       // Loop B
    for (let i of arr) {
        for (let j of arr) sum += i*j; // Loop C (nested)
    }
    return sum;
}
```
Answer: `O(___)` because _______________________________________________

---

**Q13.** Is this Big O analysis correct? If not, identify the mistake:
> "This function has two loops, so it's O(2n), which simplifies to O(n²)."
```javascript
function example(arr) {
    for (let x of arr) console.log(x);
    for (let x of arr) console.log(x);
}
```
Correct or wrong? ___  
Explanation: _______________________________________________

---

**Q14.** A student says: *"`arr.find()` is O(1) because it stops as soon as it finds the match."*  
Is this correct? Explain your answer:  
_______________________________________________

---

**Q15.** Order these complexities from **fastest** (best) to **slowest** (worst) for large `n`:
`O(n²)` · `O(1)` · `O(n log n)` · `O(log n)` · `O(n)`

Order: ___ → ___ → ___ → ___ → ___

---

## Answer Key

> *Only look at this after completing all questions.*

| Q | Answer |
|:--|:-------|
| 1 | **B** — Big O measures rate of growth, not exact seconds |
| 2 | **C** — Array index access is always O(1) |
| 3 | **C** — `includes()` loops through every element internally |
| 4 | **B** — Two separate (not nested) loops = O(2n) → simplified to **O(n)** |
| 5 | **D** — A loop inside a loop = O(n²) |
| 6 | **C** — Drop non-dominant terms: n² dominates n, so O(n²) |
| 7 | **C** — log₂(1024) = 10 |
| 8 | **D** — O(n²) grows fastest of the four options listed |
| 9 | **B** — `map()` creates a new array of the same size: O(n) space |
| 10 | **C** — One loop × O(1) lookup = O(n) overall |

**Q11:** Time `O(n)` — the loop runs once per character. Space `O(1)` — the Set is fixed size (always 5 vowels, never grows with input).

**Q12:** `O(n²)`. Loops A and B are O(n) each. Loop C (nested) is O(n²). Dominant term is n², so we drop the smaller O(n) terms. Rule applied: **Drop Non-Dominant Terms**.

**Q13:** **Wrong.** Two separate (sequential) loops give O(2n), which simplifies to **O(n)**, not O(n²). O(n²) only occurs when loops are **nested** inside each other.

**Q14:** **Incorrect.** In the best case (found at index 0), it IS O(1). But Big O measures the **worst case**. If the item is at the end or not present, it checks every element → **O(n)**.

**Q15:** `O(1)` → `O(log n)` → `O(n)` → `O(n log n)` → `O(n²)`
