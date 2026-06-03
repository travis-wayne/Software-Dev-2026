# Lesson 28 — SQL Basics & PostgreSQL
# Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this session the student will be able to:

1. **Explain relational databases in plain English** using the spreadsheet analogy — tables, rows, columns, primary keys
2. **Contrast declarative SQL with imperative JavaScript** and articulate why this distinction matters
3. **Write correct syntax** for all four CRUD operations: `INSERT INTO`, `SELECT`, `UPDATE`, `DELETE FROM`
4. **Apply the `WHERE` clause correctly** and explain what happens when it is omitted (the disaster scenario)
5. **Connect to Neon PostgreSQL** via `DATABASE_URL` and verify the status badge shows Neon vs Local SQLite

---

## Pre-Session Checklist

| Item | Detail |
|------|--------|
| Server running? | `cd examples/sql-basics && pnpm dev` |
| Status badge | Should show either "Neon PostgreSQL" or "Local SQLite (fallback)" |
| `.env` ready? | Copy `.env.example` → `.env`; fill `DATABASE_URL` if using Neon |
| Browser open? | `http://localhost:3000` — confirm **Concepts** tab loads |
| VS Code open? | Have `server.js` open to show the Neon vs SQLite branch |

> **Neon reuse tip:** If the student already set up Neon in a previous session, they can reuse the same project. Just remind them to open the Neon dashboard if the database is asleep — first query after a cold start takes ~1-2 seconds.

---

## Pedagogical Context — The Spreadsheet Analogy

Start here, before any code:

> *"You've used Excel or Google Sheets. A spreadsheet file is like a database. Each sheet tab inside it is like a table. The column headers define what kind of data goes in each column. Each row is one record."*
>
> *"Now here's the key difference: In Excel, you can type 'banana' into a column that's supposed to hold someone's age. Nobody stops you. Your formulas break. You don't know until you check."*
>
> *"In a SQL database, that is illegal. When you create a column as `INTEGER NOT NULL`, the database refuses to accept 'banana'. It refuses to accept a blank. It enforces the contract. This is not a restriction — this is the whole point. It's what makes your data trustworthy."*

Then transition to: "This strictness has a name — it's called **Data Integrity**. And SQL is the language we use to read and write data in a system that enforces it."

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — Concepts & Definitions (20 min)

**Goal:** Students can look at a table structure and explain what they see.

**Open browser → Concepts tab.**

1. **The Hero Section** (3 min)
   - Read the subtitle out loud: *"You describe what you want. The database figures out how to get it."*
   - This is the difference between SQL and JavaScript. JavaScript is imperative. SQL is declarative.

2. **Walk through the 4 Concept Cards** (10 min)
   - **"What is SQL?"** — Read the code snippet. Ask: *"In JavaScript, how would you find all users over age 18?"* (`.filter()`) *"Now compare that to SQL. Which is shorter? Which is more readable?"*
   - **"CRUD Operations"** — Map each to an HTTP method: `INSERT = POST`, `SELECT = GET`, `UPDATE = PUT`, `DELETE = DELETE`. They already know these!
   - **"SQL Data Types"** — Walk through `INTEGER`, `VARCHAR`, `TEXT`, `BOOLEAN`, `TIMESTAMP`. Ask: *"What type would you use for a product price?"* (DECIMAL, not INTEGER — discuss why)
   - **"Primary & Foreign Keys"** — Ask: *"If you have two users both named 'Emma', how does the database know which one you want to update?"* Primary Key = the guaranteed unique row address.

