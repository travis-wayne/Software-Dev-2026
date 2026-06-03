# Student Notes — Lesson 29: MongoDB & Mongoose

> **Interactive MongoDB Explorer**
> Practice Mongoose CRUD operations and validation without installing MongoDB locally!
> ```bash
> cd examples/mongoose-basics
> pnpm install
> pnpm dev
> ```
> Open **http://localhost:3000** and go to the **🍃 Mongoose CRUD** tab.

---

## 1. NoSQL vs. SQL: The Core Difference

In Lesson 28, we learned about Relational Databases (SQL). They use strict tables. If you add a new column to a table, *every single row* must update to support that column.

**MongoDB is a NoSQL (Not Only SQL) database.**
It is fundamentally different:
- It does not use Tables, it uses **Collections**.
- It does not use Rows, it uses **Documents**.

A Document is just a JSON object (technically BSON, or Binary JSON).

### The "Wild West"
Because MongoDB does not enforce a rigid table structure, it is incredibly flexible. You can save this Document:
```json
{ "name": "Alice", "age": 28 }
```
Right next to this Document in the same Collection:
```json
{ "name": "Bob", "favoriteColor": "Blue", "pets": ["Dog", "Cat"] }
```
Notice how they have completely different fields? MongoDB allows this!

---

## 2. Why we need Mongoose (The Sheriff)

While total flexibility sounds great, it is a nightmare for writing reliable code. If your code expects every user to have an `age`, but MongoDB allowed a user to be saved without one, your application will crash.

**Mongoose is an Object Data Modeling (ODM) library.**
It acts as the "Sheriff" for our Node.js applications. It lets us use the speed and format of MongoDB, but it enforces a **Schema** (a set of rules) *before* the data is allowed to be saved.

---

## 3. Creating a Mongoose Schema & Model

Before you can save data, you must define the rules using a Schema, and compile it into a Model.

```javascript
import mongoose from 'mongoose';

// 1. The Schema (The Rules)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 18 },
  isActive: { type: Boolean, default: true }
});

// 2. The Model (The Tool we use to query the DB)
const User = mongoose.model('User', userSchema);
```

---

## 4. Mongoose CRUD Operations

Once you have a Model (`User`), you can use its built-in methods to talk to the database. These methods are asynchronous, so we use `await`.

### Create
Validates the object against the Schema and saves it.
```javascript
const newUser = await User.create({ name: 'Charlie', age: 25 });
```

### Read
Retrieves documents.
```javascript
// Get everyone
const allUsers = await User.find();

// Get specific users (Where age is 25)
const specificUsers = await User.find({ age: 25 });

// Get a single user by their MongoDB _id
const oneUser = await User.findById('65a1b2c3d4e5f6g7h8i9j0k1');
```

### Update
Finds a document and modifies it. (Setting `new: true` tells Mongoose to return the updated version, rather than the old version).
```javascript
const updatedUser = await User.findByIdAndUpdate(
  '65a1b2c3d4e5f6g7h8i9j0k1', 
  { age: 26 },
  { new: true, runValidators: true } // Always use runValidators!
);
```

### Delete
Finds a document and removes it entirely.
```javascript
await User.findByIdAndDelete('65a1b2c3d4e5f6g7h8i9j0k1');
```

---

## 5. Next Steps

Complete the assignment in [`exercises/mongoose_practice.md`](../exercises/mongoose_practice.md) to practice building your own schemas, validation rules, and Express endpoints.
