// 🎓 TODO: Import useState

export default function Settings() {
  // 🎓 TODO: Add state for 'emailNotifs' (boolean)
  // 🎓 TODO: Add state for 'showToast' (boolean)

  const handleSave = () => {
    // 🎓 TODO: Set showToast to true
    // 🎓 TODO: Set a timeout to hide the toast after 3 seconds
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100 mb-1">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account preferences.</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
              <input type="text" defaultValue="Alex Dev" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input type="email" defaultValue="alex@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Preferences</h3>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-slate-200">Email Notifications</p>
              <p className="text-sm text-slate-400">Receive daily summary emails.</p>
            </div>
            {/* 🎓 TODO: Add an onClick handler to this button to toggle 'emailNotifs' */}
            <button className={`w-11 h-6 rounded-full transition-colors relative bg-slate-700`}>
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform`}></span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-700/50 flex justify-end">
          <button onClick={handleSave} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* 🎓 TODO: Render a Toast Notification here conditionally based on 'showToast' */}
      
    </div>
  );
}
