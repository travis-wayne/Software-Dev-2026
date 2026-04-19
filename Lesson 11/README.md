# Lesson 11 – JavaScript Fundamentals I: Control Flow (If/Else, Loops), Functions

## 📚 Learning Objectives

By the end of this session, you will be able to:

1. Implement conditional logic using `if`, `else if`, and `else` statements to execute code blocks based on truthy/falsy conditions.
2. Control the flow of execution with loop constructs (`for`, `while`) to perform repetitive tasks efficiently.
3. Understand when to use a `for` loop versus a `while` loop.
4. Define and invoke functions to organize, reuse, and modularize code.
5. Pass arguments into functions and return values back.
6. Understand function scope and how variables inside a function behave relative to variables outside.

## 🗂️ Folder Structure

```
Lesson 11/
├── README.md                                  ← You are here
├── notes/
│   ├── tutor_notes.md                         ← Tutor guide, session outline & tips
│   └── student_notes.md                       ← Student study notes & reference guide
├── examples/
│   ├── control-flow.html                      ← HTML file linking to the JS examples
│   └── script.js                              ← JavaScript examples covering conditionals, loops, and functions
├── exercises/
│   └── js_control_flow_practice.md            ← Step-by-step guided exercises
└── assignments/
    └── assignment_brief.md                    ← Post-session assignments with expected output
```

## 🔑 Key Concepts

| Concept | Plain English |
|---|---|
| **Control Flow** | The order in which statements are executed in a program. We use conditionals and loops to control this flow. |
| **Conditional Statements** | Like a diverging road in real life, `if/else` statements allow our code to make decisions and go down different paths depending on a condition. |
| **Loops** | A way to repeat the same code block multiple times without writing it out over and over. |
| **`for` Loop** | Best when you know exactly how many times you want the loop to run. |
| **`while` Loop** | Best when you want the loop to run an unknown number of times until a specific condition stops being true. |
| **Functions** | Reusable mini-programs. You define a set of instructions once, give it a name, and can "call" it whenever you need that task done. |
| **Arguments & Parameters** | The inputs you hand to a function to change how it runs. Parameters are the temporary variable names in the definition; arguments are the actual values passed in. |
| **Return Value** | What a function spits back out when it finishes running. |
| **Scope** | Determining where variables are accessible. Variables mapped out inside a function are "local" and can't be seen outside it. |

## 🛠️ Quick Reference

| What | Syntax |
|---|---|
| If/Else statement | `if (x) { ... } else { ... }` |
| For loop | `for (let i = 0; i < 5; i++) { ... }` |
| While loop | `while (condition) { ... }` |
| Function Declaration | `function greet(name) { ... }` |
| Call a function | `greet("Alice");` |
| Return a value | `return sum;` |

## 📖 Resources

- [MDN Web Docs: Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [JavaScript.info: Functions](https://javascript.info/functions)
- [W3Schools: JavaScript Loops](https://www.w3schools.com/js/js_loop_for.asp)
- [JavaScript If/Else Statements Tutorial (YouTube)](https://www.youtube.com/watch?v=IsG4Xd6L-fY)
- [JavaScript Loops Tutorial (YouTube)](https://www.youtube.com/watch?v=oc_s3g_2e-M)
- [JavaScript Functions Tutorial (YouTube)](https://www.youtube.com/watch?v=N8e_hQ_d48k)
