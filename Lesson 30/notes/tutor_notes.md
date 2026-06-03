# Lesson 30 — Database Design & Relationships
# 🗂️ Tutor Notes (90-Minute Session)

---

## Session Objectives

By the end of this lesson students will be able to:

1. **Explain normalization** in plain English using the "Moving Day" analogy and describe 1NF, 2NF, and 3NF
2. **Identify all three relationship types** (1:1, 1:N, M:N) from a verbal description and map them to table designs
3. **Read an Entity Relationship Diagram (ERD)** and trace FK references between tables
4. **Write correct SQL JOINs** — INNER, LEFT, and multi-table — against a live database
5. **Decide the correct implementation** for a relationship (UNIQUE FK, FK, or junction table) given a business rule

---

## Pre-Session Checklist

| Item | Details |
|------|---------|
| Node.js installed? | v18+ required for ES module top-level `await` |
| Run `npm install` in `examples/db-design/` | Installs `express`, `better-sqlite3`, `pg`, `dotenv` |
| Neon account | Can reuse the **same Neon project** from Lesson 28 — just point `DATABASE_URL` to it and run `schema.sql` in the Neon SQL Editor |
| No Neon? No problem | Leave `.env` blank — SQLite fallback auto-seeded with 4 users, 5 posts, 4 tags, 8 post_tags |
| Open browser to `localhost:3000` | Confirm the 🟢 Connected badge in the header |
| schema.sql ready | Teachers using Neon must run `schema.sql` first (simpler version, no `email`/`content` columns to match the server's seed) |

> 💡 **Neon reuse tip**: Tell students "same database, new tables" — it shows them databases are reusable namespaces, not lesson-specific artifacts.

---

## Pedagogical Context — The Moving Day Problem

> Open with this analogy before touching any SQL.

**"Imagine you run an e-commerce store. Your database has one big `orders` table:**  
`order_id | customer_name | customer_city | customer_email | product | price`

You have 500 orders. Alice has 47 of them. Today, Alice moves from Lagos to Abuja.

**How many rows do you update?**

Pause. Let students think. Someone will say "47." Ask: "What if you miss one? Now two orders show different cities for the same customer. Which is correct?"

This is the **Update Anomaly** — one of three data anomalies that normalization solves:
- **Update Anomaly** — changing one fact requires updating many rows
- **Insertion Anomaly** — can't record a customer until they place an order
- **Deletion Anomaly** — deleting the last order deletes all customer info

**The fix?** Split into `customers` and `orders`. Store Alice once. Reference her by ID. Update one row. Done.

This is normalization — and it's not about databases being complex. It's about databases being honest.

---

## Phase-by-Phase Lesson Flow (90 min)

---

### Phase 1 — Concepts + Normalization (20 min)

**Goal**: Students understand *why* before *how*.

1. **Moving Day Problem** (7 min)
   - Tell the story above
   - Show the "before" table on the Concepts tab (red section)
   - Show the "after" split — discuss how `customer_id` is the FK

2. **Three Relationship Types** (8 min)
   - Walk through the three glass cards on the Concepts tab
   - For each, ask: *"Can you think of a real-world example?"*
   - **1:1**: Person ↔ Passport. Student ↔ Student ID card
   - **1:N**: Teacher → Students. Invoice → Line Items
   - **M:N**: Students ↔ Courses. Movies ↔ Actors
   - **Key insight**: "1:1 vs 1:N is decided by a single SQL keyword: `UNIQUE`"

3. **Normal Forms** (5 min)
   - 1NF: No arrays in cells. Each cell = one value.
   - 2NF: Every column depends on the *whole* primary key (matters for composite PKs)
   - 3NF: No column depends on another non-key column
   - Keep it brief — these are reference points, not exam topics

**Formative check**: Ask 2-3 students: *"The school database has a `classes` table. Can a student be in many classes? Can a class have many students? What kind of relationship is that?"* (M:N — they need a junction table)

---

### Phase 2 — Neon + ER Diagram Walkthrough (15 min)

**Goal**: Students see the schema visually and understand FK arrows.

1. **Status badge** (2 min)
   - Point to the 🟢 badge — explain what Connected to Neon PostgreSQL vs Local SQLite means
   - "This app can talk to a real cloud database OR a local fallback. Same code, different config file."

2. **ER Diagram SVG** (7 min)
   - Scroll to the SVG diagram on the Concepts tab
   - Walk through each table: `users` → `user_profiles` (1:1, emerald arrow)
   - `users` → `posts` (1:N, amber arrow)
   - `posts` ↔ `tags` via `post_tags` (M:N, dashed junction)
   - **Ask**: "Why is the `post_tags` border dashed?" (It's a junction table — a helper, not a real entity)

3. **Live Tables** (6 min)
   - Switch to JOIN Lab tab → show Live Database Tables section
   - Point out the 🔑 FK columns highlighted in violet
   - Run `/api/tables` in browser devtools to show the raw JSON response
   - **Ask**: "What does `user_id: 1` in the `posts` table mean? Where does that 1 point?"

---

### Phase 3 — JOIN Lab Hands-On (35 min)

**Goal**: Students write JOIN queries and see live results.

**Opening exercise** (5 min): Demonstrate the preset queries in order:
1. Click **1:N Join** → run → explain INNER JOIN
2. Click **M:N Join** → run → explain the two-join chain
3. Click **LEFT JOIN** → run → point out the NULL rows (users with no posts)

**Then let students drive** (25 min):

| Mini-challenge | SQL to write | Teaches |
|---------------|-------------|---------|
| "Show each post title + its author's username" | 1:N INNER JOIN | Basic FK join |
| "List all tags for the post titled 'Understanding 1NF'" | M:N two-join | Junction table traversal |
| "Show ALL users, including those with no posts" | LEFT JOIN | Nullable FK results |
| "Show users + their bio (NULL if no profile)" | 1:1 LEFT JOIN | Optional relationships |
| "How many posts does each user have?" | GROUP BY + COUNT | Aggregation with JOINs |

**Bonus** (5 min): Ask students what happens if they type `DROP TABLE users;`
- The UI blocks it with a 403 error
- Discuss why destructive queries are blocked in web UIs

---

### Phase 4 — Quiz (20 min)

**Goal**: Consolidate understanding with individual assessment.

- Students complete the 7-question quiz independently (10 min)
- Review each question together (10 min):
  - Q2 (1:1): Emphasize the `UNIQUE` constraint is what *enforces* the 1:1
  - Q4 (M:N): Ask "could you store a comma-separated list of tag IDs instead?" — discuss why not (violates 1NF, breaks JOINs)
  - Q7 (CASCADE): Ask "when is CASCADE *dangerous*?" — when you don't want child records deleted (e.g., audit logs)

**Expected scores:**
- 7/7: Ready for Lesson 31 (Indexes & Query Optimization)
- 5-6/7: Review Concepts tab and redo JOIN lab exercises
- < 5/7: Revisit normalization analogy; try the exercises/design_practice.md

---

## Common Errors Table

| Error | Cause | Fix |
|-------|-------|-----|
| `FOREIGN KEY constraint failed` | Inserting a FK value that doesn't exist in parent table | Insert parent row first; check the ID exists |
| `UNIQUE constraint failed` | Trying to give a user a second profile (violates 1:1) | Check existing row; update instead of insert |
| `column reference "id" is ambiguous` | JOIN query has `SELECT id` when both tables have `id` | Always qualify: `SELECT users.id, posts.id` |
| `no such table: post_tags` | Schema not run; or wrong database | Run `schema.sql` in Neon SQL Editor, or check SQLite is seeded |
| `SSL SYSCALL error: EOF detected` | Neon database auto-suspended | Open Neon dashboard → wake database; or just run the query again |
| `ERROR: relation "users" does not exist` | Neon schema not applied | Run `schema.sql` in the Neon SQL Editor |
| Server shows `Local SQLite` when you want Neon | `DATABASE_URL` not set in `.env` | Copy `.env.example` → `.env`, fill in `DATABASE_URL`, restart server |
| `Cannot use import statement` | Node.js < v18, or `"type":"module"` missing | Update Node.js; check `package.json` has `"type": "module"` |

---

## Homework / Take-Home

Assign `exercises/design_practice.md` — E-commerce schema design from scratch.
Students draw the ERD, write the SQL, and test it on their Neon database.

---

## Extension Topics (if time allows)

- **Indexes**: Why does adding an index to `posts.user_id` make JOIN queries faster?
- **ON DELETE SET NULL**: When you want to keep child records but nullify the reference
- **Self-referencing FK**: `employees(id, manager_id REFERENCES employees(id))` — org charts
- **Composite UNIQUE**: `UNIQUE(user_id, course_id)` to prevent duplicate enrollments in a junction table
