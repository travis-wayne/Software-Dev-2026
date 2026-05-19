import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard — A fully-built reference component.
 *
 * 🎓 STUDY THIS COMPONENT CAREFULLY!
 * Notice how ALL the changing data comes from props.
 * The component itself has no hardcoded numbers.
 * This is what makes it REUSABLE — we render it 4 times
 * in Overview.jsx, each time with different data.
 *
 * Props:
 *  - title   {string}  e.g. "Total Revenue"
 *  - value   {string}  e.g. "$45,231"
 *  - trend   {string}  e.g. "+12.5%"
 *  - isUp    {boolean} true = green, false = red
 *  - icon    {ReactNode} a Lucide icon component
 *  - color   {string}  Tailwind color class base (e.g. "indigo", "emerald")
 */
export default function StatCard({ title, value, trend, isUp, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  icon: 'text-indigo-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
    violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'text-violet-400' },
    rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: 'text-rose-400' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-600/70 transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          {Icon && <Icon size={20} className={c.icon} />}
        </div>
      </div>

      <div>
        <p className="text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
        <div className={`flex items-center gap-1.5 mt-1.5 text-sm font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend}</span>
          <span className="text-slate-500 font-normal">vs last month</span>
        </div>
      </div>
    </div>
  );
}
