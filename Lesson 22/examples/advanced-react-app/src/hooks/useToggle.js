// src/hooks/useToggle.js
import { useState } from 'react';

// Custom hooks MUST start with the word "use"
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => {
    setValue(prev => !prev);
  };

  // We return the value and the toggle function, exactly like useState does!
  return [value, toggle]; 
}
