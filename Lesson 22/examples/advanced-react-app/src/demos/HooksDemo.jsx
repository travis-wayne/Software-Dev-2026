// src/demos/HooksDemo.jsx
import { useState } from 'react';
import { useToggle } from '../hooks/useToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function HooksDemo() {
  return (
    <div className="demo-container">
      <h2>🪝 Custom Hooks</h2>
      <p className="demo-desc">
        Custom hooks let us extract repetitive stateful logic into reusable functions. 
        They must always start with the word <code>use</code>.
      </p>
      
      <div className="hooks-grid">
        <SpoilerAlert />
        <LocalStorageDemo />
      </div>
    </div>
  );
}

// Demo 1: useToggle
function SpoilerAlert() {
  // Instead of 3 lines of useState boilerplate, we just do this:
  const [isRevealed, toggleRevealed] = useToggle(false);

  return (
    <div className="hook-card">
      <h3>useToggle Hook</h3>
      <p className="hook-desc">Simplifies boolean state management.</p>
      
      <div className="spoiler-box mt-3">
        <strong>What is the capital of React?</strong>
        {isRevealed ? (
          <p className="answer fade-in">There is no capital, it's just a library! 😂</p>
        ) : (
          <div className="hidden-answer">Click reveal to see answer</div>
        )}
      </div>
      
      <button className="btn btn-secondary mt-3" onClick={toggleRevealed}>
        {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
      </button>
    </div>
  );
}

// Demo 2: useLocalStorage
function LocalStorageDemo() {
  // This automatically syncs with window.localStorage behind the scenes!
  const [name, setName] = useLocalStorage('demo_name', 'Travis');

  return (
    <div className="hook-card">
      <h3>useLocalStorage Hook</h3>
      <p className="hook-desc">Saves state to the browser so it survives page reloads.</p>
      
      <div className="mt-3">
        <label className="block mb-2 text-sm font-semibold text-muted">
          Type a name and refresh the page:
        </label>
        <input 
          type="text" 
          className="hook-input"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      
      <p className="mt-3">
        Stored Value: <strong className="text-primary">{name}</strong>
      </p>
    </div>
  );
}
