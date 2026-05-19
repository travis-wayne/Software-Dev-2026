import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

/**
 * 🎓 LESSON GUIDE — Analytics Page
 *
 * This page teaches:
 *  1. Using a third-party library (Recharts) with React.
 *  2. Conditional rendering based on useState (chart type toggle).
 *  3. Passing data as props into library components.
 *
 * YOUR EXERCISE:
 *  - The chart type toggle button at the top switches between 'bar' and 'line'.
 *  - The `chartType` state value is already wired up.
 *  - YOUR TASK: complete the ternary below to render either
 *    <BarChart> or <LineChart> based on `chartType`.
 */

const monthlyData = [
  { month: 'Jan', users: 400,  revenue: 2400 },
  { month: 'Feb', users: 300,  revenue: 1398 },
  { month: 'Mar', users: 550,  revenue: 5800 },
  { month: 'Apr', users: 480,  revenue: 3908 },
  { month: 'May', users: 700,  revenue: 4800 },
  { month: 'Jun', users: 850,  revenue: 7200 },
];

const TOOLTIP_STYLE = {
  backgroundColor: '#1e293b',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#f1f5f9',
};

export default function Analytics() {
  const [chartType, setChartType] = useState('bar');

  return (
    <div>
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Analytics</h1>
          <p className="text-slate-400 text-sm">Platform growth over the last 6 months.</p>
        </div>

        {/* 🎓 Chart type toggle — uses useState to switch the view */}
        <div className="flex bg-slate-800/80 border border-slate-700/50 rounded-xl p-1 gap-1">
          {['bar', 'line'].map(type => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                chartType === type
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type} chart
            </button>
          ))}
        </div>
      </div>

      {/* ─── Chart Panel ──────────────────────────────────────────── */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6">
        <h3 className="text-base font-semibold text-slate-200 mb-1">User & Revenue Growth</h3>
        <p className="text-xs text-slate-500 mb-6">Showing Jan → Jun 2026</p>

        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'bar' ? (
            <BarChart data={monthlyData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              <Bar dataKey="users"   name="Users"   fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          ) : (
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              <Line type="monotone" dataKey="users"   name="Users"   stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 🎓 Concept callout */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
        <p className="text-sm font-semibold text-indigo-300 mb-2">🎓 What's happening here?</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          The <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">chartType</code> state variable
          controls which chart renders. When you click "bar chart" or "line chart", <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">setChartType()</code> updates
          state, React re-renders the component, and the ternary <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">chartType === 'bar' ? &lt;BarChart&gt; : &lt;LineChart&gt;</code> picks the correct component.
          This is <strong className="text-slate-300">conditional rendering</strong> in action!
        </p>
      </div>
    </div>
  );
}
