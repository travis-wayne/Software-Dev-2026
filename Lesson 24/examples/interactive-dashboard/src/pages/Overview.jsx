// 🎓 TODO: Import useState, useEffect
// 🎓 TODO: Import Lucide icons (Users, DollarSign, Activity, CreditCard)
// 🎓 TODO: Import StatCard component once created

export default function Overview() {
  // 🎓 TODO: Add useState for 'stats' and 'isLoading'
  
  // 🎓 TODO: Add useEffect to simulate data fetching with a 1.5s setTimeout

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
          Download Report
        </button>
      </div>

      {/* 
        🎓 TODO: 
        If isLoading is true, show a loading message/spinner.
        Otherwise, render a grid with 4 <StatCard /> components.
      */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center border-dashed">
        <p className="text-slate-400">
          Your StatCards will go here! Open <code>exercises/dashboard_project.md</code> to begin Milestone 1.
        </p>
      </div>
    </div>
  );
}
