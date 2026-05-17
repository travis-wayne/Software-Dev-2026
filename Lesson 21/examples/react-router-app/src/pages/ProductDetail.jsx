// src/pages/ProductDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { INVENTORY } from './Products'

function ProductDetail() {
  // 1. The 'id' parameter is extracted from the URL. 
  // If the URL is /products/102, then id === "102".
  const { id } = useParams()

  // 2. Find the product in our database that matches this ID
  const product = INVENTORY.find(item => item.id === id)

  // 3. Handle the case where the product isn't found
  if (!product) {
    return (
      <div className="page fade-in text-center mt-5">
        <h2>⚠️ Product Not Found</h2>
        <p>There is no product with the ID: {id}</p>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    )
  }

  // 4. Render the product details
  return (
    <div className="page fade-in">
      <Link to="/products" className="back-link">← Back to Products</Link>
      
      <div className="product-detail-card">
        <h1>{product.name}</h1>
        <div className="price-tag">{product.price}</div>
        <p className="mt-3 text-muted">
          Product ID: <code>{id}</code>
        </p>
        
        <div className="concept-box mt-4">
          <h3>Dynamic Routing in Action</h3>
          <p>
            You are viewing the <code>&lt;ProductDetail /&gt;</code> component. 
            It used the <code>useParams()</code> hook to read the <strong>{id}</strong> from the URL 
            and used it to fetch the correct data.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
