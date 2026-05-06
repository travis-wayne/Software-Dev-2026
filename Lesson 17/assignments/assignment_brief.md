# Assignment Brief — Lesson 17: Data Structures

## Setup
Copy the full `Stack`, `Queue`, `Node`, and `LinkedList` class implementations from your student notes into a `script.js` file. All tasks below require those classes to already exist.

---

## Task 1: Reverse a String with a Stack

Write a function that uses your `Stack` class to reverse a string. **Do not use `.split('').reverse().join('')`** — the point is to use a Stack.

```javascript
function reverseString(str) {
    // TODO:
    // 1. Create a new Stack
    // 2. Push every character of str onto the stack
    // 3. While the stack is not empty, pop and append to a result string
    // 4. Return the result
}

// Tests:
console.log(reverseString('hello'));     // → 'olleh'
console.log(reverseString('racecar'));   // → 'racecar'
console.log(reverseString('Data'));      // → 'ataD'

// Analysis (required):
// Time Complexity:  O(___) — Reason: _________________________
// Space Complexity: O(___) — Reason: _________________________
```

---

## Task 2: Balanced Parentheses Checker

Write a function that uses a Stack to check whether brackets are correctly nested.

```javascript
// '([{}])' → true   — every opener has a matching closer
// '([)]'   → false  — wrong nesting order
// '{'      → false  — unclosed bracket
// ''       → true   — empty string is balanced

function isBalanced(str) {
    const stack   = new Stack();
    const pairs   = { ')': '(', ']': '[', '}': '{' };
    const openers = new Set(['(', '[', '{']);

    for (let char of str) {
        if (openers.has(char)) {
            // TODO: push onto stack
        } else if (pairs[char]) {
            // TODO: if stack empty OR top doesn't match pairs[char] → return false
        }
    }

    // TODO: return true only if stack is empty
}

// Tests:
console.log(isBalanced('()'));       // → true
console.log(isBalanced('([{}])'));   // → true
console.log(isBalanced('((()))'));   // → true
console.log(isBalanced('([)]'));     // → false
console.log(isBalanced('{'));        // → false
console.log(isBalanced(''));         // → true

// Analysis (required):
// Time Complexity:  O(___) — Reason: _________________________
// Space Complexity: O(___) — Reason: _________________________
// Why is a Stack the natural choice for this problem?
// Answer: ___________________________________________________
```

---

## Task 3: Extend the Linked List

Your `LinkedList` class is missing two methods. Implement them **from scratch**, without looking at the student notes. The only reference you may use is the class structure itself.

**3A: `toArray()`** — Returns a standard JavaScript array containing all node values in order.

```javascript
toArray() {
    // TODO: Traverse the list from head to tail.
    // Push each node's value into a result array.
    // Return the result array.
}

// Test:
const list = new LinkedList();
list.add(10); list.add(20); list.add(30);
list.insertAtHead(5);
console.log(list.toArray()); // → [5, 10, 20, 30]

// Analysis:
// Time Complexity:  O(___) — Reason: _________________________
// Space Complexity: O(___) — Reason: _________________________
```

**3B: `contains(value)`** — Returns `true` if the list contains the value, `false` if not. Do NOT use `.search()` — write the traversal yourself.

```javascript
contains(value) {
    // TODO: Traverse the list.
    // If any node's value matches, return true.
    // If you reach the end without finding it, return false.
}

// Tests:
const list = new LinkedList();
list.add('Apple'); list.add('Banana'); list.add('Cherry');
console.log(list.contains('Banana')); // → true
console.log(list.contains('Mango'));  // → false

// Analysis:
// Time Complexity:  O(___) — Reason: _________________________
// What is the best-case complexity (value is the head)? O(___)
// What is the worst-case complexity (value is the tail or absent)? O(___)
```

---

## Task 4: Research — Real-World Applications

For each data structure, complete the paragraph by filling in the blanks. Be specific — give the actual system name, not just a category.

```
STACK
The _________________ feature in _________________ (name of app/system) 
uses a Stack because _________________.
When the user does X, _________________ is pushed.
When they undo, _________________ is popped.

---

QUEUE
The _________________ system in _________________ (name of app/system) 
uses a Queue because _________________.
Items join at the _______ and are processed from the _______.
Without FIFO ordering, the problem would be: _________________.

---

LINKED LIST
The _________________ feature in _________________ (name of app/system) 
uses a Linked List because _________________.
The key advantage over an array in this case is: _________________.
The trade-off is: _________________.
```

---

## Submission Checklist

- [ ] `reverseString()` implemented using the Stack class (no `.reverse()`)
- [ ] Time and Space complexity answered for Task 1
- [ ] `isBalanced()` passes all 6 test cases
- [ ] Time and Space complexity answered for Task 2
- [ ] Written explanation of why Stack suits `isBalanced`
- [ ] `toArray()` implemented with Time and Space analysis
- [ ] `contains()` implemented with best-case and worst-case analysis
- [ ] Task 4 research paragraphs completed with specific real-world examples
- [ ] All code in a `script.js` file, pushed to GitHub with a `README.md`
