# Assignment – Lesson 6: Restyle Your Portfolio with Tailwind CSS

## Objective

Integrate Tailwind CSS into your personal portfolio project and restyle the entire site using Tailwind utility classes. Your portfolio should look polished and be fully responsive across mobile, tablet, and desktop screens.

## Requirements

### Setup:

- [ ] Open your `personal-portfolio/` project from previous lessons.
- [ ] Add the Tailwind CSS CDN script to your portfolio HTML's `<head>`:
  ```html
  <script src="https://cdn.tailwindcss.com"></script>
  ```
- [ ] Keep your existing `portfolio.css` file as a backup, but start replacing custom styles with Tailwind classes.

### Navigation Bar (Tailwind Flexbox):

- [ ] Restyle your `<nav>` using Tailwind's Flexbox classes.
- [ ] Use `flex justify-between items-center` to position your logo/name and links.
- [ ] Add a dark background: `bg-slate-800 text-white p-4`.
- [ ] Make it responsive: `flex flex-col md:flex-row` so links stack on mobile.
- [ ] Add hover effects to nav links: `hover:text-blue-300 transition duration-200`.

### Hero / About Section:

- [ ] Style your hero/about section with appropriate spacing: `py-16 px-4` or similar.
- [ ] Use typography classes: `text-3xl md:text-5xl font-bold` for headings.
- [ ] Centre content if appropriate: `text-center` or `flex justify-center`.
- [ ] Add a background colour or gradient: `bg-gradient-to-r from-blue-500 to-purple-600 text-white`.

### Projects / Content Section (Tailwind Grid):

- [ ] Display project cards in a responsive grid.
- [ ] Use: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.
- [ ] Style each card with: `bg-white rounded-xl shadow-md p-6`.
- [ ] Add hover effects to cards: `hover:shadow-xl transition duration-300`.
- [ ] Add a coloured accent (e.g., gradient top bar) to each card.

### Footer:

- [ ] Style your footer with: `bg-slate-800 text-gray-400 py-6`.
- [ ] Use Flexbox to arrange footer content: `flex flex-col md:flex-row justify-between items-center`.

### Responsive Design:

- [ ] Ensure your portfolio works on all screen sizes using Tailwind's responsive prefixes.
- [ ] Test with at least these breakpoints:
  - Mobile (default): single column, stacked layout
  - Tablet (`md:`): two columns, side-by-side navigation
  - Desktop (`lg:`): three columns, full layout

### Hover & Interactive Effects:

- [ ] Add hover effects to at least 3 elements (nav links, buttons, cards).
- [ ] Use `transition duration-300` for smooth animations.
- [ ] Style at least one button with: `bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded`.

### Testing Checklist:

- [ ] Open your portfolio in the browser — does it display correctly on desktop?
- [ ] Resize the browser window — does the layout adapt smoothly?
- [ ] Use Chrome DevTools responsive mode (F12 → toggle device toolbar) to test at:
  - Desktop: `1200px` wide
  - Tablet: `768px` wide
  - Phone: `375px` wide
- [ ] Does the navigation stack vertically on mobile?
- [ ] Do cards switch from multi-column to single column on mobile?
- [ ] Do hover effects work on links, buttons, and cards?

## Bonus Challenges ⭐

- Add a gradient background to your hero section using `bg-gradient-to-r from-{colour} to-{colour}`.
- Use `transform hover:scale-105` to create a subtle zoom effect on project cards.
- Add `rounded-full` avatar styling if you have a profile image.
- Explore Tailwind's `ring` utilities for focus states: `focus:ring-2 focus:ring-blue-500`.
- Try dark mode classes: `dark:bg-gray-900 dark:text-white` (requires Tailwind dark mode config).
- Add smooth scroll behaviour: `<html class="scroll-smooth">`.

## Submission

Make sure your portfolio HTML is saved with Tailwind classes applied. Your portfolio should be viewable and fully functional on desktop, tablet, and mobile screen sizes before the next session.

> **Tip:** You don't need to remove your `portfolio.css` file. You can keep it as a reference for the traditional CSS approach. Just make sure Tailwind classes are doing the actual styling.
