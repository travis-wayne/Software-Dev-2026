# Student Notes – Lesson 6: CSS Frameworks (Tailwind CSS) & Portfolio Styling

## Topics Covered

1. Introduction to CSS frameworks and why they are used.
2. Getting started with Tailwind CSS: installation and basic usage.
3. Styling HTML elements using Tailwind's utility classes.
4. Making your portfolio responsive with Tailwind CSS.

## Key Concepts

### Why CSS Frameworks?

In Lessons 4 and 5 you learned to write CSS from scratch — the Box Model, Flexbox, Grid, and media queries. This works, but it's **repetitive**: every project needs padding, colours, spacing, responsive rules, etc. CSS frameworks give you **pre-built classes** so you can style faster and more consistently.

### Traditional CSS vs. Utility-First CSS

```
Traditional CSS Approach:
┌─────────────────────────────────────────────────┐
│  HTML                                           │
│  <div class="hero-section">...</div>            │
│                                                 │
│  CSS (separate file)                            │
│  .hero-section {                                │
│      padding: 2rem;                             │
│      background-color: #1e293b;                 │
│      color: white;                              │
│      display: flex;                             │
│      justify-content: center;                   │
│  }                                              │
└─────────────────────────────────────────────────┘

Utility-First CSS Approach (Tailwind):
┌─────────────────────────────────────────────────┐
│  HTML (no separate CSS needed!)                 │
│  <div class="p-8 bg-slate-800 text-white        │
│              flex justify-center">              │
│      ...                                        │
│  </div>                                         │
└─────────────────────────────────────────────────┘
```

> **💡 Key Insight:** With Tailwind, you style elements by adding small, descriptive classes directly in your HTML — no switching between files.

### "But Won't This Clutter My HTML?" — Common Concerns

This is the **#1 question** every student asks when they first see Tailwind. Here's the honest answer:

| Concern | Reality |
|---------|---------|
| "The HTML looks messy with so many classes" | It does look different, but you can **read** what every element does just by looking at the HTML — no jumping to a CSS file. |
| "I'll have to memorise thousands of classes" | No! You look them up. The Tailwind docs search is your main tool. After a week, the common ones (`p-4`, `flex`, `text-lg`) become second nature. |
| "Isn't this the same as inline styles?" | No — Tailwind gives you **responsive prefixes** (`md:`, `lg:`), **hover/focus states** (`hover:`), and a **consistent design system** (spacing scale, colour palette). Inline styles can't do any of that. |
| "What if I repeat the same classes on 10 elements?" | For now, that's fine. Later you'll learn to extract components (JS frameworks) or use `@apply` (see below). |
| "Will I forget how to write real CSS?" | No! Tailwind **is** CSS — every class maps to a real CSS property. You're learning CSS faster because you see the results instantly. |

> **💡 Think of it this way:** Traditional CSS = writing full sentences. Tailwind = using abbreviations. Both express the same thing, one is just faster to type and easier to scan.

### Setting Up Tailwind CSS

For learning and prototyping, use the **CDN method** — just add one line to your `<head>`:

```html
<script src="https://cdn.tailwindcss.com"></script>
```

That's it! All Tailwind utility classes are now available.

> **Note:** For production projects, you'd install Tailwind via npm and use a build tool. The CDN is perfect for learning.

### Core Utility Classes

#### Spacing — Padding & Margin

Tailwind uses a numeric scale where each unit = `0.25rem` (4px):

| Class   | CSS Equivalent     | Pixels |
|---------|--------------------|--------|
| `p-0`   | `padding: 0`       | 0px    |
| `p-1`   | `padding: 0.25rem` | 4px    |
| `p-2`   | `padding: 0.5rem`  | 8px    |
| `p-4`   | `padding: 1rem`    | 16px   |
| `p-6`   | `padding: 1.5rem`  | 24px   |
| `p-8`   | `padding: 2rem`    | 32px   |

Same scale for margin (`m-0`, `m-1`, `m-2`, etc.).

**Directional variants:**

```
                    pt- (padding-top)
                         ↑
              ┌──────────────────────┐
  pl-  ←     │                      │     → pr-
(padding-    │      Element         │   (padding-
   left)     │                      │     right)
              └──────────────────────┘
                         ↓
                    pb- (padding-bottom)

Shorthand:
• px- = left + right (horizontal)
• py- = top + bottom (vertical)
```

**Example:**
```html
<div class="p-4 mx-auto mt-8">
    <!-- padding: 1rem all sides, horizontal margin: auto, top margin: 2rem -->
</div>
```

#### Typography

