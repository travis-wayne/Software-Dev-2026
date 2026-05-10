// src/App.jsx
// ─────────────────────────────────────────────────
// Lesson 20 — state-demo-app
// Tab-based layout that switches between the 4 demos.
// ─────────────────────────────────────────────────

import { useState } from 'react'
import CounterDemo from './demos/CounterDemo'
import ToggleDemo  from './demos/ToggleDemo'
import FetchDemo   from './demos/FetchDemo'
import ClockDemo   from './demos/ClockDemo'
import './App.css'

const TABS = [
  { id: 'counter', label: '🔵 useState Counter',  component: CounterDemo },
  { id: 'toggle',  label: '🟡 Toggle & Input',    component: ToggleDemo  },
  { id: 'fetch',   label: '🌐 Data Fetching',      component: FetchDemo   },
  { id: 'clock',   label: '🕐 Cleanup / Clock',   component: ClockDemo   },
]

function App() {
  const [activeTab, setActiveTab] = useState('counter')
  const ActiveDemo = TABS.find(t => t.id === activeTab).component

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚛️ Lesson 20 — useState & useEffect</h1>
        <p className="app-subtitle">
          Four real React demos you can interact with and inspect.
          Each tab teaches a different concept.
        </p>
      </header>

      {/* Tab navigation */}
      <nav className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Render only the active demo */}
      <main>
        <ActiveDemo />
      </main>
    </div>
  )
}

export default App
