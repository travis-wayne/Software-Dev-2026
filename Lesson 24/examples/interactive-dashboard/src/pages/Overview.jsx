import { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';
import StatCard from '../components/StatCard';
import RecentActivity from '../components/RecentActivity';

/**
 * 🎓 LESSON GUIDE — Overview Page
 *
 * This page demonstrates two critical React hooks:
 *  1. useState  — to store the fetched data and a loading flag.
 *  2. useEffect — to trigger the data fetch when the component first mounts.
 *
 * STUDY THE PATTERN:
 *  - We start with isLoading = true and stats = null.
 *  - Inside useEffect, we simulate a network request with setTimeout.
 *  - When data arrives, we update both state values.
 *  - The JSX renders DIFFERENT content based on current state.
 */

// Simulated API response — in a real app this comes from fetch()
async function fetchDashboardStats() {
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay
  return {
    revenue:  { value: '$48,295', trend: '+14.5%', isUp: true  },
    users:    { value: '3,842',   trend: '+8.2%',  isUp: true  },
    sessions: { value: '12,340',  trend: '-2.1%',  isUp: false },
    orders:   { value: '1,190',   trend: '+21.3%', isUp: true  },
  };
}

export default function Overview() {
  const [stats, setStats]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🎓 This function runs ONCE when the component first mounts ([] dependency array)
    fetchDashboardStats().then(data => {
      setStats(data);
      setIsLoading(false);
    });
  }, []); // ← Empty array = "run only on first render"

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Welcome back, Alex. Here's what's happening.</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
          Download Report
        </button>
      </div>

      {/* ─── Stat Cards Grid ────────────────────────────────────── */}
      {isLoading ? (
        /* 🎓 LOADING STATE — shown while data is being "fetched" */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 h-36 animate-pulse">
              <div className="h-3 bg-slate-700 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-slate-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        /* 🎓 DATA STATE — shown once data has loaded */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Revenue"  value={stats.revenue.value}  trend={stats.revenue.trend}  isUp={stats.revenue.isUp}  icon={DollarSign} color="indigo"  />
          <StatCard title="Total Users"    value={stats.users.value}    trend={stats.users.trend}    isUp={stats.users.isUp}    icon={Users}      color="emerald" />
          <StatCard title="Active Sessions" value={stats.sessions.value} trend={stats.sessions.trend} isUp={stats.sessions.isUp} icon={Activity}   color="violet"  />
          <StatCard title="New Orders"     value={stats.orders.value}   trend={stats.orders.trend}   isUp={stats.orders.isUp}   icon={ShoppingCart} color="rose" />
        </div>
      )}

      {/* ─── Recent Activity Table ───────────────────────────────── */}
      <RecentActivity />

      {/* 🎓 CONCEPT CALLOUT */}
      <div className="mt-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
        <p className="text-sm font-semibold text-indigo-300 mb-2">🎓 What just happened?</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          When this page loaded, <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">useEffect</code> ran immediately and started a 1.5-second simulated API call.
          During that wait, <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">isLoading</code> was <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">true</code>, so you saw skeleton loaders.
          Once the data arrived, <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">setStats(data)</code> triggered a re-render and the real cards appeared. That's the complete data-fetching pattern in React!
        </p>
      </div>
    </div>
  );
}
