# Tutor Notes – Lesson 3: First Project — Personal Portfolio (Structure)

## Learning Objectives

By the end of this session, the student will be able to:

- Plan the structure of a multi-page personal portfolio website.
- Create the basic HTML file structure for a personal portfolio.
- Link multiple HTML pages together using navigation.
- Apply semantic HTML5 elements to organize portfolio content.

## Materials Needed

- Computer with internet access
- VS Code
- Web browser (Chrome or Firefox)
- Pen and paper or digital wireframing tool (optional)

## Preparation Checklist

- [ ] Have the example wireframe (`examples/wireframe_outline.md`) ready to show.
- [ ] Review best practices for file and folder organization in web projects.
- [ ] Open the starter project in `exercises/personal-portfolio/` to walk through.
- [ ] Be prepared to guide the student through breaking a large project into smaller HTML components.

## Session Outline

### Part 1: Planning Before Coding (≈15 min)

1. **Why Planning Matters**
   - Emphasize: "Plan first, code second."
   - Discuss what a portfolio website needs: Home, About, Projects, Contact.
   - Show the example wireframe in `examples/wireframe_outline.md`.

2. **Activity: Brainstorm**
   - Have the student list out the sections they want in their own portfolio.
   - Sketch a quick wireframe on paper or whiteboard (optional).

### Part 2: File & Folder Organization (≈10 min)

3. **Project Structure**
   - Walk through the `exercises/personal-portfolio/` folder structure.
   - Explain why separating files into folders (HTML, images, styles) matters.
   - Discuss naming conventions: lowercase, no spaces, descriptive names.

### Part 3: Building the Pages (≈25 min)

4. **Home Page (`index.html`)**
   - The starter file has a basic structure. Walk through it together.
   - Explain why the home page is always called `index.html`.
   - Point out the semantic elements: `<header>`, `<nav>`, `<main>`, `<footer>`.

5. **Activity: Build Remaining Pages**
   - Have the student complete `about.html`, `projects.html`, and `contact.html`.
   - Each page should have the same `<header>`, `<nav>`, and `<footer>`.
   - Add placeholder content to each page's `<main>` section.

### Part 4: Navigation & Testing (≈15 min)

6. **Linking Pages**
   - Explain relative paths: `href="about.html"` vs absolute paths.
   - Ensure the `<nav>` links are consistent across all pages.
   - Highlight the current page in navigation (optional stretch goal).

7. **Testing**
   - Open `index.html` in the browser.
   - Click every link to verify navigation works.
   - Check that all pages have proper structure.

8. **Wrap-Up & Assignment**
   - Introduce the post-session assignment: complete all pages with placeholder content.
   - Encourage the student to think about what real content they'll add later.

## Tips for Tutor

- Emphasize the importance of **planning before coding**.
- Guide the student in thinking about what sections a portfolio needs.
- Encourage creating separate HTML files for each major section.
- Stress the importance of **consistent navigation** across all pages.
- Show how the browser's address bar changes when navigating between pages.
- If time allows, briefly preview that CSS (next lesson) will make this look polished.
