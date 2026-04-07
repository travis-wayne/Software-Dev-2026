# Tutor Notes – Lesson 7: Git Basics (Add, Commit, Push, Pull)

## Learning Objectives

By the end of this session, the student will be able to:

- Understand the concept of version control and its importance in software development.
- Initialise a Git repository and track changes to files.
- Use core Git commands: `git init`, `git status`, `git add`, `git commit`, and `git log`.
- Connect a local repository to a remote repository on GitHub.
- Push local changes to GitHub and pull changes from it.

## Materials Needed

- Computer with a stable internet connection
- Visual Studio Code (VS Code)
- A terminal or command prompt (or VS Code's integrated terminal)
- Git installed (verify with `git --version`)
- A pre-existing GitHub account (student should have set this up as a pre-session task)
- The personal portfolio project from previous sessions

## Preparation Checklist

- [ ] Verify Git is installed on the student's machine: `git --version`
- [ ] Confirm Git is configured with a name and email:
  ```bash
  git config --global user.name "Student Name"
  git config --global user.email "student@example.com"
  ```
- [ ] Have the student's GitHub account ready and logged in.
- [ ] Have the `examples/git_workflow_demo/` folder open in VS Code to demonstrate the workflow.
- [ ] Familiarise yourself with creating a new repository on GitHub and copying the remote URL.
- [ ] Know how to demonstrate the GitHub web editor (for the `git pull` exercise).

---

## Session Outline

### Part 1: Why Version Control? (≈5 min)

1. **The Problem Without Version Control**
   - Ask the student: *"Have you ever saved a file as `final_v2_REALLY_FINAL.html`?"*
   - Explain: this is a common pattern, but it's messy, error-prone, and impossible to collaborate on.
   - Introduce **Version Control**: a system that automatically tracks every change made to a project over time.
   - Benefits: you can revert to any previous state, see who changed what and when, and safely collaborate.

2. **The Video Game Save Point Analogy**
   - Explain Git using a relatable analogy: *"Think of Git like a video game's save system. Every time you make progress, you save. If you take a wrong turn or your character dies, you reload from your last save point."*
   - In Git, each **commit** is a save point. You can return to any commit at any time.
   - Unlike saving a file (which overwrites the old version), Git **keeps every save point forever**.

3. **Git vs. GitHub**
   - A common point of confusion for beginners. Clarify the distinction:
     - **Git** — The version control software that runs locally on your computer. It tracks your files.
     - **GitHub** — A website that stores copies of your Git repositories online (the "cloud" for Git).
   - Analogy: *"Git is the engine; GitHub is the garage where you park and share your car."*

---

### Part 2: Core Concepts & Setting Up (≈10 min)

4. **Key Concepts to Define**

   Walk through each concept before demonstrating:

   | Concept | Plain English |
   |---------|---------------|
   | **Repository (Repo)** | The project folder Git is tracking — all your files + the history |
   | **Staging Area** | A "draft" zone — you decide *which* changes to include in your next save |
   | **Commit** | A saved snapshot. Has a unique ID, a message, and a timestamp |
   | **Remote** | A version of your repo stored online (e.g., on GitHub) |
   | **Push** | Send your local commits up to the remote |
   | **Pull** | Fetch and apply changes from the remote to your local machine |

5. **Visualising the Git Workflow**

   Draw or show this diagram on a whiteboard / screen share:

   ```
   Working Directory     Staging Area       Local Repository     Remote (GitHub)
   ─────────────────     ────────────       ────────────────     ───────────────
       (editing)              │                   (history)
                              │
   git add file     ─────►   ● staged
                              │
                    git commit -m "..."  ─────►  ● commit #1
                                                        │
                                         git push  ─────►  ● on GitHub
                                                        │
                                         git pull  ◄─────  ● changes from GitHub
   ```

6. **Checking Git Installation**
   - Open VS Code's integrated terminal (`Ctrl+``).
   - Run: `git --version`
   - If not installed, guide the student to [git-scm.com/downloads](https://git-scm.com/downloads).
   - Configure globally (do this once per machine):
     ```bash
     git config --global user.name "Your Name"
     git config --global user.email "you@example.com"
     ```

---

### Part 3: Initialising a Repository (≈10 min)

7. **`git init` — Starting a Repository**
   - Open the terminal and navigate to the `examples/git_workflow_demo/` folder:
     ```bash
     cd path/to/Lesson 7/examples/git_workflow_demo
     ```
   - Initialise a new Git repository:
     ```bash
     git init
     ```
   - Show the student that a hidden `.git` folder has been created (View → Show Hidden Items in Explorer).
   - Explain: *"This `.git` folder is the brain of the repo — Git stores all its history and tracking data in here. You never need to touch it directly."*

8. **`git status` — Checking the State**
   - Run: `git status`
   - Show the output: all files appear as **untracked** (shown in red).
   - Explain: *"Git knows about these files, but it's not tracking them yet. It's like having files on your desk that you haven't filed yet."*

---

### Part 4: Staging and Committing (≈15 min)

9. **`git add` — Staging Changes**
   - Stage a single file first to show the concept:
     ```bash
     git add index.html
     ```
   - Run `git status` again — `index.html` is now **staged** (shown in green).
   - Now stage all remaining files:
     ```bash
     git add .
     ```
   - Explain the staging area: *"The staging area is like a shopping basket. You put items in (`git add`), and when you're ready, you go to checkout (`git commit`). You can choose exactly what to include in each commit."*

10. **`git commit -m "..."` — Saving a Snapshot**
    - Make the first commit:
      ```bash
      git commit -m "Initial commit - Add portfolio structure and styling"
      ```
    - Explain what a good commit message looks like:
      - ✅ `"Add hero section and navigation bar"`
      - ✅ `"Fix broken link in contact page"`
      - ❌ `"stuff"` / `"changes"` / `"asdjkfd"`
    - Rule of thumb: *"Describe what the commit does, like you're finishing the sentence 'This commit will...'"*

11. **`git log` — Viewing History**
    - Run: `git log`
    - Show the output: commit hash, author, date, and message.
    - Run the prettier version: `git log --oneline`
    - Explain: this is the full history of all your save points.

---

### Part 5: Connecting to GitHub (≈15 min)

12. **Creating a GitHub Repository**
    - Guide the student to [github.com](https://github.com) → **New repository**.
    - Settings:
      - Repository name: `personal-portfolio`
      - Visibility: **Public**
      - **Do NOT** tick "Add a README" (the local repo already has content).
    - Click **Create repository**.
    - GitHub will display setup instructions — you'll use these next.

13. **`git remote add origin` — Linking Local to Remote**
    - Copy the HTTPS URL from GitHub (e.g., `https://github.com/username/personal-portfolio.git`).
    - Run:
      ```bash
      git remote add origin https://github.com/username/personal-portfolio.git
      ```
    - Explain: *"This tells your local Git where the remote 'garage' is located. We call it `origin` by convention."*
    - Rename the default branch to `main` if needed:
      ```bash
      git branch -M main
      ```
    - Verify:
      ```bash
      git remote -v
      ```

14. **`git push` — Uploading to GitHub**
    - Push the first commit:
      ```bash
      git push -u origin main
      ```
    - The `-u` flag sets `origin main` as the default upstream, so future pushes just need `git push`.
    - Show the student their repository on GitHub — the files are now live!

---

### Part 6: The Pull Workflow (≈5 min)

15. **Making a Change on GitHub**
    - On the GitHub repository page, click on `README.md` → click the pencil icon to edit it.
    - Add a line to the file (e.g., `Updated directly on GitHub.`).
    - Commit the change using the GitHub web interface.
    - Explain: *"This simulates a situation where a teammate has pushed a change, or you've edited a file on another machine. Your local copy is now behind."*

16. **`git pull` — Downloading Changes**
    - Back in the terminal:
      ```bash
      git pull
      ```
    - Show the output — Git fetches and merges the remote change.
    - Open the `README.md` file locally — the new line is now there.
    - Explain: *"`git pull` is something you should always run before starting work, to make sure you have the latest version."*

---

### Part 7: Applying Git to the Portfolio (≈10 min)

17. **Portfolio Git Setup**
    - Now guide the student to do the full workflow on their **own portfolio project**:
      1. Navigate to `Lesson 3/exercises/personal-portfolio/` in the terminal.
      2. Run `git init`.
      3. Run `git add .`.
      4. Run `git commit -m "Initial commit - Add portfolio structure and styling"`.
      5. Create a new GitHub repo named `personal-portfolio`.
      6. Link and push: `git remote add origin <URL>` then `git push -u origin main`.
    - Verify: the student's portfolio files should be visible on GitHub.

---

### Part 8: Wrap-Up (≈5 min)

18. **Recap & Assignment**
    - Recap the Git workflow: **Edit → Stage → Commit → Push**.
    - Recap the purpose of each command.
    - Introduce the post-session assignment: create a `README.md` for the portfolio and push it.

---

## Tips for Tutor

- Use the video game analogy early — it immediately makes commits feel intuitive.
- **Demystify the staging area** — many beginners find it confusing that you have to `add` before `commit`. Explain it as a "drafting" step that gives you fine-grained control.
- **Commit message quality** matters. Spend a moment on this — it's a habit that pays off enormously.
- Use VS Code's **Source Control panel** (the branch icon in the sidebar) to provide a visual representation of staging and committing alongside the terminal commands.
- If the student gets a `rejected` error on push, it's likely a branch name mismatch (`master` vs `main`). Use `git branch -M main` to fix it.
- Emphasise: *"You will use `git add`, `git commit`, and `git push` every single day as a developer. These three commands are as fundamental as saving a Word document."*

---

## Common Mistakes & Troubleshooting

### Setup Mistakes

1. **Git not installed or not in PATH**
   - ❌ `git` is not recognised as a command.
   - ✅ Install Git from [git-scm.com/downloads](https://git-scm.com/downloads) and restart the terminal.

2. **Not configuring user name and email**
   - ❌ Error on first commit: `Author identity unknown`.
   - ✅ Run `git config --global user.name "Name"` and `git config --global user.email "email"`.

### Staging & Committing Mistakes

3. **Committing without staging**
   - ❌ Running `git commit` on files that haven't been `git add`ed — nothing happens.
   - ✅ Always run `git status` first to see what is and isn't staged.

4. **Forgetting the `-m` flag on commit**
   - ❌ `git commit` (without `-m "message"`) opens a text editor (Vim/Nano), which can disorient beginners.
   - ✅ Always use `git commit -m "your message here"`.

5. **Vague commit messages**
   - ❌ `"fix"`, `"changes"`, `"asdf"`
   - ✅ `"Fix broken nav link on mobile"`, `"Add contact form to contact.html"`

### Remote & Push Mistakes

6. **Initialising GitHub repo with a README (causing a conflict on first push)**
   - ❌ Student ticks "Add a README file" on GitHub, then `git push` fails with "rejected - non-fast-forward".
   - ✅ When pushing an existing project, never initialise the GitHub repo with any files. Start completely empty.

7. **Incorrect remote URL**
   - ❌ `git push` fails with "repository not found".
   - ✅ Run `git remote -v` to verify the URL, then fix with `git remote set-url origin <correct-URL>`.

8. **Branch name mismatch (`master` vs `main`)**
   - ❌ `git push origin master` fails because GitHub uses `main` by default.
   - ✅ Run `git branch -M main` to rename the local branch, then `git push -u origin main`.

9. **Authentication errors**
   - ❌ `git push` prompts for username/password but fails (GitHub no longer accepts password auth).
   - ✅ Use a **Personal Access Token** (PAT) instead of a password. Guide the student through Settings → Developer settings → Personal access tokens on GitHub.

### General Mistakes

10. **Running `git init` in the wrong directory**
    - ❌ Student initialises a repo in a parent folder (`Desktop/`) instead of the project folder.
    - ✅ Always check `pwd` (or `$PWD` in PowerShell) before running `git init`.

11. **Not running `git pull` before starting work**
    - This leads to merge conflicts when pushing.
    - ✅ Build the habit: start every work session with `git pull`.
