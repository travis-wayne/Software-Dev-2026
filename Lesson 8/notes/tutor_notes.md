# Tutor Notes – Lesson 8: Branching, Merging, Pull Requests & GitHub Workflow

## Learning Objectives

By the end of this session, the student will be able to:

- Understand Git branching and why it is fundamental to modern development.
- Create, switch between, rename, and delete branches.
- Merge branches using fast-forward and 3-way merge strategies.
- Identify, understand, and manually resolve merge conflicts.
- Push a feature branch to GitHub and create a Pull Request.
- Review and merge a Pull Request on GitHub.

## Materials Needed

- Computer with internet access
- VS Code
- Terminal / VS Code integrated terminal
- Git installed and configured (from Lesson 7)
- GitHub account (from Lesson 7)
- The `branch_demo/` example project in `examples/`

## Preparation Checklist

- [ ] Review Lesson 7 — confirm student is comfortable with `add`, `commit`, `push`, `pull`.
- [ ] Open `examples/branching_visual_reference.html` in a browser tab — use it throughout.
- [ ] Know how to navigate the `examples/branch_demo/` project in the terminal.
- [ ] Prepare the merge conflict scenario mentally (see Part 4 below).
- [ ] Know how to navigate GitHub's PR interface (New Pull Request → base: main ← compare: feature-branch).
- [ ] Optional: have a second GitHub account or a collaborator URL ready to simulate a real PR review.

---

## Session Outline

### Part 1: Why Branches? The Core Concept (≈8 min)

1. **The Problem Without Branches**

   Ask: *"What would happen if your whole team worked directly on `main` all the time?"*
   - Everyone's unfinished code gets mixed together.
   - A half-written feature breaks the site for everyone.
   - You can't experiment safely.
   - Rolling back one person's change without affecting others is nearly impossible.

2. **The River Analogy**

   Draw or show this on screen:

   ```
   The River (main branch):
   ══════════════════════════════════════════════════════► (always stable, always works)

   A canal branches off to test something:
   ══════╦══════════════════════════════════════════════► main
         ║
         ╠══════════════●──────●──────●──────╗          feature branch
                      (work)  (work) (done)  ║
                                             ╚══════════► merged back in
   ```

   A branch is a **safe copy** of your project where you can work freely without affecting the main line. When you're done and confident, you merge it back.

3. **The Golden Rule**

   *"The `main` branch should always be in a working, deployable state. You never develop directly on `main`."*

   Branches are cheap (just a pointer in Git — they use almost no extra space). There's no reason NOT to use them.

---

### Part 2: Core Branching Commands (≈10 min)

4. **Listing Branches**

   ```bash
   git branch
   ```

   - Output shows all local branches.
   - The `*` marks your current branch.
   - Orange/green highlight in modern terminals also shows current branch.

5. **Creating a Branch**

   ```bash
   git branch feature/add-contact-info
   ```

   This creates the branch but **does NOT switch to it**. Verify with `git branch`.

6. **Switching to a Branch**

   ```bash
   git checkout feature/add-contact-info
   ```

   Modern shorthand (Git 2.23+):
   ```bash
   git switch feature/add-contact-info
   ```

   **The one-step shortcut (create + switch):**
   ```bash
   git checkout -b feature/add-contact-info
   # or
   git switch -c feature/add-contact-info
   ```

7. **Branch Naming Conventions**

   Show the student standard naming patterns used in industry:

   | Prefix | Purpose | Example |
   |---|---|---|
   | `feature/` | New functionality | `feature/add-contact-form` |
   | `fix/` | Bug fixes | `fix/broken-nav-link` |
   | `hotfix/` | Urgent production fix | `hotfix/login-crash` |
   | `chore/` | Maintenance, refactoring | `chore/update-dependencies` |
   | `docs/` | Documentation only | `docs/update-readme` |

   Rule: names should be lowercase, hyphenated, short but descriptive.

---

### Part 3: The Branching Workflow (≈12 min)

8. **Guided Demo in `branch_demo/`**

   Navigate to `examples/branch_demo/`:
   ```bash
   cd "path/to/Lesson 8/examples/branch_demo"
   git init
   git add .
   git commit -m "Initial commit - Add portfolio demo site"
   ```

9. **Create a Feature Branch**

   ```bash
   git checkout -b feature/add-contact-info
   ```

   Show `git branch` — student can see the new branch and the `*` has moved.

10. **Make Changes on the Feature Branch**

    - Open `contact.html` in VS Code.
    - Add a contact details section (address, email, phone placeholder).
    - Save.

    ```bash
    git add contact.html
    git commit -m "Add contact details section to contact page"
    ```

11. **Switch Back to `main` and Compare**

    ```bash
    git checkout main
    ```

    - Open `contact.html` — the changes are **gone**. The file is back to its previous state.
    - Key teaching moment: *"The changes aren't lost — they're on the feature branch. Git has switched your working directory to match the `main` snapshot."*
    - Switch back to the feature branch — the changes reappear.

    ```bash
    git checkout feature/add-contact-info
    # contact.html changes are back!
    git checkout main
    ```

