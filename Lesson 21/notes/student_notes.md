# Student Notes — Lesson 21: Routing & Multi-page Apps

## 1. What is Client-Side Routing?

In traditional websites, clicking a link sends a request to the server, the server sends back a brand new HTML file, and the browser completely reloads the page. The screen goes white for a second.

React is used to build **Single Page Applications (SPAs)**. In an SPA:
1. You only ever download **one** HTML file (`index.html`).
2. When you click a link, a JavaScript library (like **React Router**) intercepts the click.
3. It stops the browser from reloading the page.
4. It changes the URL in the address bar.
5. It instantly removes the old React components and renders the new ones that match the new URL.

This makes the application feel incredibly fast, like a native mobile app.

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

## 3. Defining Routes

Inside your `App.jsx`, you define which components should show up for which URLs using `<Routes>` and `<Route>`.

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import NotFound from './NotFound';

function App() {
  return (
    <Routes>
      {/* If the URL is exactly "/", show the Home component */}
      <Route path="/" element={<Home />} />
      
      {/* If the URL is "/about", show the About component */}
      <Route path="/about" element={<About />} />
      
      {/* Catch-All (404 Page). The "*" means "anything else" */}
      <Route path="*" element={<NotFound />} />
    </Routes>
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
      {/* WRONG: <a href="/about">About</a> */}
      
      {/* CORRECT: */}
      <Link to="/">Home</Link>
      <Link to="/about">About Us</Link>
    </nav>
  );
}
```

### `<NavLink>` for Active States
If you are building a navigation bar and want the link to look different when the user is currently on that page, use `<NavLink>` instead of `<Link>`. It automatically gets an `active` class when the URL matches its `to` prop.

```jsx
import { NavLink } from 'react-router-dom';

// In CSS: .active { font-weight: bold; color: red; }
<NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
  About Us
</NavLink>
```

---

## 5. Dynamic Routes (URL Parameters)

Often, you don't know the exact URL in advance. For example, a store might have thousands of products: `/products/123`, `/products/456`, etc. You can't write a `<Route>` for every single number.

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
// src/ProductDetail.jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  // Extract the 'id' from the URL (/products/123 -> id is "123")
  const { id } = useParams();

  return (
    <div>
      <h1>Showing details for product number: {id}</h1>
      {/* You would usually use this 'id' to fetch data from a database */}
    </div>
  );
}
```
