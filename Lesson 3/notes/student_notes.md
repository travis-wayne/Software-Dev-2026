# Student Notes – Lesson 3: First Project — Personal Portfolio (Structure)

## Topics Covered

1. Project initiation: planning your first website.
2. Structuring a multi-page website with HTML.
3. Creating navigation menus to link pages.
4. Organizing project files and folders.

## Key Concepts

### Project Planning

Before writing any code, you should:
- **Define your pages** — What sections does your portfolio need?
- **Outline content** — What will each page contain?
- **Sketch a wireframe** — Even a rough sketch helps you visualize the layout.

### File & Folder Organization

A well-organized project looks like this:

```
personal-portfolio/
├── index.html          ← Home page (always named index.html)
├── about.html          ← About Me page
├── projects.html       ← Projects / Work page
├── contact.html        ← Contact page
└── images/             ← All images go here
```

> **Tip:** Use lowercase filenames with no spaces. Use hyphens if needed: `my-projects.html`

### Multi-Page Navigation

Every page should have the same navigation bar so users can move between pages:

```html
<nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="projects.html">Projects</a>
    <a href="contact.html">Contact</a>
</nav>
```

### Semantic Structure for Every Page

Each page should follow this pattern:

```html
<header>
    <!-- Site title + navigation -->
</header>

<main>
    <!-- Page-specific content -->
</main>

<footer>
    <!-- Copyright, contact info -->
</footer>
```

## Activities

1. **Brainstorm** — List the sections you want in your portfolio.
2. **Build** — Complete the starter pages in `exercises/personal-portfolio/`.
3. **Link** — Add a `<nav>` bar to every page with links to all other pages.
4. **Test** — Open `index.html` in the browser and click every link.

## Post-Session Assignment

- Complete the basic HTML structure for **all four pages**.
- Every page must have `<header>`, `<main>`, and `<footer>`.
- Add placeholder content (e.g., "This is the About Me page") to each page.
- Verify that all navigation links work correctly.
- See `assignments/assignment_brief.md` for full details.

## Resources & Links

- **Reading:**
  - [MDN: Organizing Your Files](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/Dealing_with_files)
  - [W3Schools: HTML Navigation Bar](https://www.w3schools.com/howto/howto_css_navbar.asp) (focus on HTML structure)
- **Videos:**
  - [How to Structure a Website with HTML](https://www.youtube.com/watch?v=D-w-wB_d9c0)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)

## Tips

- Break down large projects into smaller, manageable tasks.
- Use clear and descriptive file names.
- Always test your links to ensure proper navigation.
- Think about the **meaning** of your content — use the right semantic tags.
