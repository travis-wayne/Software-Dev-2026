# Tutor Notes — Lesson 30: Database Design & Relationships

---

## Session Objectives

By the end of this session the student will be able to:
1. Explain why Normalization (reducing redundancy) is critical for Database Integrity.
2. Identify the three core relationship types (1:1, 1:N, M:N) from a real-world scenario.
3. Explain why Many-to-Many (M:N) relationships require a Junction Table in SQL.
4. Use `FOREIGN KEY` constraints in `CREATE TABLE` SQL statements.
5. Write basic `JOIN` queries to retrieve connected data.

---

## Pre-Session Setup Checklist

- [ ] `cd Lesson 30/examples/db-design`
- [ ] Ensure `pnpm install` has been run to compile `better-sqlite3`.
- [ ] `pnpm dev` runs cleanly.
- [ ] `http://localhost:3000` opens the **Concepts** tab.
- [ ] Open `schema.sql` in VS Code.

---

## Pedagogical Context: The "Address Update" Problem

The easiest way to teach Normalization is the "Address Update" problem.
Ask the student: *"Imagine an E-Commerce store. A user places 50 orders over 5 years. We stored their physical address directly on every single order row. Today, they move to a new city. What happens?"*
- They will likely say: "You have to update 50 rows."
- Ask: *"What if the code crashes halfway through, and only 25 rows get updated?"*
This is Data Corruption (Loss of Integrity). This is why we Normalize. We store the address ONCE in the `Users` table. The orders just store `user_id = 1`.

---

## Lesson Flow (90-minute session)

### Phase 1 — Concepts & Definitions (20 minutes)

Open `http://localhost:3000` to the **📖 Concepts** tab.

1. **The Address Update Problem:** Give the pitch described above. 
2. **The 3 Relationships:** Walk through the three purple concept cards.
   - For **1:1**, emphasize the `UNIQUE` keyword. If it's not unique, it becomes 1:N.
   - For **M:N**, emphasize that SQL literally *cannot* do this natively. It requires a third table (Junction Table).

### Phase 2 — The Relationships GUI (30 minutes)

Switch to the **🔗 Relationships GUI** tab in the browser.

1. **Visualizing the Schema:** Look at the top half of the screen. It shows 5 actual tables loaded from the database. 
   - Point out the purple underlined columns. Hover over them to show they are Foreign Keys.
   - Show how `users` connects to `posts`.
   - Show how `post_tags` bridges `posts` and `tags`.
2. **Writing a JOIN:**
   - Click the "1:N Join" button to inject the template. Click Run.
   - Walk through the output. Explain *why* `ON users.id = posts.user_id` is the magic glue that makes the JOIN work.
   - Click the "M:N Join" button. Walk through how it requires *two* JOINs because we have to travel through the Junction Table.

### Phase 3 — Raw SQL Implementation (25 minutes)

Open `schema.sql` in VS Code.

1. **Syntax:** Walk through lines 17-48. This is the exact PostgreSQL syntax required to build what they just saw in the UI.
2. **ON DELETE CASCADE:** Explain this magic phrase. *"If I delete a User, what happens to their Posts? If we use CASCADE, the database automatically deletes their posts for us so we don't have 'Orphaned' data."*
3. **Execution:** Have them open `psql`, copy the schema, and paste it to see it build the tables live.

### Phase 4 — Interactive Quiz (15 minutes)

Switch to the **🧠 Quiz** tab. Let the student answer all 7 questions.
Focus heavily on the difference between 1:N and M:N. They must understand the necessity of the Junction table for M:N relationships.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `foreign key constraint fails` | Trying to insert a record pointing to a parent that doesn't exist | Make sure the parent record (e.g. User) is created *before* the child record (e.g. Post). |
| `relation "X" does not exist` | Trying to create a table that references a table that hasn't been created yet | Order matters in SQL! Create `Users` before `Posts`. |
| `ambiguous column name "id"` | In a JOIN, both tables have an `id` column | Always prefix columns in a JOIN: `users.id` and `posts.id`. |

---

## Post-Session Assignment

Direct the student to `exercises/design_practice.md`.
They will be designing an E-Commerce schema (Customers, Products, Orders, Order_Items) and writing the raw SQL for it.
