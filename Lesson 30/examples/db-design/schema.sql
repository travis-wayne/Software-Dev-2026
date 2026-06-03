-- ==========================================================
-- Database Design & Relationships (PostgreSQL)
-- Run this file in psql using: \i schema.sql
-- ==========================================================

DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS users;

-- ==========================================================
-- 1. BASE ENTITY
-- ==========================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- ==========================================================
-- 2. ONE-TO-ONE (1:1) RELATIONSHIP
-- ==========================================================
-- Rule: The child table has a Foreign Key that is ALSO UNIQUE.
-- This guarantees a User can only have exactly ONE Profile.
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    website VARCHAR(255)
);

-- ==========================================================
-- 3. ONE-TO-MANY (1:N) RELATIONSHIP
-- ==========================================================
-- Rule: The child table has a Foreign Key.
-- A User can have MANY Posts, but a Post belongs to exactly ONE User.
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL
);

-- ==========================================================
-- 4. MANY-TO-MANY (M:N) RELATIONSHIP
-- ==========================================================
-- Rule: You must create a third table called a "Junction Table"
-- A Post can have MANY Tags. A Tag can belong to MANY Posts.
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- The Junction Table connecting Posts and Tags
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id) -- Composite Primary Key
);


-- ==========================================================
-- SEED DATA
-- ==========================================================
INSERT INTO users (username, email) VALUES 
('alice', 'alice@example.com'),
('bob', 'bob@example.com');

INSERT INTO user_profiles (user_id, bio) VALUES 
(1, 'I love databases!');

INSERT INTO posts (user_id, title, content) VALUES 
(1, 'Intro to SQL', 'SQL is great...'),
(1, 'Advanced Joins', 'Joins are hard...'),
(2, 'Hello World', 'My first post.');

INSERT INTO tags (name) VALUES 
('tutorial'), ('sql'), ('beginner');

-- Link "Intro to SQL" (Post 1) to "tutorial" (Tag 1) and "sql" (Tag 2)
INSERT INTO post_tags (post_id, tag_id) VALUES 
(1, 1), (1, 2);

SELECT 'Database schema created and seeded successfully!' AS status;
