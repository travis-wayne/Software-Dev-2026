// src/demos/ContextDemo.jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ContextDemo() {
  return (
    <div className="demo-container">
      <h2>🌍 The Context API Solution</h2>
      <p className="demo-desc">
        The <code>ThemeProvider</code> wraps our entire app. Any component, no matter how deep, 
        can use <code>useContext(ThemeContext)</code> to instantly read or update the theme without prop drilling!
      </p>
      
      <div className="component-box level-1">
        <span className="box-label">Level 1: ContextDemo (No props passed down!)</span>
        <DeeplyNestedLayout />
      </div>
    </div>
  );
}

function DeeplyNestedLayout() {
  return (
    <div className="component-box level-3">
      <span className="box-label">Level 3: DeeplyNestedLayout (Middleman)</span>
      <ThemedCard />
    </div>
  );
}

function ThemedCard() {
  // We tune into the broadcast! No props were passed to us.
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="component-box level-5">
      <span className="box-label">Level 5: ThemedCard (Using Context)</span>
      
      <div className={`theme-card theme-card--${theme}`}>
        <div className="theme-header">
          <h3>Current Theme: {theme}</h3>
          {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
        </div>
        <p>This card reads the global context directly. Try clicking the toggle below or in the Navbar!</p>
        <button className="btn btn-primary mt-3" onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
