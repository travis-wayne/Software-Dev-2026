# Practice Exercises — Lesson 17: Data Structures

## ⚙️ Setup — Do This First!

Before running any exercise, paste the **full class implementations** from your student notes into your browser console or a `script.js` file:

```javascript
// You need ALL FOUR of these before any exercise will work:
// 1. class Stack   { ... }
// 2. class Queue   { ... }
// 3. class Node    { ... }
// 4. class LinkedList { ... }
```

> If you see `ReferenceError: Stack is not defined`, this is why — the class hasn't been defined yet.

---

## How to Use These Exercises
1. **Predict first** — write your answer in the blank before running anything.
2. **Run it** to verify.
3. **Explain your reasoning** — understanding *why* matters more than getting it right.

---

## Part 1: Stack Exercises

### Exercise 1: Trace the Stack
Without running the code, trace what the stack looks like after each line. Write the stack state as `[bottom ... top]`.

```javascript
const s = new Stack();
s.push(1);    // Stack: [          ]
s.push(2);    // Stack: [          ]
s.push(3);    // Stack: [          ]
s.pop();      // Stack: [          ]   Returns: ___
s.push(4);    // Stack: [          ]
console.log(s.peek()); // Returns: ___
console.log(s.size()); // Returns: ___
```

**Run it to verify, then check the answers below:**

<details>
<summary>✅ Answers — Exercise 1</summary>

```
s.push(1) → [1]
s.push(2) → [1, 2]
s.push(3) → [1, 2, 3]
s.pop()   → [1, 2]    Returns: 3
s.push(4) → [1, 2, 4]
peek()    → 4
size()    → 3
```
</details>

---

### Exercise 2: String Reverser
A Stack is perfect for reversing things. Complete the function using your `Stack` class.

**Think about it:** If you push 'h','e','l','l','o' onto a stack and then pop them all off, what order do they come out in?

```javascript
function reverseString(str) {
    const stack = new Stack();

    // TODO: Loop through str and push every character onto the stack

    let reversed = '';
    // TODO: While the stack is not empty, pop and append to reversed

    return reversed;
}

// Predict before running:
// reverseString('hello') → ___________
// reverseString('racecar') → ___________

console.log(reverseString('hello'));   // Expected: 'olleh'
console.log(reverseString('abcde'));   // Expected: 'edcba'
console.log(reverseString('racecar')); // Expected: 'racecar'

// Analysis:
// Time Complexity:  O(___) — Reason: ___________________________
// Space Complexity: O(___) — Reason: ___________________________
```

---

### Exercise 3: Balanced Parentheses ⭐
This is a classic coding interview question. Use a Stack to check if a string of brackets is balanced.

**Rules:**
- `(`, `[`, `{` are *openers* — push them onto the stack.
- `)`, `]`, `}` are *closers* — pop from the stack and check it matches.
- If the stack is empty when you encounter a closer → unbalanced.
- If the stack is not empty when the string ends → unbalanced.

**Trace this manually first:**
```
Input: "([{}])"
char '(' → push. Stack: ['(']
char '[' → push. Stack: ['(', '[']
char '{' → push. Stack: ['(', '[', '{']
char '}' → closer. Pop '{'. pairs['}'] = '{'. Match! ✅
char ']' → closer. Pop '['. pairs[']'] = '['. Match! ✅
char ')' → closer. Pop '('. pairs[')'] = '('. Match! ✅
End. Stack is empty → true ✅
```

```javascript
function isBalanced(str) {
    const stack = new Stack();
    const pairs = { ')': '(', ']': '[', '}': '{' };

    for (let char of str) {
        if ('([{'.includes(char)) {
            // TODO: Push opening brackets onto the stack
        } else if (')]}'.includes(char)) {
            // TODO: If stack is empty, return false (nothing to match against)
            // TODO: Pop from stack; if popped value !== pairs[char], return false
        }
    }

    // TODO: Return true only if the stack is now empty
}

// Predict before running (true or false?):
// isBalanced('()')        → ___
// isBalanced('([{}])')    → ___
// isBalanced('([)]')      → ___
// isBalanced('{')         → ___

console.log(isBalanced('()'));       // → true
console.log(isBalanced('([{}])'));   // → true
console.log(isBalanced('([)]'));     // → false
console.log(isBalanced('{'));        // → false
```

---

## Part 2: Queue Exercises

### Exercise 4: Trace the Queue
Trace the queue state after each operation. Write queue as `[front ... back]`.

```javascript
const q = new Queue();
q.enqueue('A');  // Queue: [          ]
q.enqueue('B');  // Queue: [          ]
q.enqueue('C');  // Queue: [          ]
q.dequeue();     // Queue: [          ]   Returns: ___
q.enqueue('D');  // Queue: [          ]
console.log(q.peek()); // Returns: ___
```

<details>
<summary>✅ Answers — Exercise 4</summary>

