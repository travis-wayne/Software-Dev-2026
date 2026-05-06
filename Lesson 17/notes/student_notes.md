# Student Notes — Lesson 17: Data Structures (Stacks, Queues, Linked Lists)

## 1. What is a Data Structure?

A **data structure** is a way of organising and storing data so it can be used efficiently. You already know one: the **Array**. An array is great for many things, but it has performance weaknesses in specific situations. Different data structures exist because different problems need different shapes of organisation.

Today you will learn three fundamental ones: **Stack**, **Queue**, and **Linked List**.

> **The key question for every data structure:** *"What operations are O(1) here, and what are O(n)?"* That's what determines when to choose each one.

---

## 2. Stack — Last In, First Out (LIFO)

### Concept
A Stack is like a stack of plates in a cafeteria. You always add to the top and take from the top. You cannot access the plate at the bottom without lifting all the ones above it first.

```
     [C]  ← TOP — most recently added, first to be removed
     [B]
     [A]  ← BOTTOM — first added, last to be removed
```

**LIFO:** Last In, First Out. The last item you added is the first item you get back.

### Core Operations
| Method | What it does | Big O |
|:---|:---|:---|
| `push(val)` | Add to the top | **O(1)** |
| `pop()` | Remove from the top and return it | **O(1)** |
| `peek()` | View the top item without removing it | **O(1)** |
| `isEmpty()` | Returns `true` if the stack has no items | **O(1)** |
| `size()` | Returns the number of items | **O(1)** |

### JavaScript Implementation

```javascript
class Stack {
    constructor() {
        this.items = []; // We use the END of the array as the "top"
    }

    push(value) {
        this.items.push(value); // Array.push adds to the END → our "top"
    }

    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop(); // Array.pop removes from the END → our "top"
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1]; // Last item = top
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// ── Usage — trace this line by line ──
const stack = new Stack();
stack.push('A'); // items: ['A']          top: A
stack.push('B'); // items: ['A','B']      top: B
stack.push('C'); // items: ['A','B','C']  top: C

console.log(stack.peek()); // → 'C'  (top, not removed)
console.log(stack.pop());  // → 'C'  removed. items: ['A','B']
console.log(stack.peek()); // → 'B'  (B is now the top)
console.log(stack.size()); // → 2
```

### Real-World Uses
- **Browser back button** — every page you visit is `push`ed. Back button `pop`s the last page.
- **Undo/Redo** — each action is `push`ed onto a history stack. Ctrl+Z `pop`s the last action.
- **The JavaScript Call Stack** — when a function calls another function, the inner call is pushed on top. When it returns, it is popped. This is a Stack JavaScript runs natively.

---

## 3. Queue — First In, First Out (FIFO)

### Concept
A Queue is like a checkout line at a supermarket. The first person who joins the line is the first to be served. New people always join at the back. Nobody can skip the queue.

```
 enqueue →  [A] [B] [C] [D]  → dequeue
             ↑                    ↑
           BACK               FRONT
        (newest added)     (served first)
```

**FIFO:** First In, First Out. The oldest item is always the first to leave.

### Core Operations
| Method | What it does | Big O |
|:---|:---|:---|
| `enqueue(val)` | Add to the back | **O(1)** |
| `dequeue()` | Remove from the front and return it | O(n)\* |
| `peek()` | View the front item without removing it | **O(1)** |
| `isEmpty()` | Returns `true` if the queue has no items | **O(1)** |

> \* Using `Array.shift()` is O(n) because JavaScript must re-index every remaining element. This is acceptable for learning. In production, a pointer-based Queue avoids this.

### JavaScript Implementation

