# Exercise: Building Your First CI Pipeline

In this exercise, you will set up Continuous Integration (CI) on your own GitHub repository to ensure that bad code is never merged into your `main` branch.

## Task 1 — The Setup

1. Open your backend API project in VS Code (from Lesson 33 or 34).
2. Create a new test file if you don't have one (e.g., `tests/example.test.js`):
   ```javascript
   test('Basic math works', () => {
     expect(1 + 1).toBe(2);
   });
   ```
3. Make sure your `package.json` has a `test` script:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```
4. Create the necessary folders exactly like this: `mkdir -p .github/workflows`.

---

## Task 2 — Writing the Pipeline

1. Create a file named `.github/workflows/ci.yml`.
2. Write the following YAML configuration. **Pay close attention to indentation!**
   ```yaml
   name: My First CI Pipeline

   on:
     push:
       branches: [ "main" ]

   jobs:
     build-and-test:
       runs-on: ubuntu-latest

       steps:
         - name: Download the repository code
           uses: actions/checkout@v4
           
         - name: Install Node.js
           uses: actions/setup-node@v4
           with:
             node-version: 20
             
         - name: Install project dependencies
           run: npm install
           
         - name: Run all tests
           run: npm test
   ```
3. Commit and push this file to your `main` branch on GitHub.
4. Quickly open your repository on GitHub.com and click the **Actions** tab at the top. You should see a yellow dot indicating your pipeline is running, followed by a green checkmark!

---

## Task 3 — Intentionally Breaking the Build

A CI pipeline isn't useful unless it catches errors. Let's force an error.

1. Go back to your test file (`tests/example.test.js`).
2. Change the math so it is incorrect:
   ```javascript
   test('Basic math works', () => {
     expect(1 + 1).toBe(5); // This is wrong!
   });
   ```
3. Commit and push your broken code to GitHub.
4. Go back to the **Actions** tab on GitHub.
5. Watch the runner. It will download your code, install dependencies, and run `npm test`. The test will fail, and the Action will turn into a **red X**.
6. Click into the failed action. Look at the logs. Notice how GitHub caught the exact `expect(1 + 1).toBe(5)` error!

---

## Task 4 — The Fix

1. Go back to VS Code.
2. Fix the test so it equals `2` again.
3. Commit and push.
4. Check the Actions tab. The pipeline will pass, the red X will disappear, and you have successfully implemented Continuous Integration! 

> **Bonus Challenge:** Can you update your `.yml` file to add a new step that runs ESLint? (e.g., `- run: npm run lint`). You'll need to add a lint script to your `package.json` first!
