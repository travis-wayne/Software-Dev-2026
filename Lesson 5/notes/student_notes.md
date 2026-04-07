# Student Notes – Lesson 5: Layouts (Flexbox & Grid), Responsive Design

## Topics Covered

1. Modern CSS layout techniques: Flexbox and CSS Grid.
2. Building websites that adapt to any screen size with Responsive Web Design.
3. Using media queries to apply styles conditionally.

## Key Concepts

### Why Modern Layouts?

In Lesson 4 you learned the Box Model — every element is a box. But how do you arrange those boxes **side by side**, in **grids**, or make them **stack on mobile**? That's where Flexbox and Grid come in.

### Flexbox — One-Dimensional Layout

Flexbox arranges items in **one direction**: either a row or a column.

```css
/* The parent becomes a flex container */
.container {
    display: flex;
}
```

#### Understanding the Axes

Flexbox has two axes. Which is "main" depends on `flex-direction`:

```
flex-direction: row (default)

        ← ← ← ← MAIN AXIS → → → → →
       ┌──────────────────────────────┐  ↑
       │  ┌──────┐ ┌──────┐ ┌──────┐ │  │
  C    │  │      │ │      │ │      │ │  CROSS
  R    │  │ Item │ │ Item │ │ Item │ │  AXIS
  O    │  │  1   │ │  2   │ │  3   │ │  │
  S    │  │      │ │      │ │      │ │  │
  S    │  └──────┘ └──────┘ └──────┘ │  │
       └──────────────────────────────┘  ↓

• justify-content → controls spacing along the MAIN AXIS (horizontal)
• align-items     → controls alignment along the CROSS AXIS (vertical)
```

```
flex-direction: column

        ← ← CROSS AXIS → → →
       ┌──────────────────────┐  ↑
       │  ┌────────────────┐  │  │
       │  │    Item 1       │  │  │
       │  └────────────────┘  │  MAIN
       │  ┌────────────────┐  │  AXIS
       │  │    Item 2       │  │  │
       │  └────────────────┘  │  │
       │  ┌────────────────┐  │  │
       │  │    Item 3       │  │  │
       │  └────────────────┘  │  ↓
       └──────────────────────┘

• justify-content → controls spacing along the MAIN AXIS (now vertical)
• align-items     → controls alignment along the CROSS AXIS (now horizontal)
```

#### Key Container Properties

| Property            | What It Does                                          | Common Values                                                  |
|---------------------|-------------------------------------------------------|----------------------------------------------------------------|
| `display: flex`     | Activates Flexbox                                      | —                                                              |
| `flex-direction`    | Sets the direction of items                           | `row`, `column`, `row-reverse`, `column-reverse`               |
| `justify-content`   | Aligns items on the **main axis**                      | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` |
| `align-items`       | Aligns items on the **cross axis**                     | `stretch`, `flex-start`, `center`, `flex-end`                   |
| `flex-wrap`         | Allows items to wrap to the next line                  | `nowrap`, `wrap`                                                |

**Example — Centered navigation bar:**

```css
nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
}
```

#### Flex Item Properties

These go on the **children** (not the container) to control how each item grows, shrinks, or sizes itself:

| Property       | What It Does                                        | Default   | Example          |
|----------------|-----------------------------------------------------|-----------|------------------|
| `flex-grow`    | How much an item grows to fill extra space          | `0`       | `flex-grow: 1`   |
| `flex-shrink`  | How much an item shrinks when space is tight        | `1`       | `flex-shrink: 0` |
| `flex-basis`   | The starting size before grow/shrink kicks in       | `auto`    | `flex-basis: 200px` |
| `flex`         | Shorthand for grow, shrink, basis                   | `0 1 auto`| `flex: 1`        |

**Example — Three items, middle one takes extra space:**

```css
.sidebar   { flex: 0 0 200px; }  /* Fixed 200px, won't grow or shrink */
.content   { flex: 1; }          /* Takes all remaining space */
.aside     { flex: 0 0 150px; }  /* Fixed 150px, won't grow or shrink */
```

> **💡 Shortcut:** `flex: 1` is the same as `flex-grow: 1; flex-shrink: 1; flex-basis: 0;` — the item will grow to fill available space equally with other `flex: 1` items.

### CSS Grid — Two-Dimensional Layout

Grid arranges items in **two dimensions**: rows AND columns at the same time.

```css
/* The parent becomes a grid container */
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
    gap: 20px;                            /* space between items */
}
```

#### Grid Anatomy

```
         Column 1      Column 2      Column 3
       ┌─────────────┬─────────────┬─────────────┐
       │             │             │             │
Row 1  │   Cell      │   Cell      │   Cell      │
       │   (1,1)     │   (1,2)     │   (1,3)     │
       ├─────────────┼─────────────┼─────────────┤  ← Row Track
       │             │             │             │
Row 2  │   Cell      │   Cell      │   Cell      │
       │   (2,1)     │   (2,2)     │   (2,3)     │
       └─────────────┴─────────────┴─────────────┘
             ↑                           ↑
        Column Track                Column Track

       ←── gap ──→  (space between tracks)
