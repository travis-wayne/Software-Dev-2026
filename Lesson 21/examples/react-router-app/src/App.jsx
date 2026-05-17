// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import Quiz from './Quiz'

function App() {
  return (
    <div className="app-container">
      {/* The Navbar sits outside the <Routes> so it is always visible on every page */}
      <Navbar />

      <main className="main-content">
        {/* The Routes component acts like a switch. It looks at the URL and renders the matching Route */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          
          {/* Dynamic Route: The ':id' is a parameter that will be extracted in the ProductDetail component */}
          <Route path="/products/:id" element={<ProductDetail />} />
          
          <Route path="/quiz" element={<Quiz />} />
          
          {/* The '*' path is a catch-all for any URL that doesn't match the routes above */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
