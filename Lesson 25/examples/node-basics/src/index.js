import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

// 🎓 ES Module imports (modern)
import { multiply, divide } from './esm-math.js';
import { runQuiz } from './quiz.js';

// 🎓 CommonJS import in an ES Module context
// In pure Node.js, to import a CommonJS file (.cjs) into an ESM file (.js/.mjs), 
// we use the default import syntax, or the Node module 'module' to create require.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cjsMath = require('./commonjs-math.cjs');

function showHeader() {
  console.clear();
  console.log(
    chalk.indigo(
      figlet.textSync('Node.js 101', { horizontalLayout: 'full' })
    )
  );
  console.log(
    boxen(
      chalk.white('Welcome to the interactive Node.js & Modules lesson!\n') +
      chalk.gray('This CLI app demonstrates ') + chalk.green('NPM packages') + chalk.gray(', ') + 
      chalk.cyan('ES Modules') + chalk.gray(', and ') + chalk.yellow('CommonJS') + chalk.gray('.'),
      { padding: 1, margin: 1, borderStyle: 'double', borderColor: 'blue' }
    )
  );
}

async function showModuleDemo() {
  console.clear();
  console.log(chalk.cyan.bold('--- Module Demo ---'));
  
  console.log(chalk.yellow('\n1. CommonJS Math (commonjs-math.cjs)'));
  console.log(chalk.gray('Using require() / module.exports'));
  console.log(`Add(5, 3) = ${chalk.green(cjsMath.add(5, 3))}`);
  console.log(`Subtract(10, 4) = ${chalk.green(cjsMath.subtract(10, 4))}`);

  console.log(chalk.cyan('\n2. ES Module Math (esm-math.js)'));
  console.log(chalk.gray('Using import / export'));
  console.log(`Multiply(4, 4) = ${chalk.green(multiply(4, 4))}`);
  console.log(`Divide(20, 5) = ${chalk.green(divide(20, 5))}`);
  console.log(`Divide(10, 0) = ${chalk.red(divide(10, 0))}`);

  console.log('\n');
  const { returnToMenu } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnToMenu',
      message: 'Press enter to return to the main menu...',
      default: true
    }
  ]);
  
  if (returnToMenu) {
    await mainMenu();
  }
}

async function mainMenu() {
  showHeader();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📖 Read Concept: What is Node.js?', value: 'concept_node' },
        { name: '📖 Read Concept: NPM & package.json', value: 'concept_npm' },
        { name: '🛠️  Run Module Demo (CJS vs ESM)', value: 'demo_modules' },
        { name: '🧠 Take the Interactive Quiz', value: 'quiz' },
        { name: '🚪 Exit', value: 'exit' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'concept_node':
      showConcept(
        'What is Node.js?',
        'Node.js is a runtime environment that allows you to run JavaScript on the server. ' +
        'Before Node.js, JavaScript could only run inside a web browser.\n\n' +
        chalk.bold('Key Features:\n') +
        '1. ' + chalk.cyan('V8 Engine:') + ' It uses Google Chrome\'s incredibly fast JavaScript engine.\n' +
        '2. ' + chalk.yellow('Non-blocking / Asynchronous:') + ' It can handle thousands of concurrent connections without freezing.\n' +
        '3. ' + chalk.green('Single Language:') + ' You can write full-stack applications using only JavaScript!'
      );
      break;
    case 'concept_npm':
      showConcept(
        'NPM & package.json',
        'NPM stands for Node Package Manager. It is the world\'s largest software registry.\n\n' +
        'When you run ' + chalk.yellow('npm init') + ', it creates a ' + chalk.cyan('package.json') + ' file. ' +
        'This file is the "manifest" of your project. It keeps track of:\n' +
        '- Your project\'s name and version\n' +
        '- The scripts you can run (like ' + chalk.gray('npm start') + ')\n' +
        '- The external packages your project needs (like chalk, inquirer, lodash)\n\n' +
        'When you run ' + chalk.yellow('npm install chalk') + ', NPM downloads the code into the ' + chalk.cyan('node_modules') + ' folder.'
      );
      break;
    case 'demo_modules':
      await showModuleDemo();
      break;
    case 'quiz':
      await runQuiz();
      await mainMenu();
      break;
    case 'exit':
      console.log(chalk.gray('\nThanks for learning Node.js! See you next time. 👋\n'));
      process.exit(0);
  }
}

async function showConcept(title, body) {
  console.clear();
  console.log(
    boxen(body, {
      title: chalk.bold.magenta(title),
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'magenta'
    })
  );

  const { returnToMenu } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'returnToMenu',
      message: 'Press enter to return to the main menu...',
      default: true
    }
  ]);

  if (returnToMenu) {
    await mainMenu();
  }
}

// Start the app
mainMenu().catch(console.error);