| Class           | What It Does                  | CSS Equivalent              |
|-----------------|-------------------------------|-----------------------------|
| `text-sm`       | Small text                    | `font-size: 0.875rem`       |
| `text-base`     | Normal text                   | `font-size: 1rem`           |
| `text-lg`       | Large text                    | `font-size: 1.125rem`       |
| `text-xl`       | Extra large                   | `font-size: 1.25rem`        |
| `text-2xl`      | 2× extra large                | `font-size: 1.5rem`         |
| `text-3xl`      | 3× extra large                | `font-size: 1.875rem`       |
| `font-bold`     | Bold                          | `font-weight: 700`          |
| `font-semibold` | Semi-bold                     | `font-weight: 600`          |
| `text-center`   | Centre text                   | `text-align: center`        |

#### Colours

Tailwind provides a full colour palette with shades from `50` (lightest) to `950` (darkest):

```
text-blue-50  ░░░░░░░░░░  Very light blue (text colour)
text-blue-100 ░░░░░░░░░░
text-blue-200 ▒▒▒▒▒▒▒▒▒▒
text-blue-300 ▒▒▒▒▒▒▒▒▒▒
text-blue-400 ▓▓▓▓▓▓▓▓▓▓
text-blue-500 ██████████  Medium blue (default)
text-blue-600 ██████████
text-blue-700 ██████████
text-blue-800 ██████████
text-blue-900 ██████████  Very dark blue
text-blue-950 ██████████  Darkest blue

bg-blue-500   → background-color (same scale)
```

Available colour families: `slate`, `gray`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`.

Plus: `white`, `black`, `transparent`.

#### Borders, Shadows & Rounded Corners

These decorative utilities make elements look polished and professional:

| Class | What It Does | CSS Equivalent |
|-------|-------------|----------------|
| `border` | Adds a 1px border | `border-width: 1px` |
| `border-2` | 2px border | `border-width: 2px` |
| `border-gray-300` | Sets border colour | `border-color: #d1d5db` |
| `rounded` | Slightly rounded corners | `border-radius: 0.25rem` |
| `rounded-lg` | More rounded | `border-radius: 0.5rem` |
| `rounded-xl` | Even more rounded | `border-radius: 0.75rem` |
| `rounded-full` | Fully circular | `border-radius: 9999px` |
| `shadow` | Small shadow | `box-shadow: 0 1px 3px ...` |
| `shadow-md` | Medium shadow | `box-shadow: 0 4px 6px ...` |
| `shadow-lg` | Large shadow | `box-shadow: 0 10px 15px ...` |
| `shadow-xl` | Extra large shadow | `box-shadow: 0 20px 25px ...` |

**Example — A card with border, shadow, and rounded corners:**
```html
<div class="bg-white border border-gray-200 rounded-xl shadow-md p-6">
    <h3 class="text-xl font-bold">My Card</h3>
    <p class="text-gray-600">Card content here.</p>
</div>
```

#### Gradients

Gradients make backgrounds look modern and eye-catching:

```html
<!-- Left-to-right gradient -->
<div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8">
    Gradient background!
</div>

<!-- Top-to-bottom gradient -->
<div class="bg-gradient-to-b from-green-400 to-blue-500 text-white p-8">
    Vertical gradient!
</div>
```

| Class | Direction |
|-------|----------|
| `bg-gradient-to-r` | Left → Right |
| `bg-gradient-to-l` | Right → Left |
| `bg-gradient-to-t` | Bottom → Top |
| `bg-gradient-to-b` | Top → Bottom |
| `bg-gradient-to-br` | Top-left → Bottom-right |
| `from-{colour}` | Starting colour |
| `to-{colour}` | Ending colour |
| `via-{colour}` | Middle colour (optional) |

#### Layout: Flexbox & Grid

Everything you learned about Flexbox and Grid in Lesson 5 has a Tailwind class:

| CSS Property                          | Tailwind Class   |
|---------------------------------------|------------------|
| `display: flex`                       | `flex`           |
| `flex-direction: column`              | `flex-col`       |
| `flex-direction: row`                 | `flex-row`       |
| `justify-content: center`            | `justify-center` |
| `justify-content: space-between`     | `justify-between`|
| `align-items: center`                | `items-center`   |
| `flex-wrap: wrap`                     | `flex-wrap`      |
| `gap: 1rem`                          | `gap-4`          |
| `display: grid`                       | `grid`           |
| `grid-template-columns: repeat(3,1fr)`| `grid-cols-3`   |
| `grid-template-columns: repeat(2,1fr)`| `grid-cols-2`   |

