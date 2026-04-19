# Lesson 12 Assignment: Portfolio Integration

## Objective
Apply your DOM manipulation and event handling skills to add **real interactivity** to your personal portfolio website.

---

## Pre-Session Task
Before attending the session, confirm you can do the following (review if needed):
- Create an HTML file and link an external JavaScript file using `<script src="app.js" defer></script>`.
- Create an external CSS file and link it with `<link rel="stylesheet" href="styles.css">`.
- Explain the difference between a CSS class and an inline style.

---

## Main Assignment

### Context
Your portfolio currently looks great as a static page. Now, using only vanilla JavaScript, you will add at least **two distinct interactive features** driven by DOM events.

---

### Requirements

#### Requirement 1 — Dark/Light Mode Toggle
Add a toggle button to your portfolio that switches between a dark and light theme.

- The button must be visible in the page header or navigation.
- Clicking it must toggle a CSS class (e.g., `.dark-mode`) on the `<body>` element.
- The button's **label must update** to reflect the current state:
  - `"Switch to Dark Mode 🌙"` when in light mode.
  - `"Switch to Light Mode ☀️"` when in dark mode.
- All styling for dark mode must live in **CSS**, not in JavaScript.

#### Requirement 2 — Dynamic Greeting
Add a greeting to the top of your portfolio that changes based on the current time of day.

```javascript
// Hint: Get the current hour
const hour = new Date().getHours(); // 0–23

if (hour < 12) {
    greeting = 'Good morning ☀️';
} else if (hour < 18) {
    greeting = 'Good afternoon 🌤️';
} else {
    greeting = 'Good evening 🌙';
}
```

- Select the heading or intro element and update its `textContent` with the greeting when the page loads.
- Do **not** hard-code the text in HTML — it must be set by JavaScript.

#### Requirement 3 — Contact Form Confirmation *(Optional but Recommended)*
If your portfolio has a contact form:

- Prevent the default form submission (which reloads the page) using `e.preventDefault()`.
- After preventing the reload, show a success message (e.g., a `<div>` with "Thanks! I'll be in touch.") by removing the `hidden` class from a confirmation element.
- Clear the form inputs after submission.

---

### Code Quality Standards
Your JavaScript file must follow these rules:

| Standard | Requirement |
| :--- | :--- |
| **No inline JS** | No `onclick="..."` in HTML. Use `addEventListener()` in your `.js` file only. |
| **`defer` attribute** | Your `<script>` tag must use `defer` so the DOM loads before JS runs. |
| **`const` / `let`** | Use `const` for element references, `let` for variables that change. |
| **classList over style** | Do not use `element.style` to apply visual changes — use class toggling. |
| **Comments** | Each major block of code must have a comment explaining what it does. |

---

### Example File Structure
```
my-portfolio/
├── index.html
├── styles.css          ← includes .dark-mode rules
└── js/
    └── app.js          ← all your JavaScript
```

---

## Deliverables
1. **A commit** to your portfolio repository with the subject line: `feat: add DOM interactivity (Lesson 12)`.
2. All three files updated: `index.html` (structure), `styles.css` (dark mode rules), `app.js` (all JavaScript).
3. Be prepared to **walk through your `app.js` line by line** and explain each event listener during the next session.

---

## Bonus Challenges
- **Smooth scroll navigation:** Add click listeners to nav links so clicking "Projects" smoothly scrolls to the projects section.
- **Skill badge hover tooltips:** On `mouseenter` of a skill badge, show a small tooltip with a description; remove it on `mouseleave`.
- **Animated counter:** On page load, animate numbers in your stats section counting up from 0 to their target value.

---

## Assessment Criteria

| Criterion | Marks |
| :--- | :--- |
| Dark/Light mode toggle working correctly | 30% |
| Dynamic greeting displays on load | 20% |
| Code quality: `const/let`, `defer`, no inline JS | 25% |
| Comments explaining each block | 15% |
| Optional contact form / bonus features | 10% |
