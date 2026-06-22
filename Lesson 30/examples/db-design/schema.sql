-- ============================================================
-- Lesson 30 — DB Design Explorer
-- Blog Platform Schema
-- Run this in your Neon SQL Editor before starting the server
-- with a DATABASE_URL environment variable set.
-- ============================================================

-- Users table (no dependencies — create first)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- User Profiles — 1:1 with users
CREATE TABLE IF NOT EXISTS user_profiles (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER UNIQUE NOT NULL,
  bio        TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Posts — 1:N (one user, many posts)
CREATE TABLE IF NOT EXISTS posts (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL,
  title      VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tags — standalone (no FK dependencies)
CREATE TABLE IF NOT EXISTS tags (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Post Tags — junction table for M:N between posts and tags
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id  INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);

-- ============================================================
-- Seed data (run after table creation)
-- ============================================================

INSERT INTO users (username) VALUES
  ('alice_dev'),
  ('bob_codes'),
  ('carol_dba'),
  ('dan_learner')
ON CONFLICT (username) DO NOTHING;

INSERT INTO user_profiles (user_id, bio) VALUES
  (1, 'Full-stack developer and open-source contributor.'),
  (3, 'Database architect specialising in PostgreSQL.')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO posts (user_id, title) VALUES
  (1, 'Getting Started with SQL'),
  (1, 'Understanding JOINs'),
  (2, 'My First Blog Post'),
  (3, 'Understanding 1NF'),
  (3, 'Why Normalization Matters')
ON CONFLICT DO NOTHING;

INSERT INTO tags (name) VALUES
  ('sql'),
  ('tutorial'),
  ('beginner'),
  ('databases'),
  ('advanced')
ON CONFLICT (name) DO NOTHING;

INSERT INTO post_tags (post_id, tag_id) VALUES
  (1, 1), (1, 2), (1, 3),   -- Getting Started: sql, tutorial, beginner
  (2, 1), (2, 5),            -- Understanding JOINs: sql, advanced
  (3, 2), (3, 3),            -- My First Blog Post: tutorial, beginner
  (4, 4), (4, 3),            -- Understanding 1NF: databases, beginner
  (5, 4), (5, 5)             -- Why Normalization: databases, advanced
ON CONFLICT DO NOTHING;
