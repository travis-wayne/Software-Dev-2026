// src/App.jsx
import { useState, useContext } from 'react';
import Navbar from './components/Navbar';
import PropDrillingDemo from './demos/PropDrillingDemo';
import ContextDemo from './demos/ContextDemo';
import HooksDemo from './demos/HooksDemo';
import Quiz from './Quiz';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('prop-drilling');
  
  // We can consume the context right here at the top level to style the whole app background!
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`app-container app-container--${theme}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {activeTab === 'prop-drilling' && <PropDrillingDemo />}
        {activeTab === 'context'       && <ContextDemo />}
        {activeTab === 'hooks'         && <HooksDemo />}
        {activeTab === 'quiz'          && <Quiz />}
      </main>
    </div>
  );
}

export default App;
