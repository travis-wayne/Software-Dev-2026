# Lesson 30 Exercises — Database Design & Relationships

> **Goal:** Act as the Database Architect for a real-world e-commerce platform.
> By the end you will have designed a normalized schema, drawn an ER diagram, written all SQL, and tested it on a live database.

---

## Prerequisites

- Completed Lesson 28 (SQL Basics) and Lesson 30 (DB Design Concepts)
- A Neon PostgreSQL account (free at [neon.tech](https://neon.tech)) **or** your local `psql`
- Paper/whiteboard **or** [draw.io](https://app.diagrams.net/) for the ER diagram

---

## Scenario

You are building **ShopFlow** — a small e-commerce platform. The business analyst has given you these requirements:

> *"Customers register on the site. Each customer has a profile with their shipping address. Customers can place many orders over time. Each order contains one or more products. A product can appear in many different orders. We need to know how many of each product was purchased in each order."*

Your job: turn this into a clean, normalized relational database.

---

## Task 1 — Identify Entities & Attributes (15 min)

Read the scenario above and answer these questions in writing:

### 1a. List every entity (thing the database tracks)

Write them out. An entity becomes a table.

```
Example format:
Entity: Customer
  Attributes: name, email, created_at
```

> **Hint:** Count the nouns in the scenario: Customers, profiles, orders, products...

### 1b. Identify relationships

For each pair of entities, answer: **"Can A have many Bs? Can B have many As?"**

Fill in this table:

| Entity A | Entity B | Can A → many B? | Can B → many A? | Relationship Type |
|----------|----------|:--------------:|:--------------:|:-----------------:|
| Customer | Profile  | | | |
| Customer | Order    | | | |
| Order    | Product  | | | |

> **Answer key (check after attempting):**
>
> | A → B | A has many B? | B has many A? | Type |
> |-------|:---:|:---:|------|
> | Customer → Profile | No (1 each) | No | **1:1** |
> | Customer → Order | Yes | No | **1:N** |
> | Order → Product | Yes | Yes | **M:N** |

### 1c. Spot the extra data

From the scenario: *"We need to know how many of each product was purchased in each order."*

This `quantity` number belongs to **neither** the `products` table nor the `orders` table — it describes the **relationship between them**. Where does it go?

> **Answer:** In the junction table (`order_items`). Junction tables are not just bridges — they can hold data about the connection itself.

---

## Task 2 — Draw the ER Diagram (20 min)

Using paper or [draw.io](https://app.diagrams.net/), draw an Entity-Relationship (ER) diagram for ShopFlow.

**Rules:**
1. Each entity is a rectangle with its name at the top and attributes listed inside
2. Mark primary keys with **PK** and foreign keys with **FK**
3. Draw a line between related tables
4. Label each line with the relationship type (1:1, 1:N, M:N)
5. The M:N between Orders and Products **must** show the `order_items` junction table in the middle

**Your diagram should look roughly like this:**

```
┌─────────────────┐         ┌──────────────────────┐
│   CUSTOMERS     │         │   CUSTOMER_PROFILES  │
│─────────────────│ ───1:1─ │──────────────────────│
│ PK id           │         │ PK id                │
│    name         │         │ FK customer_id UNIQUE │
│    email        │         │    street_address     │
│    created_at   │         │    city               │
└────────┬────────┘         │    country            │
         │                  └──────────────────────┘
        1:N
         │
┌────────▼────────┐         ┌───────────────────┐
│    ORDERS       │         │    ORDER_ITEMS     │
│─────────────────│ ──1:N─ │───────────────────│
│ PK id           │         │ PK id              │
│ FK customer_id  │         │ FK order_id        │
│    order_date   │         │ FK product_id      │
│    status       │         │    quantity         │
└─────────────────┘         │    unit_price       │
                             └─────────┬─────────┘
                                      N:1
                                       │
                             ┌─────────▼─────────┐
                             │    PRODUCTS        │
                             │───────────────────│
                             │ PK id              │
                             │    name            │
                             │    description     │
                             │    price           │
                             │    stock_qty       │
                             └───────────────────┘
```

> **Note:** `ORDER_ITEMS` has its own `id` column and two extra columns (`quantity`, `unit_price`). The `unit_price` stores what the product *cost at the time of purchase* — even if the product price changes later, the historical order value is preserved.

---

## Task 3 — Write the SQL Schema (30 min)

Create a new file: `ecommerce_schema.sql`

Write all five `CREATE TABLE` statements. **Table creation order matters** — parent tables must exist before child tables that reference them.

### Correct creation order:
1. `customers` (no dependencies)
2. `customer_profiles` (depends on `customers`)
3. `products` (no dependencies)
4. `orders` (depends on `customers`)
5. `order_items` (depends on `orders` AND `products`)

### Requirements for each table:

**`customers`**
- `id SERIAL PRIMARY KEY`
- `name VARCHAR(100) NOT NULL`
- `email VARCHAR(150) UNIQUE NOT NULL`
- `created_at TIMESTAMP DEFAULT NOW()`

**`customer_profiles`** (1:1 with customers)
- `id SERIAL PRIMARY KEY`
- `customer_id INTEGER UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE`
- `street_address VARCHAR(255)`
- `city VARCHAR(100)`
- `country VARCHAR(100) DEFAULT 'Nigeria'`

> Why `UNIQUE` on `customer_id`? This is what enforces the **1:1** relationship. Without `UNIQUE`, one customer could have 10 profiles (1:N).

**`products`**
- `id SERIAL PRIMARY KEY`
- `name VARCHAR(200) NOT NULL`
- `description TEXT`
- `price DECIMAL(12,2) NOT NULL CHECK (price >= 0)`
- `stock_qty INTEGER NOT NULL DEFAULT 0`

**`orders`** (N side of Customer 1:N)
- `id SERIAL PRIMARY KEY`
- `customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT`
- `order_date TIMESTAMP DEFAULT NOW()`
- `status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled'))`

> Why `ON DELETE RESTRICT` here? If you delete a customer, you don't want their orders silently deleted — that would corrupt your revenue history. Restrict forces you to deal with the orders first.

**`order_items`** (junction table resolving Orders M:N Products)
- `id SERIAL PRIMARY KEY`
- `order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE`
- `product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT`
- `quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)`
- `unit_price DECIMAL(12,2) NOT NULL`
- `UNIQUE(order_id, product_id)` — prevents the same product appearing twice in one order

### Full SQL answer (attempt first, then check):

```sql
-- ============================================================
-- ShopFlow E-Commerce Schema
-- Run in Neon SQL Editor or local psql
-- ============================================================

-- 1. Customers (no dependencies)
CREATE TABLE customers (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Customer Profiles (1:1 with customers)
CREATE TABLE customer_profiles (
  id              SERIAL PRIMARY KEY,
  customer_id     INTEGER UNIQUE NOT NULL,
  street_address  VARCHAR(255),
  city            VARCHAR(100),
  country         VARCHAR(100) DEFAULT 'Nigeria',
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 3. Products (no dependencies)
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  price       DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  stock_qty   INTEGER NOT NULL DEFAULT 0
);

-- 4. Orders (depends on customers)
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date  TIMESTAMP DEFAULT NOW(),
  status      VARCHAR(20) DEFAULT 'pending'
              CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

-- 5. Order Items — junction table (depends on orders AND products)
CREATE TABLE order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL,
  product_id  INTEGER NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  DECIMAL(12,2) NOT NULL,
  UNIQUE (order_id, product_id),
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
```

---

## Task 4 — Seed with Test Data (15 min)

Add test data to verify your schema works:

```sql
-- Insert 3 customers
INSERT INTO customers (name, email) VALUES
  ('Amara Nwosu',   'amara@example.com'),
  ('Chidi Okonkwo', 'chidi@example.com'),
  ('Fatima Bello',  'fatima@example.com');

-- Insert 2 customer profiles (Fatima has no profile yet)
INSERT INTO customer_profiles (customer_id, city, country) VALUES
  (1, 'Lagos',  'Nigeria'),
  (2, 'Abuja',  'Nigeria');

-- Insert 4 products
INSERT INTO products (name, price, stock_qty) VALUES
  ('Wireless Headphones', 45000.00, 50),
  ('Mechanical Keyboard',  28000.00, 30),
  ('USB-C Hub',            12500.00, 100),
  ('Laptop Stand',          8000.00, 75);

-- Insert 2 orders (Amara has 2, Chidi has 1)
INSERT INTO orders (customer_id, status) VALUES
  (1, 'delivered'),    -- Amara's order
  (1, 'processing'),   -- Amara's second order
  (2, 'pending');      -- Chidi's order

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 45000.00),   -- Amara's order: 1x Headphones
  (1, 3, 2, 12500.00),   -- Amara's order: 2x USB Hub
  (2, 2, 1, 28000.00),   -- Amara's 2nd: 1x Keyboard
  (3, 1, 1, 45000.00),   -- Chidi's order: 1x Headphones
  (3, 4, 3, 8000.00);    -- Chidi's order: 3x Laptop Stand
```

---

## Task 5 — Write the Business Queries (20 min)

Write SQL to answer these real business questions. Write each one yourself before looking at the hint.

### Q1. Show all orders with the customer's name

```sql
-- Your SQL here
```

<details>
<summary>Hint / Answer</summary>

```sql
SELECT orders.id AS order_id,
       customers.name,
       orders.status,
       orders.order_date
FROM orders
JOIN customers ON orders.customer_id = customers.id
ORDER BY orders.order_date DESC;
```
</details>

---

### Q2. Show the full contents of each order (product name, quantity, line total)

```sql
-- Your SQL here
-- Hint: you need to JOIN 3 tables: orders → order_items → products
```

<details>
<summary>Hint / Answer</summary>

```sql
SELECT orders.id   AS order_id,
       customers.name  AS customer,
       products.name   AS product,
       order_items.quantity,
       order_items.unit_price,
       (order_items.quantity * order_items.unit_price) AS line_total
FROM orders
JOIN customers   ON orders.customer_id   = customers.id
JOIN order_items ON orders.id            = order_items.order_id
JOIN products    ON order_items.product_id = products.id
ORDER BY order_id, product;
```
</details>

---

### Q3. Show each customer's total spend

```sql
-- Your SQL here
-- Hint: SUM, GROUP BY, and the 3-table chain from Q2
```

<details>
<summary>Hint / Answer</summary>

```sql
SELECT customers.name,
       COUNT(DISTINCT orders.id)  AS total_orders,
       SUM(order_items.quantity * order_items.unit_price) AS total_spent
FROM customers
LEFT JOIN orders      ON customers.id     = orders.customer_id
LEFT JOIN order_items ON orders.id        = order_items.order_id
GROUP BY customers.id, customers.name
ORDER BY total_spent DESC NULLS LAST;
```
</details>

---

### Q4. Show ALL customers — even those with no orders (LEFT JOIN)

```sql
-- Your SQL here
```

<details>
<summary>Hint / Answer</summary>

```sql
SELECT customers.name,
       COUNT(orders.id) AS order_count
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name
ORDER BY order_count DESC;
```
</details>

---

### Q5. Which products have never been ordered?

```sql
-- Your SQL here (hint: LEFT JOIN + IS NULL trick)
```

<details>
<summary>Hint / Answer</summary>

```sql
SELECT products.name
FROM products
LEFT JOIN order_items ON products.id = order_items.product_id
WHERE order_items.id IS NULL;
```

This is the "anti-join" pattern — LEFT JOIN then filter for NULLs on the right side. Very useful for finding orphaned records.
</details>

---

## Task 6 — Reflection Questions (5 min)

Answer these in writing (1-2 sentences each):

1. **Why is `quantity` stored in `order_items` and not in `products`?**

2. **Why is `unit_price` stored in `order_items` even though `products` already has a `price` column?**

3. **What would go wrong if you used `ON DELETE CASCADE` on `orders.customer_id` instead of `ON DELETE RESTRICT`?**

4. **A new requirement: customers can save products to a wishlist. What type of relationship is Customer ↔ Wishlist Product? How would you model it?**

---

## Bonus Challenge — Add Indexes

After creating the tables, add indexes to speed up the most common queries:

```sql
-- Foreign key columns should always be indexed for JOIN performance
CREATE INDEX idx_orders_customer_id      ON orders(customer_id);
CREATE INDEX idx_order_items_order_id    ON order_items(order_id);
CREATE INDEX idx_order_items_product_id  ON order_items(product_id);
CREATE INDEX idx_customer_profiles_cid   ON customer_profiles(customer_id);

-- Partial index — speed up "show me all pending orders"
CREATE INDEX idx_orders_pending ON orders(status) WHERE status = 'pending';
```

**Verify your indexes were created:**
```sql
SELECT indexname, tablename, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## Submission Checklist

- [ ] ER diagram drawn (paper, draw.io, or Lucidchart)
- [ ] All 5 `CREATE TABLE` statements written and run without errors
- [ ] Test data inserted successfully
- [ ] All 5 business queries return correct results
- [ ] Reflection questions answered in writing
- [ ] (Bonus) Indexes created and verified

---

## Resources

- [draw.io](https://app.diagrams.net/) — free ER diagram tool, no account needed
- [Lucidchart ERD Tutorial](https://www.lucidchart.com/pages/er-diagrams) — visual guide to ERD notation
- [GeeksforGeeks: Normalization](https://www.geeksforgeeks.org/normalization-in-dbms-1nf-2nf-3nf-and-bcnf/) — written reference
- [Neon.tech](https://neon.tech) — free PostgreSQL cloud database
- [PostgreSQL Docs: CREATE TABLE](https://www.postgresql.org/docs/current/sql-createtable.html)
