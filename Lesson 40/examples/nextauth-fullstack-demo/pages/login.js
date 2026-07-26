// Lesson 40 — Sleek Glassmorphism Authentication Interface
// Demonstrates signIn() with CredentialsProvider and GitHubProvider, plus an account registration tab

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login state
  const [email, setEmail] = useState('travis@wayne.com');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Handle Credentials Login
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    setLoginLoading(false);

    if (result?.error) {
      setLoginError(result.error);
    } else {
      router.push('/dashboard');
    }
  }

  // Handle Registration
  async function handleRegister(e) {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setRegError(data.error || 'Failed to create account.');
      } else {
        setRegSuccess(data.message);
        // Switch to login tab and prefill email
        setEmail(regEmail);
        setPassword(regPassword);
        setTimeout(() => setActiveTab('login'), 1500);
      }
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <Navbar />

      <main style={{ maxWidth: '480px', margin: '40px auto' }}>
        <div className="glass-card p-8" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          
          {/* Tab Headers */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'login' ? '#10b981' : '#64748b',
                fontWeight: 600,
                fontSize: '1rem',
                borderBottom: activeTab === 'login' ? '2px solid #10b981' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔑 Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '12px',
                background: 'transparent',
                border: 'none',
                color: activeTab === 'register' ? '#10b981' : '#64748b',
                fontWeight: 600,
                fontSize: '1rem',
                borderBottom: activeTab === 'register' ? '2px solid #10b981' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ✨ Register New Account
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SIGN IN TAB */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'login' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Welcome Back</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>Enter your credentials or choose a social OAuth provider.</p>

              {loginError && (
                <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: '8px', color: '#fda4af', fontSize: '0.9rem', marginBottom: '16px' }}>
                  ⚠️ {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    placeholder="travis@wayne.com"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button type="submit" disabled={loginLoading} className="btn btn-emerald" style={{ padding: '12px', fontSize: '1rem', marginTop: '8px' }}>
                  {loginLoading ? 'Verifying Credentials...' : 'Sign In with Credentials →'}
                </button>
              </form>

              {/* Pre-seeded test accounts helper */}
              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.8rem', color: '#94a3b8' }}>
                <div style={{ fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>💡 Quick Test Accounts (Click to Fill):</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setEmail('travis@wayne.com'); setPassword('password123'); }} style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#34d399', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Admin (Travis)
                  </button>
                  <button onClick={() => { setEmail('student@example.com'); setPassword('secret123'); }} style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#c4b5fd', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Standard User
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0', color: '#64748b', fontSize: '0.85rem' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span>OR SOCIAL OAUTH</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <button
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="btn btn-ghost"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff' }}
              >
                🐙 Sign In with GitHub (OAuth)
              </button>
            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* REGISTER TAB */}
          {/* ───────────────────────────────────────────────────────────── */}
          {activeTab === 'register' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Create Account</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>Register a new account in our dual-mode Neon PostgreSQL / SQLite database.</p>

              {regError && (
                <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: '8px', color: '#fda4af', fontSize: '0.9rem', marginBottom: '16px' }}>
                  ⚠️ {regError}
                </div>
              )}

              {regSuccess && (
                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', fontSize: '0.9rem', marginBottom: '16px' }}>
                  ✅ {regSuccess}
                </div>
              )}

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="glass-input"
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="glass-input"
                    placeholder="jane@example.com"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Password (min 6 chars)</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="glass-input"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" disabled={regLoading} className="btn btn-violet" style={{ padding: '12px', fontSize: '1rem', marginTop: '8px' }}>
                  {regLoading ? 'Creating Account...' : '✨ Register Account →'}
                </button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
