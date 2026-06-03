-- ==========================================================
-- SQL Basics: Schema Creation & Seeding
-- Run this file in psql using: \i schema.sql
-- ==========================================================

-- 1. Create the database (Run this manually first if needed)
-- CREATE DATABASE my_app_db;
-- \c my_app_db;

-- 2. Drop the table if it already exists (useful for resetting)
DROP TABLE IF EXISTS users;

-- 3. Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,            -- Auto-incrementing integer
    name VARCHAR(100) NOT NULL,       -- String, max 100 chars, cannot be empty
    email VARCHAR(100) UNIQUE NOT NULL, -- String, must be unique across all rows
    age INTEGER,                      -- Standard integer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Auto-sets to current date/time
);

-- 4. Seed the table with initial data
INSERT INTO users (name, email, age) VALUES 
('Alice Johnson', 'alice@example.com', 28),
('Bob Smith', 'bob@example.com', 34),
('Charlie Brown', 'charlie@example.com', 22);

SELECT 'Database seeded successfully!' AS status;
