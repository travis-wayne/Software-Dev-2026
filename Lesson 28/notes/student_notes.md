# Lesson 28 — SQL Basics & PostgreSQL
# Student Reference Notes

> **Launch the SQL Playground before reading:**
> ```bash
> cd examples/sql-basics
> pnpm install   # first time only
> pnpm dev
> ```
> Open **http://localhost:3000** — go to the **SQL Lab** tab and pick "SELECT users" from the presets.

---

## What This Lesson Is About

Every application you have ever used stores data somewhere. Instagram stores your photos. WhatsApp stores your messages. Your bank stores your transactions. That "somewhere" is almost always a **database**.

This lesson introduces **Relational Databases** — the dominant way applications have stored data for the past 50 years — and **SQL**, the language you use to talk to them.

By the end you should be able to read a database schema, write queries that create, retrieve, update, and delete data, and understand why a well-structured database is the foundation of any serious application.

---

## 1. What is a Relational Database?

### The Spreadsheet Analogy

If you have used Microsoft Excel or Google Sheets, you already understand the concept:

| Concept | In Excel | In SQL |
|---------|---------|--------|
| The file | `finances.xlsx` | The Database (`my_app_db`) |
| A sheet tab | `Transactions` sheet | A Table (`transactions`) |
| Column headers (A, B, C…) | `Name`, `Amount`, `Date` | Column Schema |
| A data row | Row 3 | A Record / Row |

**The key difference:** Excel lets you put anything anywhere — a word in a number column, blank cells, inconsistent formats. A SQL database is **strict**. When you define a column as `INTEGER NOT NULL`, you *cannot* store text there, and you *cannot* leave it empty. This strictness is not a limitation — it is the feature that makes databases reliable.

### Why "Relational"?

A database is called *relational* because tables can **link to each other**. Your `orders` table doesn't repeat a customer's name and address on every row — it just stores a `customer_id` number that points to the corresponding row in the `customers` table.

