# Git Practice Exercises – Lesson 7

Work through these exercises step by step in your terminal. After each command, observe the output carefully before moving on.

---

## Before You Begin

**1. Open the Visual Reference first**

Open `examples/git_visual_reference.html` in your browser. Keep it in a tab throughout this session — it has a copy button for every command and explains every status state you'll encounter.

**2. Navigate to the demo project folder**

Open your terminal (or VS Code's integrated terminal with `` Ctrl+` ``).

Navigate to the demo project folder:
```bash
cd "path/to/Lesson 7/examples/git_workflow_demo"
```

Verify you're in the right place by listing the files:
```bash
ls         # macOS / Linux / Git Bash
Get-ChildItem  # Windows PowerShell
```

You should see: `index.html`, `projects.html`, `about.html`, `README.md`, and a `css/` folder.

> **Why a multi-file project?** Real projects always have multiple files. This demo helps you practise staging specific files versus staging everything — an important distinction.

---

## Exercise 1: Check Git is Installed

**Goal:** Confirm Git is installed and see what version you have.

```bash
git --version
```

✅ **Expected output:** Something like `git version 2.x.x`

If you see an error, download and install Git from [git-scm.com/downloads](https://git-scm.com/downloads) before continuing.

---

## Exercise 2: Configure Git (First-Time Setup)

**Goal:** Tell Git your name and email so your commits are labelled correctly.

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Verify it worked:
```bash
git config --list
```

✅ **Expected output:** A list of settings including `user.name` and `user.email`.

---

## Exercise 3: Initialise a Repository

**Goal:** Start tracking the demo project with Git.

Make sure you're inside the `git_workflow_demo/` folder, then run:

```bash
git init
```

✅ **Expected output:** `Initialized empty Git repository in .../git_workflow_demo/.git/`

Now check the current state:
```bash
git status
```

✅ **Expected output:** You should see all 4 files (`index.html`, `projects.html`, `about.html`, `README.md`) and the `css/style.css` file listed as **untracked files** (in red). Notice how Git automatically sees files in subfolders too.

> **Question to answer:** What does "untracked" mean? Why does Git not automatically track all files?

---

## Exercise 4: Stage Your Files

**Goal:** Move files into the staging area to prepare for a commit — and learn the difference between staging one file vs. staging everything.

**Step 4a:** Stage just one file first to see what happens:
```bash
git add index.html
```

Check the status:
```bash
git status
```

✅ **Expected output:** `index.html` appears under **"Changes to be committed"** (green). The other 4 files are still untracked (red). This shows exactly why the staging area exists — you control what goes into each commit.

**Step 4b:** Now stage a specific subfolder file:
```bash
git add css/style.css
```

Run `git status` again and observe — `css/style.css` is now staged too. The other pages are still untracked.

**Step 4c:** Stage all remaining files at once with the shortcut:
```bash
git add .
```

Run `git status` one more time:

✅ **Expected output:** All files — `index.html`, `projects.html`, `about.html`, `README.md`, `css/style.css` — should be green under "Changes to be committed".

> **Key insight:** The dot (`.`) means "everything in this directory and all subfolders". In a real project, this is what you'll use most. But you've now seen that you can stage individual files when you want fine-grained control over a commit.

---

## Exercise 5: Make Your First Commit

**Goal:** Save your staged changes as a permanent snapshot in the repository's history.

```bash
git commit -m "Initial commit - Add portfolio demo site"
```

✅ **Expected output:** Something like:
```
[main (root-commit) a3f9c12] Initial commit - Add portfolio demo site
 5 files changed, 120 insertions(+)
 create mode 100644 README.md
 create mode 100644 about.html
 create mode 100644 css/style.css
 create mode 100644 index.html
 create mode 100644 projects.html
```

Notice Git lists **every file that was included** in the snapshot — this is your permanent record.

Check the status:
```bash
git status
```

✅ **Expected output:** `nothing to commit, working tree clean` — all 5 files are safely saved in the snapshot.

---

## Exercise 6: View the Commit History

**Goal:** See the history of commits in your repository.

Full log (detailed):
```bash
git log
```

✅ **Expected output:** Your commit, with its hash (a long ID), author, date, and message.

Compact log (one line per commit):
```bash
git log --oneline
```

✅ **Expected output:** A single line like: `a3f9c12 Initial commit - Add demo project files`

> **Question to answer:** What is `HEAD` in the log output? What does it point to?

---

## Exercise 7: Make Changes Across Multiple Files and Commit Them Separately

**Goal:** Practise the full edit → stage → commit cycle, and learn why multiple commits are better than one big one.

**Step 7a — Edit two unrelated things:**
- Open `index.html` and update the `<title>` tag to `Alex Chen – Developer Portfolio`. Save it.
- Open `about.html` and add a new skill to the skills list: `<li>🔜 JavaScript — Coming in Lesson 8!</li>`. Save it.

**Step 7b — Check what changed:**
```bash
git status
```
✅ Both `index.html` and `about.html` should appear as **modified** (red).

**Step 7c — See the exact line changes:**
```bash
git diff
```
Lines with `+` are additions; `-` are deletions. Press `q` to exit.

**Step 7d — Commit them separately** (because they are two unrelated changes):

First, commit the title fix:
```bash
git add index.html
git commit -m "Fix page title to include full name"
```

Then, commit the about update:
```bash
git add about.html
git commit -m "Add JavaScript to upcoming skills in about page"
```

**Step 7e — View the history:**
```bash
git log --oneline
```

✅ **Expected output:** You should now have **3 commits** — each one describing a specific, intentional change.

> **Key insight:** Two small, well-labelled commits are far more useful than one big vague commit. Your future self (and teammates) will thank you.

---

## Exercise 7b: Add a .gitignore File

**Goal:** Tell Git to ignore files that should never be committed.

**Step 7b-1:** In VS Code, create a new file in the `git_workflow_demo/` root called `.gitignore` (no extension — just `.gitignore`).

**Step 7b-2:** Add these contents:
```
# Operating system files
.DS_Store
Thumbs.db

# Environment / secrets
.env

# Logs
*.log
```

Save the file.

**Step 7b-3:** Check the status:
```bash
git status
```
✅ Git should show `.gitignore` as a new untracked file.

**Step 7b-4:** Create a dummy log file to test it:
```bash
# PowerShell:
New-Item test.log
# macOS/Linux:
touch test.log
```

**Step 7b-5:** Run `git status` again — `test.log` should **not** appear. Git is now ignoring it! ✅

**Step 7b-6:** Stage and commit the `.gitignore`:
```bash
git add .gitignore
git commit -m "Add .gitignore to exclude OS and log files"
```

**Step 7b-7:** Clean up the test file (Git already ignores it, but tidy up anyway):
```bash
Remove-Item test.log  # PowerShell
```

---

## Exercise 8: Connect to GitHub

**Goal:** Link your local repository to a new GitHub remote repository.

**Before you start:**
1. Log in to [github.com](https://github.com).
2. Click **`+` → New repository**.
3. Name it `git-workflow-demo`.
4. Set it to **Public**.
5. **Do NOT** tick "Add a README file" (leave all initialisation options unchecked).
6. Click **Create repository**.
7. Copy the HTTPS URL shown on the page (e.g., `https://github.com/yourusername/git-workflow-demo.git`).

**Now in your terminal:**

```bash
git remote add origin https://github.com/yourusername/git-workflow-demo.git
```

Verify it was added:
```bash
git remote -v
```

✅ **Expected output:**
```
origin  https://github.com/yourusername/git-workflow-demo.git (fetch)
origin  https://github.com/yourusername/git-workflow-demo.git (push)
```

Rename your branch to `main` (if needed):
```bash
git branch -M main
```

---

## Exercise 9: Push to GitHub

**Goal:** Upload your local commits to your remote repository on GitHub.

```bash
git push -u origin main
```

You may be prompted for your GitHub username and a **Personal Access Token** (PAT) as your password.
> ⚠️ GitHub no longer accepts your account password for Git operations. Use a PAT instead. You can generate one at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic).

✅ **Expected output:** Messages about counting objects and writing, then a confirmation like:
```
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Now go to your GitHub repository in your browser — you should see your files! 🎉

---

## Exercise 10: Pull a Change from GitHub

**Goal:** Simulate receiving a change from a remote source and pulling it locally.

**Step 10a:** On your GitHub repository page, click on `index.html`.

**Step 10b:** Click the **pencil icon** (Edit this file).

**Step 10c:** Add a comment to the top of the file:
```html
<!-- Updated directly on GitHub -->
```

**Step 10d:** Scroll down and click **Commit changes** (use a commit message like `"Add comment via GitHub web editor"`).

**Step 10e:** Back in your terminal, pull the change:
```bash
git pull
```

✅ **Expected output:** Git will report that it fetched and merged the change.

**Step 10f:** Open `index.html` locally — you should see the comment you added on GitHub is now in your local file.

View the full history now:
```bash
git log --oneline
```

✅ **Expected output:** You should see all commits — including the one made on GitHub.

---

## Reflection Questions

After completing all exercises, answer these in your own words:

1. What is the difference between `git add` and `git commit`?
2. What is the purpose of the staging area? Why does it exist?
3. What is the difference between `git push` and `git pull`?
4. What would happen if two people edited the same file and both tried to push? (Hint: this is called a *merge conflict* — something you'll learn about in a future lesson.)
5. Why is it important to write clear commit messages?

---

## Bonus Challenges ⭐

- Run `git log --graph --oneline --all` — what does the graph represent?
- Create a new file called `contact.html` in the demo project. Add basic HTML structure, stage it, and commit it with a clear message. Then push it to GitHub.
- On GitHub, click the **Commits** tab of your repo — explore each commit to see exactly what changed line by line.
- Try `git diff HEAD~1 HEAD` — what does this compare?
- Try `git show HEAD` — what information does this give you about the latest commit?
- Run `git log --stat` — what does the extra information tell you?
- Look at your `.gitignore` — add `*.tmp` to it and verify that creating a `test.tmp` file is ignored by Git.
