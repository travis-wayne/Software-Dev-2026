// pages/index.js — Full-Stack Projects Portfolio Manager (Sleek Glassmorphism UI)
import { useState, useEffect } from 'react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('secret_key_2026');
  const [logs, setLogs] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStatus();
    fetchProjects();
  }, []);

  const addLog = (method, url, status, message) => {
    setLogs((prev) => [
      { id: Date.now(), time: new Date().toLocaleTimeString(), method, url, status, message },
      ...prev.slice(0, 8)
    ]);
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setDbStatus(data.database);
    } catch (err) {
      console.error('Failed to fetch DB status', err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data || []);
        addLog('GET', '/api/projects', res.status, `Fetched ${data.count} projects`);
      } else {
        addLog('GET', '/api/projects', res.status, data.error);
      }
    } catch (err) {
      addLog('GET', '/api/projects', 500, 'Network fetch error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !techStack) {
      alert('Please fill out Title, Description, and Tech Stack!');
      return;
    }

    const payload = { title, description, tech_stack: techStack, github_url: githubUrl, live_url: liveUrl };
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      addLog(method, url, res.status, data.message || data.error);

      if (res.ok) {
        setTitle('');
        setDescription('');
        setTechStack('');
        setGithubUrl('');
        setLiveUrl('');
        setEditingId(null);
        fetchProjects();
        fetchStatus();
      } else {
        alert(`Error (${res.status}): ${data.error}`);
      }
    } catch (err) {
      alert('Request failed. Check console.');
    }
  };

  const handleEdit = (proj) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechStack(proj.tech_stack);
    setGithubUrl(proj.github_url || '');
    setLiveUrl(proj.live_url || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': apiKey }
      });
      const data = await res.json();
      addLog('DELETE', `/api/projects/${id}`, res.status, data.message || data.error);
      
      if (res.ok) {
        fetchProjects();
        fetchStatus();
      } else {
        alert(`Delete Failed (${res.status}): ${data.error}`);
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header & Status Bar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, background: 'linear-gradient(to right, #10b981, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Next.js Full-Stack Portfolio
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Lesson 39 Demo — Embedded Serverless API Routes with Dual-Mode DB Integration
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {dbStatus && (
            <div className="glass-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATABASE ADAPTER</div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{dbStatus.adapter}</div>
              </div>
            </div>
          )}

          <div className="glass-card" style={{ padding: '10px 16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>X-API-KEY (FOR POST/PUT/DELETE)</div>
            <input 
              type="text" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              style={{ background: 'transparent', border: 'none', color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, outline: 'none', width: '140px' }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Create/Edit Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent-emerald)' }}>⚡</span>
            {editingId ? 'Edit Project Item' : 'Add New Project'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>PROJECT TITLE *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., E-Commerce Capstone"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>TECH STACK *</label>
              <input 
                type="text" 
                value={techStack} 
                onChange={(e) => setTechStack(e.target.value)} 
                placeholder="e.g., Next.js, Neon DB, Tailwind"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>DESCRIPTION *</label>
              <textarea 
                rows="3" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief summary of the project architecture and features..."
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>GITHUB URL</label>
                <input 
                  type="url" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                  placeholder="https://github.com/..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>LIVE DEMO URL</label>
                <input 
                  type="url" 
                  value={liveUrl} 
                  onChange={(e) => setLiveUrl(e.target.value)} 
                  placeholder="https://demo.com"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                type="submit" 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {editingId ? 'Save Update (PUT)' : 'Create Project (POST)'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => { setEditingId(null); setTitle(''); setDescription(''); setTechStack(''); }} 
                  style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Project Cards Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Project Inventory ({projects.length})</h2>
            <button 
              onClick={fetchProjects} 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              🔄 Refresh (GET)
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading projects from API...</div>
          ) : projects.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No projects found in database. Add your first project using the form!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((proj) => (
                <div key={proj.id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>{proj.title}</h3>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                        {proj.id}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {proj.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px', fontWeight: 500 }}>
                        🛠️ {proj.tech_stack}
                      </span>
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'underline' }}>
                          GitHub
                        </a>
                      )}
                      {proj.live_url && (
                        <a href={proj.live_url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'underline' }}>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', minWidth: '90px' }}>
                    <button 
                      onClick={() => handleEdit(proj)}
                      style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(proj.id)}
                      style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Action Log / Console Footer */}
      <section style={{ marginTop: '50px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📡 Serverless API Network Monitor</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>(Real-time request trace)</span>
        </h3>
        
        <div className="glass-card" style={{ padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>No HTTP requests logged yet. Perform an action above!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logs.map((log) => {
                const isError = log.status >= 400;
                const methodColor = log.method === 'GET' ? '#3b82f6' : log.method === 'POST' ? '#10b981' : log.method === 'PUT' ? '#f59e0b' : '#ef4444';
                return (
                  <div key={log.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: '80px' }}>[{log.time}]</span>
                    <span style={{ color: methodColor, fontWeight: 700, minWidth: '60px' }}>{log.method}</span>
                    <span style={{ color: '#f8fafc', flex: 1 }}>{log.url}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: isError ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: isError ? '#f87171' : '#34d399', fontWeight: 600 }}>
                      HTTP {log.status}
                    </span>
                    <span style={{ color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.message}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
