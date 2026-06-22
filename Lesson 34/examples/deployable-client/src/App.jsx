import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Checking...')
  
  // This is the crucial part of frontend deployment!
  // Instead of fetching from http://localhost:3000, we use an environment variable.
  // Vite uses import.meta.env to access these variables.
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    fetch(`${API_URL}/api/status`)
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(err => setApiStatus('Offline (CORS or Network Error)'))
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Deployable Frontend (Vite + React)</h1>
      <p>This template is configured to deploy perfectly to Vercel.</p>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', display: 'inline-block' }}>
        <h3>API Connection Status</h3>
        <p>Trying to fetch from: <code>{API_URL}</code></p>
        <h2 style={{ color: apiStatus === 'Online' ? 'green' : 'red' }}>
          {apiStatus}
        </h2>
      </div>
    </div>
  )
}

export default App
