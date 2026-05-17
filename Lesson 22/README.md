# Lesson 22 — Advanced React: Context API & Custom Hooks

## 🚀 Quick Start
```bash
cd "Lesson 22/examples/advanced-react-app"
pnpm install   # only needed the first time
pnpm dev       # http://localhost:5173
```

## 📂 Project Structure
```
advanced-react-app/
├── src/
│   ├── context/
│   │   └── ThemeContext.jsx       ← createContext + ThemeProvider
│   ├── hooks/
│   │   ├── useToggle.js           ← custom hook: boolean toggle
│   │   └── useLocalStorage.js     ← custom hook: persistent state
│   ├── demos/
│   │   ├── PropDrillingDemo.jsx   ← 5-level prop drilling example
│   │   ├── ContextDemo.jsx        ← same 5 levels, using Context
│   │   └── HooksDemo.jsx          ← useToggle (×2) + useLocalStorage
│   ├── components/
│   │   └── Navbar.jsx             ← uses ThemeContext to show ☀️/🌙
│   ├── App.jsx                    ← tab switcher + useContext for bg
│   ├── main.jsx                   ← ThemeProvider wraps the whole app
│   ├── Quiz.jsx                   ← 10-question interactive quiz
│   └── App.css                    ← light + dark CSS variable themes
└── package.json
```

## 🎯 What This Lesson Covers
| Concept | Where to see it |
|:---|:---|
| Prop Drilling problem | `PropDrillingDemo.jsx` — Tab 1 |
| `createContext` | `context/ThemeContext.jsx` |
| `Provider` with object value | `context/ThemeContext.jsx` |
| Wrapping app in Provider | `main.jsx` |
| `useContext` consuming a context | `ContextDemo.jsx`, `Navbar.jsx`, `App.jsx` |
| Custom hook naming (`use...`) | `hooks/useToggle.js` |
| Custom hook: `useToggle` | `demos/HooksDemo.jsx` — TWO instances |
| Hooks share logic, not state | `HooksDemo.jsx` — two independent spoilers |
| Custom hook: `useLocalStorage` | `demos/HooksDemo.jsx` |
| `useState` + `useEffect` inside a hook | `hooks/useLocalStorage.js` |

## 📚 Reading Order
1. `notes/student_notes.md` — read first
2. Run `pnpm dev`, explore **all 4 tabs**
3. `exercises/advanced_react_practice.md` — do the exercises
4. Click the **📝 Quiz** tab
