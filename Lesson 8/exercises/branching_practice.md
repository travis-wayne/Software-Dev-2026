# Git Branching Practice Exercises – Lesson 8

Work through these exercises step by step in your terminal. They are designed to mirror a real-world professional Git workflow.

---

## Before You Begin

**1. Open the Visual Reference**
Open `examples/branching_visual_reference.html` in your browser. Keep it open in a tab to reference commands and visualize the merge types.

**2. Prepare the Demo Project**
Open your terminal and navigate to the demo project folder:
```bash
cd "path/to/Lesson 8/examples/branch_demo"
```

Initialise the repository, stage all files, and make the first commit to establish your `main` branch:
```bash
git init
git add .
git commit -m "Initial commit - Add portfolio demo site"
```

Verify you are on `main` and it is clean:
```bash
git status
```
✅ **Expected output:** `On branch main` and `nothing to commit, working tree clean`.

---

## Exercise 1: Check Your Branches

**Goal:** See what branches exist.

```bash
git branch
```

✅ **Expected output:** You should see just one branch listed: `* main`. The asterisk indicates it is your active branch.

---

## Exercise 2: Create a Feature Branch

**Goal:** Create an isolated space to build a new feature without affecting `main`.

Let's say we have a task to build out the contact form. Create a branch for it and switch to it in one step:
```bash
git checkout -b feature/add-contact-form
```

Verify you have switched:
```bash
git branch
```

✅ **Expected output:** `main` and `* feature/add-contact-form`.

---

## Exercise 3: Make Changes on the Feature Branch

**Goal:** Work on the feature branch and save a snapshot.

**Step 3a:** Open `contact.html` in your code editor.
Find the blank paragraph and replace it with a simple form placeholder, like this:
```html
<form>
  <label>Email: <input type="email"></label>
  <button type="submit">Send</button>
</form>
```
Save the file.

**Step 3b:** Check the status.
```bash
git status
```
✅ **Expected:** `contact.html` is modified (red).

**Step 3c:** Stage and commit the change to your feature branch.
```bash
git add contact.html
git commit -m "Add email form to contact page"
```

---

## Exercise 4: Switch Back to Main to Compare

**Goal:** Prove that `main` is completely untouched by your feature work.

**Step 4a:** Switch to `main`.
```bash
git checkout main
```

**Step 4b:** Open `contact.html` in your editor again.
✅ **Observe:** The form you just built is **gone**! The file is exactly as it was when you started. Git has instantly swapped out the files in your directory to match the `main` snapshot.

