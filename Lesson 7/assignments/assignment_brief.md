# Assignment – Lesson 7: Version Control Your Portfolio with Git & GitHub

## Objective

Set up your personal portfolio project as a proper Git repository, push it to GitHub, and practise the full Git workflow. By the end of this assignment, your portfolio codebase should be backed up online and version-controlled.

---

## Pre-Session Task (Complete Before the Lesson)

- [ ] Create a **free GitHub account** at [github.com](https://github.com) if you don't have one already.

---

## Assignment Tasks

### Part 1: Initialise Your Portfolio Repository

- [ ] Open your terminal (or VS Code's integrated terminal with `` Ctrl+` ``).
- [ ] Navigate to your personal portfolio project directory:
  ```bash
  cd "path/to/Lesson 3/exercises/personal-portfolio"
  ```
- [ ] Verify you're in the right folder by listing the files:
  ```bash
  Get-ChildItem   # PowerShell
  ```
- [ ] Initialise a new Git repository:
  ```bash
  git init
  ```
- [ ] Check the current state:
  ```bash
  git status
  ```
  > All your portfolio files should appear as **untracked** (in red).

---

### Part 2: Create a README.md

- [ ] Create a new file called `README.md` in the root of your portfolio project.
- [ ] Write a brief description of your project in it. It should include at least:
  - A heading with your project name (e.g., `# My Personal Portfolio`)
  - A short paragraph describing what the portfolio is and what it contains.
  - A list of the pages/sections (Home, About, Projects, Contact).
  - Technologies used (HTML, CSS, Tailwind CSS, etc.).

**Example `README.md`:**

```markdown
# My Personal Portfolio

Welcome to my personal portfolio website! This project was built as part of my software development learning journey.

## Pages

- **Home** — Introduction and hero section
- **About** — A little about me and my background
- **Projects** — Showcasing my work and exercises
- **Contact** — Get in touch with me

## Technologies Used

- HTML5
- CSS3
- Tailwind CSS

## How to View

Open `index.html` in any web browser.
```

---

### Part 3: Stage and Commit All Files

- [ ] Stage all files (including your new `README.md`):
  ```bash
  git add .
  ```
- [ ] Verify everything is staged:
  ```bash
  git status
  ```
  All files should be **green** under "Changes to be committed".

- [ ] Make your first commit with a clear, descriptive message:
  ```bash
  git commit -m "Initial commit - Add portfolio structure and styling"
  ```

- [ ] Verify the commit was created:
  ```bash
  git log --oneline
  ```
  You should see your commit listed.

---

### Part 4: Push to GitHub

- [ ] Log in to [github.com](https://github.com).
- [ ] Create a **new repository**:
  - Click **`+`** (top right) → **New repository**
  - Name: `personal-portfolio`
  - Visibility: **Public**
  - **Do NOT** tick any initialisation options (no README, no .gitignore)
  - Click **Create repository**
- [ ] Copy the **HTTPS URL** shown on the page.

- [ ] Link your local repo to GitHub:
  ```bash
  git remote add origin https://github.com/yourusername/personal-portfolio.git
  ```

- [ ] Rename the branch to `main`:
  ```bash
  git branch -M main
  ```

- [ ] Push your first commit:
  ```bash
  git push -u origin main
  ```

- [ ] Go to your GitHub repository page — you should see all your files! ✅

---

### Part 5: Make a Change and Push Again

- [ ] Back in VS Code, open your `README.md` and add a new line at the bottom:
  ```markdown
  ## Status

  Currently in active development. More pages and features coming soon!
  ```
- [ ] Save the file.
- [ ] Check what changed:
  ```bash
  git status
  git diff
  ```
- [ ] Stage, commit, and push the change:
  ```bash
  git add README.md
  git commit -m "Update README with project status section"
  git push
  ```
- [ ] Verify the updated `README.md` appears on your GitHub repository page.

---

### Part 6: Pull a Remote Change

- [ ] On your GitHub repository page, navigate to `README.md`.
- [ ] Click the **pencil icon** to edit it in the browser.
- [ ] Add your GitHub profile link to the README:
  ```markdown
  ## Author

  GitHub: [yourusername](https://github.com/yourusername)
  ```
- [ ] Commit the change using the GitHub web editor.
- [ ] Back in your terminal, pull the change:
  ```bash
  git pull
  ```
- [ ] Open `README.md` locally — your new "Author" section should now be there.
- [ ] View the full history:
  ```bash
  git log --oneline
  ```
  You should now have at least **3 commits** in your history.

---

## Verification Checklist

Before marking this assignment as complete, confirm all of the following:

- [ ] Your portfolio project has a `.git/` folder (visible in Explorer with "Show Hidden Items" enabled).
- [ ] Running `git status` shows `nothing to commit, working tree clean`.
- [ ] Running `git log --oneline` shows at least 3 commits with clear messages.
- [ ] Running `git remote -v` shows your GitHub repository URL.
- [ ] Your GitHub repository page at `github.com/yourusername/personal-portfolio` shows all your portfolio files.
- [ ] The `README.md` is visible on the GitHub repository page and renders correctly.
- [ ] All commit messages are descriptive and follow the format: what the commit does.

---

## Bonus Challenges ⭐

- Add a `.gitignore` file to your portfolio project. Add `*.DS_Store` (macOS system files) and `node_modules/` to it. Commit and push this file.
- Go to your GitHub repository page and explore the **Commits** tab — every commit is listed with its diff.
- Click on a commit hash to see exactly what files changed and what lines were added or removed.
- Run `git log --graph --oneline` to see a visual graph of your commit history in the terminal.
- Try `git show HEAD` to see the full details of your most recent commit.

---

## Submission

Your assignment is complete when:
1. Your personal portfolio repository is live on GitHub at `github.com/yourusername/personal-portfolio`.
2. It contains all your portfolio HTML, CSS, and image files.
3. It has a well-written `README.md`.
4. It has at least 3 commits with meaningful commit messages.

Share your GitHub repository URL with your tutor at the start of the next session.

---

> **💡 Tip:** From this point forward, use Git on every project you build. Make it a habit to commit regularly with clear messages. Professional developers commit multiple times per day — now you're working like a pro! 🚀
