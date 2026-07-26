// Lesson 40 — Reactive Navigation Bar using NextAuth useSession()
// Displays live authentication state, user identity badges, and Sign In / Sign Out actions

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="glass-card mb-8 px-6 py-4 flex flex-wrap justify-between items-center gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#10b981', fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚡ NextAuth.js Portal</span>
        </Link>

        <nav style={{ display: 'flex', gap: '16px', fontSize: '0.95rem' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#cbd5e1' }}>Public Portfolio</Link>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#cbd5e1' }}>Protected Dashboard</Link>
        </nav>
      </div>

      <div>
        {status === 'loading' ? (
          <span style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>Checking auth state...</span>
        ) : session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{session.user.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{session.user.email}</div>
            </div>
            
            <span className="badge badge-violet" style={{ marginLeft: '4px' }}>
              {session.user.role || 'user'}
            </span>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn btn-rose"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button className="btn btn-emerald" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Sign In / Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
