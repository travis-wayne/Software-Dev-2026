// src/components/Navbar.jsx
import { NavLink } from 'react-router-dom'

function Navbar() {
  const getNavClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="navbar-logo">⚛️ RouterDemo</div>

      <div className="navbar-links">
        <NavLink to="/"        end className={getNavClass}>Home</NavLink>
        <NavLink to="/about"      className={getNavClass}>About</NavLink>
        <NavLink to="/products"   className={getNavClass}>Products</NavLink>
        <NavLink to="/quiz"       className={getNavClass}>📝 Quiz</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
