import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter-box">
      <h3 className="counter-display">Count: {count}</h3>
      <div className="btn-row">
        <button 
          className="btn btn-primary"
          onClick={() => setCount(c => c + 1)}
        >
          Increment
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
