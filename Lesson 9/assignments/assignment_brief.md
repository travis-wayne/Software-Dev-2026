# Assignment: Team Landing Page Contribution

**Lesson 9:** Group Project Intro: Collaborative Landing Page

## Objective
Write code as part of a collaborative team project. You will build one complete component (ticket) of the DevSync landing page, using Tailwind CSS, and officially submit it for Code Review via a GitHub Pull Request.

---

## Task Details

During the lesson, you selected a distinct section of the landing page to build (e.g., the Features Grid or the Global Navigation). You have already created a branch and a Work In Progress (WIP) Pull Request. Good job!

Now, you must write the actual code.

### Step 1: Write Your Code Locally
1. Find your designated zone in `index.html`.
2. Review the `project_specifications.md` file in the notes. Read exactly what content, buttons, and layout styles are expected for your section.
3. Build the component using HTML and Tailwind CSS utility classes.
4. **DO NOT** edit code in any other section. If you see a typo in someone else's section, ignore it for now (or make a note to tell them later). Stay completely inside your own zone to prevent Merge Conflicts.

### Step 2: Test Locally
1. Open the locally modified `index.html` in your browser.
2. Does it look correct? 
3. Shrink the browser window. Does it look acceptable on mobile devices? Add Tailwind `md:` or `lg:` breakpoints if you need to fix the layout for wider screens.

### Step 3: Commit Iteratively
Do not wait until the entire component is finished to make a single massive commit. Commit in logical steps:
```bash
git add index.html
git commit -m "Add layout grid for feature cards"

# (do more work, add content inside the cards)

git add index.html
git commit -m "Populate feature cards with icons and text"

# (do style polishing)

git add index.html
git commit -m "Style feature cards with shadows and rounded borders"
```

### Step 4: Push to Update the PR
1. When your component is totally complete, push your local commits to the remote branch.
```bash
git push
```
Since you already created the PR during the exercises, GitHub will automatically attach these new commits to the open PR.

### Step 5: The Review Cycle
1. Message your Tutor/Lead Developer that the PR is ready for review.
2. If your Tutor leaves a review asking for a change (e.g., "Please increase the padding here"), do the following:
   - Make the fix locally in VS Code.
   - Stage and commit it (`git add .` -> `git commit -m "Fix padding based on review"`).
   - `git push`.
3. Once the Tutor approves the code, they will Merge it.

### Step 6: Step Back and Sync Up
1. Once your PR is merged, your component officially lives in `main`! It is now part of the central codebase.
2. Bring your local laptop up to date:
```bash
git checkout main
git pull origin main
```
3. Delete your local feature branch.
```bash
git branch -d <name-of-your-branch>
```

---

## Verification Checklist

- [ ] My component contains the correct content matching the specification sheet.
- [ ] My HTML uses Tailwind classes for styling.
- [ ] I did not edit any other sections of `index.html`.
- [ ] I pushed my commits and they appear in the GitHub Pull Request.
- [ ] I responded to any Code Review feedback requested by my Tutor.
- [ ] My PR was successfully merged by the Tutor.
- [ ] I have synced my local `main` branch and deleted my local feature branch.
