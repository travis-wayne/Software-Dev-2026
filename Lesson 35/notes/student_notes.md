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

### The Big Picture: Why This Matters

| Without CI/CD | With CI/CD |
|---|---|
| Developer pushes broken code | Broken code is caught before merging |
| Manual deployments (forget steps, introduce errors) | Automated, consistent deployments every time |
| "Works on my machine" is a valid excuse | CI runs on a clean server — so that excuse is gone |
| Team must communicate deployment schedule | Deploy automatically on every merge to `main` |
| Finding bugs in production (expensive) | Finding bugs in PR review (cheap) |

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
  pull_request:
    branches: [ "main" ]

# 2. The Job
jobs:
  build-and-test:
    runs-on: ubuntu-latest

    # 3. The Steps
    steps:
    - name: 📥 Download the Code
      uses: actions/checkout@v4       # Download the code

    - name: ⚙️ Setup Node.js
      uses: actions/setup-node@v4     # Install Node.js
      with:
        node-version: 20

    - name: 📦 Install Dependencies
      run: npm ci                     # Install dependencies cleanly

    - name: 🧪 Run Tests
      run: npm test                   # Run the tests!
```

> **Note on `npm ci` vs `npm install`:** `npm ci` (short for "clean install") is designed for CI pipelines. It deletes `node_modules` and reinstalls from scratch based on `package-lock.json`, ensuring a perfectly reproducible build every time. Always use `npm ci` in CI workflows.

---

## 2a. Naming Your Steps

The `name:` field on each step is what appears in the GitHub Actions UI when you watch your pipeline run. Good names make debugging dramatically easier.

**Without good names**, your log looks like this:
```
✓ Run
✓ Run
✗ Run   ← Which run failed? What was it doing?
```

**With good names**, your log looks like this:
```
✓ 📥 Download the Code
✓ ⚙️ Setup Node.js 20
✗ 🧪 Run Automated Tests   ← Immediately obvious what failed
```

### Before/After Example

```yaml
# ❌ Bad — hard to debug when something goes wrong
steps:
  - uses: actions/checkout@v4
  - run: npm ci
  - run: npm test
  - run: npm run build

# ✅ Good — every step is immediately identifiable in the Actions log
steps:
  - name: 📥 Download the Code
    uses: actions/checkout@v4

  - name: 📦 Install Dependencies
    run: npm ci

  - name: 🧪 Run Automated Tests
    run: npm test

  - name: 🏗️ Build for Production
    run: npm run build
```

Rule of thumb: **Every step should have a `name:`** that explains *what* it's doing and *why*.

---

## 2b. Dependency Caching — Making Your Pipeline Fast

### The Problem

By default, `npm ci` downloads and installs all `node_modules` from the npm registry from scratch on every pipeline run. For a typical project with 300+ packages, this takes **2–3 minutes**.

If your team pushes 20 times a day, that's 40–60 minutes of pipeline time wasted downloading the same packages over and over.

### The Solution: `actions/cache`

The `actions/cache` action saves your `~/.npm` cache folder between runs and restores it if `package-lock.json` hasn't changed. If the lock file hasn't changed, the packages haven't changed — so there's no need to re-download.

```yaml
steps:
  - name: 📥 Download the Code
    uses: actions/checkout@v4

  - name: ⚡ Cache node_modules
    uses: actions/cache@v4
    with:
      path: ~/.npm
      # The cache key changes if package-lock.json changes
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  - name: 📦 Install Dependencies
    run: npm ci

  - name: 🧪 Run Tests
    run: npm test
```

### Understanding the Cache Key Formula

```
${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

| Part | What it does |
|---|---|
| `${{ runner.os }}` | OS name (Linux, Windows, macOS) — keeps caches separate per OS |
| `-node-` | A literal label so you can identify this cache in the dashboard |
| `${{ hashFiles('**/package-lock.json') }}` | A fingerprint of your lock file — changes when dependencies change |

**Result:** `Linux-node-a1b2c3d4e5f6...`

If `package-lock.json` hasn't changed → cache hit → `npm ci` runs almost instantly.
If `package-lock.json` changed → cache miss → `npm ci` downloads fresh → saves new cache.

### Typical Time Savings

| Scenario | Without Cache | With Cache |
|---|---|---|
| First run (no cache yet) | 2 min 30 sec | 2 min 30 sec |
| Subsequent runs (no dep changes) | 2 min 30 sec | **12 seconds** |
| After adding a new package | 2 min 30 sec | 2 min 30 sec (cache miss, then saves new cache) |

---

## 2c. Matrix Builds — Testing on Multiple Node Versions

### The Problem

Your `package.json` says `"engines": { "node": ">=18" }`. But does your app actually work on Node 18? What about Node 20? What about Node 22 (the upcoming LTS)?

Without matrix builds, you have to manually run your tests on each version. That doesn't scale.

### The Solution: `strategy.matrix`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]   # 3 jobs will run in parallel!
    steps:
      - name: 📥 Download the Code
        uses: actions/checkout@v4

      - name: ⚙️ Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}  # Reads from the matrix

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🧪 Run Tests on Node ${{ matrix.node-version }}
        run: npm test
