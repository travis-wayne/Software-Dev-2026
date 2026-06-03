# Tutor Notes — Lesson 28: SQL Basics & CRUD Operations

---

## Session Objectives

By the end of this session the student will be able to:
1. Explain the concepts of Tables, Rows, Columns, and Primary Keys.
2. Differentiate between Imperative code (JS) and Declarative code (SQL).
3. Connect to a PostgreSQL database using `psql`.
4. Write SQL commands for all 4 CRUD operations (`INSERT`, `SELECT`, `UPDATE`, `DELETE`).
5. Execute raw SQL via the Interactive Sandbox Web UI.

---

## Pre-Session Setup Checklist

- [ ] `cd Lesson 28/examples/sql-basics`
- [ ] `pnpm install` (must install `better-sqlite3` native bindings)
- [ ] `pnpm dev` runs cleanly.
- [ ] `http://localhost:3000` opens the **Concepts** tab.
- [ ] Ensure PostgreSQL is installed natively on your/student's machine, or have a Neon connection string ready for `psql`.

---

## Pedagogical Context: The Spreadsheet Analogy

Most students understand Microsoft Excel. This is the best bridge to Relational Databases.
- An Excel file = The Database (`my_app_db`)
- A Worksheet Tab = A Table (`users`)
- A Column Header = The Schema (`id`, `name`, `email`)
- A Data Row = A Record

**The major difference to highlight:**
In Excel, you can put a word in a number column, or leave things blank randomly. 
A SQL Database is **strict**. If a column is an `INTEGER NOT NULL`, you *cannot* put text there, and you *cannot* leave it blank. This strictness is what makes databases reliable.

---

## Lesson Flow (90-minute session)

### Phase 1 — Concepts & Definitions (20 minutes)

Open `http://localhost:3000` to the **📖 Concepts** tab.

1. **Tables & Primary Keys:** Walk through the first two cards. Stress the importance of the Primary Key. Ask: *"If I want to delete John Smith, and there are 5 John Smiths, how do I guarantee I only delete the right one?"* (Answer: Delete by ID).
2. **Declarative Programming:** Contrast it with array filtering in JavaScript. In JS, you write the `for` loop. In SQL, you just say `SELECT * WHERE age > 18`. The DB engine figures out the fastest way to loop.
3. **The CRUD Table:** Walk through the 4 core commands. Have the student read the "Example Syntax" out loud. It reads like plain English.

### Phase 2 — The SQL Playground (30 minutes)

Switch to the **💾 SQL Playground** tab.
Explain that we are using a temporary in-memory database to practice safely.

**Guided Exercises:**
1. **Read:** Ask the student to type and run `SELECT * FROM users;`. Point to the table that renders.
   - Ask them to filter: `SELECT name FROM users WHERE age > 25;`
2. **Create:** Ask them to add themselves to the database using `INSERT INTO`. 
   - Then have them run the `SELECT *` again to prove it worked.
3. **Update:** Tell them to change their age. 
   - **CRITICAL MOMENT:** Deliberately have them run `UPDATE users SET age = 99;` (without a WHERE clause).
   - Have them run `SELECT *` again. Show them that *everyone* is now 99.
   - Click **↺ Reset Database**. This visceral mistake cements the importance of the `WHERE` clause permanently.
4. **Delete:** Have them delete 'Bob Smith' by his exact email.

### Phase 3 — Real PostgreSQL via `psql` (25 minutes)

The Playground is great, but they need to use the real tool.
1. Open a terminal and run `psql` (or `psql -U postgres`).
2. Open `schema.sql` in VS Code.
3. Walk through the `CREATE TABLE` syntax together. Explain `SERIAL` (auto-incrementing integer) and `VARCHAR`.
4. Copy the entire `CREATE TABLE` block and paste it into `psql`.
5. Copy the `INSERT INTO` block and paste it into `psql`.
6. Have the student run `SELECT * FROM users;` in the terminal to see the CLI output format.

### Phase 4 — Interactive Quiz (15 minutes)

Switch back to the Web UI and go to the **🧠 Quiz** tab. Let the student answer all 7 questions.
The most commonly failed question is usually the `UPDATE/DELETE` without `WHERE` clause. Refer back to the deliberate mistake you made in Phase 2 if they stumble.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `relation "users" does not exist` | Table wasn't created, or they are in the wrong DB | Run the `CREATE TABLE` command or `\c my_app_db` |
| `syntax error at or near "FROM"` | Typo in the SQL command | Check for missing commas, misspelled keywords, or missing semicolons `;` |
| `column "Alice" does not exist` | Used double quotes `"` instead of single quotes `'` for strings | SQL uses single quotes for text values! `WHERE name = 'Alice'` |
| `psql: command not found` | Postgres is not in the system PATH | Reinstall Postgres or add `/bin` to the OS PATH variable |

---

## Post-Session Assignment

Direct the student to `exercises/sql_practice.md`.
They will be creating a `blog_db` with two tables (`authors` and `posts`) and establishing a **Foreign Key** relationship between them.
