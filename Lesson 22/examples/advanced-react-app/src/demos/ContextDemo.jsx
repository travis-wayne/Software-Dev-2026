// src/demos/ContextDemo.jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ContextDemo() {
  return (
    <div className="demo-container">
      <h2>🌍 The Context API Solution</h2>
      <p className="demo-desc">
        Compare this to the Prop Drilling tab. The same 5-level deep component tree — but now <strong>no
        component passes props</strong>. The <code>ThemeProvider</code> broadcasts globally, and any component
        calls <code>useContext(ThemeContext)</code> to receive it directly.
      </p>

      {/* 5-level tree, matching the PropDrillingDemo — but with NO props passed between levels */}
      <div className="component-box level-1">
        <span className="box-label">Level 1: ContextDemo — No user prop! No theme prop!</span>
        <PageLayout />
      </div>
    </div>
  );
}

// Level 2 — a middleman that does NOT need theme and therefore does NOT receive it
function PageLayout() {
  return (
    <div className="component-box level-2">
      <span className="box-label">Level 2: PageLayout — Middleman. No props here.</span>
      <ContentSection />
    </div>
  );
}

// Level 3 — another middleman. Completely unaware of the theme.
function ContentSection() {
  return (
    <div className="component-box level-3">
      <span className="box-label">Level 3: ContentSection — Middleman. No props here.</span>
      <ArticleWrapper />
    </div>
  );
}

// Level 4 — another middleman.
function ArticleWrapper() {
  return (
    <div className="component-box level-4">
      <span className="box-label">Level 4: ArticleWrapper — Middleman. No props here.</span>
      <ThemedCard />
    </div>
  );
}

// Level 5 — the component that actually needs the theme. Gets it directly from Context!
function ThemedCard() {
  // ✅ No props were passed to this component.
  // It uses useContext to "teleport" to the ThemeProvider at the top of the app.
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="component-box level-5">
      <span className="box-label">Level 5: ThemedCard — useContext() gets the value directly!</span>

      <div className={`theme-card theme-card--${theme}`}>
        <div className="theme-header">
          <h3>Current Theme: <em>{theme}</em></h3>
          {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
        </div>
        <p>
          This component called <code>useContext(ThemeContext)</code> and got the theme instantly.
          Zero props were passed through Levels 2, 3, or 4. That's Context!
        </p>
        <button className="btn btn-primary mt-3" onClick={toggleTheme}>
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
