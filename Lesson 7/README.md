# Lesson 7 – Git Basics (Add, Commit, Push, Pull)

## 📚 Learning Objectives

By the end of this session, you will be able to:

1. Understand the concept of version control and why it matters in software development.
2. Initialise a Git repository and track changes to files.
3. Use core Git commands: `git init`, `git status`, `git add`, `git commit`, and `git log`.
4. Connect a local repository to a remote repository on GitHub.
5. Push local changes to GitHub and pull changes from it.

## 🗂️ Folder Structure

```
Lesson 7/
├── README.md                              ← You are here
├── notes/
│   ├── tutor_notes.md                     ← Tutor guide, session outline & tips
│   └── student_notes.md                   ← Student study notes & reference guide
├── examples/
│   ├── git_visual_reference.html          ← ⭐ Interactive Git visual guide (open in browser)
│   ├── gitignore_template.txt             ← Annotated .gitignore starter template
│   └── git_workflow_demo/                 ← Multi-page demo project to practise Git on
│       ├── README.md                      ← Demo project README (practise pushing this)
│       ├── index.html                     ← Home page
│       ├── projects.html                  ← Projects page
│       ├── about.html                     ← About page
│       └── css/
│           └── style.css                  ← Shared stylesheet
├── exercises/
│   └── git_practice.md                    ← Step-by-step Git practice exercises
└── assignments/
    └── assignment_brief.md                ← Post-session assignment details
```

> **💡 Start here:** Open `examples/git_visual_reference.html` in your browser and keep it in a tab throughout the session as a live reference.

## 🔑 Key Concepts

- **Version Control System (VCS)** — A system that records changes to files over time
- **Git** — A popular distributed version control system
- **Repository (Repo)** — A project folder tracked by Git, containing all files and history
- **Staging Area** — An intermediate step where changes are prepared before committing
- **Commit** — A permanent snapshot of the repository at a specific point in time
- **GitHub** — A web-based platform for hosting remote Git repositories
- **Push / Pull** — Sending and receiving changes between local and remote repositories

## 🛠️ Git Command Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialise a new local repository |
| `git status` | Show the current state of files (staged, unstaged, untracked) |
| `git add <file>` | Stage a specific file for the next commit |
| `git add .` | Stage all changed files |
| `git commit -m "message"` | Save staged changes with a descriptive message |
| `git log` | View the full commit history |
| `git remote add origin <URL>` | Link local repo to a remote GitHub repository |
| `git push -u origin main` | Push commits to the remote repository |
| `git pull` | Fetch and merge changes from the remote repository |

## 📖 Resources

- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [Pro Git Book (Chapters 1 & 2)](https://git-scm.com/book/en/v2)
- [Git and GitHub for Beginners - Crash Course (freeCodeCamp)](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [Git Downloads](https://git-scm.com/downloads)
- [GitHub](https://github.com)
