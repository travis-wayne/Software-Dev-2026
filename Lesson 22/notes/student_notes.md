# Student Notes — Lesson 22: Context API & Custom Hooks

## 1. The Problem: Prop Drilling

In React, data flows "down" from parent to child via props. But what happens if the top-level `App` has the currently logged-in user, and a deeply nested `Avatar` component needs that user's profile picture?

You have to pass the `user` prop through every intermediate component, even if those components don't care about the user.

```jsx
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user}>
        <Avatar user={user} /> {/* Finally used here! */}
      </UserMenu>
    </Sidebar>
  </Layout>
</App>
```
This is called **Prop Drilling**. It makes code verbose, fragile, and hard to refactor.

---

## 2. The Solution: React Context API

The Context API allows you to broadcast data globally to any component that asks for it, completely bypassing the middlemen.

### Step 1: Create the Context
Create a file to hold your context.
```jsx
import { createContext } from 'react';

// 1. Create the Context (with an optional default value)
export const ThemeContext = createContext('light');
```

### Step 2: Provide the Context
Wrap the part of your application that needs the data in a Context Provider. You pass the actual data into the `value` prop.
```jsx
import { ThemeContext } from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    // 2. Broadcast the value
    <ThemeContext.Provider value={theme}>
      <Layout />
    </ThemeContext.Provider>
  );
}
```

### Step 3: Consume the Context
Any component inside the Provider can use the `useContext` hook to instantly access the broadcasted value.
```jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemedButton() {
  // 3. Tune into the broadcast
  const theme = useContext(ThemeContext);

  return <button className={theme === 'dark' ? 'btn-dark' : 'btn-light'}>Click me</button>;
}
```

> ⚠️ **Rule of Thumb:** Use Context for global data (Theme, Current User, Preferred Language). Use standard props for everything else to keep components reusable.

---

## 3. Custom Hooks

A custom hook is just a normal JavaScript function that uses other React Hooks inside of it. It allows you to package up complex, repetitive state logic and reuse it across multiple components.

### Example: The repetitive way
You might find yourself writing this toggle logic over and over in different components:
```jsx
const [isVisible, setIsVisible] = useState(false);
const toggleVisibility = () => setIsVisible(prev => !prev);
```

### Example: The Custom Hook way
Let's abstract that logic into a file called `useToggle.js`. 
**Rule:** Custom hooks MUST start with the word `use`.

```jsx
// src/hooks/useToggle.js
import { useState } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => {
    setValue(prev => !prev);
  };

  // Return the state and the function to change it
  return [value, toggle]; 
}
```

Now, any component can use this hook cleanly in a single line:

```jsx
import { useToggle } from './hooks/useToggle';

function FAQItem() {
  // Use our custom hook!
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <h3 onClick={toggleOpen}>What is React?</h3>
      {isOpen && <p>A JavaScript library for building user interfaces.</p>}
    </div>
  );
}
```

Custom hooks allow you to share **logic**, not state. Every component that calls `useToggle` gets its own independent `isOpen` boolean.
