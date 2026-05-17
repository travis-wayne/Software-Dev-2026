// src/pages/Products.jsx
import { Link } from 'react-router-dom'

// Mock database of products
export const INVENTORY = [
  { id: '101', name: 'Wireless Headphones', price: '$99' },
  { id: '102', name: 'Mechanical Keyboard', price: '$120' },
  { id: '103', name: 'USB-C Hub',           price: '$45' }
]

function Products() {
  return (
    <div className="page fade-in">
      <h1>🛍️ Product List</h1>
      <p className="page-desc">
        Click on a product to see its details. Notice how we use a dynamic route 
        <code>/products/:id</code> instead of creating a separate route for every single product.
      </p>

      <div className="product-grid">
        {INVENTORY.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            {/* The Link dynamically points to /products/101, /products/102, etc. */}
            <Link to={`/products/${product.id}`} className="btn btn-secondary mt-3 block text-center">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
