# Tutor Notes — Session 21: Frontend Frameworks: Routing & Building a Multi-page App

## Learning Objectives
By the end of this session, the student will be able to:
- Understand the concept of client-side routing in Single Page Applications (SPAs) vs. traditional server-side routing.
- Install and configure React Router v6 in a Vite React project.
- Define routes for different components (`<BrowserRouter>`, `<Routes>`, `<Route>`).
- Navigate between pages declaratively using `<Link>` and `<NavLink>`.
- Extract and use dynamic URL parameters (e.g., `/products/:id` with `useParams`).
- Handle 404 Not Found scenarios.

## Key Concepts to Emphasize

1. **Client-Side Routing vs. Server-Side Routing:**
   - **Server-side (Old way):** Every click requests a new HTML file from the server. The screen goes white, and the new page loads.
   - **Client-side (SPA):** The browser loads one single HTML file (`index.html`) and the entire React JavaScript bundle. When the user clicks a link, React Router intercepts the click, prevents the browser from fetching a new page, updates the URL, and instantly swaps the visible React components.

2. **React Router v6 Core Components:**
   - `<BrowserRouter>`: The context provider that watches the browser's URL. Must wrap the whole app.
   - `<Routes>`: The container that looks at the current URL and decides which child `<Route>` to render.
   - `<Route>`: Maps a specific `path` (e.g., `"/about"`) to a React `element` (e.g., `<About />`).
   - `<Link>`: The React equivalent of an `<a>` tag. **Crucial:** Never use `<a href="/about">` for internal links in a React app, as it will cause a full page reload and destroy the app's state.

3. **Dynamic Parameters (`useParams`):**
   - Explain how paths like `/users/:userId` work. The colon `:` marks a variable.
   - Show how the target component uses the `useParams()` hook to grab that value from the URL.

4. **The "Catch-All" (404 Page):**
   - A `<Route path="*">` at the bottom of the `<Routes>` list catches any URL that didn't match the routes above it.

## Preparation & Setup
- Ensure the student has Node.js and VS Code ready.
- The student should navigate to `Lesson 21/examples/react-router-app` and run `pnpm install` and `pnpm dev`.
- Walk through the pre-built examples in the Vite app. It contains a complete working router setup, including a layout, navigation, dynamic product routes, and a quiz.

## Suggested Session Flow
1. **Concept Intro (10 mins):** Discuss SPAs and why we need routing. Show them what happens when you use a regular `<a>` tag in React vs a `<Link>`.
2. **Setup & Basics (15 mins):** Walk through how the `main.jsx` wraps the app in `<BrowserRouter>`, and how `App.jsx` defines the `<Routes>`.
3. **Navigation (10 mins):** Look at the `<Navbar />` component. Discuss the difference between `<Link>` and `<NavLink>` (active state styling).
4. **Dynamic Routes (15 mins):** Go through the Product List and Product Detail flow. Explain the `:id` parameter and how `useParams()` extracts it.
5. **Interactive Quiz (10 mins):** Have the student complete the interactive quiz built into the Vite app to solidify their understanding.

## Common Stumbling Blocks
- **Forgetting `<BrowserRouter>`:** If they get an error saying "useHref() may be used only in the context of a <Router>", they forgot to wrap their app in `<BrowserRouter>`.
- **Using `<a>` instead of `<Link>`:** If the app flashes and reloads when clicking a link, they used a standard anchor tag. Remind them that this destroys all React state.
- **`exact` prop (v5 legacy):** If they look at old StackOverflow answers, they might see `exact path="/"`. Explain that in React Router v6, routes are exact by default, and this prop is no longer used.
