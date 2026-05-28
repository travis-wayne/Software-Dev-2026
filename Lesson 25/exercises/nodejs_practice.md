# Exercises — Lesson 25: Node.js, NPM & Modules

In this practice session, you will initialize a brand new Node.js project from scratch, install an external package, and write a script to fetch data from the internet.

---

## Exercise 1: Project Initialization

1. Open a terminal and create a new directory for your project:
   ```bash
   mkdir my-first-node-app
   cd my-first-node-app
   ```
2. Initialize a new Node.js project using NPM:
   ```bash
   pnpm init
   ```
   *(This will create a `package.json` file in your directory with default settings).*
3. Open the `package.json` file in VS Code. Add `"type": "module"` so we can use modern `import` syntax:
   ```json
   {
     "name": "my-first-node-app",
     "version": "1.0.0",
     "type": "module",
     "main": "index.js",
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1"
     }
   }
   ```

---

## Exercise 2: Installing a Third-Party Package

We want to make an HTTP request to a public API. While Node has built-in ways to do this, the **Axios** library is much easier to use and very popular.

1. Install `axios` and a terminal styling library called `chalk`:
   ```bash
   pnpm install axios chalk
   ```
2. Look at your folder structure. You should now see:
   - `node_modules/` (Where the code for `axios` and `chalk` lives)
   - `pnpm-lock.yaml` (or `package-lock.json` if you used `npm`)
3. Look at your `package.json` again. Notice that `"axios"` and `"chalk"` have been added to the `"dependencies"` section!

---

## Exercise 3: Creating Your Own Module

Let's write a utility module to calculate factorials.

1. Create a file called `mathUtils.js`.
2. Write a function that calculates the factorial of a number (e.g., `5!` = 5 × 4 × 3 × 2 × 1 = 120).
3. Export it using modern ES Module syntax.

```javascript
// mathUtils.js
export function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}
```

---

## Exercise 4: The Main Application

Now let's bring it all together.

1. Create a file called `index.js`.
2. Import `axios` and `chalk`.
3. Import your custom `factorial` function.
4. Write a script that calculates a factorial, prints it in color, and then fetches a random joke from an API.

```javascript
// index.js
import axios from 'axios';
import chalk from 'chalk';
import { factorial } from './mathUtils.js';

console.log(chalk.blue.bold('--- Node.js Practice App ---'));

// 1. Use your custom module
const num = 5;
const result = factorial(num);
console.log(`The factorial of ${num} is: ${chalk.green(result)}`);

// 2. Use the third-party axios module to fetch data
console.log(chalk.yellow('\nFetching a programming joke...'));

async function getJoke() {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Programming?type=single');
    console.log(chalk.cyan.italic(`\n"${response.data.joke}"`));
  } catch (error) {
    console.log(chalk.red('Failed to fetch joke:', error.message));
  }
}

getJoke();
```

---

## Exercise 5: Running Your App

1. In your terminal, run your application:
   ```bash
   node index.js
   ```
2. You should see the factorial calculated in green, followed by a programming joke in cyan!
3. **Bonus:** Add a `"start": "node index.js"` script to your `package.json` so you can run it using `pnpm start`.
