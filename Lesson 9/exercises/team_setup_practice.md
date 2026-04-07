# Exercises – Team Repository Setup (Lesson 9)

In this session, you are no longer setting up a project from scratch on your own machine. Instead, you are acting as a new developer joining an existing team project. 

The Lead Developer (your Tutor) has already created a GitHub repository and uploaded a starter template. Your goal is to connect to it.

---

## Exercise 1: Get Access to the Shared Repository

**Goal:** Ensure you have permissions to write to the shared team repo.

**Step 1a:** Log in to [github.com](https://github.com).
**Step 1b:** Your Tutor will send you an invitation to collaborate on a repository. Look for a notification or click on the direct link provided.
**Step 1c:** Click **Accept Invitation**.

You now have Developer access to the codebase!

---

## Exercise 2: Clone the Project Locally

**Goal:** Download a full copy of the internet repository to your local machine.

**Step 2a:** On the GitHub page of the shared repository, locate the green **"<> Code"** button.
**Step 2b:** Click it and copy the HTTPS URL (e.g., `https://github.com/TutorsRepo/collaborative-landing-page.git`).

**Step 2c:** In your terminal, navigate to your generic coding folder (e.g., your Desktop or `Lessons/` folder). **IMPORTANT:** Make sure you are NOT currently inside another initialized git repository!

**Step 2d:** Clone the repository. Run:
```bash
git clone <PASTE_URL_HERE>
```

✅ **Expected output:** Git will report `Cloning into 'collaborative-landing-page'...` and download all files and history.

**Step 2e:** Move into the new directory:
```bash
cd collaborative-landing-page
```

---

## Exercise 3: Inspect the Team Environment

**Goal:** Understand the starter template you've been given.

**Step 3a:** Open the newly cloned folder in VS Code.
**Step 3b:** Read the `README.md` file. It contains the instructions from the Lead Developer.
**Step 3c:** Open `index.html`. 
✅ **Observe:** The lead developer has created an HTML shell with clear `<section>` tags and HTML comments (e.g., `<!-- TICKET #2: Hero Section -->`). 

> **Important Rule:** During this project, you must only write code inside the HTML comments designated for the component you have claimed!

---

## Exercise 4: Claim Your Ticket

**Goal:** Select a component to build and create an isolated branch for it.

**Step 4a:** Discuss with your Tutor and agree on ONE component to build today. (e.g., The Hero Section).
**Step 4b:** In the terminal, verify you are currently on the `main` branch.
```bash
git status
```
**Step 4c:** Create and switch to a branch specifically named for your task. Say you chose the Hero Section:
```bash
git checkout -b feature/build-hero-section
```

---

## Exercise 5: The 'Work In Progress' (WIP) Pull Request

**Goal:** Prove the collaboration loop works before writing any real code. This is a common industry practice to signal to teammates "I am working on this right now."

**Step 5a:** In `index.html`, find the HTML comment for your assigned section.
**Step 5b:** Add a single, simple placeholder line. For example: `<p>Alex is building the Hero section here.</p>`.
**Step 5c:** Save, stage, and commit.
```bash
git add .
git commit -m "Claim Hero section with placeholder text"
```

**Step 5d:** Push your branch to the shared GitHub repository.
```bash
git push -u origin feature/build-hero-section
```

**Step 5e:** Go to GitHub and open a Pull Request. Title it `[WIP] Build Hero Section`. 
**Step 5f:** Have your Tutor review the PR right now on their screen. They should see your single line of placeholder text.

By creating this WIP PR, you have successfully proven that you can communicate code changes across the internet to your Lead Developer without ever touching the `main` branch directly!

You are now ready to actually build the component for your assignment.
