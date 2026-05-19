import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 300 },
  { name: 'Mar', users: 550 },
  { name: 'Apr', users: 480 },
  { name: 'May', users: 700 },
  { name: 'Jun', users: 850 },
];

export default function Analytics() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Analytics</h1>
        <p className="text-slate-400 text-sm">Review your platform growth.</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-slate-200 mb-6">User Growth</h3>
        
        {/* 🎓 TODO: Render the Recharts BarChart here using the 'data' array! */}
        <div className="h-72 flex items-center justify-center border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
          <p className="text-slate-500 text-sm">Replace this div with a <code>&lt;ResponsiveContainer&gt;</code> containing your chart!</p>
        </div>
      </div>
    </div>
  );
}