**Width & Height:**

| Class        | CSS Equivalent         |
|--------------|------------------------|
| `w-full`     | `width: 100%`          |
| `w-1/2`      | `width: 50%`           |
| `w-1/3`      | `width: 33.333%`       |
| `h-screen`   | `height: 100vh`        |
| `h-64`       | `height: 16rem`        |
| `min-h-screen`| `min-height: 100vh`   |

### Responsive Design with Tailwind

Tailwind uses a **mobile-first** approach — the same principle from Lesson 5!

```
How Responsive Prefixes Work:

Mobile (default)    Tablet (md:)        Desktop (lg:)
┌──────────┐        ┌──────────┐        ┌──────────────────┐
│ ┌──────┐ │        │ ┌──┐┌──┐ │        │ ┌──┐ ┌──┐ ┌──┐  │
│ │ Card │ │        │ │  ││  │ │        │ │  │ │  │ │  │  │
│ └──────┘ │        │ └──┘└──┘ │        │ └──┘ └──┘ └──┘  │
│ ┌──────┐ │        │ ┌──┐┌──┐ │        │                  │
│ │ Card │ │        │ │  ││  │ │        │                  │
│ └──────┘ │        │ └──┘└──┘ │        │                  │
│ ┌──────┐ │        │          │        │                  │
│ │ Card │ │        │          │        │                  │
│ └──────┘ │        │          │        │                  │
└──────────┘        └──────────┘        └──────────────────┘
grid-cols-1          md:grid-cols-2      lg:grid-cols-3
```

#### Breakpoints

| Prefix | Min-width | Typical Device  |
|--------|-----------|-----------------|
| (none) | 0px       | All screens     |
| `sm:`  | 640px     | Large phones    |
| `md:`  | 768px     | Tablets         |
| `lg:`  | 1024px    | Laptops         |
| `xl:`  | 1280px    | Desktops        |
| `2xl:` | 1536px    | Large monitors  |

**Example:**
```html
<div class="text-sm md:text-base lg:text-lg">
    <!-- Small text on mobile, normal on tablet, large on desktop -->
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 1 column mobile, 2 columns tablet, 3 columns desktop -->
</div>

<nav class="flex flex-col md:flex-row justify-between items-center">
    <!-- Stacked on mobile, side-by-side on tablet+ -->
</nav>
```

> **💡 Remember:** Unprefixed classes apply to **all** screen sizes. Prefixed classes apply at that breakpoint **and above**. This is the same mobile-first logic as `@media (min-width: ...)` from Lesson 5.

### Hover & State Variants

Add interactive styling with variant prefixes:

```html
<!-- Button with hover effect -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold
               py-2 px-4 rounded transition duration-300">
    Click Me
</button>

<!-- Link with focus ring -->
<a href="#" class="text-blue-600 hover:text-blue-800
                   focus:outline-none focus:ring-2 focus:ring-blue-300">
    Learn More
</a>
```

| Prefix     | When It Applies                    |
|------------|------------------------------------|
| `hover:`   | When the user hovers over element  |
| `focus:`   | When the element has focus         |
| `active:`  | When being clicked/tapped          |

### Step-by-Step: Building a Card from Scratch

Here's how you **think through** styling a card component in Tailwind, one layer at a time:

```
Step 1: Start with a plain div
┌───────────────────────────┐
│ My Project                │    <div>
│ Description text here...  │        <h3>My Project</h3>
│ View Project →            │        <p>Description...</p>
└───────────────────────────┘        <a>View Project →</a>
                                 </div>

Step 2: Add background, padding, and rounded corners
┌───────────────────────────┐
│                           │    <div class="bg-white p-6
│  My Project               │                rounded-xl">
│  Description text here... │
│  View Project →           │
│                           │
└───────────────────────────┘

Step 3: Add a shadow for depth
┌───────────────────────────┐
│                           │    <div class="bg-white p-6
│  My Project               │                rounded-xl
│  Description text here... │                shadow-md">
│  View Project →           │
│                           │
╰───────────────────────────╯  ← shadow underneath

Step 4: Style the text
┌───────────────────────────┐
│                           │    <h3 class="text-xl font-bold
│  My Project       (bold)  │                text-gray-800 mb-2">
│  Description...   (gray)  │    <p class="text-gray-600 mb-4">
│  View Project →   (blue)  │    <a class="text-blue-600
│                           │              font-semibold">
└───────────────────────────┘

Step 5: Add a gradient accent bar
┌───────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│    <div class="bg-gradient-to-r
│                           │         from-blue-500 to-cyan-500
│  My Project               │         h-32"></div>
│  Description text here... │
│  View Project →           │
│                           │
└───────────────────────────┘

Step 6: Add hover effects
                                 <div class="... hover:shadow-xl
                                              transition duration-300">
```

