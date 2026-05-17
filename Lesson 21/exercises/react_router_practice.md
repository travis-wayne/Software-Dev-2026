# Practice Exercises — Lesson 21: React Router

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 21/examples/react-router-app"
pnpm install   # only needed the first time
pnpm dev       # starts the dev server at http://localhost:5173
```
Open the code in VS Code. **Read each exercise fully before writing any code.**

---

## Exercise 1: Prove SPA State Survives Navigation

**Goal:** Understand the core benefit of SPAs — state isn't lost when you navigate.

1. Open the running app in your browser.
2. Click the "Click me" counter on the Home page several times (e.g., until it shows 7).
3. Navigate to the **About** page using the navbar.
4. Navigate back to **Home**.

❓ **Question:** What number does the counter show? Why didn't it reset to 0?

Open `src/pages/Home.jsx` and locate where the click state is declared. Notice it uses `useState` — this is regular React state that lives in memory. Because no page reload occurred, memory was never cleared.

---

## Exercise 2: Add a New Page Route

**Goal:** Practice the full workflow of adding a page — create a component, register a route, and add a link.

The app currently has Home, About, and Products. Let's add a **Contact** page.

**Step 1: Create the component**
1. In `src/pages/`, create a new file called `Contact.jsx`.
2. Inside it, write a functional component that exports a page with an `<h1>` "Contact Us" and a `<p>` with a fake email like `support@myapp.dev`.

**Step 2: Register the route**
3. Open `src/App.jsx`.
4. Import your new `Contact` component at the top.
5. Inside the `<Routes>` block, add: `<Route path="/contact" element={<Contact />} />`.
   > Put it before the `path="*"` catch-all or it will never match!

**Step 3: Add navigation**
6. Open `src/components/Navbar.jsx`.
7. Add a new `<NavLink to="/contact">Contact</NavLink>` alongside the existing links.

✅ Test it: Click the Contact link in the navbar and confirm the URL changes to `/contact` and your new page renders without a reload.

---

## Exercise 3: Dynamic Routing — User Profiles

**Goal:** Understand how a single route definition can serve thousands of different URLs using a URL parameter (`:username`).

1. In `src/App.jsx`, register this new route (before the `*` catch-all):
   ```jsx
   <Route path="/users/:username" element={<UserProfile />} />
   ```
2. Create a new file `src/pages/UserProfile.jsx`.
3. Inside it, import `useParams` from `react-router-dom`.
4. Call the hook: `const { username } = useParams();`
5. Render a card that displays: **"👤 {username}'s Profile"**

✅ Test it: In your browser's address bar, type:
- `http://localhost:5173/users/travis`
- `http://localhost:5173/users/alice`

Both should work with a single component. The same route definition handles all of them.

---

## Exercise 4: Programmatic Navigation with `useNavigate`

**Goal:** Learn how to change pages from inside code (not from a click on a `<Link>`). This is essential for redirecting users after form submissions or logins.

*(Review Section 6 in your student notes before starting.)*

1. Open your `Contact.jsx` from Exercise 2.
2. Import `useNavigate` from `react-router-dom`.
3. At the top of the component, initialize it: `const navigate = useNavigate();`
4. Add a button: `<button onClick={() => navigate('/')}>Send Message & Go Home</button>`

✅ Test it: Click the button. You should be redirected to the Home page without a page reload. Notice the click counter is still at whatever number it was!

---

## Exercise 5: Test the 404 Page and `useLocation`

**Goal:** See how the wildcard route works and how `useLocation` provides URL information.

1. In your browser, type a URL that doesn't exist:  
   `http://localhost:5173/this-page-does-not-exist`
2. The 404 page should appear. Notice it displays the **exact path you tried**. Open `src/pages/NotFound.jsx` and find the `useLocation()` hook that provides this information.
3. Try a few different invalid URLs and watch the path update on the 404 page.

---

## 📝 Final Check: Interactive Quiz
Once you have completed the exercises above, click **📝 Quiz** in the Navbar and test your knowledge!
