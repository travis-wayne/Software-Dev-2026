// src/context/ThemeContext.jsx
import { createContext, useState } from 'react';

// 1. Create the Context
// This is the "broadcast channel"
export const ThemeContext = createContext();

// 2. Create a Provider Component
// This component manages the state and broadcasts it to its children
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // We broadcast both the current theme string AND the function to change it
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
