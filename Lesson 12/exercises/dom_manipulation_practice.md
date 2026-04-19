# Lesson 12: Practice Exercises — DOM Manipulation & Events

> **Before you begin:** Create a folder called `lesson-12-practice/`. Inside it, create three files: `index.html`, `styles.css`, and `app.js`. Use the starter code below, then complete each exercise in `app.js`.

---

## Starter Code

**`index.html`**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson 12 Practice</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

    <h1 id="main-heading">Original Heading</h1>

    <p id="intro-para">This is a paragraph waiting to be styled.</p>

    <ul id="fruit-list">
        <!-- JavaScript will add list items here -->
    </ul>

    <button id="toggle-btn">Toggle Dark Mode</button>

    <img id="hero-img" src="https://picsum.photos/300/150" alt="A random photo">

    <script src="app.js" defer></script>
</body>
</html>
```

**`styles.css`**
```css
body {
    font-family: sans-serif;
    padding: 24px;
    background: #f5f5f5;
    color: #111;
    transition: background 0.3s, color 0.3s;
}

body.dark-mode {
    background: #0f1117;
    color: #e8eaf0;
}

img {
    display: block;
    margin-top: 24px;
    border: 3px solid transparent;
    border-radius: 8px;
    transition: border-color 0.2s;
}

.highlight {
    color: #3b82f6;
    font-weight: 600;
}
```

---

## Exercise 1 — Select & Update Content

**Goal:** Select elements and change their content using JavaScript.

**Tasks:**
1. Select the `<h1>` by its ID and change its text to `"DOM Mastery! 🚀"`.
2. Select the `<p>` by its ID and change its text to `"Paragraph text updated by JavaScript."`.
3. Use `classList.add()` to add the `highlight` class to the paragraph.

**Expected result:** The heading reads "DOM Mastery! 🚀", and the paragraph is bold and blue.

<details>
<summary>💡 Hint (try it yourself first!)</summary>

```javascript
const heading = document.getElementById('main-heading');
heading.textContent = 'DOM Mastery! 🚀';
```

</details>

---

## Exercise 2 — Build a List Dynamically

**Goal:** Use a loop to create and append new DOM elements.

**Tasks:**
1. Select the `<ul id="fruit-list">` element.
2. Create an array: `['Apple 🍎', 'Banana 🍌', 'Mango 🥭', 'Grape 🍇']`.
3. Use a `for` loop (from Lesson 11!) to iterate over the array.
4. For each fruit, create a new `<li>` element, set its `textContent` to the fruit name, and `appendChild` it to the list.

**Expected result:** Four fruit names appear in a bulleted list on the page.

<details>
<summary>💡 Hint</summary>

```javascript
const list = document.getElementById('fruit-list');
const fruits = ['Apple 🍎', 'Banana 🍌'];

for (let i = 0; i < fruits.length; i++) {
    const li = document.createElement('li'); // create a new <li> node
    li.textContent = fruits[i];
    list.appendChild(li);                    // add it to the <ul>
}
```

</details>

---

## Exercise 3 — The Dark Mode Toggle

**Goal:** Handle a `click` event to toggle a CSS class on `<body>`.

**Tasks:**
1. Select the `<button id="toggle-btn">`.
2. Add a `click` event listener to the button.
3. Inside the listener, toggle the class `dark-mode` on `document.body`.
4. After toggling, check if `document.body.classList.contains('dark-mode')`:
   - If **true**, change the button's `textContent` to `"Switch to Light Mode ☀️"`.
   - If **false**, change it back to `"Toggle Dark Mode 🌙"`.

**Expected result:** Clicking the button switches the page background and text between light and dark, and the button label updates accordingly.

<details>
<summary>💡 Hint</summary>

```javascript
const btn = document.getElementById('toggle-btn');

btn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    // Now check if it's dark or not
});
```

</details>

---

## Exercise 4 — Hover Effects with Mouse Events

**Goal:** Use `mouseenter` and `mouseleave` to create hover behaviour without CSS `:hover`.

**Tasks:**
1. Select the `<img id="hero-img">` element.
2. Add a `mouseenter` listener: when the mouse enters the image, set its inline `style.borderColor` to `'#fbbf24'` (yellow).
3. Add a `mouseleave` listener: when the mouse leaves, reset `style.borderColor` to `''` (empty string removes the inline style, letting the CSS default take over).

**Expected result:** A bright yellow border appears when you hover over the image and disappears when you move away.

---

## Exercise 5 — setAttribute Challenge

**Goal:** Dynamically update element attributes.

**Tasks:**
1. Select the `<img id="hero-img">` element.
2. Use `setAttribute()` to change the image `src` to `'https://picsum.photos/300/150?grayscale'` (a greyscale version).
3. Also update the `alt` attribute to `'A greyscale random photo'`.
4. Log the new `src` back to the console using `getAttribute('src')` to confirm the change.

**Expected result:** The image switches to a greyscale version.

---

## Exercise 6 — Bonus: Keydown Event

**Goal:** Respond to keyboard input.

**Tasks:**
1. Add a `keydown` event listener to `document` (the whole page).
2. When the **'d'** key is pressed, toggle the `dark-mode` class on `document.body` — the same effect as clicking the button.
3. Log `e.key` to the console to see what key was pressed.

```javascript
document.addEventListener('keydown', function(e) {
    console.log('Key pressed:', e.key);
    // your code here
});
```

**Expected result:** Pressing 'd' on the keyboard toggles dark mode, just like clicking the button.

---

## Reflection Questions
After completing the exercises, think about these:
1. Why is `textContent` safer than `innerHTML` when dealing with user-provided text?
2. What is the advantage of toggling a CSS class (like `dark-mode`) rather than directly manipulating `element.style`?
3. What happens if you call `document.getElementById('wrong-id')` and then try to use the result — what error do you get?