12. **Fast-Forward Merge**

    Merge the feature branch into `main`:
    ```bash
    git merge feature/add-contact-info
    ```

    Output will say *"Fast-forward"* because `main` hasn't diverged.

    Explain: *"A fast-forward merge is the simplest case — `main` has no new commits of its own since the branch was created, so Git just moves the `main` pointer forward to match the feature branch. No new merge commit is created."*

    ```bash
    git log --oneline --graph
    ```

    Show the linear history — no branch divergence visible.

---

### Part 4: Merge Conflicts (≈15 min)

This is the most important part of the lesson. Take your time.

13. **Setting Up the Conflict**

    Make a change on `main` to a specific line in `index.html`:
    ```bash
    # On main:
    # Edit line: <h1>Alex Chen</h1>  →  <h1>Alex Chen | Developer</h1>
    git add index.html
    git commit -m "Update hero heading on main"
    ```

    Now create a new branch and make a **different change to the same line**:
    ```bash
    git checkout -b feature/new-header
    # Edit same line: <h1>Alex Chen</h1>  →  <h1>Alex Chen — Portfolio</h1>
    git add index.html
    git commit -m "Update hero heading on feature branch"
    ```

14. **Trigger the Conflict**

    Switch back to `main` and try to merge:
    ```bash
    git checkout main
    git merge feature/new-header
    ```

    Output:
    ```
    Auto-merging index.html
    CONFLICT (content): Merge conflict in index.html
    Automatic merge failed; fix conflicts and then commit the result.
    ```

    Run `git status` — shows `index.html` as "both modified".

15. **Reading the Conflict Markers**

    Open `index.html` in VS Code. Show the student the markers:

    ```html
    <<<<<<< HEAD
    <h1>Alex Chen | Developer</h1>
    =======
    <h1>Alex Chen — Portfolio</h1>
    >>>>>>> feature/new-header
    ```

    Explain each part:
    - `<<<<<<< HEAD` — everything between here and `=======` is what `main` has.
    - `=======` — the divider between the two versions.
    - `>>>>>>> feature/new-header` — everything between `=======` and here is what the feature branch has.
    - **Your job:** decide what the final result should be. Delete the markers and all three lines around the content, keeping only what you want.

16. **Resolving the Conflict**

    Edit `index.html` to keep the desired version (e.g., combine them):
    ```html
    <h1>Alex Chen | Developer — Portfolio</h1>
    ```

    Then stage and commit the resolution:
    ```bash
    git add index.html
    git commit -m "Resolve merge conflict in hero heading"
    ```

    Run `git log --oneline --graph` to see the merge commit created.

    *Key message: "Merge conflicts are normal. They happen whenever two people (or two branches) edit the same line. Resolving them is just making a decision about which version you want — or combining both."*

---

### Part 5: Push Branch to GitHub (≈5 min)

17. **Push a Feature Branch**

    Show that you can push any branch — not just `main`:
    ```bash
    git checkout feature/add-contact-info
    git push origin feature/add-contact-info
    ```

    Go to GitHub — show the banner *"Your recently pushed branch: feature/add-contact-info — Compare & pull request"*.

---

### Part 6: Pull Requests on GitHub (≈12 min)

18. **What is a Pull Request?**

    A Pull Request is **not** a Git feature — it's a **GitHub feature**. It's a formal request to merge one branch into another, designed around:
    - **Code review** — teammates read and comment on your changes before they're merged.
    - **Discussion** — questions, suggestions, and approval all happen in one place.
    - **Quality control** — nothing gets into `main` without being reviewed.

    *"In professional teams, no code goes directly to `main`. Every change goes through a PR. Even the most senior engineer gets their code reviewed."*

19. **Creating a Pull Request**

    On GitHub:
    1. Click **"Compare & pull request"** (the yellow banner) or go to **Pull Requests → New pull request**.
    2. Set: **base: main** ← **compare: feature/add-contact-info**.
    3. Write a clear title: `"Add contact details section to contact page"`.
    4. Write a description: what does this PR do? Why? Are there any notes for the reviewer?
    5. Click **Create pull request**.

20. **Reviewing and Merging**

    Walk through the PR interface:
    - **Files changed** tab — shows the diff, line by line.
    - **Conversation** tab — for comments and discussion.
    - Click **"Merge pull request"** → **"Confirm merge"**.
    - GitHub merges the branch into `main` and shows the merge commit.

---

### Part 7: Deleting Branches (≈5 min)

21. **Why Delete Branches?**

    - Merged branches are no longer needed.
    - Keeping stale branches causes clutter and confusion.
    - Industry rule: *"Merge and delete. The work is preserved in the commit history — the branch pointer is just a label."*

