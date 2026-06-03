# Student Notes — Lesson 28: SQL Basics & CRUD Operations

> **Interactive SQL Playground**
> We have built a local SQL simulator so you can practice without installing anything!
> ```bash
> cd examples/sql-basics
> pnpm install
> pnpm dev
> ```
> Open **http://localhost:3000** and go to the **💾 SQL Playground** tab.

---

## 1. What is a Relational Database?

Think of a database like an incredibly powerful Excel spreadsheet.
- **Tables** are like individual spreadsheet tabs (e.g., a "Users" tab, an "Orders" tab).
- **Rows** are individual records (e.g., one specific user).
- **Columns** are the properties (e.g., Name, Email, Age).

A database is called **Relational** because tables can link to each other. An `Order` row can have a `user_id` column that links it to a specific `User` row.

**PostgreSQL** is one of the most popular, robust, and heavily used Relational Database systems in the world.

---

## 2. The Primary Key

Every table must have a **Primary Key**.
This is a column (usually named `id`) that is **guaranteed to be unique** for every single row.

If you have two users named "John Smith" who both live in "London", the database can still tell them apart because one has `id = 1` and the other has `id = 2`.

---

## 3. SQL: Structured Query Language

SQL is the programming language we use to talk to Relational Databases.
It is **Declarative**. In JavaScript (an imperative language), you have to write a `for` loop to search through an array. In SQL, you simply declare *what* you want, and the database figures out *how* to get it.

### The 4 Pillars of SQL: CRUD

Just like API routes (GET, POST, PUT, DELETE), SQL revolves around four main operations.

#### 1. Create (`INSERT INTO`)
Adds a brand new row to a table.
```sql
INSERT INTO users (name, email, age) 
VALUES ('Bruce Wayne', 'bruce@wayne.com', 35);
```

#### 2. Read (`SELECT`)
Retrieves data. The `*` means "all columns".
```sql
-- Get everyone
SELECT * FROM users;

-- Get specific columns, only for users over 18, sorted by oldest first
SELECT name, email 
FROM users 
WHERE age > 18 
ORDER BY age DESC;
```

#### 3. Update (`UPDATE`)
Modifies existing data.
> ⚠️ **CRITICAL WARNING:** If you forget the `WHERE` clause, you will update EVERY row in the entire table!
```sql
UPDATE users 
SET age = 36 
WHERE id = 1;
```

#### 4. Delete (`DELETE FROM`)
Removes a row entirely.
> ⚠️ **CRITICAL WARNING:** If you forget the `WHERE` clause, you will delete EVERY row in the entire table!
```sql
DELETE FROM users 
WHERE id = 1;
```

---

## 4. Using PostgreSQL Locally (`psql`)

While the web playground is great for learning syntax, real apps connect to a real database.

1. Ensure PostgreSQL is installed on your computer.
2. Open your terminal and type `psql` to enter the database console.
3. Open the `examples/sql-basics/schema.sql` file. Copy the commands and paste them into `psql` to create your first real table.
4. Try running the queries from `queries.sql`!

---

## 5. Next Steps

Complete the assignment in [`exercises/sql_practice.md`](../exercises/sql_practice.md) to practice table creation, foreign keys, and writing CRUD queries.
