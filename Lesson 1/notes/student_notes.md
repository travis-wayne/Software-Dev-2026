# Welcome to Lesson 1 Student Notes

## Welcome to Software Engineering
Welcome to the start of a transformative journey. Being a software engineer is widely misunderstood. Pop culture often portrays coders typing furiously in dark rooms, hacking into mainframes, or memorizing infinite lines of arcane syntax. 

In reality, **software engineering is about solving systemic problems**. 
A coder translates instructions into syntax. An engineer asks: 
- "Is this accessible to everyone?" 
- "Will this break if a million people click it at once?" 
- "Is this architecture maintainable for the next person who reads my code?" 

You are not here to memorize syntax. You are here to learn how to think, architect, and solve problems.

## Section 1: Career Paths & The Technology Landscape
The software development landscape is vast, but generally breaks down into these core domains:

1. **Frontend Development:**
   - **Focus:** The user interface (UI) and user experience (UX). Everything the user sees and interacts with.
   - **Tools:** HTML, CSS, JavaScript, React, Next.js.
2. **Backend Development:**
   - **Focus:** The "engine" under the hood. Business logic, databases, authentication, and APIs.
   - **Tools:** Node.js, Python, PostgreSQL, server architecture.
3. **DevOps & Cloud Engineering:**
   - **Focus:** Deployment, scaling, server health, and automation.
   - **Tools:** Docker, Kubernetes, AWS, Vercel, CI/CD pipelines.
4. **Full-Stack Development:**
   - **Focus:** A generalist who can work across all of the above domains. This curriculum aims to make you a capable Full-Stack Engineer.

Over the next 4 months, this curriculum will guide you through all these domains, starting today with the foundational bedrock of the web: HTML.

## Section 2: The Command Line Interface (CLI) — Your Superpower
Before we write code, we must understand our environment.
Most users navigate their computers using a GUI (Graphical User Interface) by clicking folders and icons with a mouse. 
Engineers use the **CLI (Command Line Interface)**.

**Why use the terminal?**
- **Speed:** Typing a command is often 10x faster than clicking through 5 nested folders.
- **Automation:** You can write a script to create 100 folders instantly. Try doing that with a mouse!
- **Cloud Servers:** When you deploy a backend server on AWS or Linux, there is no mouse or GUI. You *must* use the command line to control the server.

### Core Navigation Commands
Open your terminal (PowerShell on Windows, Terminal on Mac/Linux) and memorize these:

