# Lesson 16: Computer Science Basics — Big O Notation & Complexity

Welcome to Lesson 16! After mastering asynchronous JavaScript and building complete projects, it's time to step back and look at **how** our code runs. 

In this lesson, we transition from asking *"Does my code work?"* to asking *"Will my code scale?"* We introduce **Big O Notation** — the universal language software engineers use to describe algorithm efficiency.

## 🎯 Learning Objectives

By the end of this session, students will be able to:
1. Understand the concept of algorithm efficiency and why it matters as input size grows.
2. Read and explain Big O notation (Time and Space Complexity).
3. Identify the Big O complexity of standard JavaScript operations and loops:
   - **O(1)** — Constant Time
   - **O(log n)** — Logarithmic Time (Binary Search)
   - **O(n)** — Linear Time (Loops)
   - **O(n log n)** — Linearithmic Time (Sorting)
   - **O(n²)** — Quadratic Time (Nested Loops)
4. Compare linear search vs. binary search algorithms.

## 📂 Lesson Materials

| Resource | Description |
|:---|:---|
| [`notes/tutor_notes.md`](./notes/tutor_notes.md) | 90-minute session outline, teaching analogies, and common pitfalls to avoid. |
| [`notes/student_notes.md`](./notes/student_notes.md) | Jargon-free explanations of Big O, complexity curves, and JavaScript examples. |
| [`examples/big-o-visualizer.html`](./examples/big-o-visualizer.html) | Interactive dashboard featuring a Big O chart, Code Analyzer, and an animated Search Race (Linear vs. Binary). |
| [`exercises/complexity_practice.md`](./exercises/complexity_practice.md) | Code snippets for students to analyze and optimize. |
| [`assignments/assignment_brief.md`](./assignments/assignment_brief.md) | The capstone assignment: implementing searches and optimizing a nested loop using Hash Maps. |

## 🚀 Why This Matters

As developers, we often test our code with arrays of 5 or 10 items. But what happens when our app has 10,000 users? Or a million data points? Big O Notation gives us the theoretical foundation to predict performance bottlenecks before they crash our applications. It is also the most frequently tested topic in technical interviews.
