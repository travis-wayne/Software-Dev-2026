# Session 12 — DOM Manipulation & Basic Events: Tutor Notes

---

## Learning Objectives
By the end of this session, the student will be able to:
1. Explain what the DOM is and why it exists as an interface between HTML and JavaScript.
2. Select HTML elements using `getElementById`, `querySelector`, and `querySelectorAll`.
3. Modify an element's text, innerHTML, attributes, inline styles, and CSS classes.
4. Attach event listeners for `click`, `mouseenter`, `mouseleave`, and `keydown` events.
5. Combine selection + manipulation + events into a working, interactive mini-program.

---

## Materials Needed
- Computer with VS Code and a modern browser (Chrome preferred).
- `Lesson 12/examples/dom-events.html` open as live reference.
- `Lesson 12/examples/app.js` as the external JS follow-along file.
- Browser DevTools open on the **Elements** and **Console** tabs.

---

## Pre-Session Checklist
- [ ] Confirm student can set up an HTML file and link an external JS file (`<script src="app.js" defer>`).
- [ ] Confirm student completed Lesson 11 (control flow, functions, loops) — they'll need those skills today.
- [ ] Test the `dom-events.html` playgrounds run correctly in their browser before starting.

---

## Session Outline (~105 minutes)

### 1. The "Why" — Making Pages Come Alive (10 mins)

**Teaching script:**
> "Up to now, every program we've written has run in isolation — in the console. Today changes everything. Today JavaScript learns to *see* the page."

Show a static HTML page next to the same page with JavaScript-driven interactions (e.g., a dark mode toggle, a button that changes its own text). Let the contrast do the talking.

**Key point to plant:** Every time the browser reads an HTML file, it builds a live in-memory map called the **Document Object Model**. Every tag becomes an object. JavaScript can reach in and change those objects at any time — *without reloading the page*. This is the foundation of every modern website.

**Analogy:** The HTML file is a recipe card. The DOM is the actual meal sitting on the table. You can scoop things out, add sauce, rearrange the plate — and the recipe card never changes.

---

### 2. Introducing the DOM Tree (15 mins)

Draw (or show) the DOM tree structure on a whiteboard or share screen. Use a simple page:
```html
<html>
  <body>
    <h1 id="title">Hello</h1>
    <p class="intro">Welcome.</p>
    <button>Click me</button>
  </body>
</html>
```

Walk through the tree: `document` → `html` → `body` → each child element. Emphasise that in JavaScript, `document` is the entry point to every element.

**Common Mistake to Flag:** Students often type `Document` (capital D) out of habit — remind them JavaScript is case-sensitive. It is always `document`.

---

### 3. Selecting Elements (20 mins)

Demonstrate each method live in the **browser console** on the `dom-events.html` page:

```js
// Method 1: By ID (fastest, most specific)
const title = document.getElementById('target-box');

// Method 2: querySelector — returns the FIRST match using CSS syntax
const first = document.querySelector('.demo-box');

// Method 3: querySelectorAll — returns ALL matches as a NodeList
const allBoxes = document.querySelectorAll('.demo-box');
console.log(allBoxes.length); // how many?
```

**Key teaching moment:** Run `document.querySelector('div')` — ask the student: "Which div do you think this grabbed?" Show them by highlighting it in the Elements panel. This builds intuition for specificity.

**Activity (5 mins):** Have the student open `dom-events.html` in Chrome, press F12 to open DevTools → Console, and type 3 different selectors to grab different elements, then log them. No scaffolding — just exploration.

---

### 4. Modifying Elements (25 mins)

Work through the three categories of modification. Use the live preview in `dom-events.html → Manipulation tab` to show changes in real time.

**4a. Content**
```js
const box = document.getElementById('content-box');

// textContent — always safe; strips any HTML tags
box.textContent = 'Plain text only.';

// innerHTML — renders HTML markup inside the element
box.innerHTML = '<strong>This is bold!</strong>';
```
> "Think of `textContent` as the safe hire, and `innerHTML` as the powerful but unpredictable one. If the text ever comes from user input, always use `textContent`."

