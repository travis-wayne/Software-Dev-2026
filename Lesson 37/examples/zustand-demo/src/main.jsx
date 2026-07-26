import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Notice: No Provider wrapper needed with Zustand.
// The store is globally accessible as a hook from any component.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
