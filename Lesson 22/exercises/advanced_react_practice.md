# Practice Exercises — Lesson 22: Context API & Custom Hooks

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 22/examples/advanced-react-app"
pnpm install   # only needed the first time
pnpm dev       # starts the dev server at http://localhost:5173
```
All exercises should be done inside this project. Open the code in VS Code to get started.

---

## Exercise 1: Exploring Prop Drilling

1. Open `src/demos/PropDrillingDemo.jsx`.
2. Trace the `user` prop. It originates in `PropDrillingDemo`, passes through `DashboardLayout`, then `Sidebar`, then `UserMenu`, and finally gets used in `UserProfileBadge`.
3. Notice how `DashboardLayout`, `Sidebar`, and `UserMenu` do absolutely nothing with the `user` prop except pass it down. This is prop drilling!

---

## Exercise 2: Consuming the Theme Context

In `src/context/ThemeContext.jsx`, a `ThemeContext` has been created and provided at the top level of the app.

1. Open `src/demos/ContextDemo.jsx`.
2. Import `useContext` from React, and `ThemeContext` from `../context/ThemeContext`.
3. Inside the `ThemedCard` component, call the hook: `const { theme } = useContext(ThemeContext);`
4. Change the hardcoded className `"card card-light"` to use the dynamic theme: `className={\`card card-\${theme}\`}`.
5. In your browser, switch to the Context API tab and click the global "Toggle Theme" button in the Navbar. Your `ThemedCard` should now react to the global state change!

---

## Exercise 3: Using a Custom Hook (`useToggle`)

1. Open `src/hooks/useToggle.js`. Read the code. Notice how it perfectly encapsulates the repetitive `useState` boilerplate for booleans.
2. Open `src/demos/HooksDemo.jsx`.
3. Import `useToggle` from `../hooks/useToggle`.
4. Inside the `SpoilerAlert` component, replace the standard `useState` implementation with the custom hook:
   `const [isRevealed, toggleRevealed] = useToggle(false);`
5. Update the button's onClick handler to use your new `toggleRevealed` function.
6. Check the browser to ensure the spoiler button still works!

---

## Exercise 4: Building Your Own Custom Hook (`useFormInput`)

Let's build a custom hook that manages standard text inputs.

1. Create a new file: `src/hooks/useFormInput.js`.
2. Export a function named `useFormInput(initialValue)`.
3. Inside the function, set up state: `const [value, setValue] = useState(initialValue);`
4. Create an onChange handler function: 
   ```javascript
   const handleChange = (e) => setValue(e.target.value);
   ```
5. Return an object containing the value and the handler:
   ```javascript
   return {
     value,
     onChange: handleChange
   };
   ```
6. **Bonus:** Try using your new `useFormInput` hook in a component to control a `<input type="text" />` tag! You can spread it directly onto the input: `<input {...nameInput} />`

---

## 📝 Final Check: Interactive Quiz
Once you have completed the exercises above, switch to the **📝 Quiz** tab in the running app and test your knowledge of Context and Custom Hooks!
