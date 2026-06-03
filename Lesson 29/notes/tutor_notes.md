# Tutor Notes — Lesson 29: MongoDB & Mongoose

---

## Session Objectives

By the end of this session the student will be able to:
1. Explain the difference between Relational (SQL) and Document-oriented (NoSQL) databases.
2. Define the terms: Document, Collection, and BSON.
3. Explain why Mongoose is used on top of MongoDB (Schemas & Validation).
4. Define a Mongoose Schema and Model.
5. Perform CRUD operations using Mongoose methods (`create`, `find`, `findByIdAndUpdate`, `findByIdAndDelete`).

---

## Pre-Session Setup Checklist

- [ ] `cd Lesson 29/examples/mongoose-basics`
- [ ] Ensure `pnpm install` has been run. Note: `mongodb-memory-server` requires internet on the first run to download the MongoDB binaries.
- [ ] `pnpm dev` runs cleanly.
- [ ] `http://localhost:3000` opens the **Concepts** tab.
- [ ] Open `server.js` and `models/Product.js` in VS Code to explain them later.

---

## Pedagogical Context: The "Wild West" Analogy

If SQL is an organized spreadsheet where every row must have the same columns, **MongoDB is a folder full of text files (JSON).**

- **Pros:** It is incredibly flexible. You can store a user who has an `age` field right next to a user who doesn't. You don't have to define your columns ahead of time.
- **Cons:** It is the "Wild West." Because there are no rules, it's very easy to accidentally save garbage data (like a string `"twenty"` in a `price` field), which will crash the frontend later.

**The Solution:** Mongoose. Mongoose is the "sheriff" of the Wild West. It lets us use the flexible MongoDB engine, but forces all data to pass through a strict Javascript schema before saving.

---

## Lesson Flow (90-minute session)

### Phase 1 — Concepts & Definitions (20 minutes)

Open `http://localhost:3000` to the **📖 Concepts** tab.

1. **Documents & Collections:** Walk through the concept cards. Explain that a Document is literally just a JavaScript Object (`{ key: "value" }`). A Collection is an array of those objects.
2. **The `_id`:** Point out that MongoDB handles the Primary Key automatically, calling it `_id` and making it a massive alphanumeric string instead of a simple number.
3. **The Mongoose Cheat Sheet:** Walk through the table. This is the most critical part of the lesson. They must learn the translation from SQL (which they just learned) to Mongoose functions.
   - `INSERT INTO` -> `Model.create()`
   - `SELECT *` -> `Model.find()`

### Phase 2 — Mongoose Code Breakdown (25 minutes)

Open VS Code.

1. **The Schema (`models/Product.js`):** 
   - Walk through lines 4-22. 
   - Ask: *"Why did we put `required: true` on the name?"* (To prevent empty products).
   - Show the `min: 0` validator on the price.
2. **The Server (`server.js`):**
   - Briefly explain lines 20-33 (we are spinning up a fake DB in memory just for this lesson).
   - Go to line 55 (`app.get`). Show how `Product.find()` returns all products.
   - Go to line 65 (`app.post`). Explain that `Product.create(req.body)` will run the data against the Schema first. If it fails, it throws an error that we catch and send back as a 400 status.

### Phase 3 — The Interactive Explorer (30 minutes)

Switch to the **🍃 Mongoose CRUD** tab in the browser.

1. **READ:** The right side shows the raw JSON array (the Collection). Point out the `_id` fields.
2. **CREATE (Success):** Have the student type "Mouse" for name and "25" for price. Click Create. Watch the JSON update on the right.
3. **CREATE (Validation Error):** Have the student intentionally break the rules. Type "Broken Item", but give it a price of `-50`. Click Create.
   - Point out the red `400 Bad Request` and the error message from Mongoose: `Product price is required / Price cannot be negative`. This proves Mongoose is working!
4. **DELETE:** Have the student copy an `_id` from the JSON block, paste it into the Delete form, and click Delete.

### Phase 4 — Interactive Quiz (15 minutes)

Switch to the **🧠 Quiz** tab. Let the student answer all 7 questions.
Focus heavily on questions 4 and 7 if they struggle—they must understand that Mongoose's primary job is Schema Validation.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `MongoTimeoutError: Server selection timed out` | Forgot to call `mongoose.connect()` | Ensure `connectDB()` is called before doing DB operations |
| `ValidationError: Path 'price' is required` | Sent data without a required field | Provide the required data in `req.body` |
| `Cast to ObjectId failed for value...` | You passed a string to `findById` that isn't a valid Mongo `_id` format | Make sure the `_id` string is exactly 24 hex characters long |
| `Product is not defined` | Forgot to import the Model in `server.js` | `import Product from './models/Product.js'` |

---

## Post-Session Assignment

Direct the student to `exercises/mongoose_practice.md`.
They will be creating a `Task` tracking system entirely from scratch using Mongoose, defining a schema with `title`, `completed` (boolean), and `dueDate`, and then writing the Express routes for it.
