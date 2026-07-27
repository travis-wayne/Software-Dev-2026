const fs = require('fs');
const path = './docs/project_changelog.csv';
const lines = fs.readFileSync(path, 'utf8').trim().split('\n');
lines.pop(); // remove last line
const newRow = ['2026-07-27', 'Lesson 1 Upgrade', 'Upgraded Lesson 1 with expanded student notes (House Analogy, Block vs Inline, Forms intro), tutor notes (CLI cross-platform table, live-coding demo script), fixed about.html semantic HTML, and fully overhauled the interactive lab with proper cd traversal, interactive Debug Lab code-entry challenges with verify engine, 10-question quiz, and LocalStorage progress persistence', 'Lesson 1/notes/student_notes.md, Lesson 1/notes/tutor_notes.md, Lesson 1/examples/my-first-webpage/about.html, Lesson 1/examples/html-simulator-lab/index.html', 'Lesson 1 just got a massive upgrade! 🚀 The HTML Basics lab now features an interactive Debug Lab where YOU fix broken code (no more auto-fix cheat buttons!), a real CLI path traversal simulator, and browser-persisted session progress. Day 1 of #SoftwareDev2026 is now world-class! 💻', '#HTML5 #WebDev #SoftwareEngineering #VSCode #LearnToCode #Frontend #SoftwareDev2026 #TechEducation']
  .map(str => '"' + str.replace(/"/g, '""') + '"')
  .join(',');
lines.push(newRow);
fs.writeFileSync(path, lines.join('\n') + '\n', 'utf8');
console.log('Updated project_changelog.csv');
