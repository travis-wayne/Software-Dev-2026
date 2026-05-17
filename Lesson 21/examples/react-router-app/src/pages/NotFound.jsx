// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page fade-in text-center mt-5">
      <h1 className="text-danger text-4xl mb-2">404</h1>
      <h2>Page Not Found</h2>
      <p className="text-muted mt-2 mb-4">
        Oops! The route you are looking for doesn't exist.
      </p>
      
      <div className="concept-box text-left mb-4">
        <p>
          This component was rendered because the URL didn't match any of the defined routes.
          It fell through to the catch-all route: <code>&lt;Route path="*" element=&#123;&lt;NotFound /&gt;&#125; /&gt;</code>
        </p>
      </div>
      
      <Link to="/" className="btn btn-primary">Take Me Home</Link>
    </div>
  )
}

export default NotFound