```

### What Happens When You Push

GitHub creates **3 separate parallel jobs**:

```
✓ test (18)  ← Node 18 job
✓ test (20)  ← Node 20 job
✗ test (22)  ← Node 22 job FAILED!
```

Now you know exactly which Node version has the problem. Without matrix builds, you'd only test on one version and potentially miss compatibility issues.

### Matrix with Multiple Dimensions

You can even test across multiple operating systems:
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node-version: [18, 20]
```
This creates **4 jobs** (2 OS × 2 Node versions). Useful if your app needs to support Windows servers.

---

## 2d. Job Dependencies — `needs:`

### The Problem

By default, all jobs in a workflow file run **in parallel**. That means if you have a `test` job and a `deploy` job, they both start at the same time. Your app could get deployed to production even while the tests are still running (or failing!).

### The Solution: `needs:`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Download the Code
        uses: actions/checkout@v4
      - name: 📦 Install Dependencies
        run: npm ci
      - name: 🧪 Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test          # ← This is the magic line!
    if: github.ref == 'refs/heads/main'  # Only deploy from main branch
    steps:
      - name: 🚀 Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

With `needs: test`, the `deploy` job will:
- **Wait** for the `test` job to finish
- **Only run** if the `test` job exits with code 0 (success)
- **Be cancelled automatically** if the `test` job fails

### Chaining Multiple Jobs

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: lint       # Test only runs if lint passes
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: [lint, test]  # Deploy only runs if BOTH lint AND test pass
    runs-on: ubuntu-latest
    steps: [...]
```

This creates a linear pipeline: **Lint → Test → Deploy**.

---

## 3. Reading the Logs — Debugging a Failed Pipeline

### Step-by-Step: Finding the Error

When your pipeline fails, don't panic. Follow these steps:

1. **Go to your repo on GitHub.com** → Click the **Actions** tab (top navigation)
2. **Find the failed run** — it shows a red ❌ and the commit message that triggered it
3. **Click the failed run** to open the workflow summary page
4. **Find the failed job** — look for a red ❌ in the job list on the left sidebar
5. **Click the failed job** to see the step-by-step breakdown
6. **Find the failed step** — look for the ❌ next to a specific step name
7. **Click to expand it** — read the last 10–20 lines carefully. The actual error is almost always there.

### The Golden Rule of Log Reading

> Start from the **bottom** of the failed step and read **upward**. The final line is usually the symptom; the lines above explain the cause.

### Common Error Patterns and Fixes

| What You See in the Log | What It Means | How to Fix It |
|---|---|---|
| `Error: Cannot find module 'express'` | Package not installed — `npm ci` may not have run first | Check the order of your steps; ensure `npm ci` is before `npm test` |
| `ENOENT: no such file or directory, open './src/server.js'` | File path is wrong relative to the repo root | Check that the file exists at that exact path in your repo |
| `npm test` exited with code 1 | Tests failed — the code has a bug | Read the Jest/Mocha output **above** this line to see which test failed |
| `Permission denied: ./scripts/deploy.sh` | Shell script doesn't have execute permission | Add a step: `run: chmod +x ./scripts/deploy.sh` before running it |
| Process timed out after 360 minutes | Job hung indefinitely — something is waiting forever | Look for a hanging `await`, an open database connection, or a server that never closes |
| `401 Unauthorized` from Vercel/Render API | The `VERCEL_TOKEN` secret has expired or is wrong | Go to GitHub → Settings → Secrets and rotate the token |
| `yaml: line 14: did not find expected key` | YAML syntax error in your workflow file | Open the workflow file and check indentation around line 14 |

### Reading a Real Failure Example

```
Run npm test
> my-app@1.0.0 test
> jest

