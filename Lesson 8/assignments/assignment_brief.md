# Assignment: Git Branching & GitHub Pull Requests

**Lesson 8:** Branching, Merging, Pull Requests, GitHub Workflow

## Objective
Apply the professional Git workflow to your personal portfolio project. You will create a new feature on a dedicated branch, push the branch to GitHub, create a Pull Request, and merge it — mimicking how developers collaborate in the real world.

---

## Task Details

For this assignment, you will be adding a new "Skills" section to your personal portfolio. You must use the branching workflow to do this.

Follow these steps precisely:

### Step 1: Preparation
1. Open your terminal and navigate to your `personal-portfolio` repository.
2. Ensure you are on the `main` branch and that it is fully up to date:
   ```bash
   git checkout main
   git pull
   git status # Should say "nothing to commit"
   ```

### Step 2: Create a Feature Branch
1. Create and switch to a new branch named specifically for this feature.
   ```bash
   git checkout -b feature/add-skills-section
   ```

### Step 3: Implement the Feature
1. Open your portfolio in VS Code.
2. Open `about.html` (or `index.html` if you don't have an about page).
3. Add a new `<div>` or `<section>` detailing your current skills. Example:
   ```html
   <section class="skills">
     <h2>My Skills</h2>
     <ul>
       <li>Semantic HTML5</li>
       <li>Modern CSS (Flexbox, Grid)</li>
       <li>Tailwind CSS Web Layouts</li>
       <li>Git & GitHub Version Control</li>
     </ul>
   </section>
   ```
4. Feel free to add some CSS to style this list nicely.

### Step 4: Commit Your Work
1. Stage and commit your changes to your feature branch.
   ```bash
   git add .
   git commit -m "Add skills section to about page"
   ```

### Step 5: Push and Open a PR
1. Push your feature branch to your GitHub repository.
   ```bash
   git push -u origin feature/add-skills-section
   ```
2. Go to your repository on github.com.
3. Click the **Compare & pull request** button.
4. Add a descriptive title and a short explanation in the description box of what you added.
5. Click **Create pull request**.

### Step 6: Merge and Clean Up
1. Review your own PR on GitHub (check the "Files changed" tab).
2. Click **Merge pull request** and confirm.
3. Click **Delete branch** on GitHub.
4. Back in your local terminal, switch to `main` and pull the updated code.
   ```bash
   git checkout main
   git pull
   ```
5. Delete the local feature branch.
   ```bash
   git branch -d feature/add-skills-section
   ```

---

## Verification Checklist

Before considering this assignment complete, ensure you can check off every item:

- [ ] My portfolio has a new Skills section.
- [ ] I implemented the feature on a branch called `feature/add-skills-section`, NOT on `main`.
- [ ] I created a Pull Request on GitHub.
- [ ] I merged the Pull Request using GitHub's "Merge" button.
- [ ] My local `main` branch has the newly pulled changes.
- [ ] I deleted the feature branch both locally and on GitHub.
- [ ] Running `git branch` only shows `* main`.

---

## Bonus Challenges (Optional)

**Challenge 1: The "Fix" Workflow**
Notice a typo or alignment issue on your site? Don't fix it on `main`! Create a `fix/...` branch, push it, make a PR, and merge it.

**Challenge 2: View the Graph**
In your terminal on `main`, run `git log --oneline --graph`. Take a screenshot of the branching and merging lines shown in the graph and share it with the class!
