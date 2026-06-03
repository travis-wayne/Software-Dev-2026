# Exercise: Build a Task Manager API

In this exercise, you will practice using Mongoose to create a full CRUD API for a Task Manager.

## Prerequisites
- Create a new folder named `task-api`.
- Run `pnpm init`.
- Install your dependencies: `pnpm install express mongoose dotenv`.
- Optional: Use `nodemon` for development.

## Task 1: Setup the Server
1. Create a `server.js` file.
2. Set up a basic Express app.
3. Import `mongoose`.
4. Connect to a MongoDB database. (If you don't have MongoDB installed locally, create a free cluster on MongoDB Atlas and put your connection string in a `.env` file).
   ```javascript
   mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.error(err));
   ```

## Task 2: Define the Schema
1. Create a new folder called `models`.
2. Inside `models`, create a file named `Task.js`.
3. Import Mongoose and define a `taskSchema` with the following fields:
   - `title`: String. It is **required**. It should trim whitespace.
   - `description`: String. Not required.
   - `completed`: Boolean. Default should be `false`.
   - `dueDate`: Date. Not required.
4. Compile the schema into a Model and export it.

## Task 3: Build the API Routes (CRUD)

Back in your `server.js`, import your `Task` model and build the following routes. 
*Remember to use `async/await` and `try/catch` blocks!*

1. **CREATE (POST `/api/tasks`)**
   - Accept `req.body`.
   - Use `Task.create()` to save it.
   - Send back the created task with a `201` status code.

2. **READ ALL (GET `/api/tasks`)**
   - Use `Task.find()` to get all tasks.
   - Send them back to the client.

3. **READ INCOMPLETE (GET `/api/tasks/pending`)**
   - Use `Task.find({ completed: false })` to get only the tasks that are not done yet.
   - Send them back.

4. **UPDATE (PUT `/api/tasks/:id`)**
   - Read the ID from `req.params.id`.
   - Use `Task.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })` to update the task.
   - Return the updated task.

5. **DELETE (DELETE `/api/tasks/:id`)**
   - Use `Task.findByIdAndDelete(id)`.
   - Return a success message.

## Task 4: Test Your API
Open Postman or Insomnia.
1. Try to POST a task without a `title` to verify that your Mongoose Validation catches the error and prevents it from saving!
2. Create 3 valid tasks.
3. Update one of them to `completed: true`.
4. Call your `/api/tasks/pending` route and verify the completed task does not show up.
