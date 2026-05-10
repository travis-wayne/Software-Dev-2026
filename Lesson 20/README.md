# Lesson 20: Frontend Frameworks — State Management (useState, useEffect)

## 🎯 Learning Objectives

By the end of this session, students will be able to:
1. Explain what **state** is in React and why plain variables are not sufficient for dynamic UIs.
2. Use `useState` to declare, read, and update state in a functional component.
3. Explain the difference between **props** (passed in) and **state** (managed internally).
4. Use `useEffect` to perform side effects: logging, DOM updates, and data fetching.
5. Control *when* an effect runs using the **dependency array** (on mount, every render, on change).
6. Write a **cleanup function** inside `useEffect` to prevent memory leaks.

## 📂 Lesson Materials

| Resource | Description |
|:---|:---|
| [`notes/tutor_notes.md`](./notes/tutor_notes.md) | 90-min session outline, opening hook, analogies, pitfalls, and debug scenarios |
| [`notes/student_notes.md`](./notes/student_notes.md) | Full reference with code examples, patterns, and decision tables |
| [`examples/state-visualizer.html`](./examples/state-visualizer.html) | Interactive visualizer: useState playground, useEffect explorer, data fetch demo |
| [`exercises/state_practice.md`](./exercises/state_practice.md) | Guided exercises with predict-first boxes and scaffolded components |
| [`assignments/assignment_brief.md`](./assignments/assignment_brief.md) | Assignment: contact form, document title effect, data-fetching component |

## 🔗 Prerequisites

- **Lesson 18–19:** React components and props — students must understand JSX and how data flows from parent to child before this lesson.
- **JavaScript async/await and Fetch API** — required for the `useEffect` data-fetching section.

## 🧠 The Big Idea

Before this lesson, React components are **static** — they show data but cannot respond to it. After this lesson, components are **alive** — they remember things, react to user input, and talk to the outside world.
