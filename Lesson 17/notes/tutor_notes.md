# Tutor Notes — Lesson 17: Data Structures (Stacks, Queues, Linked Lists)

## 🎯 Lesson Objectives
1. Explain what a data structure is and why the choice matters.
2. Identify LIFO (Stack) and FIFO (Queue) behaviour.
3. Implement Stack, Queue, and Singly Linked List in JavaScript.
4. State the Big O complexity of each structure's core operations.

---

## ⏱️ Session Outline (90 Minutes)

| Time | Phase | Focus |
|:---|:---|:---|
| 00–08 | **Hook** | "What if your browser Undo button used an array with `.unshift()`?" |
| 08–25 | **Stack** | LIFO concept, analogy, implement together, test |
| 25–40 | **Queue** | FIFO concept, analogy, implement together, test |
| 40–55 | **Linked List — Concept** | Node diagram, pointer analogy, when to use it |
| 55–75 | **Linked List — Code** | Implement Node class + LinkedList class step by step |
| 75–85 | **Visualizer** | Open `data-structures.html`, test all three live |
| 85–90 | **Wrap-up** | Big O table, assignment brief |

---

## 🪝 Opening Hook: Three Problems, Three Tools (Minutes 0–8)

> **Describe three real situations. Let the student feel why arrays alone are insufficient.**

Don't open code yet. Ask these questions one by one and wait for responses:

**Question 1:** *"You're in VS Code and you press Ctrl+Z five times. Each press undoes the most recent action. What property does the order of undos have?"*  
Lead to: The last thing you did is the first thing undone. That's a specific order — and arrays don't enforce that natively.

**Question 2:** *"You're working at a bank. 50 customers all submit online requests at the same time. Which customer should be handled first?"*  
Lead to: The first to submit should be the first served. Fair ordering. Again, a specific behaviour.

**Question 3:** *"You're building a music app. The user taps 'Play Next' — the new song should jump to the top of the queue. If your playlist has 100,000 songs, is there a cost to inserting at the front of an array?"*  

Now run this to show the cost:

```javascript
const playlist = [];
console.time('Array unshift × 100,000');
for (let i = 0; i < 100000; i++) {
    playlist.unshift(i); // O(n) — pushes every item right!
}
console.timeEnd('Array unshift × 100,000');

console.time('Array push × 100,000');
for (let i = 0; i < 100000; i++) {
    playlist.push(i); // O(1) — no shifting
}
console.timeEnd('Array push × 100,000');
```

Close with: *"Today we're learning three data structures that solve exactly these three problems: Stack (undo history), Queue (bank requests), Linked List (playlist front-insertions). Each one enforces a specific rule about how items enter and leave."*

---

## 🧠 Teaching Analogies

### Stack — The Plate Stack
*"Think of a stack of dinner plates in a cafeteria. You always put a clean plate on top, and you always take from the top. You cannot take a plate from the middle without lifting all the ones above it first. Last in, first out — that's LIFO."*

Real-world JS connections: browser back/forward history, undo/redo, the call stack, balanced parentheses checking.

### Queue — The Checkout Line
*"A queue is a line at a supermarket. The first person who joins the line is the first to be served. New people join at the back. Nobody skips the queue. First in, first out — that's FIFO."*

Real-world JS connections: print queues, event loops, task schedulers, breadth-first search.

### Linked List — The Treasure Hunt
*"A linked list is like a treasure hunt where each clue tells you where the next clue is hidden. You start at 'clue 1' and it says 'go to clue 2'. Clue 2 says 'go to clue 3'. You can only find the 5th clue by following the chain from the start — you can't jump directly."*

Real-world JS connections: music playlists (next track pointer), browser history (when you need O(1) inserts at the head).

---

## ⚠️ Common Pitfalls

### Pitfall 1: Using an array `.unshift()` for a Queue's dequeue
**The Fix:** `arr.shift()` (remove from front) is O(n) because all elements must be re-indexed. For a true performant Queue, use a pointer variable instead. Show them both approaches.

### Pitfall 2: Forgetting to update `this.tail` when the list has one node
**The Fix:** When removing the last node from a Linked List, both `this.head` *and* `this.tail` must be set to `null`. Forgetting `this.tail` causes a "ghost tail" bug.

### Pitfall 3: Infinite loops when traversing a Linked List
**The Fix:** Students forget `current = current.next` in the while loop. The loop never terminates. The browser freezes. Stress: every traversal must advance the pointer.

