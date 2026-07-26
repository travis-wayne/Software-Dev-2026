import { useEffect, useState } from 'react';

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

const STATUS_COLORS = {
  pending: '#fff3cd',
  shipped: '#cce5ff',
  delivered: '#d4edda',
  cancelled: '#f8d7da',
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = () => {
    authFetch(`${API_URL}/api/orders`)
      .then(res => {
        if (res.status === 403) throw new Error('Admin access required to view all orders.');
        return res.json();
      })
      .then(data => setOrders(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    await authFetch(`${API_URL}/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Orders</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee', textAlign: 'left' }}>
            <th style={{ padding: '0.5rem' }}>Order ID</th>
            <th style={{ padding: '0.5rem' }}>Customer</th>
            <th style={{ padding: '0.5rem' }}>Total</th>
            <th style={{ padding: '0.5rem' }}>Date</th>
            <th style={{ padding: '0.5rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '0.5rem', fontSize: '0.8rem', color: '#666' }}>{o.id.slice(0, 8)}...</td>
              <td style={{ padding: '0.5rem' }}>{o.user?.name || 'Unknown'}</td>
              <td style={{ padding: '0.5rem' }}>₦{o.totalAmount?.toLocaleString()}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: '0.5rem' }}>
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                  style={{ background: STATUS_COLORS[o.status] || '#eee', padding: '0.2rem', border: 'none', borderRadius: 4 }}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;
