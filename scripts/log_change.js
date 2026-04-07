#!/usr/bin/env node
// log_change.js — Appends a new row to docs/project_changelog.csv
// Usage: node scripts/log_change.js

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '..', 'docs', 'project_changelog.csv');

// Ensure docs directory exists
const docsDir = path.dirname(changelogPath);
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// Create CSV with header if it doesn't exist
if (!fs.existsSync(changelogPath)) {
    const header = 'date,lesson,change_summary,files_affected,social_caption,hashtags\n';
    fs.writeFileSync(changelogPath, header, 'utf8');
    console.log('Created docs/project_changelog.csv');
}

// Read arguments or use defaults
const date = new Date().toISOString().split('T')[0];
const lesson = process.argv[2] || 'Lesson 7';
const summary = process.argv[3] || 'Created Lesson 7 Git Basics codebase';
const files = process.argv[4] || 'README.md, notes/tutor_notes.md, notes/student_notes.md, exercises/git_practice.md, assignments/assignment_brief.md, examples/git_workflow_demo/index.html, examples/git_workflow_demo/style.css';

// Escape CSV fields (wrap in quotes to handle commas)
const escape = (str) => `"${str.replace(/"/g, '""')}"`;

const newRow = [
    escape(date),
    escape(lesson),
    escape(summary),
    escape(files),
    escape(''), // social_caption — to be filled manually
    escape(''), // hashtags — to be filled manually
].join(',') + '\n';

fs.appendFileSync(changelogPath, newRow, 'utf8');
console.log(`✅ Logged change to docs/project_changelog.csv`);
console.log(`   Date:    ${date}`);
console.log(`   Lesson:  ${lesson}`);
console.log(`   Summary: ${summary}`);
