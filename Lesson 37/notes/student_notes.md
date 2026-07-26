# Lesson 37 — Advanced Frontend: State Management (Redux Toolkit & Zustand)
# Student Reference Notes

---

## 0. The State Analogy — A Whiteboard in an Office

Understanding how different state management tools work is like managing information in an office:
- `useState` = A **Post-it note on YOUR OWN DESK**. Only you can see it. If you throw it away, it's gone.
- `Context API` = The **OFFICE NOTICEBOARD**. Everyone can read it. But every time anyone writes anything on it (changes the context value), EVERYONE in the office looks up from their work (re-renders). Annoying for a busy office.
- `Redux / Zustand` = A shared **GOOGLE DOC**. Anyone can open just the section they need. When Section A changes, only people reading Section A get a notification — Section B readers keep working undisturbed. This is the performance win.

---

## 1. The Problem: When `useState` and Context Aren't Enough

Up until now, you've managed state with `useState` for local component state and the Context API for shared state. These are excellent tools — but they have limits in large, complex applications.

### The Re-render Problem with Context

Every time a Context value changes, **every component that consumes that Context re-renders** — even if it only uses a small part of the context value.

```jsx
// Imagine this context holds: { user, cart, theme, notifications }
const AppContext = createContext();

// The Header only needs user.name — but it will re-render every time
// cart, theme, OR notifications change. That's wasteful.
function Header() {
  const { user } = useContext(AppContext);
  return <h1>Welcome, {user.name}</h1>;
}
```

### Visual Proof: Context vs Redux/Zustand

When `cart` updates, here's what happens:

**Context API Re-renders:**
```text
[ App (Context Provider) ]
   ├── [ Navbar ] 🔄 (Re-renders because it reads Context, even if just for theme!)
   ├── [ Sidebar ] 🔄 (Re-renders)
   └── [ Cart ] 🔄 (Re-renders to show new cart)
```

**Redux / Zustand Re-renders:**
```text
[ App (Store Provider) ]
   ├── [ Navbar ] ✅ (Ignores cart update, no re-render)
   ├── [ Sidebar ] ✅ (Ignores cart update, no re-render)
   └── [ Cart ] 🔄 (Re-renders only this component)
```

### When You Need More

| Scenario | Best Solution |
|----------|--------------|
| State used in one component | `useState` |
| State shared between a few nearby components | Lift state up (props) |
| Low-frequency global state (theme, language, logged-in user) | Context API |
| High-frequency global state (cart, real-time data, complex forms) | **Redux Toolkit or Zustand** |
| Large team with strict conventions needed | **Redux Toolkit** |
| Small–medium app, minimal boilerplate preferred | **Zustand** |

---

## 2. Redux Toolkit: The Structured Approach

Redux Toolkit (RTK) is the official, recommended way to write Redux. It dramatically reduces boilerplate compared to classic Redux.

### Core Concepts

| Concept | What It Is | Analogy |
|---------|-----------|---------|
| **Store** | The single source of truth — holds the entire application state | A bank vault |
| **Slice** | A chunk of state + its associated reducers and actions | One department of the bank |
| **Action** | A plain object describing what happened: `{ type: 'cart/addItem', payload: product }` | A bank slip |
| **Reducer** | A pure function: `(currentState, action) => newState` | The bank teller |
| **Dispatch** | The method that sends an action to the store | Handing the slip to the teller |
| **Selector** | A function that reads a specific piece of state from the store | Checking your balance |

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Step 1 — Create a Slice (`src/store/cartSlice.js`)

`createSlice` is the heart of Redux Toolkit. It generates your action creators and reducer in one place.

