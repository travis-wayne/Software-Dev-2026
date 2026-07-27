const fs = require('fs');
const lines = fs.readFileSync('docs/project_changelog.csv', 'utf8').split('\n');
const row = '"2026-07-27","Lesson 47 Upgrade","Upgraded Lesson 47 with cursor pagination Prisma examples, NextAuth v5 syntax, webhook idempotency patterns, real Neon PostgreSQL pg Pool connection in capstone demo server, PR code review guide for tutors, Prisma @@index annotations on all SaaS blueprints, and expanded capstone quiz to 5 full interactive questions","Lesson 47/notes/student_notes.md, Lesson 47/notes/tutor_notes.md, Lesson 47/exercises/capstone_project_guide.md, Lesson 47/examples/fullstack-capstone-demo/src/server.js, Lesson 47/examples/fullstack-capstone-demo/.env.example, Lesson 47/examples/capstone-simulator-lab/index.html","Lesson 47 Full-Stack Capstone just got enterprise-grade upgrades! \uD83D\uDE80 Real Neon PostgreSQL connection in the demo server, cursor-based pagination, NextAuth v5 syntax, webhook idempotency, and a 5-question mastery quiz. This is production-level curriculum! #SoftwareDev2026","#NextJS #FullStack #Prisma #NeonDB #SoftwareDev2026 #WebDev #SystemDesign #LearnToCode"';
// find the last index that starts with "2026-07-27","Lesson 7","Created Lesson 7 Git Basics codebase" and replace it
let replaced = false;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('"Lesson 7","Created Lesson 7 Git Basics codebase"')) {
    lines[i] = row;
    replaced = true;
    break;
  }
}
if (!replaced) lines.push(row);
fs.writeFileSync('docs/project_changelog.csv', lines.join('\n'));
