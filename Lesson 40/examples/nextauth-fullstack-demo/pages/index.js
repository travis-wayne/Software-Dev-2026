// Lesson 40 — Public Portfolio Showcase Page
// Demonstrates public read API routes alongside interactive NextAuth session status banners

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, statRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/status')
        ]);
        const projData = await projRes.json();
        const statData = await statRes.json();

        if (projData.success) setProjects(projData.data);
        if (statData.status === 'online') setDbStatus(statData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <Navbar />

      {/* Hero Banner */}
      <section className="glass-card mb-8 p-8" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>
          Serverless Portfolio <span style={{ color: '#10b981' }}>Secured by NextAuth.js</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '750px', marginBottom: '24px' }}>
          This full-stack Next.js application demonstrates professional authentication using <strong>NextAuth.js (Auth.js)</strong>. While anyone can read this public portfolio, creating or deleting items requires an encrypted JWT cookie session validated on the backend!
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {session ? (
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                🚀 Launch Admin Dashboard →
              </button>
            </Link>
          ) : (
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                🔑 Sign In to Manage Projects →
              </button>
            </Link>
          )}
          <a href="../nextauth-lab/index.html" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button className="btn btn-violet" style={{ padding: '12px 24px', fontSize: '1rem' }}>
              🧪 Open Interactive Auth Lab
            </button>
          </a>
        </div>
      </section>

      {/* Database Diagnostic Card */}
      {dbStatus && (
        <div className="glass-card p-4 mb-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderLeft: '4px solid #10b981' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Active Database Driver:</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{dbStatus.database_name}</span>
              <span className="badge badge-emerald">Online</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem' }}>
            <div>Registered Users: <strong style={{ color: '#8b5cf6' }}>{dbStatus.stats.total_users}</strong></div>
            <div>Published Projects: <strong style={{ color: '#10b981' }}>{dbStatus.stats.total_projects}</strong></div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>📂 Published Portfolio Items</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#64748b' }}>({projects.length} total)</span>
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading portfolio data...</div>
      ) : projects.length === 0 ? (
        <div className="glass-card p-8 text-center" style={{ color: '#94a3b8' }}>
          No projects published yet! Log in as an admin to publish the very first project.
        </div>
      ) : (
        <div className="grid-2">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card p-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>{proj.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>#{proj.id}</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '16px' }}>{proj.description}</p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span className="badge badge-violet" style={{ fontSize: '0.75rem' }}>{proj.tech_stack}</span>
                <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.8rem' }}>By {proj.created_by}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