```javascript
class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(value) {
        this.items.push(value); // Add to the BACK (end of array)
    }

    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift(); // Remove from the FRONT (start of array)
    }

    peek() {
        if (this.isEmpty()) return null;
        return this.items[0]; // First item = front of queue
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }
}

// ── Usage — trace this line by line ──
const queue = new Queue();
queue.enqueue('Alice');   // items: ['Alice']
queue.enqueue('Bob');     // items: ['Alice', 'Bob']
queue.enqueue('Charlie'); // items: ['Alice', 'Bob', 'Charlie']

console.log(queue.peek());    // → 'Alice'   (front, not removed)
console.log(queue.dequeue()); // → 'Alice'   removed. items: ['Bob', 'Charlie']
console.log(queue.peek());    // → 'Bob'     (Bob is now first in line)
console.log(queue.size());    // → 2
```

### Real-World Uses
- **Print queues** — first document sent is first to print. Fair ordering.
- **JavaScript Event Loop** — browser events (clicks, API responses) are queued and processed in arrival order.
- **Task schedulers** — operating systems process jobs in the order they arrive.

---

## 4. Linked List — Nodes Connected by Pointers

### Concept
An array stores items in *contiguous memory* — all elements sit next to each other. A Linked List stores each item anywhere in memory, but each item holds a **pointer** (a reference) to the next item.

```
 HEAD
  ↓
[10 | next]──→ [20 | next]──→ [30 | next]──→ [40 | null]
                                                   ↑
                                                  TAIL
```

Each box is a **Node**. A Node has two parts:
- A **`value`** — the data it stores
- A **`next`** pointer — the address of the next Node, or `null` if it's the last

### Why Use a Linked List?

| Operation | Array | Linked List |
|:---|:---|:---|
| Access by index (`arr[i]`) | **O(1)** — direct address | O(n) — must walk the chain |
| Insert at head | O(n) — shifts all items right | **O(1)** — re-point head |
| Insert at tail | **O(1)** (with tail pointer) | **O(1)** (with tail pointer) |
| Delete from middle | O(n) — re-index all after | O(n) — traverse to find it |

**Use a Linked List when:** you need frequent O(1) insertions at the head (e.g., a browser history stack, a job queue), and you do not need to access items by index.

### Linked List Core Operations
| Method | What it does | Big O |
|:---|:---|:---|
| `add(val)` | Add a new node at the tail | **O(1)** with tail pointer |
| `insertAtHead(val)` | Add a new node at the head | **O(1)** |
| `search(val)` | Find the index of a value | O(n) — traverse from head |
| `remove(val)` | Remove the first node with this value | O(n) — traverse to find it |
| `print()` | Log all values in order | O(n) — traverse whole list |

### Step-by-Step: How `add()` Moves the Pointers

This is the trickiest part. Read this carefully before looking at the code.

**Starting state:** Empty list. `head = null`, `tail = null`.

```
add(10):
  Create Node(10).
  List is empty → head = Node(10), tail = Node(10)

  HEAD
   ↓
  [10 | null]
   ↑
  TAIL
```

```
add(20):
  Create Node(20).
  List is not empty → tail.next = Node(20), then tail = Node(20)

  HEAD
   ↓
  [10 | •]──→ [20 | null]
                    ↑
                   TAIL
```

```
add(30):
  Create Node(30).
  tail.next = Node(30), then tail = Node(30)

  HEAD
   ↓
  [10 | •]──→ [20 | •]──→ [30 | null]
                                ↑
                               TAIL
```

### JavaScript Implementation

