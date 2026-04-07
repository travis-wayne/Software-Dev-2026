# Lesson 9 – Group Project Intro: Collaborative Landing Page

## 📚 Learning Objectives

By the end of this session, you will be able to:

1. Understand the dynamics of a collaborative project using Git and GitHub.
2. Break down a complex web page into smaller, assignable components.
3. Use Agile-inspired planning tools (e.g., Kanban boards, spec sheets) to organise team work.
4. Clone a shared repository and set up a local collaborative environment.
5. Execute the GitHub Flow: Issue → Branch → Code → Pull Request → Code Review → Merge.
6. Communicate effectively regarding code contributions and feedback.

## 🗂️ Folder Structure

```
Lesson 9/
├── README.md                                  ← You are here
├── notes/
│   ├── tutor_notes.md                         ← Tutor guide, session outline & tips
│   └── student_notes.md                       ← Student study notes & reference guide
├── examples/
│   ├── team_workflow_reference.html           ← ⭐ Interactive team workflow visual guide
│   ├── project_specifications.md              ← The official spec sheet for the landing page
│   └── landing_page_starter/                  ← Starter template to be uploaded to the shared repo
│       ├── README.md
│       ├── index.html                         ← Contains HTML comments outlining sections
│       ├── .gitignore
│       └── css/
│           └── style.css
├── exercises/
│   └── team_setup_practice.md                 ← Step-by-step repository setup mapping
└── assignments/
    └── assignment_brief.md                    ← Post-session assignment: Build and PR one section
```

> **💡 Start here:** Open `examples/team_workflow_reference.html` in your browser. This interactive diagram maps out the GitHub Flow and how tasks move from "To-Do" to "Merged".

## 🔑 Key Concepts

| Concept | Plain English |
|---|---|
| **Collaborative Development** | Multiple developers contributing to a single, shared codebase without stepping on each other's toes. |
| **Project Specifications** | A clear document outlining what needs to be built, the design rules, and technical requirements. |
| **Component Breakdown** | Slicing a large web page (e.g., Landing Page) into horizontal blocks (Hero, Features, Footer) so different people can build them concurrently. |
| **Kanban Board** | A visual project management tool with columns like "To Do", "In Progress", "Review", and "Done". |
| **GitHub Flow** | The industry-standard loop: branch off `main` -> commit -> push -> open PR -> get review -> merge. |
| **Code Review** | Reading a teammate's code on GitHub to look for bugs or offer suggestions before it's allowed into `main`. |

## 🛠️ Collaborative Command Reference

| Command | Description |
|---|---|
| `git clone <URL>` | Download a full copy of a distant GitHub repository to your computer. |
| `git pull origin main` | Fetch and merge the absolute latest changes from the shared remote into your local `main` branch. |
| `git fetch --all` | Download all the latest branch data from GitHub without automatically modifying your local working files. |
| `git config --global core.editor "code --wait"` | Sets VS Code as the default editor for Git actions (like merge commits). |

## 📖 Resources

- [GitHub Flow (Official Docs)](https://docs.github.com/en/get-started/quickstart/github-flow)
- [How to Collaborate on GitHub (freeCodeCamp)](https://www.youtube.com/watch?v=0fS_0w4g820)
- [Agile Methodology Overview (Atlassian)](https://www.atlassian.com/agile)
- [Building a Landing Page with HTML & CSS (Traversy Media)](https://www.youtube.com/watch?v=D-w-wB_d9c0)
