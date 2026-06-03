# Lesson 29 — NoSQL Databases: MongoDB & Mongoose
# Student Reference Notes

> **Launch the Mongoose Explorer before reading:**
> ```bash
> cd examples/mongoose-basics
> pnpm install   # first time only
> pnpm dev       # downloads MongoDB binary on first run (~500MB, one time only)
> ```
> Open **http://localhost:3000** — go to the **CRUD Playground** tab.

---

## What This Lesson Is About

In Lesson 28 you learned about SQL — a structured, strict database where every column type and relationship is defined upfront. That works brilliantly for predictable data like users, orders, and transactions.

But not all data fits neatly into rows and columns. What about a social media post that might have zero photos or ten? A product with different attributes depending on its category? Configuration data that changes shape constantly?

This lesson introduces **MongoDB**, a fundamentally different kind of database designed for flexibility. And **Mongoose**, the tool that puts structure back on top of it when you need it.

---

## 1. NoSQL — A Different Philosophy

### What "NoSQL" Actually Means

NoSQL stands for **"Not Only SQL"** — not "SQL is wrong," but "SQL is not the only answer." NoSQL databases exist alongside SQL databases, each solving different problems.

MongoDB is a **document database**. Instead of tables and rows, it uses:
- **Collections** — groups of related data (equivalent to SQL tables)
- **Documents** — individual records stored as JSON-like objects (equivalent to SQL rows)

The critical difference: **documents in the same collection do not have to have the same structure.**

```json
// These two documents can coexist in the same "products" collection:
{ "_id": "...", "name": "Laptop", "price": 999.99, "specs": { "ram": "16GB" } }
{ "_id": "...", "name": "T-Shirt", "price": 25.00, "color": "blue", "size": "M" }
```

A SQL table could not hold these two rows — they have completely different columns. MongoDB can.

### When to Choose MongoDB Over PostgreSQL

| Use MongoDB when... | Use PostgreSQL when... |
|--------------------|----------------------|
| Data structure varies between records | Data is highly structured and consistent |
| You need to store nested objects / arrays naturally | You need complex JOIN queries across many tables |
| Schema evolves rapidly (prototyping, content) | Data integrity and ACID transactions are critical |
| Document-shaped data: blog posts, user profiles, catalogs | Financial data, inventory systems, e-commerce orders |

Most professional applications use **both** — PostgreSQL for transactional data, MongoDB for flexible content.

---

## 2. MongoDB Documents — The Basics

Every document in MongoDB has an `_id` field — this is MongoDB's equivalent of the SQL Primary Key. MongoDB generates it automatically as an `ObjectId` (a 24-character hex string):

```json
{
  "_id": "6613f8d2a4b5c7e8f9012345",
  "name": "Alice Okonkwo",
  "email": "alice@example.com",
  "skills": ["JavaScript", "Python", "SQL"],
  "address": {
    "city": "Lagos",
    "country": "Nigeria"
  }
}
```

Notice that `skills` is an **array** and `address` is a **nested object** — things SQL tables cannot represent in a single row. In MongoDB, this is completely natural.

---

## 3. Why We Need Mongoose — Bringing Order to the Chaos

MongoDB's flexibility is a double-edged sword. If every document can be shaped differently:
- How do you guarantee that every product has a `price`?
- How do you make sure `price` is a number, not "very expensive"?
- How do you validate that `email` is in the right format before saving?

Without structure, your application code breaks constantly trying to handle missing or malformed fields.

**Mongoose solves this.** It is an **ODM (Object Data Modeler)** — a layer that sits between your Node.js code and MongoDB. It lets you define a **Schema** (a set of rules) and enforces them before any data reaches the database.

```
Your Code  →  Mongoose Schema  →  Validation  →  MongoDB Atlas
           (sets the rules)    (enforces them)   (stores data)
```

---

## 4. Defining a Mongoose Schema

A Schema is a blueprint. It describes the shape of every document in a collection:

```javascript
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,          // Cannot be empty
    trim: true               // Strips whitespace
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']  // Custom error message
  },
  description: {
    type: String,
    default: 'No description provided'   // Default value
  },
  inStock: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Food', 'Other']  // Only these values allowed
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});
```

### Compiling the Schema into a Model

A Schema is just the definition. A **Model** is the actual tool you use to create, find, update, and delete documents:

```javascript
// mongoose.model('ModelName', schema)
// 'Product' → MongoDB will use the 'products' collection (lowercase, plural)
const Product = mongoose.model('Product', productSchema);

export default Product;
```

---

## 5. Connecting to MongoDB

### Option A: MongoDB Atlas (Cloud — Recommended for Real Projects)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) — free M0 tier available
2. Create a cluster → Create a database user → Get your connection string
3. Copy `.env.example` → `.env` and fill in:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority
   ```
4. Restart the server — the status badge shows "MongoDB Atlas"

### Option B: Local In-Memory (No Setup Required)

Leave `MONGODB_URI` empty in `.env`. The server automatically uses `mongodb-memory-server` — a real MongoDB instance that lives entirely in RAM. Data disappears when the server restarts, but the API is identical.

**Connection code pattern:**
```javascript
import mongoose from 'mongoose';

