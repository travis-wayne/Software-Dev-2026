# Student Notes — Lesson 26: Building APIs with Express.js

> **Start the server!** 
> 1. Open your terminal in `examples/express-api`.
> 2. Run `pnpm install` then `pnpm dev`.
> 3. Open your browser to `http://localhost:3000` to see the **API Explorer UI**!

---

## 1. What is an API?

API stands for **Application Programming Interface**.

Think of a restaurant. You sit at a table with a menu (the Frontend/Client), and the kitchen prepares the food (the Backend/Database). But you cannot walk into the kitchen to cook the food yourself. You need a **waiter** to take your order to the kitchen and bring the food back to you.

**An API is the waiter.** It is a set of rules that allows one piece of software (like your React app) to talk to another piece of software (like your Node.js database server).

---

## 2. Express.js: The Waiter's Uniform

**Express.js** is the most popular framework for building APIs in Node.js. It gives you simple tools to listen for HTTP requests (like `fetch` calls from the browser) and send back responses.

Without Express, writing a web server in raw Node.js is incredibly verbose and complicated. Express makes it as simple as:

```javascript
import express from 'express';
const app = express();

// "When someone makes a GET request to /hello, send back a message"
app.get('/hello', (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(3000, () => console.log('Server is running!'));
```

---

## 3. The Request/Response Cycle

Every time your frontend talks to your backend, two things happen:

### 1. The Request (`req`)
The client asks for something. The `req` object contains all the details of what they want:
- `req.body`: Data sent by the user (like a filled-out form to create a new book).
- `req.params`: Variables inside the URL itself (like the `123` in `/api/books/123`).

### 2. The Response (`res`)
The server replies. The `res` object controls what goes back to the client:
- `res.json()`: Sends data back formatted as JSON.
- `res.status(404)`: Sets the HTTP status code (e.g., 200 = OK, 404 = Not Found, 500 = Server Error).

---

## 4. The 4 Main HTTP Methods (CRUD)

When building an API, we use specific HTTP methods to indicate *what* we want to do to the data. This maps directly to **CRUD** (Create, Read, Update, Delete).

| Method | Express Code | Purpose (CRUD) | Example URL |
|---|---|---|---|
| **GET** | `app.get()` | **R**ead / Retrieve data | `/api/books` |
| **POST** | `app.post()` | **C**reate new data | `/api/books` (with JSON body) |
| **PUT** | `app.put()` | **U**pdate existing data | `/api/books/12` (with JSON body) |
| **DELETE** | `app.delete()` | **D**elete existing data | `/api/books/12` |

---

## 5. API Example: Managing Books

Let's look at how the 5 standard endpoints are built in your `server.js` file. Open that file and read along:

### GET All Books
```javascript
app.get('/api/books', (req, res) => {
  res.json({ success: true, data: books });
});
```
*Very simple: just return the entire array as JSON.*

### GET a Single Book by ID
```javascript
app.get('/api/books/:id', (req, res) => {
  // Extract the ID from the URL (req.params)
  const bookId = parseInt(req.params.id); 
  
  // Find it in our array
  const book = books.find(b => b.id === bookId);

  // If not found, return a 404 error
  if (!book) return res.status(404).json({ error: 'Not found' });
  
  // Otherwise, return the book
  res.json({ data: book });
});
```

### POST a New Book
```javascript
// Note: Requires app.use(express.json()) at the top of your server!
app.post('/api/books', (req, res) => {
  // Extract the data sent by the client (req.body)
  const { title, author } = req.body; 
  
  const newBook = { id: 99, title, author };
  books.push(newBook);
  
  // 201 means "Created successfully"
  res.status(201).json({ data: newBook });
});
```

---

## 6. Testing Your API

Normally, backend developers use tools like **Postman** or **Insomnia** to test their APIs without building a frontend. 

For this lesson, we built an **API Explorer UI** directly into your server! Go to `http://localhost:3000` and use the buttons to send real GET, POST, PUT, and DELETE requests to your Express server. Watch the JSON output change!

---

## Next Steps
Head over to the `exercises/express_practice.md` file to build your own API for a Movie database from scratch!
