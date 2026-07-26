import useCartStore from '../store/useCartStore.js';

function CartSidebar() {
  // Selecting individual slices prevents this component from re-rendering
  // when unrelated parts of the store change.
  const items = useCartStore(state => state.items);
  const totalQuantity = useCartStore(state => state.totalQuantity);
  const totalPrice = useCartStore(state => state.totalPrice);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  return (
    <div style={{ border: '2px solid #333', borderRadius: 8, padding: '1rem', position: 'sticky', top: '1rem' }}>
      <h2 style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
        <span>Cart</span>
        <span style={{ fontSize: '0.9rem', color: '#888' }}>{totalQuantity} items</span>
      </h2>

      {items.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
          Your cart is empty.<br />Add some products!
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 320, overflowY: 'auto' }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#f9f9f9', borderRadius: 6 }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#27ae60' }}>₦{item.price.toLocaleString()} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ width: 24, height: 24, border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
                  >−</button>
                  <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ width: 24, height: 24, border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer', background: '#fff' }}
                  >+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ marginLeft: 4, background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1rem' }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          <hr style={{ margin: '1rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '1rem' }}>
            <span>Total:</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={clearCart}
            style={{ width: '100%', padding: '0.5rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Clear Cart
          </button>
        </>
      )}

      <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '1rem', textAlign: 'center' }}>
        🐻 Powered by Zustand — ~2KB total
      </p>
    </div>
  );
}

export default CartSidebar;
