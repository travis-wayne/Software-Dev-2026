# Student Notes – Lesson 8: Branching, Merging & Pull Requests

Welcome to Lesson 8! In the previous session, you learned how to save snapshots of your project on a single timeline (`main`). Today, you'll learn how to create parallel timelines (branches) and how professional teams collaborate using GitHub Pull Requests.

---

## 1. Why Do We Need Branches?

Imagine writing a book with a co-author. If you both edit the exact same document at the same time, it's chaos. You might delete a paragraph they are currently re-writing. 

Instead, you would each make a **copy** of the chapter, do your work locally, and then carefully merge your changes back into the master document. 

In Git, this is called **Branching**.

### The Golden Rule of Git
> **The `main` branch must always be stable and deployable.**

You should **never** do your daily development work directly on `main`. Instead, for every new feature, bug fix, or experiment, you create a dedicated branch. This keeps `main` clean and safe.

---

## 2. Core Branching Commands

Whenever you create a repo, Git automatically creates a default branch called `main` (or sometimes `master` on older systems). 

### See your branches
To see all local branches in your project, run:
```bash
git branch
```
The branch with a `*` next to it (usually coloured green) is your **current active branch**.

### Create a new branch
```bash
git branch feature/add-contact-page
```
This tells Git: "Create a new branch right here, based on whatever snapshot I'm currently looking at." **Note:** This command *creates* the branch, but it does not switch you to it!

### Switch to a branch
```bash
git checkout feature/add-contact-page
```
*(Modern Git also allows `git switch feature/add-contact-page`)*

### The standard workflow (Create and switch in one step)
Developers do this so often there is a shortcut:
```bash
git checkout -b feature/add-contact-page
```
*(Modern Git also allows `git switch -c feature/add-contact-page`)*

This creates the new branch and instantly switches you to it. From this point on, any `git commit` you make is saved *only* to this branch. `main` is unaffected.

---

## 3. Branch Naming Conventions

Professional teams use naming conventions to keep branches organised. Always use lowercase letters, and replace spaces with hyphens `-`.

| Prefix | Use For | Example |
|---|---|---|
| `feature/` | Creating something new | `feature/dark-mode-toggle` |
| `fix/` | Fixing a bug | `fix/broken-header-link` |
| `docs/` | Updating documentation | `docs/update-readme` |
| `chore/` | Maintenance tasks | `chore/cleanup-css` |

---

## 4. Merging: Bringing Code Together

Once you've finished your work on a feature branch, you need to bring those changes back into `main`. This is called **merging**.

### The Merge Workflow:
1. Ensure your feature branch is fully committed (`git status` is clean).
2. Switch back to the receiving branch (usually `main`):
   ```bash
   git checkout main
   ```
3. Issue the merge command, telling Git conceptually "merge the feature INTO the branch I am currently on":
   ```bash
   git merge feature/add-contact-page
   ```

### Types of Merges

Git handles merges in two primary ways depending on history:

#### A. The Fast-Forward Merge (The Easy Way)
If `main` hasn't changed at all since you created your feature branch, Git just moves the `main` pointer forward to match your feature branch. It's instantaneous and simple.

#### B. The 3-Way Merge
If `main` *has* changed (e.g., a teammate merged something while you were working), Git has to do some thinking. It looks at:
1. The current state of `main`
2. The current state of your feature branch
3. The common ancestor (where they split apart)

It mathematically combines the changes and automatically creates a new **"Merge Commit"**. 

---

## 5. Merge Conflicts 😱

Sometimes, Git isn't smart enough to merge automatically. If you edited line 10, and your teammate *also* edited line 10 on their branch, Git doesn't know which one is right. It stops the merge and says there is a **Conflict**.

> **Don't panic!** Conflicts are a normal part of development. It just means Git needs a human to make a decision.

When a conflict happens:
1. `git status` will show you which files are "both modified".
2. Open those files in VS Code.

Git injects **conflict markers** directly into your code:

```html
<<<<<<< HEAD
<h1>Alex Chen | Developer</h1>
=======
<h1>Alex Chen — Portfolio</h1>
>>>>>>> feature/new-header
```

### How to resolve it:
The markers divide the conflicting lines:
- `<<<<<<< HEAD` to `=======`: This is the code currently on your branch (`main`).
- `=======` to `>>>>>>> feature/new-header`: This is the code coming *in* from the branch you're trying to merge.

**To fix it:** You simply edit the file. Delete the `<<<<<`, `=====`, and `>>>>>` lines entirely. Keep whichever version you want, or rewrite the line to combine both ideas!

For example:
```html
<h1>Alex Chen | Developer — Portfolio</h1>
```

Once the file is fixed and saved:
```bash
git add index.html
git commit -m "Resolve merge conflict in index heading"
```
Conflict resolved! 

---

## 6. GitHub Pull Requests (PRs)

In the real world, you almost never run `git merge` on your own machine to update `main`. Instead, you use **Pull Requests** on GitHub.

A Pull Request is a formal request saying: *"Hey team, I've finished my feature branch. Can someone review my code and pull it into `main`?"*

### The Professional GitHub Workflow:

**1. Work locally**
```bash
git checkout -b feature/cool-thing
# edit files
git add .
git commit -m "Add a cool thing"
```

**2. Push your branch to GitHub**
```bash
git push origin feature/cool-thing
```
*(If this is the first push for the branch, Git will tell you to run `git push --set-upstream origin feature/cool-thing`)*

**3. Create the Pull Request**
Go to your repository on GitHub. You'll see a green button: **"Compare & pull request"**.
Set the base branch to `main`, and the compare branch to `feature/cool-thing`. Add a title and description.

**4. Code Review**
Your teammates can see exactly which lines you changed (the "Diff"), leave comments, request changes, or approve it.

**5. Merge on GitHub**
Click the green "Merge pull request" button on GitHub. GitHub runs the `git merge` command for you on the server.

**6. Sync your local machine**
Because the merge happened on GitHub, your computer's `main` branch is now out of date.
```bash
git checkout main
git pull
```

---

## 7. Deleting Branches

Once a feature is merged, the branch pointer is no longer needed. The commits themselves are safely stored in `main`'s history. 

Leaving old branches around clutters your project. **Always delete them.**

Delete locally:
```bash
git branch -d feature/cool-thing
```
*(Note: Use `-D` if you want to force-delete an unmerged branch)*

Delete remote (GitHub):
GitHub often gives you a "Delete branch" button right after merging a PR. Alternatively:
```bash
git push origin --delete feature/cool-thing
```

---

## 8. Git Command Cheat Sheet

| Command | What it does |
|---|---|
| `git branch` | List all local branches |
| `git checkout -b <name>` | Create a new branch and switch to it immediately |
| `git checkout <name>` | Switch to an existing branch |
| `git merge <name>` | Take changes from `<name>` and merge them into your *current* branch |
| `git branch -d <name>` | Delete a local branch (must be fully merged) |
| `git push origin <name>` | Push a local branch up to GitHub |
| `git fetch --prune` | Clean up deleted GitHub branches from your local list |
| `git log --oneline --graph` | View your commit history with visual branch lines |
