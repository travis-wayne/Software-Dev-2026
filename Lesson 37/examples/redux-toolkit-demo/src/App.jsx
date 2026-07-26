import { useSelector } from 'react-redux';
import ProductList from './components/ProductList.jsx';
import CartSidebar from './components/CartSidebar.jsx';

function App() {
  // Read the cart quantity for the header badge.
  // This component only re-renders when totalQuantity changes.
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>🛒 Redux Toolkit — Shopping Cart Demo</h1>
        <div style={{ position: 'relative', fontSize: '2rem' }}>
          🛒
          {totalQuantity > 0 && (
            <span style={{
              position: 'absolute', top: -8, right: -8,
              background: '#e74c3c', color: '#fff', borderRadius: '50%',
              width: 22, height: 22, fontSize: '0.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold',
            }}>
              {totalQuantity}
            </span>
          )}
        </div>
      </header>

      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Open the <strong>Redux DevTools</strong> browser extension to inspect every action and time-travel through state changes!
      </p>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <main style={{ flex: 1 }}>
          <ProductList />
        </main>
        <aside style={{ width: 300 }}>
          <CartSidebar />
        </aside>
      </div>
    </div>
  );
}

export default App;
