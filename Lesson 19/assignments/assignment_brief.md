# Assignment Brief — Lesson 19: Intro to React

## Setup

For this assignment, you will build a real React project on your machine using **Vite**.

1. Open your terminal in a workspace folder.
2. Run `npm create vite@latest portfolio-components -- --template react`
3. Go into the folder: `cd portfolio-components`
4. Install dependencies: `npm install`
5. Start the server: `npm run dev`
6. Open the local URL in your browser.

*Note: You will write your code in `src/App.jsx`. You can delete the default Vite code inside `App.jsx` and start fresh.*

---

## Task 1: Reusable Button Component

Build a highly reusable `Button` component.

**Requirements:**
- Create a `Button` function component.
- It must accept the following props: `text`, `color`, `onClick`, and `disabled`.
- The `disabled` prop should default to `false` if not provided.
- Apply different styles based on the `color` prop (e.g., if `color` is "red", the button has a red background).
- Attach the `onClick` prop to the actual `<button>`'s `onClick` attribute.
- Render at least 3 variations of this button in your `App` component to prove it works.

```jsx
// Example usage in App:
<Button text="Submit" color="blue" onClick={() => console.log('clicked')} />
<Button text="Delete" color="red" disabled={true} />
```

---

## Task 2: Project Card Component

Build a `ProjectCard` component designed to show off a portfolio piece.

**Requirements:**
- Accept the following props: `title`, `description`, `techStack` (an array of strings), and `liveUrl`.
- Render the `title` as an `<h3>`.
- Render the `description` as a paragraph.
- Use `.map()` to render the `techStack` array as a list of small badges (or just a comma-separated list if you prefer). Remember the `key` prop!
- Render an `<a>` tag linking to the `liveUrl` that says "View Project".
- Render at least 2 `ProjectCard` components in your `App`.

```jsx
// Example usage in App:
<ProjectCard 
    title="Weather App" 
    description="A responsive app showing current weather using an external API." 
    techStack={['HTML', 'CSS', 'JavaScript']}
    liveUrl="https://example.com/weather"
/>
```

---

## Task 3: The Header Component

Create a simple `Header` component for the page.

**Requirements:**
- Accept a `name` prop and a `profession` prop.
- Render them at the top of the page (e.g., "Travis Wayne — Full Stack Developer").
- Wrap the entire `App` output in a clean layout: Header at the top, followed by the Projects section, followed by the Buttons section.

---

## Task 4: Theory Questions

Add a comment block at the bottom of your `App.jsx` file and answer these questions:

```javascript
/*
THEORY QUESTIONS:

1. Why do we need to use `className` instead of `class` when writing JSX?
Answer: 

2. Can a child component modify a prop passed to it by a parent? Why or why not?
Answer: 

3. What does it mean that React is "declarative" rather than "imperative"?
Answer: 
*/
```

---

## Submission Checklist

- [ ] Vite project created successfully and runs without errors.
- [ ] `Button` component created with all required props (`text`, `color`, `onClick`, `disabled`).
- [ ] `ProjectCard` component created and maps over the `techStack` array correctly.
- [ ] `Header` component created and renders at the top of the app.
- [ ] `App` component correctly imports and renders all child components.
- [ ] Theory questions answered in comments at the bottom of the file.
- [ ] Code pushed to GitHub (make sure you don't push the `node_modules` folder — Git should ignore it automatically if you used Vite).
