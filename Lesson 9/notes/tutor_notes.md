# Tutor Notes – Lesson 9: Group Project Intro: Collaborative Landing Page

## Learning Objectives

By the end of this session, the student will be able to:
- Transition conceptually from solo development to team-oriented development.
- Break down a single landing page into discrete, assignable tickets/components.
- Understand the role of Project Specifications and Kanban boards.
- Clone a shared repository created by the team lead (you).
- Understand and practice the GitHub Flow loop, emphasizing Code Review.

## Materials Needed
- Computer with internet access.
- VS Code & terminal.
- GitHub account.
- The `team_workflow_reference.html` visual guide open in a browser.
- The `project_specifications.md` outlining the goal.

## Preparation Checklist
- [ ] Create a new, empty **organization or shared repository** on GitHub before the session begins. Invite the student as a collaborator.
- [ ] Alternatively, you can use the files in `examples/landing_page_starter/` to initialize the remote repository so it's ready to be cloned.
- [ ] Familiarise yourself with GitHub Projects (the Kanban board feature on GitHub).
- [ ] Open the interactive visual guide (`examples/team_workflow_reference.html`) for use during the session.

---

## Session Outline

### Part 1: The Shift to Team Development (≈10 min)
1. **The Solo vs. Team Mindset**
   - Explain that up until now, code was written linearly. In a team, code is written in parallel.
   - Ask: *"If three of us need to build a single index.html page today, how do we prevent overwriting each other?"*
   - Answer: We don't edit the same lines. We break the page horizontally (components), use branches, and communicate intensely.

2. **The Project Goal**
   - Introduce the landing page project.
   - Open `examples/project_specifications.md` together. Walk through the requirements, the tech stack (Tailwind CDN is pre-loaded), and the design constraints.

### Part 2: Task Breakdown & Kanban (≈15 min)
3. **Deconstructing the Design**
   - A webpage isn't one task. It's an assembly of parts.
   - Outline the sections on a whiteboard/screen share:
     - Hero Section
     - Features Grid
     - Testimonials
     - Footer/Contact
   - Each section becomes a "Ticket" or "Issue".

4. **The Kanban Board**
   - Explain the columns: **To Do**, **In Progress**, **Review**, **Done**.
   - Show how a generic team moves tickets left to right. This prevents two people from accidentally building the Footer concurrently.
   - Mention that GitHub has a built-in "Projects" tab that acts as a Kanban board.

### Part 3: Setting Up the Shared Environment (≈15 min)
5. **The "Lead" Setup (You)**
   - Show the student the shared GitHub repository you created.
   - If using `landing_page_starter`, show that the base structure is already merged into `main`.

6. **The "Developer" Setup (Student)**
   - Have the student accept the repository invitation (if private).
   - Have the student run `git clone <URL>` on their machine in the exercises phase.
   - Discuss `git clone` vs `git init`. We don't init anymore; we download the existing central source of truth.

### Part 4: The Collaborative GitHub Flow (≈10 min)
7. **The Loop**
   - Open `team_workflow_reference.html`. Use the interactive sections to walk through:
     - Pull the latest `main`.
     - Branch off `main`.
     - Do the work (commit often).
     - Push the branch.
     - Open a Pull Request.
     - **Code Review:** Explain that the tutor will act as the Senior Developer to review their PR. They must reply to comments and make fixes if requested.
     - Merge & Delete branch.

### Part 5: Simulating a PR Interaction (≈10 min)
8. **Setting the Ground Rules for Code Reviews**
   - Code review is about the code, not the person.
   - Use language like "Consider changing this to flex-col" instead of "You did this wrong."
   - Explain that the student will open a "WIP" (Work In Progress) PR during the exercise phase just to verify the connection is working.

---

## Tips for Tutor
- **Communication is paramount:** Constantly reinforce that Git cannot fix a lack of human communication. If two people decide to edit the CSS reset at the same time, conflicts are guaranteed.
- **Tailwind CDN:** Note that the starter template uses the Tailwind CDN script. This is not for production, but it drastically lowers the barrier to entry for a beginner collaborative project so you don't have to troubleshoot Node/npm environment setups yet.
- **Simulate the Senior Dev role:** When the student opens their assignment PR, do not just merge it blindly. Leave at least one constructive comment (e.g., "Great use of semantic HTML! Could we increase the padding on this div for better readability?") so they experience the review cycle.

---

## Common Mistakes & Troubleshooting
1. **Cloning inside a Git repo**
   - ❌ Student runs `git clone` while inside `Lesson 8/` which is already a Git tracking folder. This creates nested git repositories.
   - ✅ Ensure the student is on their Desktop or a generic Dev folder before cloning.

2. **Branching off an outdated `main`**
   - ❌ Student creates a layout branch from a three-day-old `main` and suffers massive merge conflicts later.
   - ✅ The mantra: `git checkout main` -> `git pull origin main` -> THEN `git checkout -b new-feature`.

3. **Massive Pull Requests**
   - ❌ Student builds the Hero, Features, AND Footer in one branch and PR.
   - ✅ Branches should be scoped to a single ticket. It makes code review exponentially easier. Stop them early if they stray out of scope.
