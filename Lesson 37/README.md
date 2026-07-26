# Lesson 37 — Advanced Frontend: State Management (Redux Toolkit & Zustand)

**Session Type:** Advanced Frontend
**Duration:** 90 minutes
**Prerequisites:** React Hooks (`useState`, `useContext`), Component Architecture (Lessons 20–26), E-commerce Admin Dashboard (Lesson 36)

---

## What This Lesson Covers

| Topic | Description |
|-------|-------------|
| **The Problem with Context API** | Why `useState` and Context can become a bottleneck in large applications — re-renders, prop drilling, and scalability limits. |
| **Redux Toolkit** | The official, opinionated toolset for Redux. Covers `configureStore`, `createSlice`, `useSelector`, `useDispatch`, and Redux DevTools. |
| **Zustand** | A lightweight, hook-based alternative to Redux with near-zero boilerplate. Ideal for simpler global state needs. |
| **Choosing the Right Tool** | A practical framework for deciding when to use Context API, Zustand, or Redux Toolkit based on application complexity. |
| **Async State with `createAsyncThunk`** | Handling asynchronous operations (e.g., API fetches) inside Redux slices. |

---

## Running the Examples

### Redux Toolkit Example

```bash
cd examples/redux-toolkit-demo
npm install
npm run dev
```

Open **http://localhost:5173** to see a shopping cart managed entirely by Redux Toolkit. Use the **Redux DevTools** browser extension to inspect every state change and action dispatched.

### Zustand Example

```bash
cd examples/zustand-demo
npm install
npm run dev
```

Open **http://localhost:5174** to see the same shopping cart built with Zustand. Compare the boilerplate difference between the two implementations side-by-side.

---

## File Structure

```text
Lesson 37/
├── README.md
├── notes/
│   ├── tutor_notes.md                         # 90-min session plan + DevTools demo guide
│   └── student_notes.md                       # Concepts, code walkthroughs, comparison tables
├── examples/
│   ├── redux-toolkit-demo/                    # React app showcasing Redux Toolkit
│   │   ├── package.json
│   │   └── src/
│   │       ├── main.jsx                       # App entry — wraps with Redux Provider
│   │       ├── App.jsx
│   │       ├── store/
│   │       │   ├── index.js                   # configureStore
│   │       │   └── cartSlice.js               # createSlice with actions & reducers
│   │       └── components/
│   │           ├── ProductList.jsx            # Dispatches addToCart actions
│   │           └── CartSidebar.jsx            # Reads cart state with useSelector
│   └── zustand-demo/                          # Same app built with Zustand
│       ├── package.json
│       └── src/
│           ├── main.jsx
│           ├── App.jsx
│           ├── store/
│           │   └── useCartStore.js            # Zustand store — one file, no boilerplate
│           └── components/
│               ├── ProductList.jsx
│               └── CartSidebar.jsx
└── exercises/
    └── state_management_practice.md           # Hands-on task: migrate Context to Zustand/Redux
```

---

## Learning Objectives

By the end of this session the student will be able to:

1. Explain the limitations of the Context API for complex, high-frequency global state.
2. Set up a Redux Toolkit store with `configureStore` and define state slices with `createSlice`.
3. Connect React components to the Redux store using `useSelector` and `useDispatch`.
4. Build a Zustand store and consume it inside functional components with zero boilerplate.
5. Make an informed decision about which state management solution fits a given project's needs.
6. Use the Redux DevTools browser extension to inspect and time-travel through application state.
