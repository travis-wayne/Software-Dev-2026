# Assignment – Lesson 5: Responsive Layouts for Your Portfolio

## Objective

Apply Flexbox, CSS Grid, and responsive design to your personal portfolio project so it looks great on desktop, tablet, and mobile screens.

## Requirements

### Setup:

- [ ] Open your `personal-portfolio/` project and `portfolio.css` from Lesson 4.
- [ ] Ensure every HTML page has the viewport meta tag in `<head>`:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

### Responsive Navigation Bar (Flexbox):

- [ ] Apply `display: flex` to your `<nav>` to arrange links horizontally.
- [ ] Use `justify-content: space-between` or `space-evenly` to space the links.
- [ ] Add `align-items: center` to vertically center the nav items.
- [ ] Add a media query: below `768px`, change `flex-direction` to `column` so the nav stacks vertically on mobile.

### Main Content Layout (CSS Grid):

- [ ] Use `display: grid` on your main content area or `<main>` element.
- [ ] Create a 2-column layout on desktop (e.g., `grid-template-columns: 1fr 1fr` or `250px 1fr` for sidebar + content).
- [ ] Add `gap` between grid items for clean spacing.
- [ ] Add a media query: below `768px`, change to `grid-template-columns: 1fr` for a single-column layout on mobile.

### Media Queries:

- [ ] Add at least **one** media query in `portfolio.css` to adjust styles for mobile devices.
- [ ] Suggestions for mobile adjustments:
  - Reduce font sizes for headings.
  - Increase padding on sections for tap-friendly spacing.
  - Stack any side-by-side content into a single column.
  - (Optional) Hide non-essential elements on small screens using `display: none`.

### Testing Checklist:

- [ ] Open your portfolio in the browser — does it display correctly on desktop?
- [ ] Resize the browser window to narrow widths — does the layout adapt?
- [ ] Use Chrome DevTools responsive mode (F12 → toggle device toolbar) to test at common sizes:
  - Desktop: `1200px` wide
  - Tablet: `768px` wide
  - Phone: `375px` wide
- [ ] Does the navigation stack vertically on mobile?
- [ ] Does the content switch to a single column on mobile?

## Bonus Challenges ⭐

- Use `flex-wrap: wrap` to create a flexible project card gallery that wraps items to the next row.
- Use `repeat(auto-fit, minmax(250px, 1fr))` for a grid that automatically adjusts the number of columns.
- Add a second breakpoint at `480px` for smaller phones with further size reductions.
- Add smooth transitions to layout changes (e.g., `transition: all 0.3s ease`).
- Style your footer using Flexbox to align items in a row on desktop and stack on mobile.

## Submission

Make sure `portfolio.css` is saved with your Flexbox, Grid, and media query styles applied. Your portfolio should be viewable and usable on both desktop and mobile screen sizes before the next session.
