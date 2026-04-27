# Lesson 12: DOM Manipulation & Basic Events — Student Notes

---

## 1. What is the DOM?

When the browser loads your HTML file, it doesn't just display it — it **builds a live, in-memory map of every element**. This map is called the **Document Object Model (DOM)**. JavaScript can read *and change* this map at any time — without reloading the page.

**The separation of concerns:**
| Language | Role |
| :--- | :--- |
| HTML | **Structure** — the skeleton of the page |
| CSS | **Presentation** — colours, fonts, layout |
| JavaScript | **Behaviour** — what happens when users interact |

**Analogy:** Imagine a house. HTML is the blueprint, CSS is the paint and furniture, JavaScript is the wiring and switches. The DOM is the actual house standing in front of you — you can move furniture at any time.

---

## 2. The DOM Tree

Every HTML document is represented as a **tree of nodes**. Consider this HTML:

```html
<body>
  <h1 id="title">Hello</h1>
  <p class="intro">Welcome.</p>
  <button>Click me</button>
</body>
```

The DOM tree looks like this:

```
document
  └── <html>
        └── <body>
              ├── <h1 id="title">
              │     └── "Hello"  (text node)
              ├── <p class="intro">
              │     └── "Welcome."
              └── <button>
                    └── "Click me"
```

`document` is **always** your entry point. Every selection method starts from there.

---

## 3. Selecting Elements

Before you can change something, you have to **grab** it.

| Method | Selector Style | Returns |
| :--- | :--- | :--- |
| `document.getElementById('myId')` | ID string (no `#`) | Single element or `null` |
| `document.querySelector('.my-class')` | Any CSS selector | **First** match or `null` |
| `document.querySelectorAll('li')` | Any CSS selector | NodeList (all matches) |

```javascript
// --- getElementById ---
const title = document.getElementById('title'); // grabs <h1 id="title">

// --- querySelector (modern, flexible) ---
const intro = document.querySelector('.intro');    // first element with class "intro"
const btn   = document.querySelector('#my-btn');  // element with ID "my-btn"
const first = document.querySelector('li');        // very first <li> on the page

// --- querySelectorAll ---
const allItems = document.querySelectorAll('li');  // returns NodeList
console.log(allItems.length); // how many <li> elements?

// Loop through a NodeList with forEach
allItems.forEach(function(item) {
    console.log(item.textContent);
});
```

> ⚠️ **`querySelector` vs `getElementById`:** Prefer `querySelector` — it's more flexible because it takes CSS selectors. Use `getElementById` only when speed is critical (it's marginally faster).

---

## 4. Modifying Elements

### 4a. Changing Content

```javascript
const box = document.querySelector('#message');

// textContent — plain text only, safe against attacks
box.textContent = 'Hello, world!';

// innerHTML — renders HTML markup inside the element
box.innerHTML = '<strong>Bold text</strong> and <em>italic text</em>.';
```

> ⚠️ **Security:** Only ever use `innerHTML` with content you control. If you insert user-typed text with `innerHTML`, attackers can inject malicious scripts (called XSS). Always use `textContent` for user input.

---

### 4b. Modifying Attributes

```javascript
const img  = document.querySelector('img');
const link = document.querySelector('#main-link');

// Reading an attribute
console.log(img.getAttribute('src'));    // e.g., "photo.jpg" ./images/dom-events.png

// Setting / updating an attribute
img.setAttribute('alt', 'A photo of a sunset');
img.setAttribute('src', 'new-photo.jpg');

// Removing an attribute
link.removeAttribute('target'); // link no longer opens in a new tab
```

---

### 4c. Changing Styles & Classes

**Option 1 — Inline styles (quick but messy):**
```javascript
const box = document.querySelector('.card');
box.style.backgroundColor = '#1a1d2e'; // CSS "background-color" → camelCase in JS!
box.style.color = '#e8eaf0';
box.style.borderRadius = '8px';
```

> ⚠️ CSS uses kebab-case (`background-color`) but JavaScript requires camelCase (`backgroundColor`).

