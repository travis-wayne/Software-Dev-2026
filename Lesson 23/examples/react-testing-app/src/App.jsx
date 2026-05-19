import React, { useState } from 'react';
import DisplayMessage from './components/DisplayMessage';
import Counter from './components/Counter';
import Quiz from './components/Quiz';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('demo');

  return (
    <div className="app-container app-container--dark">
      <nav className="navbar">
        <div className="navbar-logo">🧪 TestingDemo</div>
        <div className="navbar-tabs">
          <button 
            className={`nav-tab ${activeTab === 'demo' ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            🕹️ Interactive Demos
          </button>
          <button 
            className={`nav-tab ${activeTab === 'quiz' ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            📝 Quiz
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'demo' && (
          <div className="demo-container fade-in">
            <h2>React Testing Demos</h2>
            <p className="demo-desc">
              These components are designed to be tested. Open the source code in VS Code, read the student notes, 
              and follow the exercises in <code>testing_practice.md</code> to learn how to write tests for them using Vitest and React Testing Library.
            </p>

            <div className="component-box mb-4">
              <span className="box-label">DisplayMessage Component</span>
              <p className="text-muted text-sm mb-3">Accepts a <code>message</code> prop. Tested using <code>screen.getByText()</code>.</p>
              <DisplayMessage message="Hello React Testing!" />
              <div className="mt-3">
                <DisplayMessage /> {/* Renders fallback */}
              </div>
            </div>

            <div className="component-box">
              <span className="box-label">Counter Component</span>
              <p className="text-muted text-sm mb-3">Has internal state. Tested using <code>userEvent.click()</code>.</p>
              <Counter />
            </div>
            
            <div className="concept-box mt-4">
              <h3>Run the tests!</h3>
              <p>In your terminal, run <code>pnpm test</code> to see Vitest run the tests for these components. Then go try Exercise 1 and Exercise 2 to write your own tests!</p>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && <Quiz />}
      </main>
    </div>
  );
}

export default App;