```javascript
import { createSlice } from '@reduxjs/toolkit';

// Redux Toolkit uses the Immer library under the hood.
// This means you can write "mutating" code and it will safely produce a new state object.
const cartSlice = createSlice({
  name: 'cart', // This becomes the prefix for action types: 'cart/addItem', etc.
  initialState: {
    items: [],       // Array of { id, name, price, quantity }
    totalQuantity: 0,
    totalPrice: 0,
  },
  reducers: {
    // Each key in reducers becomes an action creator automatically
    addItem: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1; // Immer makes this direct mutation safe
      } else {
        state.items.push({ ...product, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.totalPrice += product.price;
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const item = state.items.find(i => i.id === id);
      if (!item) return;

      state.totalQuantity -= item.quantity;
      state.totalPrice -= item.price * item.quantity;
      state.items = state.items.filter(i => i.id !== id);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (!item) return;

      const diff = quantity - item.quantity;
      state.totalQuantity += diff;
      state.totalPrice += diff * item.price;
      item.quantity = quantity;
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

// Export the action creators (auto-generated by createSlice)
export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Export the reducer (to be registered in the store)
export default cartSlice.reducer;
```

### Step 2 — Create the Store (`src/store/index.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// configureStore automatically connects the Redux DevTools browser extension.
// No extra setup needed.
const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add more slices here as your app grows:
    // auth: authReducer,
    // ui: uiReducer,
  },
});

export default store;
```

### Step 3 — Wrap Your App with `Provider` (`src/main.jsx`)

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/index.js';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider makes the Redux store available to every component below it */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

### Step 4 — Dispatch Actions from a Component

```jsx
// src/components/ProductList.jsx
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

const PRODUCTS = [
  { id: 1, name: 'Classic T-Shirt', price: 5000 },
  { id: 2, name: 'Denim Jacket', price: 25000 },
];

function ProductList() {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    // dispatch sends the action object to the Redux store
    dispatch(addItem(product));
  };

  return (
    <div>
      <h2>Products</h2>
      {PRODUCTS.map(p => (
        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #eee' }}>
          <div>
            <strong>{p.name}</strong>
            <p>₦{p.price.toLocaleString()}</p>
          </div>
          <button onClick={() => handleAddToCart(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
```

### Step 5 — Read State with `useSelector`

```jsx
// src/components/CartSidebar.jsx
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../store/cartSlice';

function CartSidebar() {
  // useSelector subscribes this component to a specific slice of the store.
  // This component will ONLY re-render if state.cart changes — not when other
  // parts of the store (e.g., state.auth) change. This is the performance win.
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <aside style={{ width: 300, padding: '1rem', borderLeft: '1px solid #eee' }}>
      <h2>Cart ({totalQuantity} items)</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.name} × {item.quantity}</span>
              <button onClick={() => dispatch(removeItem(item.id))}>✕</button>
            </div>
          ))}
          <hr />
          <strong>Total: ₦{totalPrice.toLocaleString()}</strong>
          <button onClick={() => dispatch(clearCart())} style={{ display: 'block', marginTop: '1rem' }}>
            Clear Cart
          </button>
        </>
      )}
    </aside>
  );
}

export default CartSidebar;
```

### Using Redux DevTools

Install the **Redux DevTools** browser extension (Chrome or Firefox). Once installed and your store is created with `configureStore`, it works automatically — no code changes needed.

In DevTools:
- **Actions tab (left panel):** Every dispatched action is logged with its type and payload.
- **State tab:** See the full current state tree.
- **Diff tab:** See exactly what changed between two actions.
- **Time-travel:** Click any past action to rewind your app to that state. Invaluable for debugging.

---

## 3. Zustand: The Lightweight Alternative

Zustand achieves the same result as Redux with a fraction of the code. Everything lives in a single store file.

### Installation

```bash
npm install zustand
```

### Creating a Store (`src/store/useCartStore.js`)

```javascript
import { create } from 'zustand';

