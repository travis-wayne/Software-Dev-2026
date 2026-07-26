import useCartStore from './store/useCartStore.js';
import ProductList from './components/ProductList.jsx';
import CartSidebar from './components/CartSidebar.jsx';

function App() {
  // Select only the slice of state this component needs.
  // Zustand will only re-render App when totalQuantity changes.
  const totalQuantity = useCartStore(state => state.totalQuantity);

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>🐻 Zustand — Shopping Cart Demo</h1>
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
        Same cart functionality as the Redux demo — but in <strong>one store file</strong>, no Provider, no configureStore, no dispatch.
        Compare the code: <code>src/store/useCartStore.js</code> vs the Redux demo's <code>src/store/</code> folder.
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