```
enqueue('A') → [A]
enqueue('B') → [A, B]
enqueue('C') → [A, B, C]
dequeue()    → [B, C]       Returns: 'A'
enqueue('D') → [B, C, D]
peek()       → 'B'
```
</details>

---

### Exercise 5: Printer Queue Simulator
Complete the function. Print tasks in the order they were sent.

```javascript
function runPrinter(tasks) {
    const queue = new Queue();

    // TODO: Enqueue all tasks from the tasks array

    // TODO: While the queue is not empty, dequeue one task at a time
    //       and log: `Printing: ${task}`
}

// Test:
runPrinter(['Report.pdf', 'Invoice.docx', 'Photo.png']);
// Expected output:
// Printing: Report.pdf
// Printing: Invoice.docx
// Printing: Photo.png
```

**Why is a Queue the right choice here, not a Stack?**
```
// Answer: _______________________________________________
```

---

## Part 3: Linked List Exercises

### Exercise 6: Trace the Pointers
For each operation, draw what the linked list looks like. Fill in the node values.

```javascript
const list = new LinkedList();
list.add(10);
// HEAD → [10|null]
//          ↑ TAIL

list.add(20);
// HEAD → [__|•]──→ [__|null]
//                      ↑ TAIL

list.add(30);
// HEAD → [__|•]──→ [__|•]──→ [__|null]
//                                ↑ TAIL

list.insertAtHead(5);
// HEAD → [__|•]──→ [__|•]──→ [__|•]──→ [__|null]
//                                           ↑ TAIL

list.remove(20);
// HEAD → [__|•]──→ [__|•]──→ [__|null]
//                                ↑ TAIL
```

<details>
<summary>✅ Answers — Exercise 6</summary>

```
After add(10):     HEAD → [10|null] ← TAIL

After add(20):     HEAD → [10|•]──→ [20|null] ← TAIL

After add(30):     HEAD → [10|•]──→ [20|•]──→ [30|null] ← TAIL

After insertAtHead(5):
                   HEAD → [5|•]──→ [10|•]──→ [20|•]──→ [30|null] ← TAIL

After remove(20):
                   HEAD → [5|•]──→ [10|•]──→ [30|null] ← TAIL
```
</details>

---

### Exercise 7: Count the Nodes (Without `this.length`)
Add a `count()` method to your LinkedList. You must traverse — you cannot use `this.length`.

```javascript
count() {
    let total   = 0;
    let current = this.head;

    // TODO: While current is not null:
    //   - increment total
    //   - advance current to current.next

    return total;
}

// Test:
const list = new LinkedList();
list.add(1); list.add(2); list.add(3);
console.log(list.count()); // Expected: 3

// Analysis:
// What is the Big O of count()? O(___)
// Reason: _______________________________________________
// What is the Big O of just reading this.length? O(___)
// Why do we bother storing this.length if we can count()? ___
```

---

## Part 4: Choose the Right Structure

For each scenario, decide which data structure is the best fit and explain why.

```
Scenario 1:
You are building a text editor. Every action a user takes (type a character,
delete a character, paste text) must be reversible with Ctrl+Z.

Best choice: __________ Why: ______________________________

---

Scenario 2:
You are building a customer service chat system. Customers submit support tickets
and agents must handle them in the order they were submitted — no priority jumping.

Best choice: __________ Why: ______________________________

---

Scenario 3:
You are building a music player. Songs are stored in a playlist and the user
frequently adds new songs to the TOP of the queue ("play next"). You never
need to access songs by their position number.

Best choice: __________ Why: ______________________________

---

Scenario 4:
You are storing a list of 1 million user records and need to look up a specific
user by their account number instantly (e.g., users[40312]).

Best choice: __________ Why: ______________________________
```

<details>
<summary>✅ Answers — Part 4</summary>

```
Scenario 1: Stack — Undo history is LIFO. Last action = first to undo.

Scenario 2: Queue — FIFO. First ticket submitted = first ticket handled.

Scenario 3: Linked List — insertAtHead is O(1). Array unshift is O(n).
            Adding to the front of a large playlist would be slow with an array.

Scenario 4: Array — O(1) index access. Linked Lists require O(n) traversal
            to reach a specific position.
```
</details>

---

## 💡 Code Hints

<details>
<summary>Exercise 2 — Reverser Hint</summary>

```javascript
for (let char of str) stack.push(char);
while (!stack.isEmpty()) reversed += stack.pop();
```
</details>

<details>
<summary>Exercise 3 — Balanced Brackets Hint</summary>

```javascript
if (stack.isEmpty() || stack.pop() !== pairs[char]) return false;
// At the end:
return stack.isEmpty();
```
</details>

<details>
<summary>Exercise 7 — Count Hint</summary>

```javascript
while (current !== null) {
    total++;
    current = current.next;
}
```
</details>