FAIL src/auth.test.js
  ● Auth › should return 401 for invalid token

    expect(received).toBe(expected)

    Expected: 401
    Received: 200

      16 | it('should return 401 for invalid token', async () => {
    > 17 |   expect(response.status).toBe(401);
         |                           ^
      18 | });

Tests:   1 failed, 5 passed, 6 total
npm ERR! code 1
Process completed with exit code 1.
```

**What you learn:**
- File: `src/auth.test.js`
- Test: "Auth › should return 401 for invalid token"
- Problem: The endpoint is returning 200 when it should return 401
- Fix: Check your token validation middleware

---

## 4. Branch Protection Rules

### Why Branch Protection Exists

GitHub Actions are only as useful as you make them. If a developer can push directly to `main` without going through CI, the entire pipeline is optional — and developers under deadline pressure will skip it.

**Branch protection rules make CI mandatory.** They block merging until the pipeline passes.

### Step-by-Step: Enabling Branch Protection

1. Go to your repository on GitHub → **Settings** tab
2. Click **Branches** in the left sidebar
3. Click **Add branch ruleset** (or "Add rule" on older repos)
4. Set **Branch name pattern** to `main`
5. Enable these options:
   - ✅ **Require a pull request before merging** — no direct pushes to `main`
   - ✅ **Require status checks to pass before merging**
   - In the search box, type the name of your CI job (e.g., `build-and-test`) and select it
   - ✅ **Require branches to be up to date before merging** — prevents merge races
   - ✅ **Do not allow bypassing the above settings** — applies to admins too
6. Click **Create** or **Save changes**

### What Happens After Enabling

```
git push origin main   # This is now BLOCKED! You'll see:
# remote: error: GH006: Protected branch update failed for refs/heads/main
```

All changes must now flow through this process:
1. Create a feature branch: `git checkout -b feature/add-login`
2. Push the branch: `git push origin feature/add-login`
3. Open a Pull Request on GitHub
4. GitHub Actions automatically runs CI
5. If CI fails → merge is blocked (reviewers see a red ❌)
6. If CI passes → merge is allowed (reviewers see a green ✅)
7. Someone reviews and merges → CD pipeline auto-deploys

### Why This is Industry Standard

Every serious software company uses branch protection. It prevents:
- Accidental direct pushes to `main`
- Untested code reaching production
- Merge conflicts that break the `main` branch
- "It worked on my machine" reaching real users

---

## 5. YAML Indentation — The Most Common Mistake

YAML (Yet Another Markup Language) is extremely sensitive to whitespace. One misplaced space will break your entire workflow with a cryptic error.

### The Rules

1. **Use 2 spaces for indentation** — never tabs, never 4 spaces
2. **Never mix tabs and spaces** in the same file
3. **List items use a dash (`-`)** followed by a space
4. **Nested keys are indented 2 more spaces** than their parent

### A Broken Example

```yaml
# ❌ BROKEN — mixing tab and space indentation
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
	  - run: npm ci     # ← This line uses a TAB character! Will fail.
      - run: npm test
```

**Error you'll see:**
```
yaml: line 6: found character that cannot start any token
```

### The Fixed Version

```yaml
# ✅ CORRECT — consistent 2-space indentation
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm ci
      - run: npm test
```

### A Realistic Indentation Mistake

```yaml
# ❌ BROKEN — 'with:' block is at wrong level
- name: Setup Node
  uses: actions/setup-node@v4
with:            # ← This should be indented 2 more spaces under the step!
  node-version: 20
```

```yaml
# ✅ CORRECT
- name: Setup Node
  uses: actions/setup-node@v4
  with:          # ← Now correctly nested under the step
    node-version: 20
```

### How to Avoid YAML Errors

1. **Install the "YAML" VS Code extension** (by Red Hat). It underlines indentation errors with a red squiggly line before you ever push.
2. **Use a YAML validator**: Paste your workflow at [yamlchecker.com](https://yamlchecker.com)
3. **Copy from working examples** rather than writing from scratch
4. **Use the GitHub Actions workflow editor** — github.com provides an inline editor with syntax highlighting and error checking

### YAML Cheat Sheet

```yaml
# String value
key: value

# Number value
count: 42

# Boolean
enabled: true

# List of strings
branches:
  - main
  - develop

