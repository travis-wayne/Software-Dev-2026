import { useState, useEffect } from 'react';
import { CheckCircle2, Bell, Mail, Shield, Moon } from 'lucide-react';

/**
 * 🎓 LESSON GUIDE — Settings Page
 *
 * This page teaches:
 *  1. Controlled form inputs with useState.
 *  2. Toggle switch — a boolean state toggled on button click.
 *  3. Temporary UI feedback (toast) using useState + useEffect + setTimeout.
 *
 * The toast pattern:
 *   - User clicks "Save Changes"
 *   - setShowToast(true)  → toast appears
 *   - useEffect sees showToast changed to true
 *   - It calls setTimeout to hide it after 3 seconds
 */

function Toggle({ value, onChange, label, description, icon: Icon }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-700/40 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={15} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ml-4 ${value ? 'bg-indigo-500' : 'bg-slate-700'}`}
        aria-label={`Toggle ${label}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}></span>
      </button>
    </div>
  );
}

export default function Settings() {
  const [displayName, setDisplayName]   = useState('Alex Dev');
  const [email, setEmail]               = useState('alex@example.com');
  const [emailNotifs, setEmailNotifs]   = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [darkMode, setDarkMode]         = useState(true);
  const [twoFactor, setTwoFactor]       = useState(false);
  const [showToast, setShowToast]       = useState(false);

  // 🎓 This useEffect watches 'showToast'. When it becomes true,
  // it sets a 3-second timer to hide the toast automatically.
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer); // cleanup if component unmounts
  }, [showToast]);

  const handleSave = () => {
    setShowToast(true); // triggers the useEffect above
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account and notification preferences.</p>
      </div>

      {/* ─── Profile ─────────────────────────────── */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="font-semibold text-slate-100">Profile Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">🎓 These inputs use controlled state via onChange → setState.</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ─── Notifications ────────────────────────── */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="font-semibold text-slate-100">Notifications & Preferences</h2>
          <p className="text-xs text-slate-500 mt-0.5">🎓 Each toggle is a boolean useState — click them and watch the switch move!</p>
        </div>
        <div className="px-6">
          <Toggle value={emailNotifs}   onChange={() => setEmailNotifs(v => !v)}   icon={Mail}   label="Email Notifications"  description="Receive daily activity summaries." />
          <Toggle value={weeklyReport}  onChange={() => setWeeklyReport(v => !v)}  icon={Bell}   label="Weekly Report"        description="Get a weekly analytics digest every Monday." />
          <Toggle value={darkMode}      onChange={() => setDarkMode(v => !v)}      icon={Moon}   label="Dark Mode"            description="Use the dark theme across the dashboard." />
          <Toggle value={twoFactor}     onChange={() => setTwoFactor(v => !v)}     icon={Shield} label="Two-Factor Auth"      description="Add an extra layer of security to your account." />
        </div>
      </div>

      {/* ─── Save ────────────────────────────────── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          Save Changes
        </button>
      </div>

      {/* ─── Toast ───────────────────────────────── */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/30 font-medium text-sm animate-bounce-in z-50">
          <CheckCircle2 size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* 🎓 Concept callout */}
      <div className="mt-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5">
        <p className="text-sm font-semibold text-indigo-300 mb-2">🎓 The Toast Notification Pattern</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Click "Save Changes" and watch the green toast appear then disappear. This uses <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">useEffect</code> with a <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">setTimeout</code>.
          When <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">showToast</code> becomes <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">true</code>,
          React automatically runs the effect, which schedules setting it back to <code className="bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded text-xs">false</code> after 3 seconds. The cleanup function cancels the timer if you navigate away early.
        </p>
      </div>
    </div>
  );
}
