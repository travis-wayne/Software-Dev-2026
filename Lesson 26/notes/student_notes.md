# Student Notes — Lesson 26: Building APIs with Express.js

> **Start the server, open the Explorer!**
> ```bash
> cd examples/express-api
> pnpm install   # only needed once
> pnpm dev       # starts Express with nodemon
> ```
> Then open **http://localhost:3000** — start on the **📖 Concepts** tab.

---

## 1. What is an API?

**API** stands for **Application Programming Interface**. It is the contract that defines how two pieces of software communicate with each other.

In web development, this almost always means a **client** (your React frontend) sending HTTP requests to a **server** (your Express backend) and receiving structured data (JSON) in return.

### The Restaurant Analogy

| Role | Web equivalent |
|---|---|
| Customer (you) | React Frontend |
| Waiter (takes orders, delivers food) | **Express API** |
| Kitchen (makes the food) | Database |

You (the customer) never walk into the kitchen. You always go through the waiter. Similarly, your React app never directly reads the database — it always goes through the API.

---

## 2. Express.js: The Framework

**Express.js** is a minimal Node.js framework for building web servers and APIs. Writing a server in raw Node.js is possible but painful (dozens of lines to handle one route). Express reduces that to three lines.

### Setting up a server

```javascript
import express from 'express';      // 1. Import Express
const app = express();               // 2. Create the application
const PORT = 3000;

app.use(express.json());             // 3. CRUCIAL middleware — parses JSON bodies

// 4. Define a route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// 5. Start listening for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 3. The Request / Response Cycle

Every HTTP interaction is a two-step cycle. Express gives you an object for each step:

### `req` — The Request (what the client sent)

| Property | Contains | Example |
|---|---|---|
| `req.params` | URL segment variables | `req.params.id` from `/books/:id` |
| `req.body` | JSON data in POST/PUT body | `req.body.title` |
| `req.query` | URL query strings | `req.query.search` from `?search=node` |

### `res` — The Response (what you send back)

| Method | What it does |
|---|---|
| `res.json(data)` | Sends a JSON response (sets `Content-Type: application/json`) |
| `res.status(404)` | Sets the HTTP status code (chainable: `res.status(404).json(...)`) |
| `res.send('text')` | Sends a plain text response |

---

## 4. The 4 HTTP Methods → CRUD

Every REST API operation is expressed through one of four HTTP methods:

| HTTP Method | CRUD | Purpose | Example |
|---|---|---|---|
| `GET` | **R**ead | Retrieve data | `GET /api/books` |
| `POST` | **C**reate | Create new data | `POST /api/books` + JSON body |
| `PUT` | **U**pdate | Replace existing data | `PUT /api/books/3` + JSON body |
| `DELETE` | **D**elete | Remove data | `DELETE /api/books/3` |

---

## 5. Building the 5 REST Endpoints

Open [`server.js`](../examples/express-api/server.js) and read each route with these notes:

### GET All
```javascript
app.get('/api/books', (req, res) => {
  res.json({ success: true, data: books }); // return the whole array
});
```

### GET by ID — Using `req.params`
```javascript
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id); // :id in the route becomes req.params.id (string!)
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Not found' }); // 404 if missing
  res.json({ success: true, data: book });
});
```

### POST — Using `req.body`
```javascript
// Requires app.use(express.json()) — otherwise req.body is undefined!
app.post('/api/books', (req, res) => {
  const { title, author } = req.body;         // data from the client
  if (!title || !author) return res.status(400).json({ error: 'Required fields missing' });
  const newBook = { id: nextId++, title, author };
  books.push(newBook);
  res.status(201).json({ success: true, data: newBook }); // 201 = Created
});
```

### PUT — Combining `req.params` + `req.body`
```javascript
app.put('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  books[index] = { ...books[index], ...req.body }; // spread = keep old + override
  res.json({ success: true, data: books[index] });
});
```

### DELETE — Filtering the array
```javascript
app.delete('/api/books/:id', (req, res) => {
  const before = books.length;
  books = books.filter(b => b.id !== parseInt(req.params.id));
  if (books.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, message: 'Book deleted' });
});
```

---

## 6. Middleware

Middleware is code that runs **between** the incoming request and your route handler. It transforms or validates data before your handler sees it.

```
Request ──→  express.json() ──→  cors() ──→  Your Route Handler ──→  Response
             ↑ parses body       ↑ adds CORS headers
```

```javascript
app.use(express.json()); // ← Must come BEFORE your route definitions
app.use(cors());         // ← Lets browsers on other domains call your API
```

> ⚠️ If you define a route *before* `app.use(express.json())`, that route won't have access to `req.body`.

---

## 7. HTTP Status Codes

Status codes tell the client what happened. Always use the right one:

| Code | Meaning | When to use |
|---|---|---|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Client sent invalid/missing data |
| `404` | Not Found | Resource doesn't exist |
| `500` | Internal Server Error | Something broke on your server |

---

## 8. Using the API Explorer

The **📡 API Explorer** tab at `http://localhost:3000` acts as a visual Postman for testing your routes:
- Each endpoint card shows the method, URL, description, and input fields.
- Click **Send** — the JSON response appears live with **syntax highlighting**.
- A **Request Log** tracks every call with method, status code, and response time.
- Try triggering a `404` by sending a GET to an ID that doesn't exist (e.g., ID 999).

---

## Next Steps

Build your own **Movies API** from scratch — see [`exercises/express_practice.md`](../exercises/express_practice.md).
