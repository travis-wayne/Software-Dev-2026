import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';

// ─── Questions ───────────────────────────────────────────────────────────────
const questions = [
  {
    message: 'Node.js is best described as:',
    choices: [
      'A brand-new programming language',
      'A JavaScript runtime built on Chrome\'s V8 engine',
      'A frontend CSS framework',
      'A relational database management system'
    ],
    answer: 'A JavaScript runtime built on Chrome\'s V8 engine',
    explanation: 'Node.js is NOT a language — JavaScript is the language. Node.js is the RUNTIME: the program that can execute JavaScript outside a browser, powered by Chrome\'s fast V8 engine.'
  },
  {
    message: 'What does NPM stand for?',
    choices: [
      'New Programming Method',
      'Node Project Maker',
      'Node Package Manager',
      'Network Protocol Manager'
    ],
    answer: 'Node Package Manager',
    explanation: 'NPM is the default package manager that ships with Node.js. It lets you install, publish, and manage open-source packages from the npmjs.com registry.'
  },
  {
    message: 'Which syntax is used to IMPORT in the CommonJS (older) module system?',
    choices: [
      'import math from "./math.js"',
      'load("./math.cjs")',
      'const math = require("./math.cjs")',
      'include "./math.cjs"'
    ],
    answer: 'const math = require("./math.cjs")',
    explanation: 'CommonJS uses require() to import and module.exports to export. ES Modules (the modern standard) use import/export — the same syntax you already know from React.'
  },
  {
    message: 'Which file keeps track of all installed NPM dependencies?',
    choices: [
      'index.js',
      'node_modules/index.json',
      '.npmrc',
      'package.json'
    ],
    answer: 'package.json',
    explanation: 'package.json is your project\'s manifest. It lists every package your project depends on. When someone clones your repo and runs "pnpm install", NPM reads this file to know what to download.'
  },
  {
    message: 'Why should you NEVER commit the node_modules folder to Git?',
    choices: [
      'Git doesn\'t support folders with that name',
      'It contains private API keys',
      'It can be hundreds of MB in size and is fully reproducible from package.json',
      'Node.js deletes it automatically on deployment'
    ],
    answer: 'It can be hundreds of MB in size and is fully reproducible from package.json',
    explanation: 'node_modules is just a cache of downloaded code. Any developer can re-create it exactly by running "pnpm install", which reads package.json. Committing it bloats your repo massively.'
  },
  {
    message: 'To use modern ES Module (import/export) syntax in a Node.js project, what must you add to package.json?',
    choices: [
      '"module": true',
      '"type": "module"',
      '"esm": "enabled"',
      '"syntax": "import"'
    ],
    answer: '"type": "module"',
    explanation: 'By default, Node.js treats .js files as CommonJS. Adding "type": "module" tells Node to treat all .js files as ES Modules, unlocking the import/export syntax you use in React.'
  },
  {
    message: 'Node.js handles many concurrent users efficiently because it is:',
    choices: [
      'Multi-threaded and synchronous',
      'Single-threaded, event-driven, and non-blocking',
      'Written in Python for performance',
      'Hosted on a supercomputer'
    ],
    answer: 'Single-threaded, event-driven, and non-blocking',
    explanation: 'Node.js never "waits" for slow I/O operations (like database reads). It registers a callback, moves on to the next request, and returns to the callback when the data is ready. This is the Event Loop.'
  }
];

// ─── Progress Bar Helper ──────────────────────────────────────────────────────
function progressBar(current, total) {
  const filled = Math.round((current / total) * 20);
  const bar = chalk.hex('#6366f1')('█').repeat(filled) + chalk.gray('░').repeat(20 - filled);
  return `  [${bar}] ${chalk.white(current)}/${chalk.white(total)}`;
}

// ─── Quiz Runner ──────────────────────────────────────────────────────────────
export async function runQuiz() {
  console.clear();
  console.log(
    boxen(
      chalk.bold.white('🧠  Node.js & NPM — Knowledge Check\n') +
      chalk.gray(`  ${questions.length} questions  •  Read each carefully!\n`) +
      chalk.gray('  Explanations are shown after every answer.'),
      { padding: 1, margin: { top: 0, bottom: 1, left: 2, right: 2 }, borderStyle: 'double', borderColor: 'gray' }
    )
  );

  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    // Show progress
    console.log(progressBar(i, questions.length));
    console.log('');

    const { userAnswer } = await inquirer.prompt([{
      type: 'list',
      name: 'userAnswer',
      message: chalk.white(`Q${i + 1}:  ${q.message}`),
      choices: q.choices
    }]);

    const isCorrect = userAnswer === q.answer;
    if (isCorrect) score++;

    // Feedback panel
    console.log(
      boxen(
        (isCorrect
          ? chalk.bold.green('✅  Correct!\n')
          : chalk.bold.red('❌  Not quite.\n') +
            chalk.gray('    Correct answer: ') + chalk.white(q.answer) + '\n'
        ) +
        chalk.gray('\n💡  Why: ') + chalk.white(q.explanation),
        {
          padding: 1,
          margin: { top: 0, bottom: 1, left: 2, right: 2 },
          borderStyle: 'round',
          borderColor: isCorrect ? 'green' : 'red'
        }
      )
    );
  }

  // Final score
  const pct = Math.round((score / questions.length) * 100);
  const colour = pct >= 80 ? chalk.green : pct >= 57 ? chalk.yellow : chalk.red;
  const grade = pct >= 80 ? '🏆  Excellent!' : pct >= 57 ? '👍  Good effort!' : '📖  Review the concepts and try again.';

  console.log(progressBar(questions.length, questions.length));
  console.log(
    boxen(
      chalk.bold.white('Quiz Complete!\n\n') +
      `  Score: ${colour(`${score} / ${questions.length}`)}  ${colour(`(${pct}%)`)}\n\n` +
      `  ${grade}`,
      { padding: 1, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderStyle: 'double', borderColor: 'gray' }
    )
  );

  await inquirer.prompt([{
    type: 'confirm',
    name: '_',
    message: chalk.gray('Press Enter to return to the main menu...'),
    default: true
  }]);
}
