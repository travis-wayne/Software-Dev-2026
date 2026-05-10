// src/App.jsx
// ─────────────────────────────────────────────────
// Lesson 19 — react-intro-app
// The tutor and student work through this file together.
// Each section is marked with its teaching moment.
// ─────────────────────────────────────────────────

import Badge from './components/Badge'
import Button from './components/Button'
import UserCard from './components/UserCard'
import './App.css'

// ── TEACHING MOMENT 3 ─────────────────────────────
// This is a "parent" component. It imports child components
// and decides what data to pass down as props.
// Notice how we reuse <UserCard /> multiple times
// with completely different props — that's the power of components.

const teamMembers = [
  { id: 1, name: 'Alice Johnson',   role: 'Lead Developer', isOnline: true  },
  { id: 2, name: 'Bob Smith',       role: 'UI Designer',    isOnline: false },
  { id: 3, name: 'Charlie Okafor',  role: 'QA Engineer',    isOnline: true  },
]

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>⚛️ Lesson 19 — Components & Props</h1>
        <p className="app-subtitle">
          Each card below is the same <code>UserCard</code> component,
          rendered with different props.
        </p>
      </header>

      <main className="team-board">
        {/* ── TEACHING MOMENT 4 ─────────────────────────────
            .map() loops over the array and returns one
            <UserCard /> for each team member.
            The `key` prop helps React track which item is which. */}
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
          <Button text="Follow"    variant="primary"  />
          <Button text="Message"   variant="secondary"/>
          <Button text="Delete"    variant="danger"   />
          <Button text="Disabled"  variant="primary"  disabled />
        </div>
      </section>

      {/* ── TODO FOR STUDENT (Exercise 4) ────────────────────
          Add an `avatarUrl` prop to UserCard and display
          an <img> tag inside the card. Start by updating
          the UserCard component file, then pass the prop here. */}
    </div>
  )
}

export default App
