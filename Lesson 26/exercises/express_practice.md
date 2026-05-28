# Exercises — Lesson 26: Building APIs with Express

In this exercise, you will step away from the pre-built lesson files and create your very own API from scratch. You will build a backend server to manage a database of **Movies**.

---

## Exercise 1: Project Initialization

1. Open your terminal and create a new directory for your API:
   ```bash
   mkdir movie-api
   cd movie-api
   ```
2. Initialize a new Node project and install Express and Nodemon:
   ```bash
   pnpm init
   pnpm install express
   pnpm install -D nodemon
   ```
3. Update your `package.json` to include `"type": "module"` and the start scripts:
   ```json
   "type": "module",
   "scripts": {
     "dev": "nodemon server.js",
     "start": "node server.js"
   }
   ```

---

## Exercise 2: Server Setup & Dummy Data

1. Create a `server.js` file.
2. Import `express`, initialize the `app`, and set up the JSON parsing middleware (`app.use(express.json())`).
3. Set the server to listen on port `5000`.
4. Create an array of dummy data to act as your "database":

```javascript
let movies = [
  { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
  { id: 2, title: 'The Matrix', director: 'The Wachowskis', year: 1999 },
  { id: 3, title: 'Parasite', director: 'Bong Joon-ho', year: 2019 }
];
let nextId = 4;
```

---

## Exercise 3: Build the CRUD Endpoints

Using the lesson examples as a guide, implement the following 5 routes in your `server.js` file:

### 1. GET `/api/movies`
- Should return the entire `movies` array.
- **Status Code:** 200 (Default)

### 2. GET `/api/movies/:id`
- Should return a single movie object based on the ID in the URL.
- **Error Handling:** If the movie is not found, return a `404` status with `{ error: "Movie not found" }`.

### 3. POST `/api/movies`
- Should accept a JSON body containing `title`, `director`, and `year`.
- Should create a new movie object, assign it the `nextId`, and push it to the array.
- **Status Code:** 201 (Created)

### 4. PUT `/api/movies/:id`
- Should find the movie by ID and update its `title`, `director`, and `year` based on the request body.
- **Error Handling:** If the movie doesn't exist, return a `404`.

### 5. DELETE `/api/movies/:id`
- Should remove the movie with the matching ID from the array.
- **Error Handling:** If the movie doesn't exist, return a `404`.

---

## Exercise 4: Testing Your API

To test this API, you cannot use a web browser (browsers only make `GET` requests by default). You need an API testing tool.

1. Download and install [Postman](https://www.postman.com/downloads/) or [Insomnia](https://insomnia.rest/download).
2. Start your server: `pnpm dev`
3. In your testing tool, make the following requests to `http://localhost:5000`:
   - Send a `GET` request to `/api/movies`. (Verify you see the 3 initial movies).
   - Send a `POST` request to `/api/movies`. Make sure to set the Body to `Raw -> JSON`, and pass a new movie object.
   - Send a `GET` request to `/api/movies` again to verify your new movie was added!
   - Send a `DELETE` request to `/api/movies/2` to delete "The Matrix". 

If all of these work, congratulations! You have built a fully functional REST API.