```javascript
// Step 1: The Node blueprint — one "link" in the chain
class Node {
    constructor(value) {
        this.value = value;
        this.next  = null; // Points to nothing until linked
    }
}

// Step 2: The LinkedList container — manages the chain
class LinkedList {
    constructor() {
        this.head   = null; // First node in the chain
        this.tail   = null; // Last node in the chain
        this.length = 0;
    }

    // Add to the END — O(1) because we have a tail pointer
    add(value) {
        const node = new Node(value);

        if (!this.head) {
            // Empty list: new node is BOTH head and tail
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node; // Current tail links forward to new node
            this.tail = node;      // New node is now the tail
        }

        this.length++;
    }

    // Add to the BEGINNING — O(1)
    insertAtHead(value) {
        const node = new Node(value);

        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head; // New node points TO the old head
            this.head = node;      // New node IS the new head
        }

        this.length++;
    }

    // Search for a value — O(n), must walk the chain
    search(value) {
        let current = this.head;
        let index   = 0;

        while (current !== null) {
            if (current.value === value) return index;
            current = current.next; // ⚠️ Always advance the pointer!
            index++;
        }

        return -1; // Not found
    }

    // Remove the first node with this value — O(n)
    remove(value) {
        if (!this.head) return false;

        // Special case: removing the head node
        if (this.head.value === value) {
            this.head = this.head.next;
            if (!this.head) this.tail = null; // List is now empty
            this.length--;
            return true;
        }

        // Find the node BEFORE the one to remove
        let current = this.head;
        while (current.next !== null) {
            if (current.next.value === value) {
                if (current.next === this.tail) {
                    this.tail = current; // Removing the tail — update tail pointer
                }
                current.next = current.next.next; // Skip over the removed node
                this.length--;
                return true;
            }
            current = current.next;
        }

        return false; // Not found
    }

    // Print all values — O(n)
    print() {
        const values = [];
        let current  = this.head;

        while (current !== null) {
            values.push(current.value);
            current = current.next;
        }

        console.log(values.join(' → '));
    }
}

// ── Usage ──
const list = new LinkedList();
list.add(10);
list.add(20);
list.add(30);
list.insertAtHead(5);

list.print();                    // → 5 → 10 → 20 → 30
console.log(list.search(20));   // → 2  (index 2)
list.remove(10);
list.print();                    // → 5 → 20 → 30
console.log(list.length);       // → 3
```

---

## 5. When to Choose Which?

Use this guide when deciding which data structure fits a problem.

| Situation | Best Choice | Reason |
|:---|:---|:---|
| You need to undo/redo actions | **Stack** | LIFO — last action is first to undo |
| You need to process tasks in the order they arrived | **Queue** | FIFO — first task in is first handled |
| You need to go back through browser history | **Stack** | Each visit is pushed; Back = pop |
| You need random access by index (`data[500]`) | **Array** | O(1) direct access; Linked List is O(n) |
| You need to frequently add items to the front | **Linked List** | insertAtHead is O(1); Array unshift is O(n) |
| You need to check if something exists quickly | **Object/Set** | O(1) hash lookup |

---

## 6. Quick Reference — Big O Summary

| Structure | Operation | Big O | Notes |
|:---|:---|:---|:---|
| Stack | push / pop / peek | **O(1)** | All operations at one end |
| Queue | enqueue / peek | **O(1)** | — |
| Queue | dequeue (array .shift) | O(n) | Use a pointer-based Queue for O(1) |
| Linked List | insertAtHead | **O(1)** | — |
| Linked List | add to tail (with tail ptr) | **O(1)** | — |
| Linked List | search / remove | O(n) | Must traverse from head |
| Array | push / pop | **O(1)** | — |
| Array | unshift / shift | O(n) | Must re-index all elements |

---

## ✅ Summary Checklist

- [ ] I can explain the difference between LIFO (Stack) and FIFO (Queue) using an analogy.
- [ ] I can implement a `Stack` class with `push`, `pop`, `peek`, and `isEmpty`.
- [ ] I can implement a `Queue` class with `enqueue`, `dequeue`, `peek`, and `isEmpty`.
- [ ] I understand that a `Node` holds a `value` and a `next` pointer.
- [ ] I can trace on paper how `head` and `tail` change as nodes are added to a Linked List.
- [ ] I can implement `add`, `insertAtHead`, `search`, `remove`, and `print` on a Linked List.
- [ ] I know when to choose each structure based on the operations I need.