*(Don't worry, your work is safe on the feature branch!)*

---

## Exercise 5: The Fast-Forward Merge

**Goal:** Bring your completed feature into `main`.

Make sure you are on `main` (`git checkout main`).

Merge the feature branch into `main`:
```bash
git merge feature/add-contact-form
```

✅ **Expected output:** The output will say `Fast-forward`. Because `main` hadn't changed since you started, Git just "fast-forwarded" the `main` pointer to catch up with your feature branch.

Check `contact.html` in your editor. The form is back! It is now officially part of `main`.

---

## Exercise 6: Delete the Completed Branch

**Goal:** Clean up branches you no longer need.

Now that the feature is merged into `main`, the branch pointer is clutter. Delete it:
```bash
git branch -d feature/add-contact-form
```

Verify it's gone:
```bash
git branch
```

---

## Exercise 7: Simulate a Merge Conflict 😱

**Goal:** Intentionally create a conflict and resolve it manually.

**Step 7a:** Create a new branch to change the hero header.
```bash
git checkout -b feature/new-heading
```

**Step 7b:** Open `index.html`. Find the line `<h1>Alex Chen</h1>` and change it to:
```html
<h1>Alex Chen — Software Engineer</h1>
```
Save, stage, and commit:
```bash
git add index.html
git commit -m "Change home heading to Software Engineer"
```

**Step 7c:** Switch back to `main`.
```bash
git checkout main
```

**Step 7d:** Oh no! Your "manager" asks you to make a quick hotfix to the heading on `main` directly.
Open `index.html` (you should see the old heading again). Change it to:
```html
<h1>Alex Chen | Developer</h1>
```
Save, stage, and commit on `main`:
```bash
git add index.html
git commit -m "Update heading formatting on main"
```

**Step 7e:** Try to merge your feature branch.
```bash
git merge feature/new-heading
```

🚨 **CONFLICT ALERT!** 🚨
Expected output:
```
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

---

## Exercise 8: Resolve the Merge Conflict

**Goal:** Manually fix the conflict.

**Step 8a:** Run `git status`. It tells you `index.html` is "both modified".
**Step 8b:** Open `index.html` in VS Code. Find the conflict markers:

```html
<<<<<<< HEAD
<h1>Alex Chen | Developer</h1>
=======
<h1>Alex Chen — Software Engineer</h1>
>>>>>>> feature/new-heading
```

**Step 8c:** You are the human making the decision. Let's combine them into a final version. Delete the markers and edit the line so it looks exactly like this:
```html
<h1>Alex Chen | Software Engineer</h1>
```

**Step 8d:** Save the file.
**Step 8e:** Tell Git the conflict is resolved by staging and committing the file.
```bash
git add index.html
git commit -m "Resolve merge conflict in index heading"
```

You have successfully survived a merge conflict! Delete the feature branch (`git branch -d feature/new-heading`).

---

## Exercise 9: Push a Branch to GitHub

**Goal:** Prepare a feature branch to be reviewed on GitHub.

**Step 9a:** You need a GitHub repository. Follow the same flow as Lesson 7 to create a new empty, public repository on GitHub (name it `branch-demo`).
Link it locally:
```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

**Step 9b:** Create a new feature branch for the about page.
```bash
git checkout -b feature/about-skills
```

**Step 9c:** Open `about.html` and add some skills inside the `<div id="skills-placeholder"></div>`:
```html
<ul>
  <li>HTML & CSS</li>
  <li>Git & GitHub</li>
</ul>
```
Stage and commit:
```bash
git add about.html
git commit -m "Add basic skills list to about page"
```

**Step 9d:** Push your feature branch to GitHub!
```bash
git push -u origin feature/about-skills
```

---

## Exercise 10: Create a Pull Request (PR)

**Goal:** Request that your changes be merged into `main` on GitHub.

**Step 10a:** Go to your repository on github.com.
**Step 10b:** You should see a yellow or green banner stating: `feature/about-skills had recent pushes`. Click the **Compare & pull request** button next to it.
**Step 10c:** Verify the configuration: `base: main` arrow pointing from `compare: feature/about-skills`.
**Step 10d:** Add a title and description, then click **Create pull request**.

---

## Exercise 11: Review and Merge the PR

**Goal:** Complete the professional GitHub workflow.

**Step 11a:** In the PR view on GitHub, click the **Files changed** tab. This is where reviewers see your diff.
**Step 11b:** Go back to the **Conversation** tab and click the green **Merge pull request** button, then **Confirm merge**.
**Step 11c:** Click the **Delete branch** button on GitHub.

---

## Exercise 12: Sync Your Local Machine

**Goal:** Ensure your local `main` branch knows about the merge that just happened on GitHub's servers.

**Step 12a:** Back in your local terminal, switch to `main`:
```bash
git checkout main
```

**Step 12b:** Download the newly merged code:
```bash
git pull
```

**Step 12c:** Delete your local copy of the feature branch:
```bash
git branch -d feature/about-skills
```

**Congratulations!** You have completed the exact workflow used daily by thousands of professional software engineering teams.

---

## Reflection Questions

1. Why shouldn't you do your daily development directly on the `main` branch?
2. What happens to your working files when you use `git checkout` to switch between branches?
3. What is a fast-forward merge?
4. In a merge conflict, what do the symbols `<<<<<<< HEAD` and `=======` mean?
5. Why is a Pull Request better than just having everyone run `git merge` locally and pushing straight to `main`?

---

## Bonus Challenges ⭐

- Run `git log --oneline --graph --all`. How does the history look different now that we've had a branch, a conflict, and a PR merge?
- Try creating another conflict on purpose and resolving it using VS Code's built-in "Merge Conflict" helper buttons (often displayed above the conflicting lines in the editor).
- Run `git fetch --prune`. Notice how it cleans up tracking references to remote branches you've deleted.
