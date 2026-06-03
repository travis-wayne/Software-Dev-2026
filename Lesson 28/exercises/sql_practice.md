# Exercise: Building a Blog Database

Now that you know the basics of SQL CRUD operations, it's time to design a database with multiple tables that relate to each other.

## Prerequisites
Ensure PostgreSQL is running on your machine and you have access to the `psql` terminal.

## Task 1: Database & Table Creation

1. Open your terminal and start `psql`.
2. Create a new database named `blog_db` and connect to it:
   ```sql
   CREATE DATABASE blog_db;
   \c blog_db;
   ```
3. Create an `authors` table with the following columns:
   - `id`: Auto-incrementing primary key (`SERIAL PRIMARY KEY`)
   - `name`: String, max 100 chars, cannot be null
   - `email`: String, max 100 chars, must be unique, cannot be null
4. Create a `posts` table with the following columns:
   - `id`: Auto-incrementing primary key
   - `title`: String, max 200 chars, cannot be null
   - `content`: Text (use the `TEXT` data type instead of `VARCHAR` so it can be infinitely long)
   - `author_id`: Integer. This is a **Foreign Key** that points to the `authors` table!

*Hint for the foreign key:*
```sql
author_id INTEGER REFERENCES authors(id)
```

## Task 2: Seeding Data (Create)

1. Write `INSERT INTO` statements to add at least **three authors** to the `authors` table.
2. Write `INSERT INTO` statements to add at least **five posts** to the `posts` table. 
   - *Important:* Make sure you set the `author_id` of the posts to match the actual `id` numbers of the authors you just created! For example, if 'Jane Doe' has `id = 1`, one of her posts should have `author_id = 1`.

## Task 3: Querying the Data (Read)

Write and execute the following `SELECT` queries:
1. Select all columns for all authors.
2. Select only the `title` and `content` of all posts.
3. Select all posts written by the author with `id = 2`.

## Task 4: Modifying the Data (Update & Delete)

1. **Update:** You noticed a typo in one of your post titles. Write an `UPDATE` query to change the `title` of the post with `id = 3` to "My Updated SQL Post".
2. **Delete:** One of your authors decided to leave the platform. Write a `DELETE` query to remove the author with `id = 3`. 

*Note: Depending on how your database is configured, deleting an author might fail if they still have posts linked to them! If you get a foreign key constraint error, try deleting their posts first, THEN delete the author.*
