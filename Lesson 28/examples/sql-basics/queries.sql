-- ==========================================================
-- SQL Basics: CRUD Operations
-- ==========================================================

-- ----------------------------------------------------------
-- 1. READ (SELECT)
-- ----------------------------------------------------------
-- Get absolutely everything
SELECT * FROM users;

-- Get specific columns
SELECT name, email FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 25;

-- Filter by exact string
SELECT * FROM users WHERE email = 'alice@example.com';

-- Sort the results
SELECT * FROM users ORDER BY age DESC;

-- Limit the number of results
SELECT * FROM users LIMIT 2;


-- ----------------------------------------------------------
-- 2. CREATE (INSERT)
-- ----------------------------------------------------------
INSERT INTO users (name, email, age) 
VALUES ('Diana Prince', 'diana@example.com', 30);

-- Verify it worked
SELECT * FROM users WHERE name = 'Diana Prince';


-- ----------------------------------------------------------
-- 3. UPDATE
-- ----------------------------------------------------------
-- WARNING: Always use WHERE, or you will update every row!
UPDATE users 
SET age = 35 
WHERE name = 'Bob Smith';

-- Verify it worked
SELECT * FROM users WHERE name = 'Bob Smith';


-- ----------------------------------------------------------
-- 4. DELETE
-- ----------------------------------------------------------
-- WARNING: Always use WHERE, or you will delete every row!
DELETE FROM users 
WHERE name = 'Charlie Brown';

-- Verify it worked
SELECT * FROM users;
