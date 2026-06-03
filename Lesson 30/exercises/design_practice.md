# Exercise: Designing an E-Commerce Database

In this exercise, you will act as the Database Architect for a new online store. You must design the schema, identify the relationships, and write the raw PostgreSQL code to create the tables.

## Prerequisites
- A piece of paper, a whiteboard, or a digital tool like `draw.io`.
- Access to your local `psql` terminal.

## Task 1: Identify the Entities and Relationships

Your E-Commerce app needs to track the following things:
1. **Customers** (Name, Email)
2. **Products** (Name, Price)
3. **Orders** (Order Date)

**Answer these questions (write them down):**
1. A Customer can have how many Orders? An Order belongs to how many Customers? *(What type of relationship is this?)*
2. An Order can contain how many Products? A Product can be in how many Orders? *(What type of relationship is this?)*

## Task 2: Draw the ER Diagram
Based on your answers from Task 1, draw a quick ER diagram. 
- Draw boxes for `Customers`, `Orders`, and `Products`.
- If you identified a Many-to-Many (M:N) relationship between Orders and Products, you **must** draw a 4th box for the Junction Table! (Usually called `Order_Items` or `Order_Products`).
- Draw lines connecting the boxes to represent the Foreign Keys.

## Task 3: Write the SQL Schema

Open a new file called `ecommerce.sql`. Write the PostgreSQL `CREATE TABLE` statements for your design.

**Requirements:**
1. Every table must have an `id SERIAL PRIMARY KEY`.
2. The relationships must be enforced using `REFERENCES`.
3. Order matters! You must create parent tables before you create child tables that reference them.

*Hint for the Junction Table:*
The `Order_Items` table should have a `quantity` column! If I buy 3 laptops in one order, the Junction Table is the perfect place to store that number.

```sql
-- Write your SQL here.
-- Example of starting:
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- Continue with Products, Orders, and Order_Items...
```

## Task 4: Test Your Schema
1. Open your `psql` terminal.
2. Run `CREATE DATABASE ecommerce_db;`
3. Run `\c ecommerce_db;`
4. Copy and paste your SQL from Task 3 into the terminal. 
5. Did it create successfully without errors? If you got a "relation does not exist" error, check the order in which you created your tables!
