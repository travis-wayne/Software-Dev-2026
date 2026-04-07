# Student Notes – Lesson 4: CSS Basics, Box Model, Selectors

## Topics Covered

1. Introduction to CSS: Making web pages beautiful.
2. Different ways to add CSS to your HTML.
3. Understanding the fundamental CSS Box Model.
4. Targeting HTML elements with various CSS selectors.

## Key Concepts

### What is CSS?

CSS (Cascading Style Sheets) controls the **look and feel** of your website — colors, fonts, spacing, layout, and more. HTML provides the structure; CSS provides the style.

```css
/* Basic CSS syntax */
selector {
    property: value;
}
```

**Example:**

```css
h1 {
    color: navy;
    font-size: 32px;
}
```

### Three Ways to Add CSS

#### 1. Inline CSS (on the element)

```html
<p style="color: red; font-size: 18px;">This text is red.</p>
```

> **Use when:** You need a quick, one-off style. Not recommended for larger projects.

#### 2. Internal CSS (in the `<head>`)

```html
<head>
    <style>
        p {
            color: blue;
        }
    </style>
</head>
```

> **Use when:** Styling a single page. Better than inline, but not ideal for multi-page sites.

#### 3. External CSS (separate `.css` file) ⭐ Best Practice

```html
<head>
    <link rel="stylesheet" href="style.css">
</head>
```

> **Use when:** Building real projects. Keeps your HTML clean and styles reusable across pages.

### The CSS Box Model

Every HTML element is a rectangular box made up of four layers:

```
┌─────────────────────────────────────┐
│            MARGIN                   │
│  ┌───────────────────────────────┐  │
│  │          BORDER               │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │        PADDING          │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │     CONTENT       │  │  │  │
│  │  │  │  (text, images)   │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

- **Content** — The actual text, image, or other media.
- **Padding** — Space between the content and the border.
- **Border** — A visible (or invisible) line around the padding.
- **Margin** — Space outside the border, pushing other elements away.

**Example:**

```css
div {
    padding: 20px;
    border: 2px solid black;
    margin: 10px;
}
```

> **Tip:** Use Chrome DevTools (right-click → Inspect) to see the Box Model of any element!

### CSS Selectors

Selectors tell CSS **which** elements to style.

| Selector          | Syntax              | Example                          |
|-------------------|----------------------|----------------------------------|
| Type              | `element`           | `p { color: blue; }`            |
| Class             | `.class-name`       | `.highlight { background: yellow; }` |
| ID                | `#id-name`          | `#main-title { font-size: 36px; }` |
| Universal         | `*`                 | `* { margin: 0; }`              |
| Attribute         | `[attribute]`       | `input[type="text"] { border: 1px solid gray; }` |
| Pseudo-class      | `:state`            | `a:hover { color: red; }`       |

### Specificity

When multiple rules target the same element, the browser uses **specificity** to decide which wins:

```
Inline styles  >  ID selectors  >  Class selectors  >  Type selectors
   (1000)           (100)             (10)                (1)
```

> **Example:** `#title { color: red; }` beats `.title { color: blue; }` because ID (100) > Class (10).

## Activities

1. **Try All Three CSS Methods** — Add inline, internal, and external CSS to `exercises/styles.html`.
2. **Box Model Exploration** — Apply padding, border, and margin to a `<div>` and inspect it with DevTools.
3. **Selector Practice** — Use `p`, `.my-class`, `#my-id`, and `a:hover` selectors in `exercises/style.css`.
4. **DevTools Inspection** — Open `styles.html` in the browser and use developer tools to inspect the Box Model.

## Post-Session Assignment

- Create a new stylesheet (`portfolio.css`) for your personal portfolio project.
- Link `portfolio.css` to all HTML pages of your portfolio.
- Apply basic styling to your portfolio (fonts, colors, padding, margins, hover effects).
- See `assignments/assignment_brief.md` for full details.

## Resources & Links

- **Reading:**
  - [MDN: CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS)
  - [CSS-Tricks: The Box Model](https://css-tricks.com/the-css-box-model/)
  - [W3Schools: CSS Selectors](https://www.w3schools.com/css/css_selectors.asp)
- **Videos:**
  - [CSS Crash Course For Absolute Beginners](https://www.youtube.com/watch?v=yfoY53QXEnI)
  - [CSS Box Model Explained](https://www.youtube.com/watch?v=rIO5326FgPE)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

## Tips

- Practice using different selectors to gain mastery.
- Always use external stylesheets for larger projects.
- The Box Model is crucial; make sure you understand how padding, border, and margin affect element size and spacing.
- Right-click any element → "Inspect" to see its styles and Box Model in DevTools.
- Experiment! Change values and see what happens — that's the fastest way to learn CSS.
