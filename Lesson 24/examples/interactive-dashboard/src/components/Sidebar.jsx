import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, Zap } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',          label: 'Overview',  icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings',  label: 'Settings',  icon: Settings },
];

/**
 * 🎓 LESSON GUIDE — Sidebar
 *
 * Notice: We are using <NavLink> from react-router-dom (NOT <a href>).
 * NavLink is React Router's special link that:
 *  1. Navigates without a full page reload (SPA behaviour).
 *  2. Gives you an `isActive` boolean so you can style the active link.
 *
 * The `className` prop receives a FUNCTION — not a string — so we can
 * compute the correct CSS classes based on whether the link is active.
 */
export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 flex flex-col flex-shrink-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Zap size={16} className="text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            ReactDash
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer CTA */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/20 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-indigo-200 mb-2.5">This is your capstone! 🎓</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Navigate between pages. Notice the URL changes but the page never reloads — that's the SPA magic!
          </p>
        </div>
      </div>
    </aside>
  );
}
