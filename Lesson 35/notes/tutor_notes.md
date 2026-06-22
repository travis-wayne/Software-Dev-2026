# Lesson 35 — CI/CD Basics (GitHub Actions)
# 🗂️ Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this lesson students will be able to:

1. Explain the difference between Continuous Integration (testing) and Continuous Deployment (shipping).
2. Create `.github/workflows` directories and write basic YAML syntax.
3. Utilize `actions/checkout` and `actions/setup-node`.
4. Intentionally fail a CI pipeline to see GitHub's block mechanisms in action.
5. Manage repository Secrets for deployment actions.

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Blank GitHub Repo | Have a simple Express or Vite repo ready to demonstrate pushing workflows. |
| Jest Knowledge | Ensure you understand the basic `sum.test.js` syntax, as we use a tiny test to demonstrate CI passing/failing. |

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — The Concept of CI/CD (15 min)

**Goal**: Make them understand *why* we automate.

1. **The Scenario:** Ask the student: *"Imagine you work at Facebook. 100 developers are pushing code right now. How does Facebook ensure nobody accidentally pushes a typo that breaks the whole website?"*
2. **Define CI:** Explain that CI is a robot that runs `npm test` on a cloud computer before you are allowed to merge your code.
3. **Define CD:** Explain that CD is the robot moving the code to Vercel/Render after CI passes.

---

### Phase 2 — Writing Your First GitHub Action (35 min)

**Goal**: Build a CI pipeline that runs tests.

1. **The Setup:** Have the student create a new folder: `mkdir -p .github/workflows`. Emphasize that the spelling must be exact.
2. **Writing the YAML:** Guide them through creating `ci.yml`.
   - Explain `on: push` (The Trigger).
   - Explain `runs-on: ubuntu-latest` (The Virtual Machine).
   - Detail the `steps`: We need to download the code (`checkout@v4`), install Node (`setup-node@v4`), and run `npm install` + `npm test`.
3. **Live Demo (Crucial Step):** 
   - Have the student push code where the tests **fail**. 
   - Open GitHub, click the **Actions** tab, and watch the runner turn red. Show them the logs!
   - Fix the test, push again, and watch the runner turn green.

---

### Phase 3 — Secrets and CD (25 min)

**Goal**: Demystify how Actions talk to external services like Vercel.

1. **The Problem:** We want GitHub to tell Vercel to deploy, but GitHub needs our Vercel password. We can't put it in the code!
2. **Repository Secrets:** Walk the student through **Settings -> Secrets and variables -> Actions**. Have them create a dummy secret.
3. **Reviewing CD Templates:** Open the provided `2-cd-frontend.yml` and `3-cd-backend.yml` files in the `examples/` folder.
   - You don't need the student to build these from scratch today. Just read through them together, highlighting how `secrets.VERCEL_TOKEN` is injected into the runner's environment.
   - Explain that while Vercel auto-deploys out of the box, doing it manually via GitHub Actions gives you power to *stop* the deploy if CI tests fail.

---

### Phase 4 — Troubleshooting & YAML Nuances (15 min)

**Goal**: Prepare them for the strictness of YAML.

**Common Errors to Discuss:**
- **YAML Indentation:** Explain that YAML relies heavily on exact spacing. A missed space breaks the entire workflow.
- **Path errors:** The workflow file MUST be in `.github/workflows/`, not `.github/workflow/` or `github/workflows/`.
- **Missing Scripts:** If their workflow runs `npm test`, but their `package.json` doesn't have a `"test"` script, the Action will fail.

---

## Homework / Take-Home

Assign `exercises/github_actions_practice.md`.
Students will set up CI on their own projects and ensure their workflows successfully block bad code.
