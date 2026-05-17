// src/pages/Home.jsx
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page fade-in">
      <h1>🏠 Welcome Home</h1>
      <p className="page-desc">
        This is a Single Page Application (SPA). Notice how fast the navigation is? 
        The browser never reloads the page. React Router simply intercepts the URL 
        change and swaps the components instantly.
      </p>
      
      <div className="action-cards">
        <div className="card">
          <h3>Try it out</h3>
          <p>Click the button below to visit the About page.</p>
          {/* We use Link for standard navigation within the app */}
          <Link to="/about" className="btn btn-primary mt-3">Go to About</Link>
        </div>
        
        <div className="card">
          <h3>Dynamic Routing</h3>
          <p>See how URL parameters work.</p>
          <Link to="/products" className="btn btn-secondary mt-3">View Products</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
