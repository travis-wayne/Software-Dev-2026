# Lesson 30 — Database Design & Relationships
# Student Reference Notes

> **Launch the DB Design Explorer before reading:**
> ```bash
> cd examples/db-design
> pnpm install   # first time only
> pnpm dev
> ```
> Open **http://localhost:3000** — confirm the status badge shows your database, then explore the **ER Diagram + JOIN Lab** tab.

---

## What This Lesson Is About

In Lesson 28 you learned how to write SQL. You can create tables and run CRUD queries. But knowing the syntax is only half the job.

The other half — and arguably the more important half — is knowing **how to design the tables in the first place.**

A badly designed database is one of the most expensive mistakes in software engineering. It causes:
- Duplicate data that goes out of sync
- Bugs that are impossible to trace
- Queries that take minutes instead of milliseconds
- Weeks of migration work to fix later

This lesson teaches you the principles that separate databases that scale from databases that break.

---

## 1. The Problem with Bad Database Design

### The Classic Mistake: Storing Everything in One Table

Imagine you're building an e-commerce platform. A beginner might create this single `orders` table:

| order_id | customer_name | customer_email | customer_city | product_name | product_price |
|----------|--------------|----------------|---------------|-------------|---------------|
| 1001 | Alice Smith | alice@email.com | Lagos | Laptop | 450000 |
| 1002 | Alice Smith | alice@email.com | Lagos | Mouse | 8000 |
| 1003 | Alice Smith | alice@email.com | Lagos | Keyboard | 25000 |

Alice has placed 3 orders. Her name, email, and city are stored **3 times**.

Now ask yourself:
- **What if Alice moves to Abuja?** You must update 3 rows. If you miss one, the database is inconsistent. Two orders say "Lagos", one says "Abuja". Which is correct?
- **What if Alice has 500 orders?** You update 500 rows for one fact change.
- **What if you want to add Alice as a customer before she places any order?** You can't — there's no order row to attach her data to.

These problems have names:
- **Update Anomaly** — changing one fact requires updating many rows
- **Deletion Anomaly** — deleting all orders deletes all record of Alice existing
- **Insertion Anomaly** — cannot record Alice without an order

**The fix is called Normalization.**

---

## 2. Normalization — Storing Each Fact Once

The goal of normalization is simple: **every fact should be stored in exactly one place.**

Instead of one bloated table, you split the data:

**`customers` table:**
| id | name | email | city |
|----|------|-------|------|
| 1 | Alice Smith | alice@email.com | Lagos |

**`orders` table:**
| id | customer_id | product_name | product_price |
|----|------------|-------------|---------------|
| 1001 | 1 | Laptop | 450000 |
| 1002 | 1 | Mouse | 8000 |
| 1003 | 1 | Keyboard | 25000 |

Alice's city is stored **once**. If she moves to Abuja, you update **one row** in `customers`. All 3 orders instantly reflect the correct city when you JOIN them.

The `customer_id` column in `orders` is a **Foreign Key** — it "points at" a row in the `customers` table.

### The Normal Forms (Plain English)

**First Normal Form (1NF):** Each cell holds exactly one value. No lists, no arrays in a single column.

```
WRONG: tags = "javascript, nodejs, express"  (three values in one cell!)
RIGHT: Store tags in a separate tags table, linked with a junction table
```

**Second Normal Form (2NF):** Every non-key column depends on the *whole* primary key (mostly matters for composite keys).

**Third Normal Form (3NF):** No column should depend on another non-key column.

```
WRONG: Having "city" and "country" in orders — city already tells you the country
RIGHT: If city determines country, the country column belongs in a separate cities table
```

---

## 3. The Three Relationship Types

Once your data is split across tables, you need to describe how those tables relate to each other. There are three patterns:

---

### One-to-One (1:1)

> One row in Table A corresponds to exactly one row in Table B — and vice versa.

**Real-world examples:**
- A Person has exactly one Passport
- A User has exactly one UserProfile
- A Country has exactly one Capital City

**How to implement it:** Add a Foreign Key on the "child" table with a `UNIQUE` constraint. The `UNIQUE` constraint is what enforces the 1:1 — without it, the same `user_id` could appear in many profile rows (making it 1:N).

