import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// configureStore does three things automatically:
// 1. Combines all your reducers into a single root reducer.
// 2. Sets up Redux DevTools browser extension (no extra config needed).
// 3. Adds useful middleware like serializability checks to catch bugs early.

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // As the app grows, register more slices here:
    // auth: authReducer,
    // products: productsReducer,
  },
});

export default store;
