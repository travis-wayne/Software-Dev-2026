# Quiz — Lesson 17: Basic Data Structures

> **Instructions:** Complete all questions before checking the answer key.
> Estimated time: 20 minutes.

---

## Section A: Multiple Choice *(10 questions — 1 point each)*

**Q1.** Which term describes a Stack's ordering behaviour?
- A) First-In, First-Out (FIFO)
- B) Last-In, First-Out (LIFO)
- C) Random Access
- D) Priority-based

---

**Q2.** You call `push(1)`, `push(2)`, `push(3)`, then `pop()` on a Stack. What does `pop()` return?
- A) 1
- B) 2
- C) 3
- D) undefined

---

**Q3.** Which term describes a Queue's ordering behaviour?
- A) Last-In, First-Out (LIFO)
- B) First-In, First-Out (FIFO)
- C) Sorted order
- D) Random Access

---

**Q4.** You call `enqueue('A')`, `enqueue('B')`, `enqueue('C')`, then `dequeue()` on a Queue. What does `dequeue()` return?
- A) C
- B) B
- C) A
- D) undefined

---

**Q5.** What is the Big O of `push()` on a Stack (implemented with an array)?
- A) O(n)
- B) O(n²)
- C) O(log n)
- D) O(1)

---

**Q6.** In a Linked List, the `head` refers to:
- A) The last node in the list
- B) The middle node in the list
- C) The first node in the list
- D) The node with the highest value

---

**Q7.** What does the `next` property of the **last** node in a Linked List point to?
- A) The first node (circular)
- B) Itself
- C) `undefined`
- D) `null`

---

**Q8.** What is the Big O of **accessing** the 5th element in a Linked List (by index)?
- A) O(1)
- B) O(log n)
- C) O(n) — you must traverse from the head
- D) O(n²)

---

**Q9.** You need a data structure where you process tasks in the order they were received (e.g., a print queue). Which is the best choice?
- A) Stack
- B) Queue
- C) Linked List with random access
- D) An unsorted array

---

**Q10.** Which of the following is a real-world use case for a **Stack**?
- A) People waiting in a line at a bank
- B) Processing customer support tickets in order of submission
- C) Your browser's back/forward navigation history
- D) Items on a conveyor belt

---

## Section B: Trace Exercises *(3 questions — 3 points each)*

**Q11.** Trace the Stack. Write the state of the stack after each operation, with `TOP` on the right.

```
Operations: push(10), push(20), push(30), pop(), push(40), peek()
```

| After Operation | Stack State (TOP →) | Return Value |
|:---|:---|:---|
| `push(10)` | `[ 10 ]` | — |
| `push(20)` | | — |
| `push(30)` | | — |
| `pop()` | | |
| `push(40)` | | — |
| `peek()` | | |

---

**Q12.** Trace the Queue. Write the state after each operation, with `FRONT` on the left.

```
Operations: enqueue('Alice'), enqueue('Bob'), enqueue('Charlie'), dequeue(), enqueue('Dave'), dequeue()
```

| After Operation | Queue State (FRONT → BACK) | Return Value |
|:---|:---|:---|
| `enqueue('Alice')` | `[ Alice ]` | — |
| `enqueue('Bob')` | | — |
| `enqueue('Charlie')` | | — |
| `dequeue()` | | |
| `enqueue('Dave')` | | — |
| `dequeue()` | | |

---

**Q13.** Trace the Linked List. For each `add()` call, draw the pointer chain using `→`. Include `null` at the end.

```
Operations: add(5), add(10), add(15), add(20)
```

| After Operation | List Diagram |
|:---|:---|
| `add(5)` | `head → [5] → null` |
| `add(10)` | |
| `add(15)` | |
| `add(20)` | |

After all adds: What is `head.next.next.value`? ___

---

## Section C: Short Answer *(2 questions — 3 points each)*

**Q14.** Explain why `arr.shift()` (removing the first element of an array) is O(n), but Stack `pop()` (removing the last element) is O(1). What does this tell us about which end of an array is more efficient to modify?

Answer: _______________________________________________

---

**Q15.** A student asks: *"Why use a Linked List if arrays are simpler?"* Give one specific scenario where a Linked List is the better choice, and explain **why** using Big O.

Answer: _______________________________________________

---

## Answer Key

| Q | Answer |
|:--|:-------|
| 1 | **B** — Stack = LIFO (Last-In, First-Out) |
| 2 | **C** — 3 was pushed last, so it's popped first |
| 3 | **B** — Queue = FIFO (First-In, First-Out) |
| 4 | **C** — 'A' was enqueued first, so it's dequeued first |
| 5 | **D** — `push()` adds to the end of the array: O(1) |
| 6 | **C** — `head` is always the first node |
| 7 | **D** — The last node's `next` is `null` (the null terminator) |
| 8 | **C** — Unlike arrays, Linked Lists have no index; you traverse from `head` |
| 9 | **B** — FIFO behaviour = Queue |
| 10 | **C** — Browser back button = LIFO (most recent page is first to go back to) |

**Q11 — Stack Trace:**
| After | Stack | Return |
|:---|:---|:---|
| `push(10)` | `[10]` | — |
| `push(20)` | `[10, 20]` | — |
| `push(30)` | `[10, 20, 30]` | — |
| `pop()` | `[10, 20]` | `30` |
| `push(40)` | `[10, 20, 40]` | — |
| `peek()` | `[10, 20, 40]` *(unchanged)* | `40` |

**Q12 — Queue Trace:**
| After | Queue | Return |
|:---|:---|:---|
| `enqueue('Alice')` | `[Alice]` | — |
| `enqueue('Bob')` | `[Alice, Bob]` | — |
| `enqueue('Charlie')` | `[Alice, Bob, Charlie]` | — |
| `dequeue()` | `[Bob, Charlie]` | `'Alice'` |
| `enqueue('Dave')` | `[Bob, Charlie, Dave]` | — |
| `dequeue()` | `[Charlie, Dave]` | `'Bob'` |

**Q13 — Linked List Trace:**
- After `add(5)`: `head → [5] → null`
- After `add(10)`: `head → [5] → [10] → null`
- After `add(15)`: `head → [5] → [10] → [15] → null`
- After `add(20)`: `head → [5] → [10] → [15] → [20] → null`
- `head.next.next.value` = **15**

**Q14:** `arr.shift()` is O(n) because removing the first element requires every remaining element to shift one index to the left (re-indexing the whole array). `pop()` removes from the end — no elements need to move. **Conclusion:** The **end** of an array is always O(1) to modify; the **front** is O(n).

**Q15:** Good answer example — *"When you need to frequently insert items at the beginning of a list. With an array, `unshift()` is O(n) because all elements must be re-indexed. With a Linked List, inserting at the head is O(1) — just update the `head` pointer. If you're building a real-time feed where new items appear at the top, a Linked List avoids the performance penalty."*
