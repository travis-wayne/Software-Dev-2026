# Lesson 19: Frontend Frameworks — Intro to React, Components, Props

## 🎯 Learning Objectives

By the end of this session, students will be able to:
1. Explain why React was created and the problem it solves compared to vanilla JavaScript DOM manipulation.
2. Define what a **Component** is and identify the shift to Component-Based Architecture.
3. Write **JSX** and explain the key differences between JSX and HTML.
4. Create and render functional components.
5. Pass data from a parent component to a child component using **Props**.
6. Set up a basic React development environment using Vite.

## 📂 Lesson Materials

| Resource | Description |
|:---|:---|
| [`notes/tutor_notes.md`](./notes/tutor_notes.md) | 90-min session outline, opening hook, analogies (Lego blocks), pitfalls, and debug scenarios |
| [`notes/student_notes.md`](./notes/student_notes.md) | Full reference covering components, JSX rules, and props |
| [`examples/react-playground.html`](./examples/react-playground.html) | Interactive visualizer: Zero-build React playground using Babel standalone to demonstrate components and props instantly |
| [`exercises/react_practice.md`](./exercises/react_practice.md) | Guided exercises: identifying components, fixing JSX errors, building a Profile card |
| [`assignments/assignment_brief.md`](./assignments/assignment_brief.md) | Assignment: Initialize a Vite project, build a modular layout, and create reusable Button and Card components |

## 🔗 Prerequisites

- **ES6+ JavaScript:** Students must be comfortable with arrow functions, object destructuring, and `import`/`export` syntax.
- **Vanilla DOM:** A strong understanding of `document.createElement()` helps students appreciate *why* React's declarative approach is so much better.

## 🧠 The Big Idea

React fundamentally changes how developers think about UI. Instead of writing HTML and then using JavaScript to reach in and change it (imperative), developers describe *what* the UI should look like based on current data (declarative), and build it out of small, reusable, independent pieces called Components.
