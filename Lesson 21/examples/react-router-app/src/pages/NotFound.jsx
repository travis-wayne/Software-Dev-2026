// src/pages/NotFound.jsx
import { Link, useLocation } from 'react-router-dom'

function NotFound() {
  // useLocation() gives us information about the current URL.
  // We use it here to show the student exactly which path triggered the 404.
  const location = useLocation()

  return (
    <div className="page fade-in text-center mt-5">
      <h1 className="text-danger text-4xl mb-2">404</h1>
      <h2>Page Not Found</h2>
      <p className="text-muted mt-2">
        No route matched the path: <code>{location.pathname}</code>
      </p>

      <div className="concept-box text-left mb-4 mt-4">
        <h3>How this works:</h3>
        <p>
          The <code>&lt;Route path="*"&gt;</code> at the bottom of your <code>&lt;Routes&gt;</code> block
          acts as a catch-all wildcard. Since no other route matched <code>{location.pathname}</code>,
          this component was rendered instead.
        </p>
        <p style={{marginTop:'0.75rem'}}>
          We used the <code>useLocation()</code> hook to read the current URL and display the path
          that was tried.
        </p>
      </div>
      
      <Link to="/" className="btn btn-primary">Take Me Home</Link>
    </div>
  )
}

export default NotFound