This is more efficient, more accurate, and easier to update. (Lesson 30 goes deep on this — it's called Normalization.)

---

## 2. The Primary Key — Every Row's Unique ID

Every table must have a **Primary Key**: a column that is guaranteed to be unique for every single row. It is almost always called `id`.

Here's why it matters:

Suppose your app has two users named "Chidi Okeke." Both live in Lagos. If you want to delete one of them, how do you tell the database which one?

```sql
-- DANGEROUS: This might delete both Chidis!
DELETE FROM users WHERE name = 'Chidi Okeke';

-- SAFE: This deletes exactly one specific row
DELETE FROM users WHERE id = 47;
```

The Primary Key is the address of a row. You always delete, update, and reference by ID.

In PostgreSQL, the most common pattern is:

```sql
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,  -- auto-increments: 1, 2, 3, 4...
  username   VARCHAR(50) NOT NULL,
  email      TEXT        UNIQUE NOT NULL,
  created_at TIMESTAMP   DEFAULT NOW()
);
```

---

## 3. SQL: The Language of Databases

SQL (Structured Query Language) is a **declarative** language. This is fundamentally different from JavaScript.

In JavaScript, you are **imperative** — you describe *how* to do something:
```javascript
// Imperative: you write the loop yourself
const adults = users.filter(user => user.age > 18);
```

In SQL, you are **declarative** — you describe *what* you want, and the database figures out the most efficient way to get it:
```sql
-- Declarative: the database decides HOW to find the rows
SELECT * FROM users WHERE age > 18;
```

This matters because databases are built to optimize queries. A query that would take seconds in JavaScript might execute in milliseconds in SQL, because the database engine knows how its data is stored internally.

---

## 4. The Four CRUD Operations

Every interaction with a database maps to one of four operations. You already know these from Express routes — they correspond directly.

### CREATE — `INSERT INTO`

Adds a new row to a table.

```sql
INSERT INTO users (username, email)
VALUES ('alice_dev', 'alice@example.com');
```

**Important:** You list the column names, then the values in matching order. You don't include `id` — it's auto-generated. You don't include `created_at` — it defaults to `NOW()`.

```sql
-- Insert multiple rows at once
INSERT INTO posts (user_id, title, content)
VALUES
  (1, 'My First Post', 'Hello world from the database!'),
  (1, 'Learning SQL',  'This is actually making sense now.');
```

---

### READ — `SELECT`

Retrieves data. The most used command in SQL by far.

```sql
-- Get everything from the users table
SELECT * FROM users;

-- Get only specific columns (better practice — don't use * in production)
SELECT id, username, email FROM users;

-- Filter rows with WHERE
SELECT * FROM users
WHERE username = 'alice_dev';

-- Multiple conditions
SELECT * FROM posts
WHERE user_id = 1
  AND created_at > '2024-01-01';

-- Sort the results
SELECT * FROM posts
ORDER BY created_at DESC;  -- Most recent first

-- Limit how many rows come back
SELECT * FROM users
LIMIT 10
OFFSET 0;  -- Pagination: first 10 results
```

**The `WHERE` clause is optional but almost always needed in production.** Without it, you get *every single row*, which is slow and expensive on large tables.

---

### UPDATE — `UPDATE ... SET`

Modifies existing rows.

```sql
UPDATE users
SET email = 'alice_new@example.com'
WHERE id = 1;
```

> **Critical Warning:** If you forget the `WHERE` clause, you update **every row in the entire table**. This has caused real production disasters. Always write your WHERE clause before the SET clause mentally, then type it.

```sql
-- Update multiple columns at once
UPDATE posts
SET title   = 'Updated Title',
    content = 'Corrected content here.'
WHERE id = 3;
```

---

### DELETE — `DELETE FROM`

Removes rows permanently.

```sql
DELETE FROM users
WHERE id = 5;
```

> **Critical Warning:** Same as UPDATE — forgetting `WHERE` deletes the entire table. In PostgreSQL, you can wrap dangerous operations in a transaction to test them safely:

```sql
BEGIN;
DELETE FROM users WHERE id = 5;
-- Check: SELECT * FROM users WHERE id = 5; (should return nothing)
COMMIT;   -- Only makes it permanent if you're sure
-- ROLLBACK; -- Use this instead to undo
```

---

## 5. Filtering, Sorting, and Shaping Results

These are the most important SQL clauses beyond basic CRUD:

```sql
-- WHERE: Filter rows (like .filter() in JavaScript)
SELECT * FROM posts WHERE user_id = 1;

-- ORDER BY: Sort results (like .sort() in JavaScript)
SELECT * FROM users ORDER BY created_at ASC;   -- oldest first
SELECT * FROM users ORDER BY created_at DESC;  -- newest first

-- LIMIT / OFFSET: Pagination (like .slice() in JavaScript)
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20;
-- Gets rows 21-30 (the third page of 10-per-page results)

-- LIKE: Pattern matching (like .includes() in JavaScript)
SELECT * FROM users WHERE email LIKE '%@gmail.com';
-- % means "any characters"

-- COUNT, SUM, AVG: Aggregate functions
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
```

---

## 6. Understanding Column Types

When you define a table, every column needs a type. The type constrains what data can be stored:

| Type | Use For | Example |
|------|---------|---------|
| `SERIAL` | Auto-incrementing IDs | `id SERIAL PRIMARY KEY` |
| `INTEGER` / `INT` | Whole numbers | `age INT`, `quantity INT` |
| `DECIMAL(10,2)` | Money / precise decimals | `price DECIMAL(10,2)` |
| `VARCHAR(n)` | Text with a max length | `username VARCHAR(50)` |
| `TEXT` | Unlimited text | `content TEXT` |
| `BOOLEAN` | True/false | `is_active BOOLEAN DEFAULT true` |
| `TIMESTAMP` | Date and time | `created_at TIMESTAMP DEFAULT NOW()` |

**Column Constraints:**
- `NOT NULL` — This column must always have a value
- `UNIQUE` — No two rows can have the same value in this column
- `DEFAULT value` — Use this value if none is provided
- `REFERENCES table(column)` — Foreign Key (links to another table)

---

## 7. Connecting to Neon PostgreSQL

The SQL Lab runs on a local SQLite database for practice. For a real cloud PostgreSQL database:

### Step 1: Create a Neon account
Go to [neon.tech](https://neon.tech) — free tier is enough. Create a project.

### Step 2: Get your connection string
In the Neon dashboard, copy the connection string. It looks like:
```
postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Create `.env`
```bash
# Copy the example file
cp .env.example .env
```
Open `.env` and paste your connection string:
```env
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
```

### Step 4: Restart the server
```bash
pnpm dev
```
The status badge in the header will show **Neon PostgreSQL** instead of **Local SQLite**.

### Step 5: Create your tables (Neon only)
For Neon, run the schema manually in the Neon SQL Editor:
```sql
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50) UNIQUE NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  title      TEXT NOT NULL,
  content    TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id         SERIAL PRIMARY KEY,
  post_id    INTEGER NOT NULL REFERENCES posts(id),
  user_id    INTEGER NOT NULL REFERENCES users(id),
  body       TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. SQL vs JavaScript — Side-by-Side Reference

Understanding the parallels between SQL and JavaScript makes SQL much easier to learn:

| Operation | JavaScript Array | SQL |
|-----------|----------------|-----|
| Get all items | `users` | `SELECT * FROM users` |
| Find by ID | `users.find(u => u.id === 1)` | `SELECT * FROM users WHERE id = 1` |
| Filter | `users.filter(u => u.age > 18)` | `SELECT * FROM users WHERE age > 18` |
| Add new item | `users.push({ name, email })` | `INSERT INTO users (name, email) VALUES (...)` |
| Change item | `user.email = 'new@email.com'` | `UPDATE users SET email='new@email.com' WHERE id=1` |
| Remove item | `users.splice(index, 1)` | `DELETE FROM users WHERE id = 1` |
| Count | `users.length` | `SELECT COUNT(*) FROM users` |
| Sort | `users.sort(...)` | `SELECT * FROM users ORDER BY name ASC` |
| Paginate | `users.slice(0, 10)` | `SELECT * FROM users LIMIT 10 OFFSET 0` |

---

## 9. Common Mistakes to Avoid

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| `UPDATE` without `WHERE` | Updates every row in the table | Always write WHERE first |
| `DELETE` without `WHERE` | Deletes every row in the table | Use a transaction; always test with SELECT first |
| Forgetting `NOT NULL` | Allows empty data that breaks your app | Design schemas defensively |
| Using `SELECT *` in production | Slow on large tables; returns sensitive columns | List only the columns you need |
| Inserting without specifying columns | Breaks if table schema changes | Always name your columns explicitly |
| Using string concatenation for queries | SQL injection attacks | Use parameterized queries: `$1, $2` |

---

## 10. Next Steps

Work through [`exercises/sql_practice.md`](../exercises/sql_practice.md) — you'll build a complete Library Management System schema from scratch, write all the CRUD queries, and connect it to a real Neon PostgreSQL database.