22. **Deleting Remotely (on GitHub)**

    After merging a PR, GitHub shows a **"Delete branch"** button — click it.

    Or via CLI:
    ```bash
    git push origin --delete feature/add-contact-info
    ```

23. **Deleting Locally**

    ```bash
    git branch -d feature/add-contact-info
    ```

    The `-d` flag only deletes if the branch has been merged. If unmerged, use `-D` to force:
    ```bash
    git branch -D feature/abandoned-experiment
    ```

24. **Sync Your Local After Remote Deletion**

    ```bash
    git fetch --prune
    ```

    This removes any local references to branches that no longer exist on the remote.

---

### Part 8: Applying to the Portfolio + Wrap-Up (≈5 min)

25. **Portfolio Workflow**

    Guide the student to apply the full workflow to their own `personal-portfolio` repo:
    1. `git checkout -b feature/add-skills-section`
    2. Add a skills section to `about.html`.
    3. `git add .` → `git commit -m "Add skills section to about page"`
    4. `git push origin feature/add-skills-section`
    5. Create a PR on GitHub → Merge it → Delete the branch.

26. **Recap**

    - Branches = safe, isolated lines of development.
    - `git checkout -b` creates and switches in one step.
    - Merge conflicts require manual resolution — delete the markers, keep what you want.
    - PRs are how professional teams collaborate and maintain code quality.
    - Merge → Delete is one action, not two optional ones.

---

## Tips for Tutor

- The **visual reference HTML file** is your best friend here. The branch diagram in it is animated and interactive — use it as your primary visual at the start of Parts 2 and 3.
- The conflict resolution exercise is the hardest part for students to grasp. Go slowly. Show `git status` at each step. Let them read the conflict markers themselves before explaining.
- VS Code has an excellent **merge conflict helper UI** — when you open a file with conflict markers, it shows coloured buttons: "Accept Current Change", "Accept Incoming Change", "Accept Both Changes". Show this to the student as an alternative to manually editing the markers.
- Use `git log --oneline --graph` frequently — the visual graph makes branching and merging history immediately intuitive.
- For PRs, if you don't have a second account, you can still demonstrate the full flow by creating and merging your own PR — it's a valid and common workflow even for solo developers.

---

## Common Mistakes & Troubleshooting

### Branching Mistakes

1. **Working on `main` instead of a feature branch**
   - ❌ Student forgets to create a branch and commits directly to `main`.
   - ✅ Develop the habit: *always* run `git checkout -b feature/...` first. Check `git branch` before starting work.

2. **Forgetting which branch they're on**
   - ❌ Student makes changes on the wrong branch.
   - ✅ Check `git branch` or look at the VS Code status bar (bottom-left — shows current branch name in blue).
   - ✅ Run `git status` — the top line always says `On branch <name>`.

3. **Trying to switch branches with uncommitted changes**
   - ❌ `git checkout main` fails with "Your local changes to the following files would be overwritten".
   - ✅ Either commit first (`git add . && git commit -m "WIP"`), or stash (`git stash`) — stashing is an advanced topic you can briefly mention.

### Merge Mistakes

4. **Merging in the wrong direction**
   - ❌ Student runs `git merge main` while on `main` (merges `main` into `main` — does nothing or causes confusion).
   - ✅ Always check: you merge the feature branch INTO main. Switch to `main` first, then run `git merge feature/...`.

5. **Leaving conflict markers in the file after resolving**
   - ❌ Student deletes some markers but leaves `<<<<<<` or `=======` in the file.
   - ✅ After resolving, always search the file for `<<<<`, `====`, `>>>>` to ensure no markers remain.

6. **Running `git commit` before adding the resolved file**
   - ❌ `git commit` after resolving but without `git add` — Git says the conflict is still unresolved.
   - ✅ Resolve → `git add <file>` → `git commit`.

### GitHub / PR Mistakes

7. **Base and compare branches swapped in the PR**
   - ❌ PR is set as base: feature-branch ← compare: main (backwards).
   - ✅ Always: base = the branch you want to merge INTO (usually `main`). Compare = the branch with your new work.

8. **Pushing to `main` directly instead of a feature branch**
   - ❌ `git push origin main` with feature work on `main`.
   - ✅ Create the feature branch, push that, and make a PR.

9. **Not pulling after merging a PR**
   - ❌ After merging on GitHub, local `main` is behind. Student is confused why their local files don't reflect the merge.
   - ✅ Always `git checkout main && git pull` after a PR is merged to sync the local repo.

10. **Trying to delete a branch that isn't fully merged**
    - ❌ `git branch -d feature/...` gives error: "not fully merged".
    - ✅ If you're sure you want to delete it: use `git branch -D feature/...`. If unsure, check if it was merged via `git log main --oneline | grep ...`.

11. **Stale remote-tracking branches cluttering `git branch -r`**
    - ❌ Branches deleted on GitHub still show up locally.
    - ✅ `git fetch --prune` removes stale remote-tracking references.
