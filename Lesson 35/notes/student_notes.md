# Lesson 35 — CI/CD Basics (GitHub Actions)
# Student Reference Notes

---

## 1. What is CI/CD?

In modern software development, teams push code to GitHub dozens of times a day. If a developer pushes code that contains a bug, it could crash the live website for thousands of users. **CI/CD** solves this problem through automation.

### Continuous Integration (CI)
CI is the practice of automatically testing your code every time you push it to a repository. 
Imagine a robot that downloads your code, runs `npm install`, and runs `npm test` every single time you create a Pull Request. If the tests fail, the robot blocks you from merging your code!

### Continuous Deployment (CD)
CD is the next step. If your code passes all the CI tests, a robot automatically takes that code and deploys it to your live servers (like Vercel or Render). You never have to manually click "Deploy" again.

---

## 2. GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is a CI/CD platform built directly into GitHub. It allows you to write `.yml` files that tell GitHub's servers exactly what to do with your code.

### The Anatomy of a Workflow
A workflow is just an automated process. You create them by placing `.yml` files in a special directory: `.github/workflows/`.

Every workflow has three main parts:
1. **Events (`on`)**: What triggers the robot? Usually, it's `push` or `pull_request`.
2. **Jobs**: What operating system should the robot use? Usually, `ubuntu-latest`.
3. **Steps**: The exact terminal commands the robot should type.

Here is what a basic CI workflow looks like:

```yaml
name: Node.js CI

# 1. The Event
on:
  push:
    branches: [ "main" ]

# 2. The Job
jobs:
  build:
    runs-on: ubuntu-latest

    # 3. The Steps
    steps:
    - uses: actions/checkout@v4       # Download the code
    - uses: actions/setup-node@v4     # Install Node.js
      with:
        node-version: 20
        
    - run: npm ci                     # Install dependencies cleanly
    - run: npm test                   # Run the tests! If this fails, the workflow stops.
```

---

## 3. GitHub Secrets

When you build CD pipelines, your GitHub Action robot needs permission to log into Vercel or Render on your behalf. But you **cannot** write your password in the `.yml` file, because it's public!

Instead, we use **GitHub Secrets**:
1. Go to your repository on GitHub.
2. Click **Settings** ➔ **Secrets and variables** ➔ **Actions**.
3. Click **New repository secret**.
4. Name it `VERCEL_TOKEN` and paste your token.

Now, inside your workflow file, you can securely inject the secret like this:
```yaml
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 4. Why Does This Matter?

By using GitHub Actions:
- **No broken code goes live:** Bugs are caught in the Pull Request phase.
- **Faster deployments:** You merge code, and 30 seconds later, it's live on the internet.
- **Consistency:** You don't have to remember to run `npm build` or `eslint` locally; the server does it for you.
