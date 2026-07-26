import useCartStore from '../store/useCartStore.js';

const PRODUCTS = [
  { id: 1, name: 'Classic White T-Shirt', price: 5000, category: 'Tops' },
  { id: 2, name: 'Slim Fit Denim Jeans', price: 18000, category: 'Bottoms' },
  { id: 3, name: 'Leather Sneakers', price: 32000, category: 'Footwear' },
  { id: 4, name: 'Woven Bucket Hat', price: 7500, category: 'Accessories' },
  { id: 5, name: 'Ankara Print Shirt', price: 12000, category: 'Tops' },
];

function ProductList() {
  // Select only what this component needs — prevents re-renders from other state changes.
  // addItem is a stable function reference, so this is safe to do.
  const addItem = useCartStore(state => state.addItem);
  const cartItemIds = useCartStore(state => state.items.map(i => i.id));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Products</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PRODUCTS.map(product => (
          <div
            key={product.id}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: 8,
              background: cartItemIds.includes(product.id) ? '#f0fff4' : '#fff',
            }}
          >
            <div>
              <strong>{product.name}</strong>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{product.category}</div>
              <div style={{ color: '#27ae60', fontWeight: 'bold', marginTop: 4 }}>
                ₦{product.price.toLocaleString()}
              </div>
            </div>
            {/* No dispatch needed — just call the action function directly */}
            <button
              onClick={() => addItem(product)}
              style={{
                padding: '0.4rem 1rem', background: '#3498db', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer',
              }}
            >
              {cartItemIds.includes(product.id) ? '+ More' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
