# Exercise: Securing the Movies API

In this exercise, you will act as the Security Lead for the movie review platform you've been building. You recently learned about CORS, XSS, and missing HTTP headers. Your job is to harden the Express API against these vulnerabilities.

## Prerequisites
- A working Express project (you can use your code from the previous Lesson 31 Movies API).
- API client (Postman or Insomnia).

## Task 1 — Install Security Dependencies

1. Open your terminal in your project folder.
2. Install the necessary security packages:
   ```bash
   npm install cors helmet xss
   ```

## Task 2 — Configure Helmet

Helmet is the easiest security win in Node.js. It automatically sets 14 crucial HTTP headers (like hiding the `X-Powered-By: Express` header, which tells hackers exactly what tech stack you use).

1. Open your `server.js` file.
2. Import `helmet`.
3. Add it as a global middleware **high up** in your file (before your routes).
   ```javascript
   import helmet from 'helmet';
   
   app.use(helmet());
   ```
4. Start your server and make a request in Postman. Look at the "Headers" tab in the response. You should see a bunch of new headers like `Content-Security-Policy` and `X-DNS-Prefetch-Control`.

## Task 3 — Configure Strict CORS

By default, an API without CORS configuration might block browser requests, or if configured poorly (`app.use(cors())`), might allow *any* website in the world to access your authenticated endpoints.

1. Import `cors` in your `server.js`.
2. Configure the middleware to only allow a specific frontend (e.g., `http://localhost:5173` if you are using Vite, or whatever port your frontend runs on).
3. Explicitly allow the methods your API uses.

```javascript
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:5173', // Change this to match your frontend port!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // If you are using cookies for auth
};

app.use(cors(corsOptions));
```

## Task 4 — Implement XSS Sanitization Middleware

Imagine your API has a `POST /api/movies` route. If someone submits a movie title like `"<script>alert('Hacked')</script>"`, and your frontend renders it, you have an XSS vulnerability.

Instead of writing `xss()` inside every single route, create a piece of middleware that sanitizes everything in the request body automatically!

1. Create a file `middleware/sanitize.js`.
2. Write a middleware function that loops through `req.body` and sanitizes string values using the `xss` library.

```javascript
import xss from 'xss';

export const sanitizeBody = (req, res, next) => {
  // If there's no body, move on
  if (!req.body) return next();

  // Loop through every key in the body
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      // Clean the string!
      req.body[key] = xss(req.body[key]);
    }
  }
  
  next();
};
```

3. Import this middleware into `server.js` and apply it globally **after** `express.json()` (because `req.body` doesn't exist until `express.json()` parses it!).

```javascript
app.use(express.json());
app.use(sanitizeBody); // Clean it up!
```

## Task 5 — Test the Defenses

1. Open Postman.
2. Send a `POST` request to your API to create a new movie.
3. Make the title malicious:
   ```json
   {
     "title": "The Matrix <script>fetch('http://hacker.com')</script>",
     "director": "Wachowskis",
     "year": 1999
   }
   ```
4. Check your database. If your middleware works, the script tags will be stripped out, and the database will only contain safe text!

---

### Bonus Task

Read up on **Rate Limiting**. If a hacker tries to brute-force a login endpoint, they might send 10,000 requests a second.
Research the `express-rate-limit` npm package and try to apply a rule that limits IP addresses to 100 requests per 15 minutes.
