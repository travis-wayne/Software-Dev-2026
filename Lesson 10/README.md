# Lesson 10 – JavaScript Fundamentals I: Variables, Data Types, Operators

## 📚 Learning Objectives

By the end of this session, you will be able to:

1. Explain the role of JavaScript in web development and how it fits alongside HTML and CSS.
2. Open the browser's developer console and execute JavaScript statements directly.
3. Declare and use variables with `let` and `const`, and understand why `var` is discouraged.
4. Identify and work with JavaScript's primitive data types and use `typeof` to inspect them.
5. Perform calculations using arithmetic, assignment, comparison, and logical operators.
6. Understand type coercion and why `===` should always be used over `==`.
7. Link an external `.js` file to an HTML document using the `<script>` tag.

## 🗂️ Folder Structure

```
Lesson 10/
├── README.md                                  ← You are here
├── notes/
│   ├── tutor_notes.md                         ← Tutor guide, session outline & tips
│   └── student_notes.md                       ← Student study notes & reference guide
├── examples/
│   ├── js_interactive_reference.html          ← ⭐ Interactive visual guide with live playgrounds
│   ├── js-basics.html                         ← HTML file linking to the JS examples
│   └── script.js                              ← JavaScript examples covering all topics
├── exercises/
│   └── js_fundamentals_practice.md            ← Step-by-step guided exercises (12 tasks)
└── assignments/
    └── assignment_brief.md                    ← Post-session assignments with expected output
```

> **💡 Start here:** Open `examples/js_interactive_reference.html` in your browser. This interactive guide covers every concept from today's lesson with live code playgrounds, visual diagrams, and a quiz to test your understanding.

## 🔑 Key Concepts

| Concept | Plain English |
|---|---|
| **JavaScript** | The programming language that brings interactivity and dynamic behaviour to web pages — the "brain" of the web. |
| **Variables** | Named containers for storing data. Use `const` by default, `let` when the value needs to change, never `var`. |
| **Data Types** | The kind of data a variable holds: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `object`. |
| **`typeof`** | An operator that tells you what type a value is (e.g., `typeof 42` returns `"number"`). |
| **Operators** | Symbols used to perform operations: arithmetic (`+`, `-`, `*`, `/`, `%`), comparison (`===`, `!==`), logical (`&&`, `\|\|`, `!`). |
| **Type Coercion** | JavaScript's automatic conversion between types — the #1 source of beginner bugs. |
| **Template Literals** | Modern string syntax using backticks (`` ` ``) that allows embedded expressions: `` `Hello, ${name}!` ``. |

## 🛠️ Quick Reference

| What | Syntax |
|---|---|
| Print to console | `console.log("message");` |
| Declare constant | `const name = "Alice";` |
| Declare variable | `let score = 100;` |
| Check type | `typeof value` |
| Strict equality | `===` and `!==` |
| Link JS to HTML | `<script src="script.js"></script>` |
| Template literal | `` `Hello, ${name}!` `` |

## 📖 Resources

- [MDN Web Docs: JavaScript basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction)
- [W3Schools: JavaScript Variables](https://www.w3schools.com/js/js_variables.asp)
- [JavaScript.info: Data types](https://javascript.info/data-types)
- [JavaScript Crash Course for Beginners (YouTube)](https://www.youtube.com/watch?v=hdI2bqO0rbM) — Focus on first 30-45 minutes
- [JavaScript Operators Tutorial (YouTube)](https://www.youtube.com/watch?v=c_J-g_0g28U)
