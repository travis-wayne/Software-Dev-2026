import { create } from 'zustand';

// Zustand collapses the store, actions, and reducers into a single create() call.
// The result is a custom hook you call directly inside any component.
// No Provider, no configureStore, no dispatch — just call the hook.

const useCartStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  items: [],           // [{ id, name, price, quantity }]
  totalQuantity: 0,
  totalPrice: 0,

  // ── Actions ──────────────────────────────────────────────────────────────
  // Actions are plain functions — no action type strings, no reducers needed.

  addItem: (product) => {
    const { items } = get(); // get() reads the current state synchronously
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

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return;
    const { items } = get();
    const item = items.find(i => i.id === id);
    if (!item) return;

    const diff = quantity - item.quantity;
    set(state => ({
      items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
      totalQuantity: state.totalQuantity + diff,
      totalPrice: state.totalPrice + diff * item.price,
    }));
  },

  clearCart: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),
}));

export default useCartStore;