```

- **Track** = a row or column
- **Cell** = a single box where a row and column intersect
- **Gap** = the space between tracks (set with `gap`)
- **Line** = the dividing lines between tracks (numbered from 1)

#### Understanding `fr`, `repeat()`, `minmax()`, and `auto-fit`

```css
/* fr = fraction of remaining space */
grid-template-columns: 1fr 2fr;        /* 2nd column is twice as wide */

/* repeat() = shorthand for repeating tracks */
grid-template-columns: repeat(3, 1fr);  /* same as: 1fr 1fr 1fr */

/* minmax() = set minimum and maximum size */
grid-template-columns: repeat(3, minmax(150px, 1fr));
/* Each column is at least 150px, but can grow */

/* auto-fit = automatically create as many columns as fit */
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
/* Creates columns that are at least 250px wide.
   If there's room for 3 → 3 columns.
   If there's room for 2 → 2 columns.
   If there's room for 1 → 1 column.
   NO media query needed! */
```

> **💡 `auto-fit` vs `auto-fill`:** `auto-fit` collapses empty tracks so items stretch. `auto-fill` keeps empty tracks, leaving gaps. For most cases, use `auto-fit`.

#### Key Grid Properties

| Property                  | What It Does                                  | Example Values                                |
|---------------------------|-----------------------------------------------|-----------------------------------------------|
| `display: grid`           | Activates Grid                                 | —                                             |
| `grid-template-columns`   | Defines the columns                            | `1fr 1fr 1fr`, `200px 1fr`, `repeat(3, 1fr)` |
| `grid-template-rows`      | Defines the rows                               | `auto 200px`, `1fr 2fr`                       |
| `gap`                     | Space between grid items                       | `10px`, `20px 15px`                           |
| `grid-column`             | Makes an item span columns (on the item)       | `span 2`, `1 / 3`                             |

> **💡 What is `fr`?** The `fr` unit means "fraction of available space." `1fr 2fr` means the second column gets twice the space of the first.

### Flexbox vs. Grid — When to Use Which?

| Use Case                                       | Best Tool     |
|-------------------------------------------------|---------------|
| Navigation bar (items in a row)                 | **Flexbox**   |
| Centering a single item                        | **Flexbox**   |
| Card gallery (rows AND columns)                | **Grid**      |
| Full page layout (header, sidebar, main, footer)| **Grid**      |
| Items flowing in one direction                  | **Flexbox**   |
| Precise two-dimensional placement              | **Grid**      |

> **Tip:** You can use BOTH together! Grid for the overall page layout, Flexbox for smaller components inside.

### Responsive Web Design (RWD)

Responsive design means your website looks good on **any screen size** — from phones to large monitors.

#### 1. The Viewport Meta Tag

This tag **must** be in every HTML file's `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without it, mobile browsers try to zoom out and show the whole desktop page — resulting in tiny, unreadable text.

#### 2. Media Queries

Media queries let you apply CSS **only when certain conditions are met**, usually based on screen width.

```css
/* Default styles (mobile-first) */
.container {
    display: flex;
    flex-direction: column;
}

/* When screen is 768px or wider (tablet/desktop) */
@media (min-width: 768px) {
    .container {
        flex-direction: row;
    }
}
```

**Common breakpoints:**

| Device      | Breakpoint       |
|-------------|------------------|
| Phone       | up to `480px`    |
| Tablet      | `481px – 768px`  |
| Desktop     | `769px` and up   |

#### 3. Mobile-First Approach ⭐

Write your default CSS for **small screens first**, then add `@media (min-width: ...)` rules to enhance the layout for larger screens. This is the industry standard.

## Activities

1. **Flexbox Practice** — Use `exercises/layouts.html` and `exercises/layouts.css` to create a flex container and experiment with `flex-direction`, `justify-content`, and `align-items`.
2. **Grid Practice** — Create a grid container with `grid-template-columns` and `gap`, then place items within it.
3. **Responsive Layout** — Add a media query to change the layout from multi-column to single-column below `768px`.
4. **DevTools Testing** — Open the browser's responsive design mode (F12 → toggle device toolbar) to test your layouts at different screen sizes.

## Post-Session Assignment

- Apply Flexbox and Grid to your personal portfolio project.
- Create a responsive navigation bar and content layout.
- Add media queries for mobile devices.
- See `assignments/assignment_brief.md` for full details.

## Resources & Links

- **Reading:**
  - [CSS-Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
  - [CSS-Tricks: A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/a-guide-to-css-grid/)
  - [MDN Web Docs: Responsive design](https://developer.mozilla.org/en-US/docs/Web/Guide/Responsive)
- **Videos:**
  - [Flexbox Crash Course](https://www.youtube.com/watch?v=JJSoRMw6A00)
  - [CSS Grid Crash Course](https://www.youtube.com/watch?v=jV8o1CS_Q6M)
  - [Responsive Web Design Tutorial](https://www.youtube.com/watch?v=i_yLp_d_XhY)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

## Tips

- Flexbox and Grid are powerful; practice them extensively.
- Always test your responsive designs on various screen sizes using DevTools.
- Start with **mobile-first** design: style for small screens first, then add media queries for larger screens.
- Use `fr` units instead of percentages for Grid columns — they're more flexible.
- Right-click any element → "Inspect" to see how Flexbox and Grid affect layout in DevTools.
- Experiment! Change values and resize the browser — that's the fastest way to learn layouts.
