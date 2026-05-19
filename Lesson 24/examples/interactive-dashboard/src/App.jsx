import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* 
        This Sidebar is outside the Routes block, 
        so it never unmounts when navigating! 
      */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
