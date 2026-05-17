# Student Notes — Lesson 22: Context API & Custom Hooks

## 1. The Problem: Prop Drilling

In React, data flows "down" from parent to child via props. But what happens if the top-level `App` has the currently logged-in user, and a deeply nested `Avatar` component needs that user's profile picture?

You have to pass the `user` prop through every intermediate component, even if those components don't care about the user.

```jsx
<App user={user}>
  <Layout user={user}>      {/* ← doesn't use user, just passes it */}
    <Sidebar user={user}>   {/* ← doesn't use user, just passes it */}
      <UserMenu user={user}> {/* ← doesn't use user, just passes it */}
        <Avatar user={user} /> {/* ← FINALLY uses it! */}
      </UserMenu>
    </Sidebar>
  </Layout>
</App>
```
This is called **Prop Drilling**. It makes code verbose, fragile, and hard to refactor. You can see this live in the **🕳️ Prop Drilling** tab of the app.

---

## 2. The Solution: React Context API

The Context API lets any component in the tree access shared data directly, no matter how deep it is. Think of it like a radio broadcast — one station broadcasts, and any radio anywhere can tune in.

### Step 1: Create the Context
```jsx
// src/context/ThemeContext.jsx
import { createContext } from 'react';

export const ThemeContext = createContext();
```

### Step 2: Create a Provider Component
The Provider manages the actual state and broadcasts it via the `value` prop.
```jsx
// Note: we broadcast an OBJECT so consumers can get both the value AND the setter
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Step 3: Wrap your App
In `main.jsx`, wrap the entire app so all components can access the context:
```jsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Step 4: Consume the Context (in any component, any depth)
```jsx
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

function ThemedButton() {
  // We destructure both values from the object broadcast by the Provider
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      style={{ background: theme === 'dark' ? '#1e293b' : '#f8fafc' }}
      onClick={toggleTheme}
    >
      Current: {theme}
    </button>
  );
}
```

> ⚠️ **Rule of Thumb:** Use Context for data that truly needs to be global — Theme, Logged-in User, Language. For local data (is a modal open? what is in this input field?), keep using `useState` and props.

---

## 3. Custom Hooks

A custom hook is just a normal JavaScript function that calls other React Hooks inside. It packages up repetitive state logic so you can reuse it cleanly.

### The Problem — Repetitive Boilerplate
You end up writing this toggle logic over and over in different components:
```jsx
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);
```

### The Solution — Extract it into a Custom Hook
**Rule: Custom hooks MUST start with the word `use`.**

```jsx
// src/hooks/useToggle.js
import { useState } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle]; // Return like useState does
}
```

Now any component can use this in a single clean line:
```jsx
const [isOpen, toggleOpen] = useToggle(false);
```

### Key Concept: Shared Logic, NOT Shared State
If component A and component B both call `useToggle`, they each get their own **independent** boolean. Toggling A doesn't affect B. You can see this live in the **🪝 Custom Hooks** tab — two spoiler cards using the same hook, with completely separate revealed/hidden states.

---

## 4. Building a More Complex Hook — `useLocalStorage`

Here's a more powerful example that combines `useState` and `useEffect`:

```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Run this function ONCE on first render to read from localStorage
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // Whenever value changes, write the new value to localStorage
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // It works just like useState from the outside!
  return [value, setValue];
}
```

Notice how this hook uses both `useState` AND `useEffect` internally — the component using it never has to know. The complexity is hidden inside the hook.

```jsx
// From a component's perspective, it's as simple as:
const [name, setName] = useLocalStorage('user_name', 'Travis');
```
