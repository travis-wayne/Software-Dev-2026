// Lesson 40 — Protected Server-Side Dashboard Page
// Secured at request-time by getServerSession() in getServerSideProps!

import { useState, useEffect } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import Navbar from '../components/Navbar';

export default function DashboardPage({ user }) {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('Next.js 14, NextAuth.js, Tailwind CSS');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function loadProjects() {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreateProject(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tech_stack: techStack })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to create project.');
      } else {
        setSuccessMsg(data.message);
        setTitle('');
        setDescription('');
        await loadProjects();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id) {
    if (!confirm(`Are you sure you want to permanently delete project #${id}?`)) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || 'Delete failed');
      } else {
        await loadProjects();
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <Navbar />

      {/* Admin Welcome & Token Inspector Card */}
      <section className="glass-card mb-8 p-6" style={{ borderLeft: '4px solid #8b5cf6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-violet" style={{ marginBottom: '8px' }}>🔐 Protected Route Guard Active</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Welcome to the Management Console</h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '650px', marginTop: '4px' }}>
              You accessed this page because your encrypted NextAuth cookie was successfully validated by <strong><code>getServerSession()</code></strong> before the HTML was rendered!
            </p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', minWidth: '280px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Session User Payload:</div>
            <div>ID: <strong style={{ color: '#10b981' }}>{user.id}</strong></div>
            <div>Name: <strong style={{ color: '#ffffff' }}>{user.name}</strong></div>
            <div>Email: <strong style={{ color: '#38bdf8' }}>{user.email}</strong></div>
            <div>Role: <strong style={{ color: '#8b5cf6' }}>{user.role}</strong></div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Create Project Form */}
        <div className="glass-card p-6">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕ Publish Portfolio Item</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
            This form sends a <code>POST /api/projects</code> request. The backend will verify your session cookie before allowing the SQL insert!
          </p>

          {errorMsg && (
            <div style={{ padding: '10px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: '6px', color: '#fda4af', fontSize: '0.85rem', marginBottom: '16px' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '16px' }}>
              ✅ {successMsg}
            </div>
          )}

          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Project Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input"
                placeholder="e.g., AI Chat Application"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input"
                rows={3}
                placeholder="Describe key features and architecture..."
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Tech Stack</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="glass-input"
                placeholder="Next.js, Neon DB, Tailwind"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-emerald" style={{ padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}>
              {loading ? 'Publishing Item...' : '🚀 Publish Project →'}
            </button>
          </form>
        </div>

        {/* Manage Projects List */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛠️ Manage Portfolio Database ({projects.length})</span>
          </h2>

          {projects.length === 0 ? (
            <div className="glass-card p-8 text-center" style={{ color: '#94a3b8' }}>
              No projects in the database. Use the form on the left to publish one!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((proj) => (
                <div key={proj.id} className="glass-card p-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{proj.title}</h3>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>#{proj.id}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>{proj.description}</p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>{proj.tech_stack}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Created by {proj.created_by}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="btn btn-rose"
                    style={{ padding: '8px 14px', fontSize: '0.85rem', flexShrink: 0 }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVER-SIDE ROUTE GUARD
// Enforces that only logged-in users can ever load this page HTML!
// ─────────────────────────────────────────────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
      user: session.user
    }
  };
}