// create() returns a hook. You call this hook inside any component.
const useCartStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────
  items: [],
  totalQuantity: 0,
  totalPrice: 0,

  // ── Actions ──────────────────────────────────────────────────────
  // Actions are just regular functions — no action types, no reducers needed.

  addItem: (product) => {
    const { items } = get(); // get() reads the current state
    const existing = items.find(i => i.id === product.id);

    if (existing) {
      set(state => ({
        items: state.items.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        totalQuantity: state.totalQuantity + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    } else {
      set(state => ({
        items: [...state.items, { ...product, quantity: 1 }],
        totalQuantity: state.totalQuantity + 1,
        totalPrice: state.totalPrice + product.price,
      }));
    }
  },

  removeItem: (id) => {
    const { items } = get();
    const item = items.find(i => i.id === id);
    if (!item) return;

    set(state => ({
      items: state.items.filter(i => i.id !== id),
      totalQuantity: state.totalQuantity - item.quantity,
      totalPrice: state.totalPrice - item.price * item.quantity,
    }));
  },

  clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
}));

export default useCartStore;
```

### Using the Store in Components

There is no `Provider`. No `useDispatch`. Just call the hook directly.

```jsx
// src/components/ProductList.jsx (Zustand version)
import useCartStore from '../store/useCartStore';

function ProductList() {
  // Destructure only the actions/state you need — prevents unnecessary re-renders
  const addItem = useCartStore(state => state.addItem);

  return (
    <div>
      {PRODUCTS.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong>
          <button onClick={() => addItem(p)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
```

```jsx
// src/components/CartSidebar.jsx (Zustand version)
import useCartStore from '../store/useCartStore';

function CartSidebar() {
  // Select only the state this component needs
  const items = useCartStore(state => state.items);
  const totalPrice = useCartStore(state => state.totalPrice);
  const totalQuantity = useCartStore(state => state.totalQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);

  return (
    <aside>
      <h2>Cart ({totalQuantity} items)</h2>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() => removeItem(item.id)}>✕</button>
        </div>
      ))}
      <strong>Total: ₦{totalPrice.toLocaleString()}</strong>
      <button onClick={clearCart}>Clear Cart</button>
    </aside>
  );
}
```

---

## 4. Redux vs Zustand: Side-by-Side Comparison

| Feature | Redux Toolkit | Zustand |
|---------|--------------|---------|
| **Boilerplate** | Medium — slices, store, Provider | Minimal — one `create()` call |
| **Setup** | `configureStore` + `Provider` wrapper | No Provider needed |
| **DevTools** | First-class support, built-in | Available via middleware |
| **Learning Curve** | Steeper (but well-documented) | Gentle |
| **TypeScript** | Good support | Excellent, first-class |
| **Async Logic** | `createAsyncThunk` | Regular `async/await` in actions |
| **Best For** | Large teams, strict conventions, complex state | Small–medium apps, rapid development |
| **Bundle Size** | ~47KB | ~2KB |

---

## 5. Async State with `createAsyncThunk` (Redux Toolkit)

Often, state comes from an API. Redux Toolkit's `createAsyncThunk` handles the loading, success, and error states automatically.

```javascript
// src/store/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetching from our Lesson 36 E-commerce API
// NOTE: Make sure CORS is configured on the backend and VITE_API_URL is set in .env
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  // extraReducers handles actions from createAsyncThunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
```

Using it in a component:

```jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';

function ProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts()); // Triggers the async thunk
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Loading products...</p>;
  if (status === 'failed') return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <ul>
      {items.map(p => <li key={p.id}>{p.name} — ₦{p.price.toLocaleString()}</li>)}
    </ul>
  );
}
```

---

## 5.5 Zustand Persist — Surviving Page Refreshes

By default, Zustand state is lost on page refresh. The `persist` middleware saves state to localStorage automatically.

### The Problem
User adds 3 items to cart → refreshes page → cart is empty. Bad UX!

### The Solution
```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      addItem: (product) => { /* same as before */ },
      clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
    }),
    {
      name: 'shopping-cart', // localStorage key
      // Optional: only persist 'items', not computed values
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```
After adding this, open DevTools → Application → Local Storage → you'll see your cart saved there. Refresh the page — items are still there!

---

## 6. Assignments

### Pre-session
- Review `useState`, `useContext`, and when you've hit their limits in previous projects.
- Skim the [Redux Toolkit Quick Start](https://redux-toolkit.js.org/introduction/getting-started) docs.

### Post-session

**Option A — Redux Toolkit:**
- In your Lesson 36 Admin Dashboard, implement a global shopping cart using Redux Toolkit.
- Create a `cartSlice` with `addItem`, `removeItem`, `updateQuantity`, and `clearCart` actions.
- Display a cart item count badge in the navigation header that updates in real-time.
- Create a `/cart` page that shows all cart items and the total.
- **Bonus:** Use `createAsyncThunk` to fetch the products list from your backend API instead of hardcoding it.

**Option B — Zustand:**
- Complete the same cart feature using Zustand.
- Additionally, create a `useAuthStore` that replaces the `localStorage.getItem('token')` check with reactive Zustand state, so all components instantly reflect when the user logs in or out.

---

## 6.5 When Should You Use Which? (Decision Guide)

```text
Is the state used in ONE component only?
YES → Use useState
NO ↓

Is it low-frequency data that rarely changes? (auth status, theme, language)
YES → Use Context API
NO ↓

Are you on a large team that needs strict patterns and Redux DevTools?
YES → Use Redux Toolkit
NO ↓

→ Use Zustand
```

---

## 7. Resources & Links

### Reading Materials
- [Redux Toolkit Official Docs: Quick Start](https://redux-toolkit.js.org/introduction/getting-started)
- [Zustand Official Documentation](https://zustand-demo.pmnd.rs/)
- [Redux FAQ: When Should I Use Redux?](https://redux.js.org/faq/whentouse#when-should-i-use-redux)

### Video Tutorials
- [Redux Toolkit Crash Course — Traversy Media](https://www.youtube.com/watch?v=N_x4gV4400Y)
- [Zustand Tutorial for Beginners — Web Dev Simplified](https://www.youtube.com/watch?v=s_4C_c_fJ_g)

### Tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/download)
- [React Developer Tools (Chrome)](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkaikndgimoin)
- [Redux DevTools (Chrome)](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklgglnlmjkdafkceo/related)

---

## 8. Quick Reference

### Common Mistakes

| Mistake | Consequence | Fix |
|---------|-------------|-----|
| Selecting the whole store: `useSelector(state => state)` | Component re-renders on EVERY store change | Select only what you need: `useSelector(state => state.cart.items)` |
| Mutating state directly in reducers without RTK | State bugs that are impossible to trace | Use Redux Toolkit (Immer handles immutability) OR use `set()` in Zustand |
| Forgetting the `Provider` wrapper in Redux | `useSelector`/`useDispatch` hooks throw errors | Wrap your app root with `<Provider store={store}>` |

### Redux Toolkit Cheatsheet

```javascript
// Install
npm install @reduxjs/toolkit react-redux

// 1. Create a slice
import { createSlice } from '@reduxjs/toolkit';
const mySlice = createSlice({ name, initialState, reducers });
export const { action1, action2 } = mySlice.actions;
export default mySlice.reducer;

// 2. Create the store
import { configureStore } from '@reduxjs/toolkit';
const store = configureStore({ reducer: { myFeature: myReducer } });

// 3. Wrap App
import { Provider } from 'react-redux';
<Provider store={store}><App /></Provider>

// 4. Read state in a component
const value = useSelector(state => state.myFeature.value);

// 5. Dispatch an action
const dispatch = useDispatch();
dispatch(action1(payload));
```

### Zustand Cheatsheet

```javascript
// Install
npm install zustand

// 1. Create a store (returns a hook)
import { create } from 'zustand';
const useMyStore = create((set) => ({
  value: 0,
  increment: () => set(state => ({ value: state.value + 1 })),
}));

// 2. Use in any component — no Provider needed
const { value, increment } = useMyStore();
// Or select only what you need (prevents unnecessary re-renders):
const value = useMyStore(state => state.value);
```
