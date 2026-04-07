# Tutor Notes – Lesson 4: CSS Basics, Box Model, Selectors

## Learning Objectives

By the end of this session, the student will be able to:

- Understand the purpose of CSS and how it styles HTML elements.
- Apply CSS using inline, internal, and external stylesheets.
- Explain and apply the CSS Box Model (content, padding, border, margin).
- Use various CSS selectors (element, class, ID, attribute, pseudo-class) to target specific HTML elements.

## Materials Needed

- Computer with internet access
- VS Code
- Web browser (Chrome or Firefox)
- Browser Developer Tools (Chrome DevTools)

## Preparation Checklist

- [ ] Review the different methods of applying CSS and their use cases.
- [ ] Prepare visual aids or diagrams to explain the Box Model clearly.
- [ ] Have examples ready to demonstrate various CSS selectors and their effects.
- [ ] Open the exercise files in `exercises/` folder to walk through.
- [ ] Have the Box Model demo (`examples/box_model_demo.html`) ready to show.

## Session Outline

### Part 1: Introduction to CSS (≈10 min)

1. **What is CSS?**
   - CSS = Cascading Style Sheets.
   - Emphasize the separation of concerns: HTML for structure, CSS for presentation.
   - Show a plain HTML page vs. the same page with CSS applied.

2. **CSS Syntax**
   - Explain the basic syntax: `selector { property: value; }`
   - Show a few simple examples (changing text color, background, font size).

### Part 2: Ways to Include CSS (≈15 min)

3. **Three Methods**
   - **Inline CSS:** Using the `style` attribute directly on an element.
     - Quick but not reusable. Good for one-off overrides.
   - **Internal CSS:** Using `<style>` in the `<head>`.
     - Good for single-page styles, but doesn't scale.
   - **External CSS:** Linking a `.css` file with `<link>`.
     - Best practice for real projects. Keeps styles separate.

4. **Activity: Try All Three**
   - Have the student open `exercises/styles.html`.
   - Practice adding inline, internal, and external styles to different elements.
   - Discuss when each method is appropriate.

### Part 3: The CSS Box Model (≈15 min)

5. **The Box Model Explained**
   - Every HTML element is a rectangular box.
   - Walk through the four layers: **Content → Padding → Border → Margin**.
   - Open `examples/box_model_demo.html` in the browser.
   - Use Chrome DevTools to inspect elements and show the Box Model diagram.

6. **Activity: Box Model in Practice**
   - Have the student apply `padding`, `border`, and `margin` to a `<div>` in `exercises/style.css`.
   - Use DevTools to inspect and adjust values in real time.
   - Discuss `box-sizing: border-box` vs the default `content-box`.

### Part 4: CSS Selectors (≈15 min)

7. **Selector Types**
   - **Type selector:** `p { }` — targets all `<p>` elements.
   - **Class selector:** `.my-class { }` — targets elements with `class="my-class"`.
   - **ID selector:** `#my-id { }` — targets the element with `id="my-id"`.
   - **Universal selector:** `* { }` — targets everything.
   - **Attribute selector:** `input[type="text"] { }` — targets by attribute.
   - **Pseudo-class selectors:** `a:hover { }`, `input:focus { }` — targets states.

8. **Specificity**
   - Explain the specificity hierarchy: Inline > ID > Class > Type.
   - Show a quick example where two conflicting rules apply to the same element.

9. **Activity: Selector Practice**
   - Have the student use different selectors to style elements on `exercises/styles.html`.
   - Challenge: style only certain links, only certain paragraphs, etc.

### Part 5: Wrap-Up (≈5 min)

10. **Recap & Assignment**
    - Review the key takeaways: CSS syntax, Box Model, selectors, specificity.
    - Introduce the post-session assignment: style their personal portfolio.
    - Encourage the student to experiment and inspect elements in DevTools.

## Tips for Tutor

- Emphasize the separation of concerns (HTML for structure, CSS for style).
- Start with simple styling and gradually introduce more complex concepts.
- Use the browser's developer tools extensively — it's the fastest way to learn CSS.
- Explain CSS specificity early to prevent confusion with conflicting styles.
- Encourage the student to experiment: change values and see what happens.
- If time allows, briefly preview that responsive design and layouts come next.
