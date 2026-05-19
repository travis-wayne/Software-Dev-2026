import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
// 🎓 TODO: Import NavLink from react-router-dom

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <LayoutDashboard size={18} className="text-indigo-400" />
          </div>
          ReactDash
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {/* 
          🎓 TODO: Replace these <a> tags with <NavLink> components.
          Use the isActive parameter in className to apply the active styles!
          Active styles: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
          Inactive styles: "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
        */}
        <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent">
          <LayoutDashboard size={20} />
          <span className="font-medium">Overview</span>
        </a>

        <a href="/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent">
          <BarChart3 size={20} />
          <span className="font-medium">Analytics</span>
        </a>

        <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </a>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-indigo-200 font-medium mb-3">Upgrade to Pro</p>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
            Get Started
          </button>
        </div>
      </div>
    </aside>
  );
}
