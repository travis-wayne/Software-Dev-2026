# Lesson 8 – Branching, Merging, Pull Requests & GitHub Workflow

## 📚 Learning Objectives

By the end of this session, you will be able to:

1. Understand the concept of Git branching and why it is essential for modern development.
2. Create, switch between, and delete branches using Git commands.
3. Merge branches using fast-forward and 3-way merge strategies.
4. Identify, understand, and manually resolve merge conflicts.
5. Push a branch to GitHub and create a Pull Request.
6. Review and merge a Pull Request on GitHub.

## 🗂️ Folder Structure (fix)

```
Lesson 8/
├── README.md                                  ← You are here
├── notes/
│   ├── tutor_notes.md                         ← Tutor guide, session outline & tips
│   └── student_notes.md                       ← Student study notes & reference guide
├── examples/
│   ├── branching_visual_reference.html        ← ⭐ Interactive branching visual guide (open in browser)
│   └── branch_demo/                           ← Multi-file demo project for branching exercises
│       ├── README.md
│       ├── index.html
│       ├── contact.html
│       ├── about.html
│       └── css/
│           └── style.css
├── exercises/
│   └── branching_practice.md                  ← 12 step-by-step branching exercises
└── assignments/
    └── assignment_brief.md                    ← Post-session assignment details
```

> **💡 Start here:** Open `examples/branching_visual_reference.html` in your browser and keep it in a tab throughout the session as a live reference.

## 🔑 Key Concepts

| Concept | Plain English |
|---|---|
| **Branch** | An independent line of development — a parallel version of your project |
| **`main`** | The default, stable branch — always keep this clean and working |
| **Feature Branch** | A branch created for a specific new feature or bug fix |
| **Merge** | Integrating the changes from one branch into another |
| **Fast-Forward Merge** | The simplest merge — no new commits on `main`, so Git just moves the pointer |
| **3-Way Merge** | Git combines changes from both branches by comparing their common ancestor |
| **Merge Conflict** | When Git can't automatically decide how to combine changes — you resolve it manually |
| **Pull Request (PR)** | A GitHub feature to propose, review, and discuss changes before merging |

## 🛠️ Git Command Reference

| Command | Description |
|---|---|
| `git branch` | List all local branches |
| `git branch <name>` | Create a new branch |
| `git checkout <name>` | Switch to a branch |
| `git checkout -b <name>` | Create and switch to a new branch in one step |
| `git switch <name>` | Modern alternative to `git checkout` for switching |
| `git switch -c <name>` | Modern alternative to `git checkout -b` |
| `git merge <branch>` | Merge the named branch into your current branch |
| `git branch -d <name>` | Delete a branch (only if merged) |
| `git branch -D <name>` | Force-delete a branch (even if not merged) |
| `git push origin <branch>` | Push a branch to GitHub |
| `git push origin --delete <branch>` | Delete a remote branch on GitHub |
| `git branch -vv` | Show branches with their latest commit and tracking info |

## 📖 Resources

- [Git Branching — Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [About Pull Requests — GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-with-pull-requests/about-pull-requests)
- [Git Branching and Merging Tutorial (Traversy Media)](https://www.youtube.com/watch?v=FyAAI_20b0I)
- [GitHub Pull Request Tutorial (freeCodeCamp)](https://www.youtube.com/watch?v=8lGpZkW_tS0)
- [Git](https://git-scm.com/downloads)
- [GitHub](https://github.com)
