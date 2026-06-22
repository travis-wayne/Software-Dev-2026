# Lesson 35 — CI/CD Basics (GitHub Actions)

**Session Type:** Deployment & DevOps
**Duration:** 90 minutes
**Prerequisites:** Familiarity with Git, GitHub, and basic Deployment (Lesson 34)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Continuous Integration (CI)** | The concept of using automated robots (Runners) to build and test code on every Push or Pull Request. |
| **Continuous Deployment (CD)** | The concept of automatically shipping code to production servers (Vercel, Render) once CI passes. |
| **GitHub Actions YAML Syntax** | Breaking down the structure of a `.yml` file into Events (`on`), Jobs (`runs-on: ubuntu-latest`), and Steps (`run: npm test`). |
| **GitHub Secrets** | Securely injecting API keys and Tokens into cloud runners without leaking them in the repository. |

---

## Example Action Templates

This lesson contains three pre-configured `.github/workflows` templates that students can study and adapt for their own projects.

1. **`1-ci-pipeline.yml`**: A standard Node.js CI pipeline. It downloads the code, installs Node v20, runs `npm ci`, and runs `npm test`. It is designed to block Pull Requests if tests fail.
2. **`2-cd-frontend.yml`**: A template demonstrating how to manually trigger a Vercel deployment from inside a GitHub Action using the `amondnet/vercel-action`.
3. **`3-cd-backend.yml`**: A template demonstrating how to trigger a Render.com deployment by pinging a secure Deploy Hook URL using `curl`.

To demonstrate the CI pipeline failing and passing locally, the `examples/src` folder contains a tiny `sum.test.js` script using Jest.

---

## File Structure

```text
Lesson 35/
├── README.md
├── notes/
│   ├── tutor_notes.md                 # 90-min plan + live CI demo guide
│   └── student_notes.md               # CI/CD concepts and Action YAML structures
├── examples/
│   ├── package.json                   # Mock repo with Jest configured
│   ├── src/
│   │   ├── sum.js                     # Example math function
│   │   └── sum.test.js                # Example test to demonstrate CI failing/passing
│   └── .github/
│       └── workflows/
│           ├── 1-ci-pipeline.yml      # CI Template
│           ├── 2-cd-frontend.yml      # Vercel CD Template
│           └── 3-cd-backend.yml       # Render CD Template
└── exercises/
    └── github_actions_practice.md     # Hands-on task to intentionally break and fix CI
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Articulate the difference between CI and CD.
2. Structure a valid GitHub Action `.yml` file.
3. Intentionally read Action logs on GitHub to diagnose failed builds.
4. Keep tokens secure using Repository Secrets.
