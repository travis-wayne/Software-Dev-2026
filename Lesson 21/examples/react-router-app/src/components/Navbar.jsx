// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom'

function Navbar() {
  // We use NavLink instead of Link here because NavLink automatically
  // provides an 'isActive' boolean to the className function.
  // This lets us style the active tab differently.
  
  const getNavClass = ({ isActive }) => {
    return isActive ? "nav-link nav-link--active" : "nav-link"
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        ⚛️ RouterDemo
      </div>
      <div className="navbar-links">
        {/* CRITICAL: Never use <a href="..."> in a React app. It causes a full page reload! */}
        <NavLink to="/" className={getNavClass}>Home</NavLink>
        <NavLink to="/about" className={getNavClass}>About</NavLink>
        <NavLink to="/products" className={getNavClass}>Products</NavLink>
        <NavLink to="/quiz" className={getNavClass}>📝 Quiz</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
