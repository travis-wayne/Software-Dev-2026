# Post-Session Assignment: Lesson 14 – Asynchronous JS & API Integration

## Overview

In this assignment, you will build a **User Directory App**. This project will test your ability to fetch real-world data from an API, handle loading and error states, and use `async/await` to manage asynchronous flow.

## Setup

1. Create a folder called `assignment-lesson14/`.
2. Create `index.html` and `app.js`.
3. Use the following starter HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Directory</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f4f4f9; }
        .user-card { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .error { color: red; font-weight: bold; }
        .loading { font-style: italic; color: #666; }
    </style>
</head>
<body>
    <h1>User Directory</h1>
    
    <div id="status"></div>
    <ul id="user-list"></ul>

    <hr>
    <h3>Quote of the Day</h3>
    <button id="get-quote">Get New Quote</button>
    <p id="quote-box"></p>

    <script src="app.js"></script>
</body>
</html>
```

---

## Part A: Fetching & Displaying Users

**Goal:** Retrieve a list of users and render them to the page.

**Requirements:**
1. In `app.js`, create an `async` function called `fetchUsers`.
2. Use `fetch()` to get data from: `https://jsonplaceholder.typicode.com/users`.
3. While the data is being fetched, display `"Loading users..."` in the `#status` div.
4. Once the data arrives, clear the status div and loop through the users.
5. For each user, create an `<li>` or `<div>` that shows their **Name** and **Email**.
6. Append these to the `#user-list` element.

---

## Part B: Error Handling

**Goal:** Ensure the app doesn't crash if the internet is down or the API fails.

**Requirements:**
1. Wrap your `fetchUsers` code in a `try...catch` block.
2. If an error occurs, display `"Failed to load users. Please try again later."` in the `#status` div with a CSS class of `error`.
3. Log the actual error to the console for debugging.

---

## Part C: Interactive Data (Random Quotes)

**Goal:** Use a different API to fetch data on demand (button click).

**Requirements:**
1. Select the `#get-quote` button and the `#quote-box` paragraph.
2. Add a `"click"` event listener to the button.
3. When clicked, it should fetch a random quote from: `https://api.freequote.io/v1/quotes/random` (or use `https://dummyjson.com/quotes/random` if the first one is unavailable).
4. Display the quote text in the `#quote-box`.
5. Implement `try/catch` here as well.

---

## Part D: Reflection & Logic

**Goal:** Verify your understanding of the underlying concepts.

Add these as comments at the bottom of your `app.js`:

1. What is the difference between `fetch()` and `response.json()`?
2. Why do we check `if (!response.ok)` even if the `fetch()` didn't throw an error?
3. What happens to the code *after* an `await` line while the promise is still pending?
4. How would you change the code to show a "Fetching..." message on the button itself while the quote is loading?

---

## Submission Checklist

- [ ] `fetchUsers` is an `async` function.
- [ ] Both `fetch` and `.json()` use the `await` keyword.
- [ ] Users are displayed correctly on the page (DOM manipulation).
- [ ] `try/catch` blocks are used for all network operations.
- [ ] A loading message is shown while users are being retrieved.
- [ ] The Quote button works and fetches new data each time.
- [ ] Reflection questions are answered.

---

## Bonus Challenges ⭐

- **Bonus 1 — Search:** Add an `<input>` field. As the user types, filter the displayed list of users by their name.
- **Bonus 2 — Detailed View:** When a user's name is clicked, fetch their specific posts from `https://jsonplaceholder.typicode.com/posts?userId=ID` and display them below the name.
- **Bonus 3 — Visuals:** Use CSS Grid or Flexbox to make the user list look like a professional directory with cards.
