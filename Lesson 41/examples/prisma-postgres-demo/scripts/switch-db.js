#!/usr/bin/env node
/**
 * Lesson 41 — Database Provider Switcher
 * Quickly switch schema.prisma between PostgreSQL (Neon/Supabase) and SQLite (local offline)
 * 
 * Usage:
 *   node scripts/switch-db.js --cloud    # Switch to Neon/Supabase PostgreSQL
 *   node scripts/switch-db.js --local    # Switch to local SQLite
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, '../prisma/schema.prisma');

const arg = process.argv[2];

if (!arg || (arg !== '--cloud' && arg !== '--local')) {
  console.error('Usage: node scripts/switch-db.js [--cloud | --local]');
  process.exit(1);
}

let schema = readFileSync(schemaPath, 'utf-8');

if (arg === '--cloud') {
  // Uncomment postgresql block, comment out sqlite block
  schema = schema
    .replace(/^(\/\/ )?(datasource db \{\n.*?provider = "postgresql"[\s\S]*?\})/m, '$2')
    .replace(/^(datasource db \{\n.*?provider = "sqlite"[\s\S]*?\})/m, '// $1');
  console.log('✅ Switched to PostgreSQL (Neon/Supabase)');
  console.log('   Make sure DATABASE_URL and DIRECT_URL are set in .env');
  console.log('   Run: pnpm prisma migrate deploy');
} else {
  // Comment out postgresql block, uncomment sqlite block  
  schema = schema
    .replace(/^(datasource db \{\n.*?provider = "postgresql"[\s\S]*?\})/m, '// $1')
    .replace(/^\/\/ (datasource db \{\n.*?provider = "sqlite"[\s\S]*?\})/m, '$1');
  console.log('✅ Switched to SQLite (local offline mode)');
  console.log('   Run: pnpm prisma db push && pnpm prisma db seed');
}

writeFileSync(schemaPath, schema, 'utf-8');
console.log(`Schema file updated: ${schemaPath}`);
