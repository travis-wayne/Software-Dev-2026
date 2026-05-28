import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';

const questions = [
  {
    type: 'list',
    name: 'q1',
    message: 'What is Node.js?',
    choices: [
      'A programming language',
      'A JavaScript runtime environment built on Chrome\'s V8 engine',
      'A frontend web framework',
      'A relational database'
    ],
    answer: 'A JavaScript runtime environment built on Chrome\'s V8 engine',
    explanation: 'Node.js allows you to run JavaScript on the server (outside the browser). It is not a language itself, but a runtime for JS.'
  },
  {
    type: 'list',
    name: 'q2',
    message: 'What does NPM stand for?',
    choices: [
      'Node Package Manager',
      'New Programming Method',
      'Node Project Maker',
      'Network Protocol Manager'
    ],
    answer: 'Node Package Manager',
    explanation: 'NPM is the default package manager for Node.js, used to install, share, and manage third-party code.'
  },
  {
    type: 'list',
    name: 'q3',
    message: 'Which of these is the correct syntax for CommonJS (older) imports?',
    choices: [
      'import fs from "fs"',
      'const fs = require("fs")',
      'load fs from "fs"',
      'include("fs")'
    ],
    answer: 'const fs = require("fs")',
    explanation: 'CommonJS uses `require()` to import modules and `module.exports` to export them. ES Modules use `import/export`.'
  },
  {
    type: 'list',
    name: 'q4',
    message: 'What file keeps track of your project\'s NPM dependencies?',
    choices: [
      'index.js',
      'node_modules',
      'package.json',
      'config.js'
    ],
    answer: 'package.json',
    explanation: '`package.json` acts as a manifest for your project, listing all the installed packages and their versions.'
  },
  {
    type: 'list',
    name: 'q5',
    message: 'Node.js is known for being:',
    choices: [
      'Multi-threaded and synchronous',
      'Single-threaded, event-driven, and non-blocking',
      'Only suitable for small applications',
      'A replacement for HTML and CSS'
    ],
    answer: 'Single-threaded, event-driven, and non-blocking',
    explanation: 'Node.js handles many concurrent connections efficiently because it does not block the thread while waiting for I/O operations (like reading from a database).'
  }
];

export async function runQuiz() {
  console.clear();
  console.log(
    boxen(chalk.cyan.bold('🎓 Node.js & NPM Quiz 🎓'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    })
  );

  let score = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const { userAnswer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'userAnswer',
        message: chalk.yellow(`Q${i + 1}: `) + q.message,
        choices: q.choices
      }
    ]);

    if (userAnswer === q.answer) {
      console.log(chalk.green('✅ Correct!\n'));
      score++;
    } else {
      console.log(chalk.red(`❌ Incorrect. The correct answer was: ${chalk.white(q.answer)}`));
      console.log(chalk.gray(`💡 Explanation: ${q.explanation}\n`));
    }
  }

  const percentage = Math.round((score / questions.length) * 100);
  let resultColor = percentage >= 80 ? chalk.green : percentage >= 50 ? chalk.yellow : chalk.red;

  console.log(
    boxen(
      `${chalk.bold('Quiz Complete!')}\n\nYour Score: ${resultColor(`${score} / ${questions.length} (${percentage}%)`)}`,
      { padding: 1, borderColor: 'magenta', borderStyle: 'round' }
    )
  );

  const { returnToMenu } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnToMenu',
      message: 'Press enter to return to the main menu...',
      default: true
    }
  ]);

  return returnToMenu;
}