**Option 2 — classList ✅ (best practice):**
Keep all your styles in CSS. JavaScript just flips classes on or off.

```css
/* styles.css */
.highlighted {
    background-color: rgba(52, 211, 153, 0.1);
    border: 2px solid #34d399;
}
```

```javascript
// JavaScript only controls which classes are active
const box = document.querySelector('#content-box');

box.classList.add('highlighted');      // adds the class
box.classList.remove('highlighted');   // removes it
box.classList.toggle('highlighted');   // adds if absent, removes if present
box.classList.contains('highlighted'); // → true / false (check without modifying)
```

---

## 5. Event Listeners

An **event** is anything that happens in the browser — a click, a key press, a mouse movement. You tell JavaScript to *listen* for an event and *respond* when it happens.

```javascript
element.addEventListener('event-name', callbackFunction);
```

```javascript
const btn = document.querySelector('#my-btn');

btn.addEventListener('click', function(e) {
    // 'e' is the event object — contains useful info
    console.log('Clicked!', e.target); // e.target = the element clicked
    btn.textContent = 'Clicked! ✅';
    btn.classList.add('active');
});
```

### Common Events

| Event Name | Fires when… |
| :--- | :--- |
| `click` | User clicks the element |
| `mouseenter` | Mouse cursor moves onto the element |
| `mouseleave` | Mouse cursor moves off the element |
| `keydown` | User presses a key (while element is focused) |
| `submit` | A `<form>` is submitted |
| `input` | Value inside an `<input>` changes |

### Mouseover / Mouseout Example

```javascript
const card = document.querySelector('.card');

card.addEventListener('mouseenter', function() {
    card.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.4)';
});

card.addEventListener('mouseleave', function() {
    card.style.boxShadow = 'none';
});
```

---

## 6. Putting It All Together

Here is **one complete, working example** that combines everything — selection, manipulation, and events:

**HTML (dom-events-demo.html)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DOM Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1 id="greeting">Welcome!</h1>
    <p id="status">The theme is currently: Light</p>
    <button id="theme-btn">Enable Dark Mode</button>
    <script src="app.js" defer></script>
</body>
</html>
```

**CSS (styles.css)**
```css
body.dark {
    background-color: #0f1117;
    color: #e8eaf0;
}
```

**JavaScript (app.js)**
```javascript
// 1. SELECT the elements we need
const btn     = document.getElementById('theme-btn');
const status  = document.getElementById('status');

// 2. LISTEN for a click event on the button
btn.addEventListener('click', function() {
    
    // 3. TOGGLE the 'dark' class on <body>
    document.body.classList.toggle('dark');

    // 4. UPDATE text based on current state
    if (document.body.classList.contains('dark')) {
        btn.textContent   = 'Disable Dark Mode';
        status.textContent = 'The theme is currently: Dark 🌙';
    } else {
        btn.textContent   = 'Enable Dark Mode';
        status.textContent = 'The theme is currently: Light ☀️';
    }
});
```

**What to notice:**
- The `<script>` tag uses the `defer` attribute — this ensures the DOM is fully built before any JS runs.
- JS never touches your CSS file — it only switches classes on and off.
- Clicking the button toggles the page between two states cleanly.

---

## 7. Quick Reference Cheat Sheet

```
SELECT
  document.getElementById('id')        → one element by ID
  document.querySelector('css')        → first match
  document.querySelectorAll('css')     → all matches (NodeList)

CONTENT
  element.textContent = 'text'         → set plain text
  element.innerHTML   = '<b>html</b>'  → set inner HTML

ATTRIBUTES
  element.getAttribute('attr')         → read
  element.setAttribute('attr', 'val')  → write / update
  element.removeAttribute('attr')      → delete

STYLE (use sparingly)
  element.style.property = 'value'     → camelCase!

CLASSES (preferred)
  element.classList.add('name')
  element.classList.remove('name')
  element.classList.toggle('name')
  element.classList.contains('name')   → true/false

EVENTS
  element.addEventListener('click', fn)
  element.addEventListener('mouseenter', fn)
  element.addEventListener('mouseleave', fn)
  element.addEventListener('keydown', fn)
```
