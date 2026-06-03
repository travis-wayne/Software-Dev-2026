import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load environment variables from .env file
// This makes them available on process.env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. BUILT-IN & 3RD-PARTY MIDDLEWARE
// ==========================================
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files for our UI
app.use(express.static(path.join(__dirname, 'public')));


// ==========================================
// 2. CUSTOM MIDDLEWARE: Request Logger
// ==========================================
// This middleware runs on EVERY request because it has no specific path
const requestLogger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  
  // CRITICAL: We must call next() to pass control to the next middleware/route
  next(); 
};
app.use(requestLogger);


// ==========================================
// 3. CUSTOM MIDDLEWARE: Authentication
// ==========================================
// This middleware checks for a specific header before allowing access
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_SECRET_KEY; // Loaded from .env!

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Missing X-API-KEY header' });
  }

  if (apiKey !== validKey) {
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }

  // Key is valid, allow the request to proceed
  next();
};


// ==========================================
// 4. ROUTES
// ==========================================

// A public route - NO authentication required
app.get('/api/public-data', (req, res) => {
  res.json({ message: 'This is public data available to anyone.' });
});

// A protected route - we inject `requireApiKey` middleware specific to this route
app.get('/api/secure-data', requireApiKey, (req, res) => {
  res.json({ 
    message: 'Access granted!',
    secret: 'The meaning of life is 42.'
  });
});

// A route designed to intentionally crash to demonstrate error handling
app.get('/api/broken', (req, res) => {
  // Simulating a server crash (e.g. database goes offline, variable is undefined)
  const user = undefined;
  console.log(user.name); // This will throw a TypeError: Cannot read properties of undefined
  
  res.json({ message: 'You will never see this.' });
});


// ==========================================
// 5. GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================
// Notice the 4 arguments (err, req, res, next). 
// Express recognizes a 4-argument function as an Error Handler.
// It must be defined AFTER all other routes and middleware!
app.use((err, req, res, next) => {
  console.error('💥 ERROR CAUGHT BY GLOBAL HANDLER:');
  console.error(err.stack); // Log the full stack trace for the developer

  // Send a clean, standardized error response to the client
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Loaded API_SECRET_KEY: ${process.env.API_SECRET_KEY ? 'Yes' : 'No'}`);
});
