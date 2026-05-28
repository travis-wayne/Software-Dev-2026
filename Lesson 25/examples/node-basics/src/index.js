import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import inquirer from 'inquirer';


// 🎓 ES Module imports (modern syntax — same as React)
import { multiply, divide } from './esm-math.js';
import { runQuiz } from './quiz.js';

// 🎓 CommonJS import inside an ES Module project
// Because our package.json has "type": "module", ALL .js files default to ESM.
// To load a CommonJS file (.cjs), we must use createRequire.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjsMath = require('./commonjs-math.cjs');

// ─── Header ─────────────────────────────────────────────────────────────────
function showHeader() {
  console.clear();
  // chalk.hex() is the safe way to use custom colours in Chalk v5
  console.log(chalk.hex('#6366f1')(figlet.textSync('Node.js 101', { font: 'Standard' })));
  console.log(
    boxen(
      chalk.white.bold('Welcome to the Interactive Node.js Lesson!\n') +
      chalk.gray('Navigate the menu below to learn concepts, run live demos, and take the quiz.\n\n') +
      chalk.hex('#6366f1')('■ ') + chalk.cyan('ES Modules') + '  ' +
      chalk.hex('#f59e0b')('■ ') + chalk.yellow('CommonJS') + '  ' +
      chalk.hex('#10b981')('■ ') + chalk.green('NPM Packages'),
      { padding: 1, margin: { top: 0, bottom: 1, left: 2, right: 2 }, borderStyle: 'round', borderColor: 'gray' }
    )
  );
}

// ─── Concept Screens ────────────────────────────────────────────────────────
const CONCEPTS = {
  concept_node: {
    title: '📦  What is Node.js?',
    color: '#6366f1',
    content: [
      chalk.bold.white('The Core Idea'),
      chalk.gray('For years, JavaScript could ONLY run in a browser. In 2009,'),
      chalk.gray('Ryan Dahl changed everything by embedding Chrome\'s V8 engine'),
      chalk.gray('into a standalone program — that program is Node.js.\n'),

      chalk.bold.white('Key Fact: Node.js is NOT a language.'),
      chalk.gray('It is a ') + chalk.cyan('runtime environment') + chalk.gray(' — a program that can EXECUTE JavaScript.\n'),

      chalk.bold.white('The 3 Superpowers of Node.js'),
      chalk.hex('#6366f1')('  1. V8 Engine:    ') + chalk.gray('The same ultra-fast engine that powers Google Chrome.'),
      chalk.hex('#10b981')('  2. Non-Blocking:  ') + chalk.gray('Handles thousands of users at once without freezing.'),
      chalk.hex('#f59e0b')('  3. One Language:  ') + chalk.gray('Write frontend (React) and backend (Node) in pure JS.\n'),

      chalk.bold.white('The Event Loop (Quick Intro)'),
      chalk.gray('Node runs on a single thread. When it hits a slow task (like fetching'),
      chalk.gray('from a database), it does NOT wait. It registers a callback and moves'),
      chalk.gray('on. When the task is done, the callback fires. This is ') + chalk.cyan('non-blocking I/O') + chalk.gray('.')
    ].join('\n')
  },
  concept_npm: {
    title: '📦  NPM & package.json',
    color: '#f59e0b',
    content: [
      chalk.bold.white('What is NPM?'),
      chalk.gray('NPM stands for ') + chalk.yellow('Node Package Manager') + chalk.gray('. It has two jobs:'),
      chalk.gray('  1. A registry of 2 million+ open-source packages (npmjs.com).'),
      chalk.gray('  2. A CLI tool that installs those packages into your project.\n'),

      chalk.bold.white('The package.json file'),
      chalk.gray('Running ') + chalk.yellow('pnpm init') + chalk.gray(' creates ') + chalk.cyan('package.json') + chalk.gray(' — your project\'s manifest. It stores:'),
      chalk.gray('  • Project name, version, description'),
      chalk.gray('  • Run scripts (') + chalk.gray('"start": "node index.js"') + chalk.gray(')'),
      chalk.gray('  • Dependencies (packages others must install to run your app)\n'),

      chalk.bold.white('Installing a Package'),
      '  ' + chalk.yellow('pnpm install chalk') + chalk.gray('   ← downloads chalk into node_modules/'),
      '  ' + chalk.yellow('pnpm install -D nodemon') + chalk.gray(' ← installs as a devDependency\n'),

      chalk.bold.white('⚠  Golden Rule — NEVER commit node_modules to Git!'),
      chalk.gray('  The folder can be hundreds of MB. Instead, Git tracks ') + chalk.cyan('package.json') + chalk.gray('.'),
      chalk.gray('  Anyone who clones your repo just runs ') + chalk.yellow('pnpm install') + chalk.gray(' to rebuild it.')
    ].join('\n')
  },
  concept_modules: {
    title: '📂  CommonJS vs ES Modules',
    color: '#10b981',
    content: [
      chalk.bold.white('Why Modules?'),
      chalk.gray('Writing all your code in one file becomes unmaintainable.'),
      chalk.gray('Modules let you split code across files and import what you need.\n'),

      chalk.bold.white('CommonJS  (older — still very common)'),
      chalk.gray('Uses: ') + chalk.yellow('require()') + chalk.gray(' / ') + chalk.yellow('module.exports'),
      chalk.gray('File extension: ') + chalk.cyan('.cjs') + chalk.gray(' (or .js in a non-ESM project)\n') +
      chalk.gray('  // Exporting\n') +
      chalk.green('  module.exports = { add, subtract };\n') +
      chalk.gray('  // Importing\n') +
      chalk.green('  const math = require(\'./math.cjs\');\n'),

      chalk.bold.white('ES Modules  (modern standard — same as React!)'),
      chalk.gray('Uses: ') + chalk.cyan('export') + chalk.gray(' / ') + chalk.cyan('import'),
      chalk.gray('Requires: ') + chalk.yellow('"type": "module"') + chalk.gray(' in package.json\n') +
      chalk.gray('  // Exporting\n') +
      chalk.green('  export function multiply(a, b) { return a * b; }\n') +
      chalk.gray('  // Importing\n') +
      chalk.green('  import { multiply } from \'./math.js\';')
    ].join('\n')
  }
};

