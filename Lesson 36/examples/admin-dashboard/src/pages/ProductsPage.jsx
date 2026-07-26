import { useEffect, useState } from 'react';

// Reusable helper: injects the JWT token into every request automatically.
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};

const API_URL = import.meta.env.VITE_API_URL;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state for creating a new product
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  // ── Fetch all products on mount ──────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      setError('Failed to load products. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Create a new product ─────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await authFetch(`${API_URL}/api/products`, {
      method: 'POST',
      body: JSON.stringify({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }),
    });
    if (res.ok) {
      setForm({ name: '', description: '', price: '', stock: '', category: '' });
      setShowForm(false);
      fetchProducts();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to create product');
    }
  };

  // ── Delete a product ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await authFetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* ── Add Product Form ─────────────────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleCreate} style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem' }}>
          <h3>New Product</h3>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Price (₦)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          <input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <button type="submit">Create Product</button>
        </form>
      )}

      {/* ── Products Table ───────────────────────────────────────────── */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Category</th>
            <th style={{ padding: '0.5rem' }}>Price</th>
            <th style={{ padding: '0.5rem' }}>Stock</th>
            <th style={{ padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem' }}>{p.name}</td>
              <td style={{ padding: '0.5rem' }}>{p.category || '—'}</td>
              <td style={{ padding: '0.5rem' }}>₦{p.price?.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{p.stock}</td>
              <td style={{ padding: '0.5rem' }}>
                {/* TODO: Implement an edit modal or inline edit form */}
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