**4b. Attributes**
```js
const img = document.querySelector('img');
img.setAttribute('alt', 'A descriptive alt text');
img.setAttribute('src', 'new-image.png');

const link = document.querySelector('a');
link.getAttribute('href'); // reading an attribute
link.removeAttribute('target'); // removing one
```

**4c. Styles & Classes (spend the most time here)**
Explain inline vs class-based styling with a real argument:
- Inline styles scatter presentation logic into JS, making it hard to maintain.
- Classes keep CSS in CSS. JS just flips a switch.

```js
const box = document.getElementById('content-box');

// ❌ Inline — harder to maintain
box.style.backgroundColor = '#1a1d2e';
box.style.borderColor = '#34d399';

// ✅ Class toggle — clean and maintainable
box.classList.add('highlighted');    // adds it
box.classList.remove('highlighted'); // removes it
box.classList.toggle('dark-mode');   // flips it
box.classList.contains('dark-mode'); // checks it → true/false
```

**Common Mistake:** Students write `element.style.background-color` — explain that hyphenated CSS properties become camelCase in JS (`backgroundColor`).

---

### 5. Event Listeners (25 mins)

**Teaching script:**
> "An event listener is like hiring a security guard. You say: 'Watch this button. When someone clicks it, call me.' You don't need to keep checking — the browser will tell you when it happens. This non-blocking behaviour is one of the most important ideas in web development."

Walk through the anatomy of an event listener:
```js
element.addEventListener('event-name', callbackFunction);
```

**Live demo — build it together:**
```js
const btn = document.querySelector('#action-btn');

btn.addEventListener('click', function(e) {
    console.log('Clicked!', e.target); // e.target is the element that was clicked
    btn.textContent = 'Clicked!';
    btn.classList.toggle('active');
});
```

**Then add a hover effect:**
```js
const box = document.querySelector('#event-box');

box.addEventListener('mouseenter', () => {
    box.style.borderColor = '#fbbf24';
});

box.addEventListener('mouseleave', () => {
    box.style.borderColor = '';
});
```

**Introduce the `event` object briefly:** `e.target` tells you which element triggered the event. `e.preventDefault()` stops default browser behaviour (e.g., stopping a form from submitting and reloading the page).

---

### 6. Putting It All Together — Mini Project (10 mins)

Challenge the student to build a small "character card" in 10 minutes:
1. An HTML page with a heading, a paragraph, and a button ("Reveal").
2. The paragraph starts hidden (CSS: `.hidden { display: none; }`).
3. Clicking the button toggles the `hidden` class on the paragraph.
4. The button text switches between "Reveal" and "Hide".

This ties selection + class manipulation + events into one satisfying interaction.

---

## Common Mistakes & How to Address Them

| Mistake | Why It Happens | How to Fix |
| :--- | :--- | :--- |
| `getElementById` returns `null` | Script runs before DOM loads; ID is misspelled | Use `defer` on script tag; double-check ID |
| Modifying `.style.background-color` | Forgetting CSS → camelCase in JS | Show the rule: hyphen → camelCase |
| Adding inline onclick instead of `addEventListener` | Mixing HTML and JS concerns | Explain separation of concerns |
| Forgetting `const`/`let` when selecting | Habit from console | Enforce it every time in code reviews |
| `querySelectorAll` result not iterable like an array | NodeList has no `.map()` etc | Teach `Array.from(nodeList)` if needed |
| Adding listeners inside the loop (multiple triggers) | Common loop + event mistake | Always select first, then listen |

---

## Wrap-up & Assignment (5 mins)
- Recap the three pillars: **Select → Manipulate → Listen**.
- Assign `assignment_brief.md`: portfolio integration challenge.
- Pre-reading for Lesson 13: arrays and the DOM (`forEach` to build lists dynamically).
