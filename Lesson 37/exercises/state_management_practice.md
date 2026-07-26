# Exercise: Migrating to Global State Management

In this exercise, you will take an existing React application that uses `useState` and the Context API and migrate its global state to either Redux Toolkit or Zustand. Choose one path and complete all tasks in that section.

---

## Prerequisites

- Your Lesson 36 Admin Dashboard project (or the `examples/admin-dashboard` scaffold).
- Either path installed: `npm install @reduxjs/toolkit react-redux` or `npm install zustand`.
- The Redux DevTools browser extension (for Path A).

---

## Task 1 — Identify the Global State

Before writing code, identify every piece of state in the application that is truly "global" (shared across multiple unrelated components).

In your Admin Dashboard, the following qualify:

| State | Where it's used now | Problem |
|-------|--------------------|----|
| `token` (in `localStorage`) | Checked in every page and `ProtectedRoute` | Not reactive — components don't know when it changes |
| Cart items | Doesn't exist yet | Will need to be shared between Header, ProductsPage, and CartPage |

Write down your answers here before moving on:
1. What global state does your app currently have?
2. What global state does your app *need* but doesn't have yet?

---

## Path A — Redux Toolkit

### A1 — Set Up the Store

1. Install Redux Toolkit: `npm install @reduxjs/toolkit react-redux`.
2. Create `src/store/authSlice.js`. Define:
   - `initialState`: `{ token: null, user: null, isAuthenticated: false }`.
   - Reducers: `login(state, action)` (sets token and user) and `logout(state)` (clears everything).
3. Create `src/store/index.js` with `configureStore`, registering `authReducer`.
4. Wrap your `<App />` in `<Provider store={store}>` inside `src/main.jsx`.

### A2 — Replace `localStorage` Checks

Right now, your `ProtectedRoute` component checks `!!localStorage.getItem('token')`. This is not reactive.

1. In `LoginPage.jsx`, replace `localStorage.setItem('token', data.token)` with `dispatch(login({ token: data.token, user: data.user }))`.
2. In `ProtectedRoute`, replace the `localStorage` check with `useSelector(state => state.auth.isAuthenticated)`.
3. In your logout button handler, replace `localStorage.removeItem('token')` with `dispatch(logout())`.
4. Verify: Log in, then navigate. The dashboard should load. Log out — you should be redirected to `/login` immediately, without a page refresh.

### A3 — Build the Cart Slice

1. Create `src/store/cartSlice.js` with:
   - `addItem`, `removeItem`, `updateQuantity`, `clearCart` reducers.
   - Register it in `configureStore`.
2. Add a cart item count badge to your navigation: `const totalQuantity = useSelector(state => state.cart.totalQuantity)`.
3. Add an "Add to Cart" button to each row in `ProductsPage.jsx` that dispatches `addItem(product)`.
4. Create a new `src/pages/CartPage.jsx` that reads `state.cart.items` with `useSelector` and displays them in a table.
5. Add a route for `/cart` in `App.jsx`.

### A4 — Verify with Redux DevTools

1. Open the app, open DevTools, and click the Redux DevTools panel.
2. Add three different items to the cart. Confirm you see three `cart/addItem` actions logged.
3. Use the time-travel feature: click the first `cart/addItem` action. Verify the cart sidebar shows only one item.
4. Click the latest action to return to the current state.

**✅ Checkpoint:** Open `http://localhost:5173/cart`. The cart page must list all items. The header badge must match the number of items. Logging out must redirect you to `/login` immediately.

---

## Path B — Zustand

### B1 — Set Up the Auth Store

1. Install Zustand: `npm install zustand`.
2. Create `src/store/useAuthStore.js`:
   ```javascript
   import { create } from 'zustand';

   const useAuthStore = create((set) => ({
     token: null,
     user: null,
     isAuthenticated: false,
     login: (token, user) => set({ token, user, isAuthenticated: true }),
     logout: () => set({ token: null, user: null, isAuthenticated: false }),
   }));

   export default useAuthStore;
   ```

### B2 — Replace `localStorage` Checks

1. In `LoginPage.jsx`, call `useAuthStore(state => state.login)(data.token, data.user)` on successful login. Remove the `localStorage.setItem` call.
2. In `ProtectedRoute`, replace the `localStorage` check with `const isAuthenticated = useAuthStore(state => state.isAuthenticated)`.
3. In your logout button, call `useAuthStore(state => state.logout)()`. Remove `localStorage.removeItem`.
4. Verify login and logout work reactively (no page refresh needed).

### B3 — Build the Cart Store

1. Create `src/store/useCartStore.js` with `items`, `totalQuantity`, `totalPrice`, `addItem`, `removeItem`, `clearCart`.
2. Add a cart item count badge to your navigation using `useCartStore(state => state.totalQuantity)`.
3. Add an "Add to Cart" button in `ProductsPage.jsx` using `useCartStore(state => state.addItem)`.
4. Create `src/pages/CartPage.jsx` reading from `useCartStore`.
5. Add a `/cart` route in `App.jsx`.

### B4 — Verify

1. Open the app. Add three items to the cart. Confirm the header badge updates to 3 without a page refresh.
2. Navigate to `/cart`. All items must be listed.
3. Remove an item from `/cart`. The badge in the header must immediately update.

**✅ Checkpoint:** All state changes must be reflected instantly across the Header, ProductsPage, and CartPage — with zero prop drilling and no page reloads.

---

## Bonus Challenge

Persist the cart across page refreshes using Zustand's `persist` middleware:

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      // ... your actions
    }),
    {
      name: 'cart-storage', // Key in localStorage
    }
  )
);
```

After implementing this, refresh the page. Your cart should still be there! Then do the same for `useAuthStore` to persist the login session across page refreshes — replacing the need for `localStorage` entirely.
