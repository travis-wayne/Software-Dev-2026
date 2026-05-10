// src/components/UserCard.jsx
// ─────────────────────────────────────────────────
// TEACHING MOMENT 1 — Your first real component with props.
//
// Props received:
//   name     (string)  — the team member's full name
//   role     (string)  — their job title
//   isOnline (boolean) — whether they are currently active
//
// Notice:
//  • The function name starts with a Capital Letter (required).
//  • We DESTRUCTURE props directly in the parameter list — clean!
//  • We use {curly braces} to embed JavaScript values inside JSX.
//  • We use a TERNARY to conditionally change UI based on isOnline.
// ─────────────────────────────────────────────────

import Badge from './Badge'
import Button from './Button'

function UserCard({ name, role, isOnline }) {
  return (
    <div className="user-card">
      {/* The coloured dot — rendered by another child component */}
      <div className="card-header">
        <div className={`avatar ${isOnline ? 'avatar--online' : 'avatar--offline'}`}>
          {/* Show the first letter of the name as the avatar */}
          {name.charAt(0)}
        </div>
        <Badge text={isOnline ? 'Online' : 'Offline'} type={isOnline ? 'success' : 'neutral'} />
      </div>

      <h2 className="card-name">{name}</h2>
      <p className="card-role">{role}</p>

      <div className="card-actions">
        <Button text="View Profile" variant="primary"   />
        <Button text="Message"      variant="secondary" />
      </div>

      {/* ── TODO (Exercise 4) ──────────────────────────────────
          1. Add `avatarUrl` to the destructured props above.
          2. Render: <img src={avatarUrl} alt={name} className="card-avatar-img" />
             (place it above the name)
          3. Go to App.jsx and pass avatarUrl="https://i.pravatar.cc/80?u=1"
             (change the ?u= number for each card to get different avatars) */}
    </div>
  )
}

export default UserCard
