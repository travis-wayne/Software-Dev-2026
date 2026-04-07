# Student Notes – Lesson 7: Git Basics (Add, Commit, Push, Pull)

## Topics Covered

1. What version control is and why it matters.
2. Core Git concepts: repositories, staging, commits, and remotes.
3. Setting up Git and configuring it for the first time.
4. The core Git workflow: `init` → `add` → `commit` → `push`.
5. Connecting to a remote repository on GitHub.
6. Pulling changes from a remote repository.

---

## Key Concepts

### The Problem Version Control Solves

Have you ever done this?

```
my_project/
├── index_v1.html
├── index_v2.html
├── index_v2_FINAL.html
├── index_v2_FINAL_use_this_one.html
└── index_FINAL_FINAL_ACTUALLY_FINAL.html  ← 😅
```

This is a common pattern when working without version control — manually saving "backup" copies of files. It's messy, takes up space, and makes collaboration impossible.

**Version Control** is a system that automatically records every change you make to a project, so you can:
- See the full history of every edit.
- Revert any file (or the whole project) to a previous state.
- Work safely on new features without breaking existing code.
- Collaborate with others without overwriting each other's work.

---

### The Video Game Analogy

Think of Git like a video game's **save system**:

```
Your Project's History:
─────────────────────────────────────────────────────────►  time
    ●           ●           ●            ●            ●
  Save 1      Save 2      Save 3       Save 4      Save 5
"Add HTML"  "Add CSS"  "Add nav"   "Fix footer"  "Add JS"

If something breaks at Save 5,
you can reload from Save 4 instantly.
```

In Git:
- Each **commit** = a save point.
- You can travel back to **any** commit at any time.
- Unlike saving a file (which overwrites), Git **keeps every save forever**.

---

### Git vs. GitHub — What's the Difference?

This is one of the most common points of confusion. Here's the distinction:

| | Git | GitHub |
|---|--------|--------|
| **What is it?** | Software that runs on your computer | A website (a cloud service) |
| **What does it do?** | Tracks changes to your files locally | Stores copies of your Git repos online |
| **Analogy** | The engine of a car | The garage where you park and share your car |

> **💡 Key Point:** You can use Git without GitHub (purely locally). But GitHub requires Git. GitHub is just one option — alternatives include GitLab and Bitbucket.

---

### The Four Areas of Git

Understanding where your files "live" is fundamental to understanding Git:

```
┌─────────────────────────────────────────────────────────────────────┐
│                          YOUR COMPUTER                              │
│                                                                     │
│  ┌──────────────────┐   git add    ┌──────────────┐                │
│  │ Working Directory│ ──────────►  │ Staging Area │                │
│  │                  │              │              │                │
│  │  (Your files as  │              │ (Changes you │                │
│  │   you edit them) │              │  plan to     │                │
│  │                  │              │  save next)  │                │
│  └──────────────────┘              └──────┬───────┘                │
│                                           │ git commit             │
│                                           ▼                        │
│                                   ┌──────────────┐                │
│                                   │  Local Repo  │                │
│                                   │              │                │
│                                   │  (Full saved │                │
│                                   │   history)   │                │
│                                   └──────┬───────┘                │
│                                          │                         │
└──────────────────────────────────────────┼─────────────────────────┘
                                           │ git push
                                           ▼
                              ┌────────────────────────┐
                              │    Remote (GitHub)     │
                              │                        │
                              │  (Online backup &      │
                              │   collaboration hub)   │
                              └────────────────────────┘
                                           │
                              git pull ────┘  (download changes)
```

---

### The Staging Area — The "Drafting" Step

The staging area might feel redundant at first: *"Why can't I just commit directly?"*

The staging area gives you **fine-grained control** over what goes into each commit. Imagine you've been working and you've changed 5 files. But logically, 3 of those changes belong to one fix, and 2 belong to a different feature. You can:

1. `git add` the 3 related files → `git commit -m "Fix broken nav link"`
2. `git add` the remaining 2 files → `git commit -m "Add contact form validation"`