// ─── Module Live Demo ───────────────────────────────────────────────────────
async function showModuleDemo() {
  console.clear();

  const demoBox = (label, syntax, results) =>
    boxen(
      chalk.bold(label) + '\n' + chalk.gray(syntax) + '\n\n' + results,
      { padding: 1, borderStyle: 'round', borderColor: 'gray', width: 56 }
    );

  console.log(chalk.bold.hex('#6366f1')('\n  🛠  Live Module Demo\n'));

  // CommonJS
  console.log(
    demoBox(
      chalk.yellow('1. CommonJS  (commonjs-math.cjs)'),
      '   require() / module.exports',
      `   add(5, 3)       = ${chalk.green(cjsMath.add(5, 3))}\n` +
      `   subtract(10, 4) = ${chalk.green(cjsMath.subtract(10, 4))}`
    )
  );

  // ESM
  console.log(
    demoBox(
      chalk.cyan('2. ES Modules  (esm-math.js)'),
      '   import / export',
      `   multiply(4, 4)  = ${chalk.green(multiply(4, 4))}\n` +
      `   divide(20, 5)   = ${chalk.green(divide(20, 5))}\n` +
      `   divide(10, 0)   = ${chalk.red(divide(10, 0))}`
    )
  );

  console.log(
    boxen(
      chalk.gray('💡 ') + chalk.white('Notice: ') +
      chalk.gray('Both systems produce the same results — the difference\nis only in the SYNTAX used to share code between files.'),
      { padding: 1, borderStyle: 'round', borderColor: 'gray' }
    )
  );

  await pauseForMenu();
  await mainMenu();
}

// ─── Concept Viewer ──────────────────────────────────────────────────────────
async function showConcept(key) {
  const { title, color, content } = CONCEPTS[key];
  console.clear();
  console.log(
    boxen(content, {
      title: chalk.bold.hex(color)(title),
      titleAlignment: 'center',
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'gray'
    })
  );
  await pauseForMenu();
  await mainMenu();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function pauseForMenu() {
  await inquirer.prompt([{
    type: 'confirm',
    name: '_',
    message: chalk.gray('Press Enter to return to the main menu...'),
    default: true
  }]);
}

// ─── Main Menu ───────────────────────────────────────────────────────────────
async function mainMenu() {
  showHeader();

  const { action } = await inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'What would you like to explore?',
    choices: [
      { name: '📖  Concept 1 — What is Node.js?', value: 'concept_node' },
      { name: '📦  Concept 2 — NPM & package.json', value: 'concept_npm' },
      { name: '📂  Concept 3 — CommonJS vs ES Modules', value: 'concept_modules' },
      { name: '🛠   Live Demo — Run CJS & ESM side by side', value: 'demo_modules' },
      { name: '🧠  Take the Quiz', value: 'quiz' },
      new inquirer.Separator(),
      { name: '🚪  Exit', value: 'exit' }
    ]
  }]);

  switch (action) {
    case 'concept_node':
    case 'concept_npm':
    case 'concept_modules':
      await showConcept(action);
      break;
    case 'demo_modules':
      await showModuleDemo();
      break;
    case 'quiz':
      await runQuiz();
      await mainMenu();
      break;
    case 'exit':
      console.log('\n' + chalk.gray('  Thanks for learning Node.js! 👋\n'));
      process.exit(0);
  }
}

mainMenu().catch(console.error);
