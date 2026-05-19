import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

const ACTIVITY = [
  { id: 1, user: 'Sarah K.', action: 'Submitted a new project report',   time: '2 min ago',  status: 'success' },
  { id: 2, user: 'Mark T.',  action: 'Requested access to Analytics',    time: '15 min ago', status: 'pending' },
  { id: 3, user: 'Amara J.', action: 'Updated billing information',       time: '1 hr ago',   status: 'success' },
  { id: 4, user: 'Chris O.', action: 'API rate limit exceeded',           time: '3 hrs ago',  status: 'error' },
  { id: 5, user: 'Lisa M.',  action: 'Exported monthly data to CSV',      time: '5 hrs ago',  status: 'success' },
];

const STATUS_MAP = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Done' },
  pending: { icon: Clock,        color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  label: 'Pending' },
  error:   { icon: AlertCircle,  color: 'text-rose-400',    bg: 'bg-rose-400/10',    label: 'Error' },
};

export default function RecentActivity() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
        <h3 className="font-semibold text-slate-100">Recent Activity</h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all →</button>
      </div>
      <div className="divide-y divide-slate-700/40">
        {ACTIVITY.map(item => {
          const s = STATUS_MAP[item.status];
          const Icon = s.icon;
          return (
            <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-700/20 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${s.bg}`}>
                <Icon size={15} className={s.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  <span className="text-slate-400">{item.user}</span> — {item.action}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color} shrink-0`}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
