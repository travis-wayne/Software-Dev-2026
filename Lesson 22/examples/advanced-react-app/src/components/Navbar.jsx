// src/components/Navbar.jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const tabs = [
    { id: 'prop-drilling', label: '🕳️ Prop Drilling' },
    { id: 'context',       label: '🌍 Context API' },
    { id: 'hooks',         label: '🪝 Custom Hooks' },
    { id: 'quiz',          label: '📝 Quiz' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        ⚛️ Advanced React
      </div>
      
      <div className="navbar-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </nav>
  );
}
