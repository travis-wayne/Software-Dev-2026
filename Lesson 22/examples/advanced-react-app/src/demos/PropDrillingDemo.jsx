// src/demos/PropDrillingDemo.jsx
import { User } from 'lucide-react';

export default function PropDrillingDemo() {
  const user = { name: "Travis Wayne", role: "Admin" };

  return (
    <div className="demo-container">
      <h2>🕳️ The Prop Drilling Problem</h2>
      <p className="demo-desc">
        Notice how the <code>user</code> object has to be passed down through 3 intermediate components 
        that don't use it, just so the final <code>UserProfileBadge</code> can display the name.
      </p>
      
      <div className="component-box level-1">
        <span className="box-label">Level 1: PropDrillingDemo</span>
        <DashboardLayout user={user} />
      </div>
    </div>
  );
}

// Level 2: Doesn't need 'user', but has to pass it down
function DashboardLayout({ user }) {
  return (
    <div className="component-box level-2">
      <span className="box-label">Level 2: DashboardLayout (Passes user ↓)</span>
      <Sidebar user={user} />
    </div>
  );
}

// Level 3: Doesn't need 'user', but has to pass it down
function Sidebar({ user }) {
  return (
    <div className="component-box level-3">
      <span className="box-label">Level 3: Sidebar (Passes user ↓)</span>
      <UserMenu user={user} />
    </div>
  );
}

// Level 4: Doesn't need 'user', but has to pass it down
function UserMenu({ user }) {
  return (
    <div className="component-box level-4">
      <span className="box-label">Level 4: UserMenu (Passes user ↓)</span>
      <UserProfileBadge user={user} />
    </div>
  );
}

// Level 5: FINALLY USES IT!
function UserProfileBadge({ user }) {
  return (
    <div className="component-box level-5">
      <span className="box-label">Level 5: UserProfileBadge (Uses user!)</span>
      <div className="user-badge">
        <User size={18} />
        <span>{user.name} ({user.role})</span>
      </div>
    </div>
  );
}
