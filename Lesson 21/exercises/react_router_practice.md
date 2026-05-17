# Practice Exercises — Lesson 21: React Router

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 21/examples/react-router-app"
pnpm install   # only needed the first time
pnpm dev       # starts the dev server at http://localhost:5173
```
All exercises should be done inside this project. Open the code in VS Code to get started. Note that `react-router-dom` is already installed and setup in `main.jsx`.

---

## Exercise 1: Add a New Page Route

Currently, the app has a `Home` and `About` page. Let's add a `Contact` page.

1. In the `src/pages/` folder, create a new file called `Contact.jsx`.
2. Inside `Contact.jsx`, create and export a simple functional component that returns a `<div>` with an `<h1>` saying "Contact Us" and a `<p>` with a fake email address.
3. Open `src/App.jsx`.
4. Import your new `Contact` component at the top of the file.
5. Inside the `<Routes>` block, add a new `<Route>` that maps the path `"/contact"` to your `<Contact />` component.

---

## Exercise 2: Add Navigation Links

Now that the route exists, users need a way to click to it!

1. Open `src/components/Navbar.jsx`.
2. Find the existing `<NavLink>` elements.
3. Add a new `<NavLink>` pointing `to="/contact"`. Set its text to "Contact".
4. Check the browser — you should now be able to click the Contact link and see the page change instantly without the browser reloading!

---

## Exercise 3: Dynamic Routing (User Profiles)

Let's build a dynamic user profile system.

1. In `src/App.jsx`, add a new route: `<Route path="/users/:username" element={<UserProfile />} />`. Notice the `:username` parameter!
2. Create a new file `src/pages/UserProfile.jsx`.
3. In `UserProfile.jsx`, import `useParams` from `react-router-dom`.
4. Extract the `username` from the URL parameters.
5. Render a nice profile card that says "Welcome to **{username}**'s profile!".
6. To test it, go to your browser and manually type `http://localhost:5173/users/travis` in the URL bar. Does it say "Welcome to travis's profile!"?

---

## Exercise 4: Navigate Programmatically

Sometimes you want to change pages *without* the user clicking a link (e.g., after they submit a login form). We use the `useNavigate` hook for this.

1. Open your `Contact.jsx` component.
2. Import `useNavigate` from `react-router-dom`.
3. Inside the component, initialize it: `const navigate = useNavigate();`
4. Add a button below the contact email: `<button>Send Message</button>`.
5. Add an `onClick` handler to the button. When clicked, it should call `navigate("/")` to send the user back to the Home page automatically.

---

## Exercise 5: Test the 404 Page

1. The `App.jsx` already has a catch-all route: `<Route path="*" element={<NotFound />} />`.
2. In your browser, try typing a URL that doesn't exist, like `http://localhost:5173/this-is-a-fake-page`.
3. Verify that the 404 Not Found page appears, and that the navigation bar still stays at the top of the screen.

---

## 📝 Final Check: Interactive Quiz
Once you have completed the exercises above, switch to the **Quiz** tab in the running app and test your knowledge of React Router!
