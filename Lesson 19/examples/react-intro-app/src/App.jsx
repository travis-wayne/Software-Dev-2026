// src/App.jsx — Lesson 19: react-intro-app
import { useState } from 'react'
import Badge from './components/Badge'
import Button from './components/Button'
import UserCard from './components/UserCard'
import Quiz from './Quiz'
import './App.css'

const teamMembers = [
  { id: 1, name: 'Alice Johnson',  role: 'Lead Developer', isOnline: true  },
  { id: 2, name: 'Bob Smith',      role: 'UI Designer',    isOnline: false },
  { id: 3, name: 'Charlie Okafor', role: 'QA Engineer',    isOnline: true  },
]

function App() {
  const [tab, setTab] = useState('demo')

  return (
    <div className="app">
      {/* Tab nav */}
      <nav className="app-tabs">
        <button
          className={`app-tab ${tab === 'demo' ? 'app-tab--active' : ''}`}
          onClick={() => setTab('demo')}
        >
          ⚛️ Components Demo
        </button>
        <button
          className={`app-tab ${tab === 'quiz' ? 'app-tab--active' : ''}`}
          onClick={() => setTab('quiz')}
        >
          📝 Quiz
        </button>
      </nav>

      {/* Quiz tab */}
      {tab === 'quiz' && (
        <main>
          <Quiz />
        </main>
      )}

      {/* Demo tab */}
      {tab === 'demo' && (
        <>
          <header className="app-header">
            <h1>⚛️ Lesson 19 — Components & Props</h1>
            <p className="app-subtitle">
              Each card below is the same <code>UserCard</code> component,
              rendered with different props.
            </p>
          </header>

          <main className="team-board">
            {teamMembers.map(member => (
              <UserCard
                key={member.id}
                name={member.name}
                role={member.role}
                isOnline={member.isOnline}
              />
            ))}
          </main>

          <section className="button-demo">
            <h2>Reusable Button Component</h2>
            <p className="demo-desc">
              The same <code>Button</code> component renders differently
              based on the props it receives.
            </p>
            <div className="button-row">
              <Button text="Follow"   variant="primary"   />
              <Button text="Message"  variant="secondary" />
              <Button text="Delete"   variant="danger"    />
              <Button text="Disabled" variant="primary"   disabled />
            </div>
          </section>

          {/* ── TODO (Exercise 7) ──────────────────────────────────
              Add an `avatarUrl` prop to UserCard and display
              an <img> tag inside the card. */}
        </>
      )}
    </div>
  )
}

export default App
