# Lesson 30 — Database Design & Relationships

**Session Type:** Backend, Databases & Systems
**Duration:** 90 minutes
**Prerequisites:** Lesson 28 (SQL Basics & PostgreSQL), Lesson 29 (optional — MongoDB)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **Normalization** | Why bad table design causes Update, Insertion, and Deletion Anomalies — and how to fix them |
| **Relationships** | One-to-One, One-to-Many, Many-to-Many — how to identify and implement each |
| **ER Diagrams** | How to read and draw Entity-Relationship Diagrams as your design blueprint |
| **SQL JOINs** | INNER JOIN, LEFT JOIN, and multi-table JOINs to query normalized data |
| **Referential Integrity** | Foreign Keys, `ON DELETE CASCADE/RESTRICT/SET NULL` |

---

## Running the Interactive Demo

### Option A — Local SQLite (no setup needed)
```bash
cd examples/db-design
pnpm install
pnpm dev
```
Open **http://localhost:3000** — the app auto-creates and seeds an in-memory database.

### Option B — Neon PostgreSQL (cloud, data persists)
```bash
# 1. Copy the environment template
cp examples/db-design/.env.example examples/db-design/.env

# 2. Edit .env and add your Neon connection string
#    DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require

# 3. Run the schema in the Neon SQL Editor (one time only)
#    Copy/paste the contents of: examples/db-design/schema.sql

# 4. Start the server
cd examples/db-design && pnpm dev
```

The status badge in the app header shows which database is connected.

---

## File Structure

```
Lesson 30/
├── notes/
│   ├── tutor_notes.md          # 90-min lesson plan with Phase-by-Phase flow
│   └── student_notes.md        # Deep conceptual reference for students
├── examples/
│   └── db-design/
│       ├── server.js            # Express API (Neon + SQLite fallback)
│       ├── package.json
│       ├── .env.example         # Template — copy to .env and fill values
│       ├── schema.sql           # Run in Neon SQL Editor to create tables
│       └── public/
│           └── index.html       # Interactive 3-tab UI
└── exercises/
    └── design_practice.md       # Full e-commerce schema design project
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Explain **normalization** using the Moving Day Problem analogy (Update/Insertion/Deletion anomalies)
2. Identify **all three relationship types** from a verbal business description and choose the correct SQL implementation
3. **Read and draw** an Entity-Relationship (ER) Diagram
4. Write **INNER JOIN, LEFT JOIN, and multi-table JOIN** queries against a live database
5. Choose the correct **ON DELETE behaviour** (CASCADE, RESTRICT, SET NULL) for different scenarios
6. **Translate an ER diagram** into correct SQL `CREATE TABLE` statements with foreign keys

---

## Resources

| Resource | Link |
|----------|------|
| IBM: Database Design Introduction | https://www.ibm.com/docs/en/db2-warehouse?topic=databases-introduction-design |
| GeeksforGeeks: Normalization (1NF, 2NF, 3NF) | https://www.geeksforgeeks.org/normalization-in-dbms-1nf-2nf-3nf-and-bcnf/ |
| Lucidchart: What is an ER Diagram? | https://www.lucidchart.com/pages/er-diagrams |
| freeCodeCamp: Database Design Tutorial | https://www.youtube.com/watch?v=ztHopE5Wnpc |
| Caleb Curry: Normalization (1NF, 2NF, 3NF) | https://www.youtube.com/watch?v=8VfJg_2j1eQ |
| freeCodeCamp: ERD Tutorial | https://www.youtube.com/watch?v=Qp_j-E0x7_c |
| draw.io (free ERD tool) | https://app.diagrams.net/ |
| Neon PostgreSQL (free cloud DB) | https://neon.tech |
| PostgreSQL Official Docs | https://www.postgresql.org/docs/ |
