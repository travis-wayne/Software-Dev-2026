# Tutor Notes — Lesson 26: Building APIs with Express

---

## Session Objectives

By the end of this session, the student will be able to:
1. Explain the concept of an API and the Client-Server architecture.
2. Initialize a basic Express.js server on a specific port.
3. Define routes using the 4 main HTTP verbs (GET, POST, PUT, DELETE).
4. Extract data from URL parameters (`req.params`) and request bodies (`req.body`).
5. Send back structured JSON responses with appropriate HTTP status codes (200, 201, 404).

---

## Pre-Session Setup Checklist

- [ ] Ensure `Lesson 26/examples/express-api` has been `pnpm install`'ed.
- [ ] Run `pnpm dev` in the terminal to start the server via Nodemon.
- [ ] Open `http://localhost:3000` in the browser to verify the API Explorer UI is working.

---

## Pedagogical Context: The "Invisible" Backend

The biggest hurdle for students moving to the backend is that **there is no UI by default**. When they write a React component, they see a button. When they write an Express route, they just see terminal text.

To bridge this gap, this lesson includes a custom-built **API Explorer UI** served from the `public/` folder. This acts as a lightweight, visual Postman directly in the browser, allowing the student to click "Send" and instantly see the JSON response from the server they are building.

---

## Lesson Flow (90-minute session)

### Phase 1 — The API Concept (15 minutes)
1. **The Waiter Analogy:** Use the restaurant analogy from the student notes. The React app is the customer, the database is the kitchen, and the Express API is the waiter.
2. Open the **API Explorer** at `http://localhost:3000`.
3. Click the `GET /api/books` button. Show the student the JSON array that comes back. 
4. Ask: *"Where did this data come from?"* Explain that it didn't come from the browser; it came from the Node.js server.

### Phase 2 — Touring the Server Code (25 minutes)
1. Open `server.js` side-by-side with the API Explorer.
2. Walk through the setup:
   - `express()` initialization.
   - `app.use(express.json())` — **Crucial:** Explain that without this, Express cannot read `req.body` in POST requests.
3. Look at the `GET /api/books` route. Show how `res.json()` takes a JavaScript array and turns it into text for the network.
4. Look at the `GET /api/books/:id` route. 
   - Explain the colon `:` syntax.
   - Show how `req.params.id` extracts that number.
   - Demonstrate the `404` status code by editing the route locally to search for a non-existent ID.

### Phase 3 — Interaction (POST, PUT, DELETE) (20 minutes)
1. In the API Explorer, fill out the POST form (new title/author) and hit Send.
2. Look at the `POST /api/books` route in `server.js`.
   - Explain `req.body`.
   - Explain the `201 Created` status code.
3. Have the student click the `GET All` button again in the UI to prove the new book was saved in the server's memory!
4. Walk through PUT (updating) and DELETE (filtering the array).

### Phase 4 — The "Break It" Exercise (10 minutes)
Stop the `nodemon` server temporarily. Have the student click a button in the UI. 
- *What happens?* A `Failed to fetch` error.
- *Why?* Because the waiter went home. The server isn't running.
Restart the server with `pnpm dev`.

### Phase 5 — The Interactive Quiz (15 minutes)
1. In the API Explorer UI, click the **Lesson Quiz** tab.
2. Have the student answer the 5 questions.
3. If they miss the question about `app.use(express.json())`, reinforce it visually by commenting out that line in `server.js`, sending a POST request, and watching it crash because `req.body` is undefined.

---

## Common Errors & Fixes

| Error / Symptom | Cause | Fix |
|---|---|---|
| `req.body is undefined` in a POST route | Missing JSON middleware | Add `app.use(express.json())` at the top of the file |
| Route returns `Cannot GET /api/book` (singular) | URL typo | Ensure the fetch URL exactly matches the `app.get()` string |
| `TypeError: Assignment to constant variable` | Using `const` for the in-memory array | Change `const books = []` to `let books = []` if reassigning during DELETE |
| Server doesn't restart on save | Ran `node server.js` instead of `nodemon` | Run `pnpm dev` (which triggers `nodemon server.js`) |
| Data resets to 3 books when saving code | Nodemon restarted the server | Explain that in-memory arrays wipe on restart; real apps use databases (next lesson!) |

---

## Post-Session Assignment (For Student)
Direct the student to `Lesson 26/exercises/express_practice.md`. They must build a completely new API from scratch for a `Movies` database and implement all 5 CRUD routes. Encourage them to download **Postman** or **Insomnia** to test it, as they won't have the custom UI for their own project.
