# Student Notes — Lesson 21: Routing & Multi-page Apps

## 1. What is Client-Side Routing?

In traditional websites, clicking a link sends a request to the server, the server sends back a brand new HTML file, and the browser completely reloads the page. The screen goes white for a second, and **all data in memory is lost**.

React is used to build **Single Page Applications (SPAs)**. In an SPA:
1. You only ever download **one** HTML file (`index.html`).
2. When you click a link, a JavaScript library (like **React Router**) intercepts the click.
3. It stops the browser from reloading the page.
4. It changes the URL in the address bar.
5. It instantly removes the old React components and renders the new ones that match the new URL.

**The key benefit:** Because the page never actually reloads, your React state **survives** navigation. A click counter in the navbar stays at its count even as you move between pages.

---

## 2. Installing and Setting Up React Router

React doesn't come with routing built-in. We use the industry-standard library: `react-router-dom`.

```bash
# In your terminal, inside your Vite project folder:
pnpm add react-router-dom
```

### Step 1: Wrap the App in `<BrowserRouter>`
For the router to work, your entire application must be wrapped in a `<BrowserRouter>`. This is usually done in your `main.jsx` (or `index.js`).

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Import it
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Wrap your App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 3. Defining Routes — The App Layout Pattern

Inside your `App.jsx`, you define which components should show up for which URLs using `<Routes>` and `<Route>`.

The most important architectural pattern is this: **put your `<Navbar>` OUTSIDE of `<Routes>`**. This way, the navbar renders on every single page without being re-mounted, and any state it holds (like a cart count) is preserved.

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      {/* Navbar is OUTSIDE Routes — it always renders, on every page */}
      <Navbar />

      <main>
        {/* Routes only renders ONE of its children at a time */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Catch-All (404 Page). The "*" means "anything else" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
```

---

## 4. Navigation: Never use `<a>` tags!

> ⚠️ **CRITICAL RULE:** If you use a standard HTML `<a href="/about">` tag in a React app, the browser will do a full page reload. This destroys all your React state (e.g., the user is logged out, cart is emptied).

Always use React Router's **`<Link>`** component instead.

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* WRONG: <a href="/about">About</a> ← causes full page reload! */}
      
      {/* CORRECT: */}
      <Link to="/">Home</Link>
      <Link to="/about">About Us</Link>
    </nav>
  );
}
```

### `<NavLink>` for Active States
If you are building a navigation bar and want the link to look different when the user is currently on that page, use `<NavLink>` instead of `<Link>`. It receives an `isActive` boolean automatically.

```jsx
import { NavLink } from 'react-router-dom';

<NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
  About Us
</NavLink>
```

---

## 5. Dynamic Routes (URL Parameters)

Often, you don't know the exact URL in advance. A store might have thousands of products: `/products/123`, `/products/456`, etc. You can't write a `<Route>` for every single ID.

Instead, you use a **Dynamic Route** with a colon (`:`).

### 1. Define the Route with a variable
```jsx
// In App.jsx
<Route path="/products/:id" element={<ProductDetail />} />
```
The `:id` tells React Router: "This part of the URL is a variable named `id`".

### 2. Extract the variable using `useParams()`
Inside the `ProductDetail` component, you use the `useParams` Hook to read that variable from the URL.

```jsx
// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  // If the URL is /products/123, then id === "123"
  const { id } = useParams();

  return (
    <div>
      <h1>Product #{id}</h1>
      {/* You would usually use this 'id' to fetch data from a database */}
    </div>
  );
}
```

---

## 6. Programmatic Navigation (`useNavigate`)

Sometimes you need to navigate to a new route **without** the user clicking a link — for example, after they successfully submit a login form.

For this, we use the `useNavigate` hook.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // ... validate credentials ...
    
    // After successful login, send the user to the dashboard
    navigate('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... form fields ... */}
      <button type="submit">Login</button>
    </form>
  );
}
```

You can also navigate backwards using `navigate(-1)`, which mimics the browser's back button.

---

## 7. Handling 404 Pages

A `<Route path="*">` catches any URL that doesn't match the routes defined above it. Place it **last** in your `<Routes>` block.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  {/* This catches EVERYTHING else */}
  <Route path="*" element={<NotFound />} />
</Routes>
```