### Pitfall 4: Accessing `.value` on `null` (when the list is empty)
**The Fix:** Always check `if (!this.head) return null` (or throw) at the start of operations that assume the list is non-empty.

---

## 📝 Checking for Understanding

Ask these throughout the session. Wait for the student to answer before explaining:

1. *"I push A, B, C onto a stack. I pop twice. What is on top?"*  
   → **A**. Pop removes C first, then B. A is left on top.

2. *"I enqueue A, B, C into a queue. I dequeue twice. What is at the front?"*  
   → **C**. Dequeue removes A first, then B. C is now at the front.

3. *"What is the Big O of `stack.pop()`?"*  
   → **O(1)**. It removes from the end of the array — no shifting, no looping.

4. *"What is the Big O of searching for a value in a Linked List?"*  
   → **O(n)**. You must start at the head and walk every node until you find it.

5. *"Why would you choose a Linked List over an array for frequent front-insertions?"*  
   → `insertAtHead` in a Linked List is **O(1)** — just re-point the head pointer. Array `.unshift()` is **O(n)** because every existing element must shift one position right.

6. *"I have a Linked List: 5 → 10 → 20 → 30. I call `remove(10)`. What does the list look like, and which pointer changed?"*  
   → **5 → 20 → 30**. The node at index 0 (`5`) had its `next` pointer re-pointed from `10` to `20`. Node `10` is now unreferenced.

7. *"Could you implement a Stack using a Linked List instead of an array? How?"*  
   → Yes. `push` = `insertAtHead` (O(1)). `pop` = remove the head node (O(1)). The head is always the top of the stack.

---

## 🗺️ Teaching the "When to Choose" Decision

After implementing all three structures, spend 5 minutes on this. It's what separates a student who can *implement* from one who can *think like an engineer*.

Draw this on a whiteboard:

```
Do you need to process items in a specific order?
├── LIFO (last in, first out)?  → STACK
├── FIFO (first in, first out)?  → QUEUE
└── Neither — just organising data?
    ├── Need random access by index? → ARRAY
    └── Need fast front insertions?  → LINKED LIST
```

Give a real example: *"JavaScript's own event loop is a Queue. Every click, every timer, every API response goes into the event queue and is processed in arrival order. If it were a Stack, the last event would always jump the queue."*

---

## 📊 Big O Reference Table (Share at session close)

| Structure | Operation | Time Complexity |
|:---|:---|:---|
| Stack | push / pop / peek | **O(1)** |
| Queue | enqueue / dequeue / peek | **O(1)** |
| Linked List | insertAtHead | **O(1)** |
| Linked List | insertAtTail | **O(1)** with tail pointer |
| Linked List | search / delete | **O(n)** — must traverse |
| Array | push / pop | **O(1)** |
| Array | unshift / shift | **O(n)** — re-indexes all |

---

## 🔴 Live Debug Scenarios

**Scenario 1:** Student's linked list `add()` works but `print()` shows only one node.
- Cause: `this.head` is being overwritten on every call instead of checking `if (!this.head)` first.
- Fix: `if (!this.head) { this.head = node; this.tail = node; } else { this.tail.next = node; this.tail = node; }`

**Scenario 2:** Student's Queue `dequeue()` returns `undefined`.
- Cause: Using `this.items.unshift()` for enqueue instead of `this.items.push()` — the structure is reversed.
- Fix: Draw the FIFO diagram. Enqueue = push (add to back). Dequeue = shift (remove from front).

**Scenario 3:** Student's Stack `pop()` always returns the same value.
- Cause: Forgetting `return this.items.pop()` — calling `.pop()` without the `return` keyword.
- Fix: Show that `.pop()` both removes and returns the value, but the method must pass it back with `return`.

**Scenario 4:** Student gets `ReferenceError: Stack is not defined` in exercises.
- Cause: The class was not pasted into the console/file before calling `new Stack()`.
- Fix: Remind the student that the class implementations must be defined first. Point to the Setup section at the top of the exercises file.

**Scenario 5:** Linked list `remove()` removes the node but `print()` still shows the old tail value.
- Cause: When removing the last node, `this.tail` was not updated to point to the previous node.
- Fix: In the traversal, before skipping `current.next`, check `if (current.next === this.tail) this.tail = current;`
