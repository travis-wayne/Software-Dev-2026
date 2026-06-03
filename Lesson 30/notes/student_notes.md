# Student Notes — Lesson 30: Database Design & Relationships

> **Interactive Database Explorer**
> Practice writing JOIN queries and visualizing relationships locally!
> ```bash
> cd examples/db-design
> pnpm install
> pnpm dev
> ```
> Open **http://localhost:3000** and go to the **🔗 Relationships GUI** tab.

---

## 1. What is Normalization?

**Normalization** is the process of organizing your tables to reduce **Data Redundancy** (duplicate data) and improve **Data Integrity** (accuracy).

Imagine storing a user's address in every single order they make. If they move, you have to update thousands of orders. If you miss one, your data is corrupted (bad integrity).
Instead, you store the address *once* in a `Users` table, and the `Orders` table just stores the `user_id`.

**The Three Normal Forms (Simplified):**
1. **1NF (First Normal Form):** Every column must hold atomic (single) values. You cannot have an array of "tags" stuffed into a single column.
2. **2NF (Second Normal Form):** Everything must be in 1NF, and every column must depend on the Primary Key.
3. **3NF (Third Normal Form):** Everything must be in 2NF, and columns cannot depend on *other* non-primary-key columns.

---

## 2. Relationships

Databases are built on relationships. There are three types you need to know.

### 1. One-to-One (1:1)
One record in Table A relates to exactly one record in Table B.
- **Example:** A `User` has exactly one `UserProfile`.
- **How to do it:** The child table gets a Foreign Key (`user_id`) with a **UNIQUE** constraint.

### 2. One-to-Many (1:N)
One record in Table A relates to many records in Table B.
- **Example:** A `User` can author many `Posts`.
- **How to do it:** The child table (`Posts`) gets a standard Foreign Key (`user_id`).

### 3. Many-to-Many (M:N)
Many records in Table A relate to many records in Table B.
- **Example:** A `Post` can have many `Tags`. A `Tag` can belong to many `Posts`.
- **How to do it:** SQL cannot do this directly! You must create a third table called a **Junction Table** (e.g., `post_tags`). It holds two foreign keys: `post_id` and `tag_id`.

---

## 3. JOINing the Data

When you normalize data into separate tables, you need a way to combine it back together when you query it. This is what `JOIN` is for.

```sql
-- I want the Username and the Post Title, but they are in two different tables!
SELECT users.username, posts.title
FROM users
JOIN posts ON users.id = posts.user_id;
```
This tells the database: "Give me the username and title, but only where the `id` of the user matches the `user_id` on the post."

---

## 4. Next Steps

Complete the assignment in [`exercises/design_practice.md`](../exercises/design_practice.md) to practice designing an E-Commerce schema and writing the raw SQL to create it.