- `pwd` (Print Working Directory): Tells you exactly what folder you are currently in. (On Windows PowerShell, `Get-Location` or `pwd` works).
- `ls` (List): Shows all files and folders in your current directory. (On Windows CMD, it's `dir`, but PowerShell supports `ls`).
- `cd <folder-name>` (Change Directory): Moves you *into* the specified folder.
- `cd ..`: Moves you *up* one folder level.
- `cd ~`: Instantly teleports you to your home directory.
- `mkdir <folder-name>`: Makes a new directory.
- `touch <file-name>`: Creates a new, empty file. (On Windows PowerShell, use `New-Item <file-name>`).

**Visualizing the File Tree:**
Imagine your computer as a giant tree. The root is the hard drive (e.g., `C:\` or `/`), and every folder is a branch. The CLI allows you to climb these branches instantly.

## Section 3: Setting Up Visual Studio Code (IDE Mastery)
Visual Studio Code (VS Code) is your IDE (Integrated Development Environment). It is where you will spend 90% of your time.

### Ergonomics of VS Code
- **Explorer Sidebar:** On the left, shows your project files. Keep it organized.
- **Editor Tabs:** The main coding area. 
- **Integrated Terminal:** Press `` Ctrl + ` `` (or `` Cmd + ` `` on Mac) to open a terminal directly inside VS Code. You never need to leave the editor!

### Must-Have Extensions for Web Developers
Install these immediately from the Extensions marketplace on the left toolbar:
1. **Prettier - Code formatter:** Automatically formats your code to make it neat and readable on save.
2. **Live Server:** Launches a local development server with a live reload feature. When you save an HTML file, the browser refreshes instantly!
3. **Auto Rename Tag:** When you change the opening `<p>` tag to an `<h1>`, it automatically changes the closing tag.
4. **Error Lens:** Highlights errors and syntax mistakes directly on the line where they occur.

### Keybindings That Save Hours
- `Alt + Up/Down Arrow`: Move the current line of code up or down.
- `Ctrl + D`: Highlights the current word. Press it again to highlight the *next* occurrence of that word (multi-cursor editing!).
- `Ctrl + /`: Toggles the current line into a comment (code the browser ignores).

## Section 4: HTML5 — The Skeleton of the Web
**HTML (HyperText Markup Language)** is not a programming language; it is a *markup* language. It tells the browser how to structure content.

Every HTML5 document requires a strict boilerplate. Memorize the purpose of every line:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Webpage</title>
  </head>
  <body>
    <!-- Visible content goes here -->
  </body>
</html>
```

**What does it all mean?**
- `<!DOCTYPE html>`: Tells the browser, "Hey, render this using the modern HTML5 standard, don't use old quirks!"
- `<html>`: The root container for everything.
- `<head>`: The invisible brain of the page. It contains metadata, the page title (shown in the browser tab), and links to CSS files. Search engines (Google) rely heavily on `<head>` data for SEO.
- `<body>`: The visual UI. Everything the user sees on the screen goes in here.

## Section 5: Essential HTML Tags & Anatomy of an Element

### Tag Anatomy
Most HTML elements have an opening tag, content, and a closing tag (with a forward slash):
`<tagname attribute="value">Content</tagname>`

Some tags are "void" or "self-closing", meaning they have no content inside them:
`<img src="photo.jpg" />` or `<br />` (line break).

### Core Text Elements
- Headings: `<h1>` to `<h6>`. 
  - **CRITICAL RULE:** You should only ever have ONE `<h1>` tag per page! It represents the main topic of the page.
- Paragraphs: `<p>`
- Emphasized text: `<em>` (italicizes, implies vocal stress).
- Strong importance: `<strong>` (bold, implies importance).

### Links & Navigation
The anchor tag `<a>` is what makes the web a "web":
`<a href="https://google.com" target="_blank">Click here</a>`
- `href`: Hypertext Reference (where the link goes).
- `target="_blank"`: Opens the link in a new tab.

### Images & Accessibility
`<img src="profile.jpg" alt="A photo of me smiling at a computer" />`
- `src`: The source file path.
- `alt`: Alternative text. **This is mandatory!** If a visually impaired user relies on a screen reader, it will read the `alt` text aloud. If the image fails to load on a slow connection, the `alt` text displays instead. Leaving out `alt` text is considered unprofessional engineering.

### Lists
- **Unordered List (Bullet points):** 
  ```html
  <ul>
    <li>Apples</li>
    <li>Bananas</li>
  </ul>
  ```
- **Ordered List (Numbered):**
  ```html
  <ol>
    <li>First step</li>
    <li>Second step</li>
  </ol>
  ```

## Section 6: Semantic HTML vs. Generic Markup ("Div Soup")
A `<div>` is a generic container. It means nothing. It's just a box.
Years ago, developers built entire websites using ONLY `<div>` tags (referred to as "Div Soup").

```html
<!-- BAD: Div Soup -->
<div class="header">
  <div class="logo">My Site</div>
</div>
<div class="content">...</div>
<div class="footer">Copyright</div>
```

**Why is this bad?**
1. Screen readers don't know what a `<div>` is. They can't quickly navigate the user to the "footer".
2. Search engine crawlers (Googlebots) can't easily distinguish the main article from the sidebar ads.

**The Solution: Semantic HTML5 Containers**
Semantic tags have built-in meaning:
- `<header>`: The introductory content or navigation links at the top.
- `<nav>`: A section containing navigation links.
- `<main>`: The dominant content of the `<body>`.
- `<article>`: A self-contained composition (like a blog post or news story).
- `<section>`: A thematic grouping of content.
- `<aside>`: Content indirectly related to the main content (a sidebar).
- `<footer>`: The bottom of a section or document.

```html
<!-- GOOD: Semantic HTML5 -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

## Section 4b: The Big Picture — HTML, CSS & JavaScript Working Together (The House Analogy)
- HTML = The bricks, walls, framing, and roof structure (skeleton). Without this, nothing stands.
- CSS = Interior design, paint colors, furniture, window dressings (style). Makes it look beautiful.
- JavaScript = Electrical wiring, plumbing, smart home automation, elevator (logic and interactivity).
- Key rule: You build the walls BEFORE you paint them. You cannot style (CSS) or animate (JS) something that doesn't exist in HTML yet!

```text
=======================
|     JAVASCRIPT      | (Interactivity / Logic)
=======================
|        CSS          | (Styling / Design)
=======================
|        HTML         | (Structure / Skeleton)
=======================
```

## Section 5b: Block vs. Inline Elements — Understanding the Flow
- Block elements: start on a new line, stretch full width by default → `<h1>`, `<p>`, `<div>`, `<ul>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Inline elements: flow within text, only as wide as their content → `<a>`, `<span>`, `<strong>`, `<em>`, `<img>`

**Visual Flow Comparison:**
```text
Block Elements:
[================= <p> =================]
[================ <div> ================]

Inline Elements:
[ <span> ][ <a> ][ <strong> ]
```
Common beginner confusion: Why can't I put a `<p>` inside an `<a>`? → Block inside inline is invalid HTML5!

## Section 5c: Introduction to HTML Forms — Capturing User Input
Forms are the primary way users send data to a server (login, signup, search, contact).

Essential form elements:
```html
<form action="/submit" method="POST">
  <label for="name">Your Name:</label>
  <input type="text" id="name" name="name" placeholder="Enter your name" required />
  
  <label for="email">Email Address:</label>
  <input type="email" id="email" name="email" required />
  
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>
  
  <button type="submit">Send Message</button>
</form>
```
- `action`: Where the data goes.
- `method`: How it's sent (GET vs POST).
- `name`: How form data gets labeled for the server.
- `required`: Prevents submission if empty.
- `placeholder`: Hint text in the input.

Where does this data GO when you hit Submit? Into a database like PostgreSQL — that is exactly what Month 3 covers! For now, just know that forms are the front door of every web application.

## Section 7: Common Beginner Mistakes & How to Avoid Them

| Mistake | Consequence | How to Fix |
|---------|-------------|------------|
| **Forgetting to close tags** | The browser tries to guess where the tag ends, often breaking your entire layout. | Use VS Code extensions like *Auto Rename Tag* and format your code regularly. |
| **Spaces in filenames** (`my page.html`) | Breaks links when deployed to Linux servers; URLs look ugly (`my%20page.html`). | ALWAYS use lowercase, hyphen-separated names: `my-first-page.html`. |
| **Missing `alt` attributes on images** | Fails accessibility audits; screen readers read the raw filename to blind users. | Always include `alt="Descriptive text"`. |
| **Multiple `<h1>` tags** | Confuses search engines and disrupts the logical document outline. | Use one `<h1>` per page, then `<h2>`, `<h3>`, etc. |
| **Working directly on the Desktop** | Creates a chaotic workspace; hard to link files relatively. | Create a dedicated `workspace/project-name` folder structure and open that *entire folder* in VS Code. |
| **Using `<b>` instead of `<strong>`** | `<b>` is purely visual; `<strong>` has semantic meaning (screen readers emphasize it). | Always prefer `<strong>` for important text. |
| **Nesting block inside inline** (`<a><p>text</p></a>`) | Invalid HTML5; browser renders it unpredictably. | Never put block elements inside inline elements. |
| **Skipping heading levels** (e.g., `<h1>` to `<h4>`) | Confuses screen readers and breaks document outline. | Always use semantic heading hierarchy (`<h1>` -> `<h2>` -> `<h3>`). |
| **Not linking CSS/JS correctly** | Your styles or logic won't load, leaving a plain or broken page. | Double check file paths in `<link>` and `<script>` tags. |
| **Using IDs multiple times on one page** | Breaks JS targeting and accessibility links. | Use `class` for multiple elements, `id` MUST be unique per page. |

Welcome to the world of software engineering! Let's get building.
