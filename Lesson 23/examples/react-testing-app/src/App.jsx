import React, { useState } from 'react';
import DisplayMessage from './components/DisplayMessage';
import Counter from './components/Counter';
import Quiz from './components/Quiz';
import Concepts from './components/Concepts';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('concepts');

  const TABS = [
    { id: 'concepts', label: '📖 Concepts', emoji: '📖' },
    { id: 'demo',     label: '🕹️ Live Demos', emoji: '🕹️' },
    { id: 'quiz',     label: '📝 Quiz',       emoji: '📝' },
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🧪</span>
          <span className="brand-name">TestingLab</span>
          <span className="brand-badge">Lesson 23</span>
        </div>
        <div className="navbar-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-glow"></div>
        <p className="hero-eyebrow">Session 23 · Vitest · React Testing Library</p>
        <h1 className="hero-title">Intro to <span className="hero-highlight">Software Testing</span></h1>
        <p className="hero-sub">
          Learn to write unit tests and component tests that give you complete confidence in your code.
        </p>
        <div className="hero-pills">
          <span className="pill">✅ Vitest</span>
          <span className="pill">✅ React Testing Library</span>
          <span className="pill">✅ AAA Pattern</span>
          <span className="pill">✅ userEvent</span>
        </div>
      </div>

      {/* Content */}
      <main className="main-content">
        {activeTab === 'concepts' && <Concepts />}

        {activeTab === 'demo' && (
          <div className="demo-page fade-in">
            {/* Instruction Banner */}
            <div className="instruction-banner">
              <div className="instruction-icon">💡</div>
              <div>
                <p className="instruction-title">These are the components you'll be testing.</p>
                <p className="instruction-body">
                  Run <code>pnpm test</code> in your terminal, then open the <code>.test.jsx</code> and <code>.test.js</code>
                  files in VS Code to complete the exercises. Watch the terminal turn 🔴 red when a test fails and 🟢 green when it passes!
                </p>
              </div>
            </div>

            <div className="demo-grid">
              {/* Demo 1 */}
              <div className="demo-card">
                <div className="demo-card-header">
                  <span className="demo-tag demo-tag--prop">Props</span>
                  <h3 className="demo-card-title">DisplayMessage</h3>
                  <p className="demo-card-desc">
                    Accepts a <code>message</code> prop and displays it. If no prop is passed, it renders a fallback.
                    You'll test this with <code>screen.getByText()</code>.
                  </p>
                </div>
                <div className="demo-card-preview">
                  <p className="preview-label">Rendered Output ↓</p>
                  <DisplayMessage message="Hello React Testing!" />
                  <div style={{marginTop:'0.75rem'}}>
                    <DisplayMessage />
                  </div>
                </div>
                <div className="demo-card-code">
                  <p className="code-label">📄 File: <code>components/DisplayMessage.test.jsx</code></p>
                  <p className="code-task">Exercise 2 → Fill in the <code>renders the correct message prop</code> test.</p>
                </div>
              </div>

              {/* Demo 2 */}
              <div className="demo-card">
                <div className="demo-card-header">
                  <span className="demo-tag demo-tag--state">useState</span>
                  <h3 className="demo-card-title">Counter</h3>
                  <p className="demo-card-desc">
                    Manages its own count with <code>useState</code>. Clicking "Increment" updates state.
                    You'll simulate that click with <code>userEvent.click()</code>.
                  </p>
                </div>
                <div className="demo-card-preview">
                  <p className="preview-label">Rendered Output ↓</p>
                  <Counter />
                </div>
                <div className="demo-card-code">
                  <p className="code-label">📄 File: <code>components/Counter.test.jsx</code></p>
                  <p className="code-task">Exercise 3 → Fill in the <code>increments the count when clicked</code> test.</p>
                </div>
              </div>
            </div>

            {/* Math unit test section */}
            <div className="unit-section">
              <div className="unit-section-header">
                <span className="demo-tag demo-tag--unit">Unit Test</span>
                <h3>Math Utility (math.js)</h3>
              </div>
              <p className="unit-desc">
                Pure JavaScript functions are the easiest things to unit test — no browser, no DOM needed. 
                The <code>add()</code> function is already tested for you as a reference. Your job is to test <code>multiply()</code>.
              </p>
              <div className="code-block">
                <p className="code-block-label">📄 src/utils/math.test.js</p>
                <pre>{`describe('Math utilities', () => {
  it('should correctly add two numbers', () => {
    // Arrange
    const num1 = 5, num2 = 10;
    // Act
    const result = add(num1, num2);
    // Assert ← The actual check
    expect(result).toBe(15); // ✅
  });

  // 🎓 YOUR TURN: Test the multiply() function below!
  it('should multiply two numbers correctly', () => {
    // ...fill this in (Exercise 1)
  });
});`}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="fade-in">
            <div className="quiz-header">
              <h2 className="quiz-header-title">Knowledge Check</h2>
              <p className="quiz-header-sub">5 questions to test your understanding of Vitest and React Testing Library.</p>
            </div>
            <Quiz />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
