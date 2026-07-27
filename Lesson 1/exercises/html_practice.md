# HTML Practice & Exercises

Welcome to your first hands-on lab! These exercises are designed to build your muscle memory for terminal commands and HTML markup.

## Exercise 1: Terminal Workspace Navigation Sprint
**Goal:** Practice folder and file creation without touching your mouse!

1. Open your terminal (or PowerShell).
2. Navigate to your Documents folder: `cd Documents` (or your preferred root directory).
3. Create a master workspace folder: `mkdir software-dev-2026-workspace`
4. Enter the new folder: `cd software-dev-2026-workspace`
5. Create two subfolders inside it: `mkdir projects notes`
6. Go into the projects folder: `cd projects`
7. Create a new file: 
   - Mac/Linux: `touch index.html`
   - Windows (PowerShell): `New-Item index.html`
8. Open the current folder in VS Code: `code .`

## Exercise 2: The Boilerplate Memory Challenge
**Goal:** Build confidence in the foundational HTML structure.

Open the `index.html` file you just created. **Without copy-pasting**, type out the basic HTML5 document structure from memory. 
Ensure you include:
- The DOCTYPE declaration
- The `<html>` tag with the language attribute
- The `<head>` section with charset, viewport, and title
- The `<body>` section with a simple `<h1>` tag inside.

*Tip:* Think about why each tag is necessary as you type it.

## Exercise 3: Semantic Restructuring Lab
**Goal:** Transform "Div Soup" into clean, accessible HTML.

Below is a poorly structured webpage using only `<div>` tags. Refactor it using proper semantic HTML5 containers (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`).

**Poorly Structured HTML (Div Soup):**
```html
<div class="top-banner">
  <div class="logo">My Tech Blog</div>
  <div class="menu">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>
</div>

<div class="content-area">
  <div class="blog-post">
    <h2>Learning HTML</h2>
    <div class="text">Today I learned about semantic tags.</div>
  </div>
  
  <div class="sidebar">
    <h3>About Me</h3>
    <div class="text">I am a student software engineer.</div>
  </div>
</div>

<div class="bottom-bar">
  Copyright 2026
</div>
```

*Challenge:* Rewrite the above HTML snippet using semantic tags.

## Exercise 4: Building Your Professional Developer Bio Page
**Goal:** Create a real webpage showcasing your new skills!

Create a new file called `developer-bio.html` and build a complete webpage featuring:
1. A semantic `<header>` with an `<h1>` containing your name and professional title.
2. A `<main>` section containing:
   - An `<article>` about your background and goals for the Software-Dev-2026 program.
   - An unordered list `<ul>` of technologies you are excited to learn (React, Node.js, PostgreSQL, Docker).
   - An ordered list `<ol>` of your top 3 career goals.
   - A professional profile image (`<img>`) with descriptive `alt` text (you can use a placeholder image URL like `https://via.placeholder.com/150`).
3. A `<footer>` with a clickable email link (`<a href="mailto:your.email@example.com">`) and a link to your GitHub profile.

Make sure your code is properly indented and valid!