This makes your history **meaningful and clean**, rather than one giant messy commit.

> **💡 Analogy:** The staging area is like a shopping basket at the supermarket. You browse and put items in the basket (`git add`). When you're ready, you pay for the basket (`git commit`). You decide exactly what goes in each basket.

---

## Core Git Commands

### Setting Up Git (One-Time Setup)

Before using Git for the first time, configure your identity. Git uses this information to label your commits:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Verify your configuration:
```bash
git config --list
```

---

### `git init` — Start a Repository

Run this once inside your project folder to initialise a new Git repository:

```bash
git init
```

**What happens:**
- A hidden `.git/` folder is created inside your project.
- Git begins tracking the directory.
- Your files are not yet tracked — they are "untracked".

```
Before git init:            After git init:
─────────────────           ──────────────────────────
my-portfolio/               my-portfolio/
├── index.html              ├── .git/         ← (hidden) Git's brain
├── about.html              ├── index.html
└── css/                    ├── about.html
    └── style.css           └── css/
                                └── style.css
```

> **⚠️ Warning:** Run `git init` inside your project folder, **not** on your Desktop or a parent folder. Always check which directory you're in first.

---

### `git status` — Check What's Going On

```bash
git status
```

This is your most-used command. It shows you the current state of your files:

```
On branch main

Untracked files:
  (use "git add <file>..." to include in what will be committed)

        index.html       ← not yet staged (shown in red)
        about.html
        css/style.css

nothing added to commit but untracked files present
```

After staging:

```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

        new file:   index.html    ← staged and ready (shown in green)
        new file:   about.html
        new file:   css/style.css
```

> **💡 Habit:** Run `git status` before and after every Git operation. It tells you exactly what state you're in.

---

### `git add` — Stage Changes

Stage a single file:
```bash
git add index.html
```

Stage multiple specific files:
```bash
git add index.html about.html
```

Stage **all** changed files in the current directory (most common):
```bash
git add .
```

> **The `.` means "everything in the current folder and its subfolders."**

---

### `git commit` — Save a Snapshot

```bash
git commit -m "Your commit message here"
```

**What makes a good commit message?**

```
✅ Good commit messages:
   "Initial commit - Add portfolio HTML structure"
   "Add responsive navigation bar"
   "Fix broken image link on projects page"
   "Update footer with social media links"

❌ Bad commit messages:
   "stuff"
   "changes"
   "fix"
   "asdfjkl"
   "final"
   "v2"
```

**The rule:** Write your message as if completing the sentence: *"This commit will..."*
- "This commit will **Add responsive navigation bar**" ✅

---

### `git log` — View Commit History

View the full history of commits:
```bash
git log
```

A cleaner, one-line-per-commit view:
```bash
git log --oneline
```

**Example output:**
```
a3f9c12 (HEAD -> main) Add contact form validation
7b2d8e1 Add projects section to homepage
3c1a5f8 Fix broken nav link on mobile
b0e7d23 Initial commit - Add portfolio HTML structure
```

Each line shows: **commit hash** | **branch info** | **commit message**

> **💡 `HEAD`** means "the commit you are currently at" — your current position in the history.

---

### Connecting to GitHub