3. **The Animated Query Flow Diagram** (5 min)
   - Walk through: Browser → Express → Neon → rows returned
   - Point out: "Your JavaScript never touches the database directly. Express is the middleman. It translates your HTTP request into an SQL query."
   - Ask: *"Where does the `pg` library live in this diagram?"* (Between Express and Neon — it's the adapter)

4. **CTA → Switch to SQL Lab** (2 min)
   - Click "Launch SQL Lab" button
   - Confirm the connection badge shows which database is in use

**Formative check:** Ask: *"What's the Primary Key? Why does it matter?"*

---

### Phase 2 — Neon Connection Demo (15 min)

**Goal:** Students see that the same code can talk to local SQLite or a real cloud database.

1. **Status badge walkthrough** (3 min)
   - If using Neon: point to the green badge "🟢 Neon PostgreSQL"
   - If using SQLite fallback: "This is the local in-memory database. Your queries work identically — the only difference is that Neon data persists between restarts."

2. **Show the `.env` toggle** (5 min)
   - In VS Code, open `.env`. Comment out `DATABASE_URL`. Save. Restart server.
   - Refresh browser. Badge should change to "🟡 Local SQLite (fallback)".
   - Uncomment `DATABASE_URL`. Restart. Badge goes back to Neon.
   - **Say:** *"This is exactly how professional apps work. `NODE_ENV=production` reads from Vercel's environment variables. Development reads your local `.env`."*

3. **Run a diagnostic query** (7 min)
   - Go to SQL Lab. Type: `SELECT version();`
   - On Neon, this returns the full PostgreSQL version string.
   - On SQLite, it returns the SQLite version.
   - This is the "hello world" of database connections.
   - Ask: *"Why does it matter which database system you're connected to?"* (Syntax differences — SQLite uses `AUTOINCREMENT`, Postgres uses `SERIAL` etc.)

---

### Phase 3 — SQL Lab Hands-On (35 min)

**Goal:** Students write every CRUD operation, see results, make mistakes, and learn from them.

**Recommended progression:**

**READ (10 min):**
1. Click preset → "SELECT users". Run. Walk through the table: what are the columns? What is the Primary Key?
2. Click preset → "SELECT posts". Run. Ask: *"What does `user_id` mean in this table?"* (It references `users.id` — this is a Foreign Key!)
3. Ask student to write their own: `SELECT title FROM posts WHERE user_id = 1;`

**JOIN (10 min):**
4. Click preset → "JOIN posts ← users". Run. Walk through the query.
   - *"Why do we write `posts.title` instead of just `title`?"* (Ambiguity — both tables might have a column called that)
   - *"The `ON` clause is the magic. It says: match the `user_id` on the post to the `id` on the user."*
5. Ask: *"How would you also include the user's email in these results?"* Let them try.

**CREATE (5 min):**
6. Click preset → "INSERT user". Run. Check the type — should say "Write operation (1 row affected)".
7. Then run `SELECT * FROM users;` to prove the new row exists.

**UPDATE (5 min):**
8. Click preset → "UPDATE user". Run. Then SELECT to verify the change.
9. **Danger demo (optional but powerful):** Ask the student to write an UPDATE without a WHERE clause. Type it but do NOT run yet. Ask: *"What would happen if we ran this?"* Let them explain, then close the tab without running.

**DELETE (5 min):**
10. Click preset → "DELETE user". Run. Then SELECT to confirm.
11. Ask: *"Can we undo a DELETE?"* (No, unless you use transactions — mention `BEGIN/COMMIT/ROLLBACK`)

**Formative check:** Ask: *"You need to change the email of user with id = 2. Write the SQL."*

---

### Phase 4 — Quiz (20 min)

- Students complete the 7-question quiz independently (10 min)
- Review together (10 min):
  - Q1 (SQL acronym): Trivial — use it to transition to discussing what "Structured" means
  - Q3 (Primary Key): Ask *"What happens if two rows have the same Primary Key?"* (Postgres rejects it — unique constraint violation)
  - Q6 (JOIN): Ask *"Why do we need JOIN if we already have two tables?"* (Because the data is split — normalization separates it, JOIN reunites it for reading)
  - Q7 (HTTP 201): Bridge back to Lesson 26 — *"When your Express POST route creates a database row, it should return 201, not 200."*

**Expected scores:**
- 7/7: Ready for Lesson 29 (MongoDB)
- 5-6/7: Redo the SQL Lab sequence from CREATE onward
- < 5/7: Return to the Concepts tab, focus on the CRUD table, restart Phase 3

---

## Common Errors Table

| Error | Cause | How to Recognize | Fix |
|-------|-------|----------------|-----|
| `relation "X" does not exist` | Table not created yet | Message includes table name | Run `CREATE TABLE` first; for Neon, run schema.sql |
| `null value in column violates not-null constraint` | Missing required field in INSERT | Error message names the column | Include all required columns in INSERT |
| `duplicate key value violates unique constraint` | Trying to insert a value that already exists in a UNIQUE column | Error names the constraint | Check if row exists first; use `INSERT ... ON CONFLICT` |
| `syntax error at or near "X"` | Typo in SQL | PostgreSQL shows line and position | Read the error carefully; check for missing commas, quotes |
| `SSL SYSCALL error: EOF detected` | Neon database auto-suspended | Happens on first query after idle | Run the query again; Neon wakes up in 1-2 seconds |
| UPDATE/DELETE affects all rows | Missing WHERE clause | `rowCount` shows unexpectedly high number | Always write WHERE clause; use transactions for safety |

---

## Post-Session Assignment

Direct student to `exercises/sql_practice.md`.

The task: build a Library Management System from scratch in PostgreSQL on Neon:
- Design and create tables: `authors`, `books`, `members`, `loans`
- Write CRUD queries for each table
- Write a JOIN query to list all borrowed books with their borrower's name

---

## Extension Topics (if student finishes early)

- **Indexes:** `CREATE INDEX ON users(email)` — why indexed columns make WHERE clauses much faster
- **Transactions:** `BEGIN`, `COMMIT`, `ROLLBACK` — the safety net for multi-step operations
- **`INSERT ... ON CONFLICT`:** How to upsert (insert or update) data idempotently
- **Parameterized queries:** `SELECT * FROM users WHERE id = $1` — how to prevent SQL injection
- **pgAdmin / Neon SQL Editor:** Show the visual table browser as a complement to terminal `psql`
