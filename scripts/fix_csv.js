const fs = require('fs');
let lines = fs.readFileSync('docs/project_changelog.csv', 'utf8').trim().split('\n');
if (lines[lines.length - 1].includes('Lesson 7') && lines[lines.length - 1].includes('Created Lesson 7 Git Basics codebase')) {
    lines.pop();
}
lines.push('"2026-07-26","Lesson 36","Upgraded Lesson 36 with an Interactive Architecture Lab, Prisma Schema, API testing workflows, and common mistakes table.","Lesson 36/notes/student_notes.md, Lesson 36/examples/ecommerce-api/prisma/schema.prisma, Lesson 36/examples/ecommerce-api/.env.example, Lesson 36/examples/lab/index.html","🔥 Just shipped the ultimate E-commerce Capstone update! Lesson 36 now includes a stunning 4-tab Interactive Lab where students can visually simulate API flows, explore the database schema, and test their backend knowledge. It\'s the perfect bridge between theory and a deployable Full-Stack app! 🚀","#FullStack #NodeJS #ReactJS #Prisma #ECommerce #WebDev #LearnToCode #CodeNewbie #SoftwareEngineering #BackendDev"');
fs.writeFileSync('docs/project_changelog.csv', lines.join('\n') + '\n');
