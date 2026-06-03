import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup needed for ES Modules to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Initialize the Express Application
const app = express();
const PORT = 7000;

// 2. Middleware
app.use(cors()); // Allows other domains to make requests to our API
app.use(express.json()); // Tells Express to parse incoming JSON bodies (needed for POST/PUT)

// Serve the interactive API Explorer UI
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 📚 IN-MEMORY "DATABASE"
// ==========================================
let books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 3, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' }
];
let nextId = 4;

// ==========================================
// 🚀 THE API ENDPOINTS (ROUTES)
// ==========================================

// 1. GET All Books (Read)
app.get('/api/books', (req, res) => {
  res.json({ success: true, data: books });
});

// 2. GET Single Book (Read by ID)
app.get('/api/books/:id', (req, res) => {
  // `req.params.id` gets the value from the URL, e.g., /api/books/2 -> id = 2
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    // 404 Not Found
    return res.status(404).json({ success: false, error: 'Book not found' });
  }

  res.json({ success: true, data: book });
});

// 3. POST a New Book (Create)
app.post('/api/books', (req, res) => {
  // `req.body` contains the JSON data sent by the client
  const { title, author } = req.body;

  if (!title || !author) {
    // 400 Bad Request
    return res.status(400).json({ success: false, error: 'Title and author are required' });
  }

  const newBook = { id: nextId++, title, author };
  books.push(newBook);

  // 201 Created
  res.status(201).json({ success: true, data: newBook });
});

// 4. PUT Update a Book (Update)
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }

  // Update the book's properties
  books[bookIndex] = { ...books[bookIndex], title, author };

  res.json({ success: true, data: books[bookIndex] });
});

// 5. DELETE a Book (Delete)
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const initialLength = books.length;

  // Keep all books EXCEPT the one with the matching ID
  books = books.filter(b => b.id !== bookId);

  if (books.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }

  res.json({ success: true, message: 'Book deleted successfully' });
});

// ==========================================
// 🎧 START THE SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`\n🚀 Express Server is running!`);
  console.log(`🌍 Open http://localhost:${PORT} in your browser to view the API Explorer & Quiz.`);
  console.log(`📦 Base API URL: http://localhost:${PORT}/api/books\n`);
});