# List of objects (steps)
steps:
  - name: First Step    # Each item in list starts with -
    run: echo hello     # Properties of item are indented under it

  - name: Second Step
    run: echo world

# Nested object
strategy:
  matrix:
    node-version: [18, 20, 22]
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

### Secrets vs Environment Variables

| Feature | Secrets | Env Variables (non-secret) |
|---|---|---|
| Encrypted at rest | ✅ Yes | ❌ No |
| Masked in logs | ✅ Yes (shows `***`) | ❌ No |
| Editable after creation | ❌ No (replace only) | ✅ Yes |
| Best for | API keys, passwords, tokens | Non-sensitive config |
| Accessed via | `${{ secrets.MY_SECRET }}` | `${{ vars.MY_VAR }}` |

### Common Secrets You'll Need

| Secret Name | What It Contains |
|---|---|
| `VERCEL_TOKEN` | Your Vercel personal access token (for deploying) |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID |
| `VERCEL_PROJECT_ID` | Your specific Vercel project ID |
| `RENDER_DEPLOY_HOOK_URL` | A Render webhook URL that triggers a deploy |
| `DATABASE_URL` | Your production database connection string |

---

## 6. Complete Reference: Common Mistakes

| Mistake | Symptoms / Error | Fix |
|---|---|---|
| **Tab instead of spaces in YAML** | `yaml parse error: found character that cannot start any token` | Use 2 spaces for every indentation level; install the YAML VS Code extension |
| **Wrong directory path in workflow** | `npm test` passes locally but `ENOENT: no such file` in CI | Remember CI starts from the repo root; use `working-directory:` if your code is in a subfolder |
| **Missing `needs:` on deploy job** | Deploy runs even when tests fail | Add `needs: [build-and-test]` to your deploy job |
| **Expired or wrong GitHub Secret** | `401 Unauthorized` from Vercel/Render API | Go to Settings → Secrets → delete and recreate the secret with a fresh token |
| **`node_modules` committed to Git** | PR has 40,000+ changed files; repo is massive | Add `node_modules/` to `.gitignore` and remove it with `git rm -r --cached node_modules` |
| **Using `npm install` instead of `npm ci`** | Inconsistent builds; lockfile may be silently ignored | Always use `npm ci` in CI workflows |
| **Missing environment variables** | `Cannot read properties of undefined` at startup | Add required env vars to GitHub Secrets and reference them in your workflow `env:` block |
| **Wrong event trigger** | Workflow runs on every branch, not just `main` | Use `branches: ["main"]` filter under your `on.push` or `on.pull_request` |

---

## 4. Why Does This Matter?

By using GitHub Actions:
- **No broken code goes live:** Bugs are caught in the Pull Request phase.
- **Faster deployments:** You merge code, and 30 seconds later, it's live on the internet.
- **Consistency:** You don't have to remember to run `npm build` or `eslint` locally; the server does it for you.
- **Accountability:** The Actions log is a permanent audit trail of every deployment and who triggered it.
- **Collaboration:** New team members can contribute without being trusted to run the right commands — the pipeline enforces the process.

### The Developer Workflow with CI/CD

```
1. git checkout -b feature/my-feature
2. Write code + write tests
3. git push origin feature/my-feature
4. Open Pull Request on GitHub
5. ← GitHub Actions runs automatically →
   ├── Installs dependencies
   ├── Runs linter
   ├── Runs tests
   └── Reports: ✅ All checks passed
6. Team member reviews and approves PR
7. Merge to main
8. ← CD pipeline runs automatically →
   └── Deploys to production
9. Done! No manual deployment needed.
```

---

## Quick Reference

### Essential Workflow Template

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - name: 📥 Download the Code
        uses: actions/checkout@v4

      - name: ⚡ Cache npm packages
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: ${{ runner.os }}-node-

      - name: ⚙️ Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🧪 Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    steps:
      - name: 🚀 Trigger Render Deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
```

### Workflow File Checklist

- [ ] File is in `.github/workflows/` directory
- [ ] File ends in `.yml` or `.yaml`
- [ ] `on:` trigger is defined
- [ ] At least one job is defined
- [ ] Job has `runs-on: ubuntu-latest`
- [ ] Steps are properly indented (2 spaces)
- [ ] Deploy job has `needs:` pointing to the test job
- [ ] Secrets referenced via `${{ secrets.SECRET_NAME }}`
- [ ] `npm ci` used (not `npm install`)