#### Step 1: Create a Repository on GitHub
1. Log in to [github.com](https://github.com).
2. Click the **`+`** icon (top right) → **New repository**.
3. Set the name (e.g., `personal-portfolio`), choose **Public**.
4. **Do NOT tick** "Add a README file" if you already have a local project.
5. Click **Create repository**.

#### Step 2: `git remote add origin` — Link Local to Remote

Copy the HTTPS URL from GitHub and run:
```bash
git remote add origin https://github.com/yourusername/personal-portfolio.git
```

- `remote` — a version of your repo stored elsewhere (online)
- `origin` — the conventional name for your primary remote
- The URL — tells Git where on the internet the remote lives

Verify the connection:
```bash
git remote -v
```

Output:
```
origin  https://github.com/yourusername/personal-portfolio.git (fetch)
origin  https://github.com/yourusername/personal-portfolio.git (push)
```

---

### `git push` — Upload to GitHub

For the very first push (sets the default upstream branch):
```bash
git push -u origin main
```

All subsequent pushes (after the first):
```bash
git push
```

After pushing, go to your GitHub repository page — your files will be there! 🎉

---

### `git pull` — Download from GitHub

```bash
git pull
```

- Fetches any changes from the remote that you don't have locally.
- Merges those changes into your local repository.

> **💡 Best Practice:** Always run `git pull` at the **start** of every work session before you begin editing. This ensures you always have the latest version, especially when collaborating.

---

## The Full Git Workflow — Step by Step

Here is the complete workflow you'll use every day:

```
1. Navigate to your project folder
   cd path/to/your/project

2. (Optional, if starting fresh) Initialise a repo
   git init

3. Check the current state
   git status

4. Pull the latest changes (if working with a team or resuming)
   git pull

5. Make your changes to files (edit, create, delete)
   [edit your HTML, CSS, JS files...]

6. Check what changed
   git status

7. Stage your changes
   git add .

8. Commit with a clear message
   git commit -m "Describe what you changed"

9. Push to GitHub
   git push
```

---

## Visual Cheat Sheet

```
COMMAND                          WHAT IT DOES
─────────────────────────────────────────────────────────
git init                         Start tracking a folder with Git
git status                       See the state of all your files
git add <file>                   Stage a specific file
git add .                        Stage all changed files
git commit -m "message"          Save staged changes as a snapshot
git log                          View full commit history
git log --oneline                View history in compact format
git remote add origin <URL>      Link local repo to GitHub
git remote -v                    Verify remote connection
git push -u origin main          First-time push to GitHub
git push                         Push subsequent commits
git pull                         Download and apply remote changes
```

---

## Activities

1. **Git Installation Check** — Run `git --version` in the terminal. If not installed, download from [git-scm.com](https://git-scm.com/downloads).
2. **Configuration** — Set your name and email using `git config --global`.
3. **Demo Workflow** — Open `examples/git_workflow_demo/` and follow the full `init → add → commit` workflow.
4. **Practice Exercises** — Work through all steps in `exercises/git_practice.md`.
5. **Portfolio Setup** — Navigate to your own portfolio project and initialise a Git repo, make your first commit, and push to GitHub.

---

## Post-Session Assignment

See `assignments/assignment_brief.md` for full details. In summary:

- Pre-session: Make sure you have a GitHub account.
- Post-session:
  - Create a `README.md` in the root of your portfolio project.
  - Write a brief description of your portfolio project in it.
  - Add, commit, and push it to GitHub.

---

## Resources & Links

- **Reading:**
  - [Git Handbook](https://guides.github.com/introduction/git-handbook/)
  - [Pro Git Book (Chapters 1 & 2)](https://git-scm.com/book/en/v2)
- **Videos:**
  - [Git and GitHub for Beginners - Crash Course (freeCodeCamp)](https://www.youtube.com/watch?v=RGOj5yH7evk)
- **Tools:**
  - [Git Downloads](https://git-scm.com/downloads)
  - [GitHub](https://github.com)
  - [Visual Studio Code](https://code.visualstudio.com/)

---

## Tips

- **Run `git status` constantly.** It's your compass — it tells you exactly where you are at all times.
- **Commit often.** Many small, well-labelled commits are far better than one giant vague one.
- **Write meaningful commit messages.** Future you (and your teammates) will thank you.
- **Always `git pull` before starting work** — never edit "stale" files.
- **Use VS Code's Source Control panel** (the branch icon in the sidebar) for a visual interface — great for seeing staged vs. unstaged changes at a glance.
- Don't be intimidated by the command line. The core Git workflow is just 3–4 commands you'll use every single day. They will quickly become second nature.
