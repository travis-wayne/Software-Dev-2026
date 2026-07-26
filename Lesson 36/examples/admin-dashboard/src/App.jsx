import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';

// ── Auth Helper ────────────────────────────────────────────────────────────
// Checks whether a JWT token is saved in localStorage.
const isAuthenticated = () => !!localStorage.getItem('token');

// ── Protected Route Wrapper ────────────────────────────────────────────────
// Redirects to /login if the user is not authenticated.
// TODO: Build a LoginPage component and add a /login route.
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

// ── Nav Layout ─────────────────────────────────────────────────────────────
function AdminLayout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ width: 200, background: '#1a1a2e', color: '#fff', padding: '1rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><NavLink to="/products" style={{ color: '#ccc' }}>📦 Products</NavLink></li>
          <li><NavLink to="/users" style={{ color: '#ccc' }}>👥 Users</NavLink></li>
          <li><NavLink to="/orders" style={{ color: '#ccc' }}>🧾 Orders</NavLink></li>
        </ul>
        <button onClick={handleLogout} style={{ marginTop: '2rem', cursor: 'pointer' }}>Logout</button>
      </nav>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: Add a /login route that renders a LoginPage component */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout><ProductsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AdminLayout><UsersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AdminLayout><OrdersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