**The final HTML:**

```html
<div class="bg-white rounded-xl shadow-md hover:shadow-xl
            transition duration-300 overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-cyan-500 h-32"></div>
    <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">My Project</h3>
        <p class="text-gray-600 mb-4">Description text here...</p>
        <a href="#" class="text-blue-600 hover:text-blue-800
                           font-semibold transition">View Project →</a>
    </div>
</div>
```

> **💡 Key takeaway:** Build up styles layer by layer. Start with structure (padding, width), then add visual polish (colours, shadows, rounded), then add interactivity (hover, transitions). You don't need to write all the classes at once!

### Extracting Repeated Styles with `@apply` (Preview)

If you find yourself writing the **same long list of classes** on many elements, Tailwind provides `@apply` to extract them into a custom CSS class:

```css
/* In your CSS file */
.btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold
           py-2 px-6 rounded transition duration-300;
}
```

Then in HTML:
```html
<!-- Instead of repeating all those classes every time: -->
<button class="btn-primary">Save</button>
<button class="btn-primary">Submit</button>
```

> **Note:** `@apply` requires the Tailwind CLI build setup (not the CDN). We'll cover this in future sessions. For now, it's fine to repeat classes — that's the Tailwind way!

### Tailwind CSS Cheat Sheet

Here's a quick reference for the most commonly used classes:

```
SPACING          TYPOGRAPHY         COLOURS            LAYOUT
─────────        ──────────         ────────           ──────
p-{0-96}         text-xs            text-{color}-{n}   flex
px-{n} py-{n}    text-sm            bg-{color}-{n}     flex-row
m-{0-96}         text-base          border-{color}     flex-col
mx-{n} my-{n}    text-lg                               justify-{x}
space-x-{n}      text-xl            BORDERS            items-{x}
gap-{n}          text-2xl           border              grid
                 text-3xl           border-2            grid-cols-{n}
SIZING           font-bold          rounded             gap-{n}
──────           font-semibold      rounded-lg
w-full           text-center        rounded-full       EFFECTS
w-1/2            text-left                              shadow
w-1/3            text-right         DISPLAY             shadow-lg
h-screen                            hidden              opacity-{n}
h-{n}                               block               transition
min-h-screen                        inline-block        duration-{n}
```

## Activities

1. **Explore the Demo** — Open `examples/tailwind_demo.html` to see Tailwind in action. Inspect elements in DevTools to see which classes produce which styles.
2. **Spacing & Typography** — Complete exercises 1–2 in `exercises/tailwind_practice.html`.
3. **Colours & Layout** — Complete exercises 3–4 in `exercises/tailwind_practice.html`.
4. **Responsive Design** — Complete exercise 5: make a card grid responsive using `md:` and `lg:` prefixes.
5. **Hover Effects** — Complete exercise 6: create buttons with hover and transition effects.
6. **Portfolio Restyling** — Begin integrating Tailwind into your personal portfolio project.

## Post-Session Assignment

- Integrate Tailwind CSS into your personal portfolio project.
- Restyle your navigation bar, sections, and footer using Tailwind utility classes.
- Make your portfolio fully responsive using Tailwind's responsive prefixes.
- Add hover effects to links and buttons.
- See `assignments/assignment_brief.md` for full details.

## Resources & Links

- **Reading:**
  - [Tailwind CSS: Installation](https://tailwindcss.com/docs/installation)
  - [Tailwind CSS: Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first)
  - [Tailwind CSS: Responsive Design](https://tailwindcss.com/docs/responsive-design)
- **Videos:**
  - [Tailwind CSS Crash Course (Brad Traversy)](https://www.youtube.com/watch?v=d56mG7oAKC8)
  - [Build a Responsive Website with Tailwind CSS](https://www.youtube.com/watch?v=dFj4_g0-3oQ)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Tailwind CSS Official Website](https://tailwindcss.com/)

## Tips

- Don't try to memorise all Tailwind classes — learn to navigate the documentation efficiently.
- Start with basic styling and gradually add more complex designs.
- Use the browser's developer tools to inspect applied Tailwind classes and debug styles.
- Keep the [Tailwind docs](https://tailwindcss.com/docs) open in a browser tab while coding.
- Tailwind's search bar (press `/` on the docs site) is your best friend for finding classes.
- When in doubt, search: "tailwind [css property]" — e.g., "tailwind border radius".