```sql
CREATE TABLE user_profiles (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,          -- UNIQUE enforces 1:1
  bio     TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

```
users:          user_profiles:
id | username   id | user_id | bio
1  | alice      1  | 1       | "Full-stack developer..."
2  | bob        2  | 3       | "Database enthusiast..."
3  | carol
```
Bob has no profile yet — and that's allowed (the FK is not `NOT NULL`... unless you want to require it).

---

### One-to-Many (1:N)

> One row in Table A can correspond to many rows in Table B. But each row in B links to only one row in A.

**Real-world examples:**
- One User can write many Posts (but each Post belongs to one User)
- One Teacher teaches many Students (but each Student has one teacher per class)
- One Invoice has many Line Items (but each Line Item belongs to one Invoice)

**How to implement it:** Add a Foreign Key on the "many" side table.

```sql
CREATE TABLE posts (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,                       -- Points to the author
  title   TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

```
users:          posts:
id | username   id | user_id | title
1  | alice      1  | 1       | "Getting Started with SQL"
2  | bob        2  | 1       | "Understanding JOINs"
                3  | 2       | "Bob's First Post"
```
Alice has 2 posts. Bob has 1 post. The `user_id` column is the link.

**The key insight:** The Foreign Key always lives on the "many" side. Posts have many-to-one with users, so `user_id` is on `posts`.

---

### Many-to-Many (M:N)

> Many rows in Table A can relate to many rows in Table B — and vice versa.

**Real-world examples:**
- Students enroll in many Courses; Courses have many Students
- Posts can have many Tags; Tags can belong to many Posts
- Movies can have many Actors; Actors can appear in many Movies

**The problem:** SQL cannot directly represent M:N. You cannot have an array of IDs in a single column (that violates 1NF). You cannot put multiple foreign keys in one row.

**The solution: A Junction Table** (also called a Bridge Table or Pivot Table)

A Junction Table is a third table that sits between the two, holding two foreign keys — one pointing at each side:

```sql
-- The two main tables
CREATE TABLE posts (id SERIAL PRIMARY KEY, title TEXT);
CREATE TABLE tags  (id SERIAL PRIMARY KEY, name TEXT UNIQUE);

-- The junction table — each row represents ONE post-tag relationship
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)  -- Composite PK prevents duplicate pairs
);
```

```
posts:              tags:              post_tags:
id | title          id | name          post_id | tag_id
1  | SQL Basics     1  | sql           1       | 1      (SQL Basics → sql)
2  | Node.js Guide  2  | tutorial      1       | 2      (SQL Basics → tutorial)
                    3  | beginner      2       | 2      (Node.js Guide → tutorial)
                                       2       | 3      (Node.js Guide → beginner)
```

Post 1 has tags: sql, tutorial. Post 2 has tags: tutorial, beginner. Tag "tutorial" belongs to both posts.

The `PRIMARY KEY (post_id, tag_id)` prevents the same post from being linked to the same tag twice.

---

## 4. Foreign Keys & Data Integrity

A **Foreign Key** is a column that references the Primary Key of another table. The database enforces referential integrity — you cannot add a `post_tags` row with `post_id = 99` if there is no post with `id = 99`.

### `ON DELETE` Options

What happens when the parent row (the one being referenced) is deleted?

```sql
ON DELETE CASCADE    -- Automatically delete child rows too
ON DELETE SET NULL   -- Set the FK column to NULL (keep the child, orphan it)
ON DELETE RESTRICT   -- Block the deletion if child rows exist (default)
```

**When to use each:**
- `CASCADE`: Deleting a user should delete their posts and comments (makes sense — orphaned posts are useless)
- `SET NULL`: Deleting an author might set `post.author_id = NULL` but keep the post archived
- `RESTRICT`: Prevent deleting a supplier if they have active orders (audit trail)

---

## 5. Writing JOIN Queries

Normalization splits data across tables. JOINs bring it back together at query time.

### INNER JOIN — Only Matching Rows

Returns rows that have a match in **both** tables. Rows with no match on either side are excluded.

```sql
-- Get each post title + its author's username
SELECT users.username, posts.title
FROM posts
INNER JOIN users ON posts.user_id = users.id;
```

The `ON` clause is the bridge — it tells the database which columns link the two tables.

Result:
```
username | title
---------|---------------------------
alice    | Getting Started with SQL
alice    | Understanding JOINs
bob      | Bob's First Post
```

---

### LEFT JOIN — All Rows from the Left Table

Returns all rows from the **left** table (the one after `FROM`), plus matching rows from the right. If there's no match, the right side is `NULL`.

```sql
-- Show ALL users, even those who haven't written any posts yet
SELECT users.username, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.user_id;
```

Result:
```
username | title
---------|---------------------------
alice    | Getting Started with SQL
alice    | Understanding JOINs
bob      | Bob's First Post
carol    | NULL                      ← Carol has no posts yet
```

Carol appears with `NULL` in the title column — she exists in users but has no posts.

---

### Multi-Table JOIN (M:N traversal)

To query a Many-to-Many relationship, you JOIN through the junction table:

```sql
-- Get all tags for each post (traversing the junction table)
SELECT posts.title, tags.name AS tag
FROM posts
INNER JOIN post_tags ON posts.id = post_tags.post_id
INNER JOIN tags      ON post_tags.tag_id = tags.id
ORDER BY posts.title;
```

You need two JOIN clauses because you have to cross two relationships: posts → post_tags → tags.

---

### The JOIN Cheat Sheet

```sql
-- INNER JOIN: only rows with matches on both sides
SELECT a.col, b.col FROM a INNER JOIN b ON a.id = b.a_id;

-- LEFT JOIN: all rows from left, NULL for missing right-side matches
SELECT a.col, b.col FROM a LEFT JOIN b ON a.id = b.a_id;

-- Aliases make long queries readable
SELECT u.username, p.title
FROM users u
JOIN posts p ON u.id = p.user_id;

-- Always qualify ambiguous column names
SELECT users.id, posts.id, users.username  -- NOT just "id"
FROM users JOIN posts ON users.id = posts.user_id;
```

---

## 6. The Complete Blog Schema (Reference)

This is the schema used in the lesson's live demo — 5 tables showing all three relationship types:

```sql
-- 1:N — one user writes many posts
CREATE TABLE users (
  id       SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL
);

-- 1:1 — each user has at most one profile
CREATE TABLE user_profiles (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL,
  bio     TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 1:N — one user writes many posts
CREATE TABLE posts (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title   VARCHAR(200) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- M:N — posts and tags are many-to-many
CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Junction table for posts <-> tags
CREATE TABLE post_tags (
  post_id INTEGER,
  tag_id  INTEGER,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);
```

---

## 7. Practical Tips for Database Design

1. **Start with entities, not tables.** Write out the "things" in your system first: User, Product, Order, Category. Each entity becomes a table.

2. **Identify relationships next.** For each pair: can A have many Bs? Can B have many As? This tells you 1:1, 1:N, or M:N.

3. **Draw it before coding it.** A rough ERD on paper saves hours of migration work. Even a whiteboard sketch works.

4. **Every table needs a Primary Key.** Usually `id SERIAL PRIMARY KEY`. No exceptions.

5. **Name Foreign Keys consistently.** `user_id` always references `users.id`. `post_id` always references `posts.id`. Predictable naming makes JOINs easy to write.

6. **Use `ON DELETE CASCADE` thoughtfully.** For owned data (user's posts), cascade makes sense. For audit records you never want to lose, use `RESTRICT`.

7. **Don't normalize everything.** Sometimes a small redundancy is worth it for query speed. Experience teaches when to break the rules.

---

## 8. Indexes — The Table of Contents for Your Database

### What is an Index?
Imagine trying to find every mention of "George Washington" in a 1,000-page history book. Without an index, you have to read every single page (this is called a **Full Table Scan**). With an index at the back of the book, you look up "Washington, George", see "Pages 42, 87, 105", and go straight there.

A database index works exactly the same way. It is a separate data structure that keeps a sorted list of values from a specific column, pointing to the exact disk location of the full row.

### When to Use Indexes
By default, the Primary Key (`id`) is always indexed. But Foreign Keys are **not** indexed automatically.

If you run this query frequently:
```sql
SELECT * FROM posts WHERE user_id = 45;
```
Without an index on `user_id`, the database must scan the entire `posts` table. If there are millions of posts, this query will be slow.

```sql
-- The fix:
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### The Trade-off
Why not index every column? Because indexes speed up **reads** but slow down **writes**.
Every time you `INSERT`, `UPDATE`, or `DELETE` a post, the database also has to update the index. If you have 20 indexes on a table, writing to that table becomes very slow.
Rule of thumb: **Index columns that you frequently filter by (`WHERE`), sort by (`ORDER BY`), or JOIN on.**

### Composite Indexes
You can index multiple columns together. This is useful for queries that filter by both columns at once:
```sql
CREATE INDEX idx_post_tags_post_tag ON post_tags(post_id, tag_id);
```

---

## 9. When NOT to Normalize (Pragmatic Denormalization)

Normalization is a goal, not a religion. Sometimes, strict normalization makes a database too slow or queries too complex. **Denormalization** is the strategic, intentional breaking of normalization rules to improve performance.

### Example: The User's Full Name
Technically, if you store `first_name` and `last_name`, storing `full_name` violates 3NF because `full_name` depends on the other two columns.
However, if you have to display the full name 1,000 times a second, computing it every time might waste CPU cycles. Storing `full_name` as a cached column is a valid denormalization.

### The Rule of Thumb
**Never denormalize prematurely.** Start with a perfectly normalized database. Only denormalize when you have proven, measured read performance issues that an index cannot solve.

---

## 10. Common Mistakes to Avoid

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Storing arrays in a single column | Violates 1NF — hard to query and JOIN | Create a separate table for the multi-value data |
| Forgetting the UNIQUE constraint on 1:1 FK | Becomes 1:N by accident | Add `UNIQUE` to the FK column for 1:1 relationships |
| Ambiguous column name in JOIN | `column reference "id" is ambiguous` | Always qualify: `users.id`, `posts.id` |
| Missing ON DELETE behaviour | Foreign key constraint errors when deleting parents | Explicitly decide: CASCADE, SET NULL, or RESTRICT |
| Not indexing FK columns | JOINs on large tables take minutes | `CREATE INDEX ON tablename(fk_column)` |
| Over-normalizing simple data | Too many JOINs for simple queries | Store simple lookups like country codes as ENUMs or inline |

---

## 11. Next Steps

1. **Explore the Lab:** Use the DB Design Explorer (tab 'Explorer') to see live queries in action.
2. **Practice:** Work through [`exercises/design_practice.md`](../exercises/design_practice.md) — you'll design a full E-commerce schema from scratch (Customers, Products, Orders, Order_Items), draw the ERD, write the SQL, and test it on your Neon database.