// Try Atlas first; fall back to in-memory
const uri = process.env.MONGODB_URI;

if (uri) {
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB Atlas');
} else {
  // Spin up local in-memory MongoDB
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
  console.log('⚠️  Using in-memory MongoDB — data does not persist');
}
```

---

## 6. Mongoose CRUD Operations

Once you have a Model (`Product`), you use its built-in methods. All are asynchronous — always use `await`.

### CREATE — `Model.create()`

```javascript
// Mongoose validates against the schema before saving
const newProduct = await Product.create({
  name: 'Wireless Headphones',
  price: 89.99,
  inStock: true
});

console.log(newProduct._id);  // MongoDB auto-generated ObjectId
```

**What validation does:** If `name` is missing or `price` is negative, Mongoose throws a `ValidationError` before touching the database. The invalid document is never saved.

---

### READ — `Model.find()` and `Model.findById()`

```javascript
// Get all products
const allProducts = await Product.find();

// Filter: only products with price under 50
const affordable = await Product.find({ price: { $lt: 50 } });
// $lt = "less than", $gt = "greater than", $gte, $lte, $ne, $in...

// Find a specific product by its _id
const one = await Product.findById('6613f8d2a4b5c7e8f9012345');

// Get specific fields only (like SELECT name, price FROM...)
const names = await Product.find().select('name price -_id');
```

### Mongoose Query Operators Cheat Sheet

```javascript
Product.find({ price: { $lt: 100 } })   // price < 100
Product.find({ price: { $gte: 50 } })   // price >= 50
Product.find({ inStock: true })          // exact match
Product.find({ name: /headphone/i })     // regex: contains "headphone" (case-insensitive)
Product.find().sort({ price: 1 })        // sort ascending
Product.find().sort({ price: -1 })       // sort descending
Product.find().limit(10)                 // first 10 results
```

---

### UPDATE — `Model.findByIdAndUpdate()`

```javascript
const updated = await Product.findByIdAndUpdate(
  '6613f8d2a4b5c7e8f9012345',   // Which document
  { price: 79.99 },              // What to change
  {
    new: true,          // Return the updated doc (not the old one)
    runValidators: true // Re-run schema validators on the new values
  }
);
```

> **Why `runValidators: true` matters:** By default, Mongoose only runs validators on `create()`. When you update, validators are skipped unless you explicitly opt in. This means you could update a price to a negative number without it. Always include `runValidators: true`.

---

### DELETE — `Model.findByIdAndDelete()`

```javascript
await Product.findByIdAndDelete('6613f8d2a4b5c7e8f9012345');
// Returns the deleted document (or null if not found)
```

---

## 7. Understanding Mongoose Validation Errors

When you violate a schema rule, Mongoose throws a `ValidationError` with clear messages:

```javascript
try {
  await Product.create({ price: -5 }); // Missing 'name' (required) + invalid price
} catch (err) {
  console.log(err.name);     // "ValidationError"
  console.log(err.message);  
  // "product validation failed: 
  //  name: Path `name` is required.
  //  price: Price cannot be negative"
}
```

In your Express routes, you catch this and return a `400 Bad Request`:

```javascript
app.post('/api/products', async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(err); // Pass unexpected errors to global error handler
  }
});
```

---

## 8. SQL vs MongoDB — Side-by-Side

| Concept | SQL (PostgreSQL) | MongoDB (Mongoose) |
|---------|----------------|------------------|
| Data container | Table | Collection |
| Single record | Row | Document |
| Unique ID | `id SERIAL PRIMARY KEY` | `_id` (ObjectId, auto) |
| Get all records | `SELECT * FROM products` | `Product.find()` |
| Filter records | `WHERE price < 100` | `{ price: { $lt: 100 } }` |
| Create record | `INSERT INTO products ...` | `Product.create({...})` |
| Update record | `UPDATE products SET ... WHERE id = X` | `Product.findByIdAndUpdate(id, {...})` |
| Delete record | `DELETE FROM products WHERE id = X` | `Product.findByIdAndDelete(id)` |
| Enforce rules | Column types + constraints | Mongoose Schema + validators |
| Relationships | Foreign Keys + JOINs | Embedded documents or `populate()` |

---

## 9. Common Mistakes to Avoid

| Mistake | What Goes Wrong | Fix |
|---------|----------------|-----|
| Forgetting `await` on Mongoose calls | Returns a Promise object, not the data | Always `await` Model methods |
| Missing `runValidators: true` on update | Price could become -1, email invalid, etc. | Always include in options object |
| Using `.find()` with no await | Silent issue — data is undefined when you use it | Add `await` |
| Using string ID where ObjectId needed | `findById('abc')` throws CastError | Validate ID format before querying |
| Not wrapping in try/catch | ValidationError crashes your server | Wrap all async DB calls in try/catch |
| Calling `Model.create()` with extra fields | MongoDB ignores them (Mongoose strips them silently) | Define all expected fields in schema |

---

## 10. Next Steps

Work through [`exercises/mongoose_practice.md`](../exercises/mongoose_practice.md) — you'll build a full Task Manager API from scratch, connect it to MongoDB Atlas, and implement all CRUD operations with proper validation.
