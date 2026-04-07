# Student Notes – Lesson 9: Collaborative Landing Page

Welcome to Lesson 9! Up until now, your code has been your own. You were the only author, the only reviewer, and the only person merging code.

In the professional software industry, this is almost never the case. You will work on teams ranging from 2 to 2,000 developers, all touching the same codebase. Today, we transition from solo-coding to **Collaborative Development**.

---

## 1. The Mindset Shift

When coding in a team, your primary goal is no longer just "make it work." The goals are:
- Make it work without breaking your teammate's code.
- Write code that someone else can easily read and review.
- Communicate constantly about *what* you are building and *where* you are building it.

---

## 2. Planning and Deconstruction

You cannot build a house by having 10 builders all lay bricks on the same wall at the same time. You assign one person to plumbing, one to electrical, and one to framing.

Web pages work the same way. We must deconstruct the design into manageable "Components" or "Tickets".

### Example Landing Page Breakdown:
If we are building a SaaS Landing Page, we slice it horizontally:
1. **Navigation/Header** (Task assigned to Alice)
2. **Hero Section** (Task assigned to Bob)
3. **Features Grid** (Task assigned to Charlie)
4. **Footer** (Task assigned to Alice later)

By splitting the files or horizontal sections, Alice, Bob, and Charlie can write code simultaneously on different branches without causing massive Git Merge Conflicts.

---

## 3. Project Management Tools

To ensure Bob doesn't start building the Hero section on precisely the same day Charlie decides to build the Hero section, teams use tracking tools.

### The Kanban Board
A Kanban board is a visual representation of work. Usually, it consists of columns:
- **To-Do / Backlog:** Every task required to finish the project.
- **In Progress:** The one (and only one) task a developer is actively coding.
- **In Review:** The code is finished and waiting for a Pull Request review on GitHub.
- **Done:** The code is merged into `main`.

Before writing any code, you will move a task to the "In Progress" column and assign your face/name to it.

---

## 4. The Collaborative GitHub Flow

This is the standard operational loop for a professional developer contributing to a team project.

### Step 1: Sync Up
Always start your day by fetching the latest code your teammates wrote yesterday.
```bash
git checkout main
git pull origin main
```

### Step 2: Branch Out
Never work on `main`. Create a branch named exactly after your assigned task.
```bash
git checkout -b feature/build-hero-section
```

### Step 3: Write Code & Commit Often
Make small, logical commits. If your task is "Build Hero", do not include CSS resets or global font changes without discussing it with your team first, as it might break their sections.
```bash
git add index.html
git commit -m "Add heading and CTA button to hero section"
```

### Step 4: Open a Pull Request (PR)
Push your branch to GitHub and open a PR requesting to merge into `main`.
```bash
git push -u origin feature/build-hero-section
```

### Step 5: The Code Review
In a team, you cannot click the "Merge" button on your own code. 
You request a review from a teammate (or your Tutor). They will read your code on GitHub and may request changes.
If they say *"Please make the button blue instead of red"*:
1. Go back to VS Code on your branch.
2. Change the button to blue.
3. `git add .` and `git commit -m "Update button color based on review"`.
4. `git push`.
GitHub automatically updates the PR with your new commit.

### Step 6: Merge, Delete, and Sync
Once approved, the PR is merged into `main`. You delete the branch on GitHub, delete it locally, and start back at Step 1 for your next task!

---

## 5. Standardising the Environment with Starter Templates

When starting a team project, one person (the Tech Lead) usually creates a **Starter Template**. This ensures everyone is using the same baseline configuration.

Our starter template includes:
- An `index.html` file with HTML comments pre-defining where sections belong `<!-- Hero Section Here -->`.
- A linked `css/style.css` file.
- The Tailwind CSS script via CDN so we all have access to the same utility classes instantly.
- A `.gitignore` file.

You will **Clone** this starter template to begin your work.

### `git init` vs `git clone`
- `git init`: "I am starting a brand new project locally."
- `git clone <URL>`: "A project already exists on the internet. Download the whole folder, the `.git` history, and connect it to the remote automatically."

---

## 6. The Golden Rules of Team Collaboration

1. **Pull before you branch:** `git checkout main -> git pull -> git checkout -b my-branch`.
2. **Stay in your lane:** If your task is to build the Footer, do not edit the Header code "just to fix a quick typo." It will cause a conflict for the person working on the Header.
3. **Write descriptive PR titles:** "Added stuff" is bad. "[Footer] Add 3-column link layout and copyright" is good.
4. **Respect the Code Review:** Reviews are about maintaining code quality, not criticising the developer.
