# Practice Exercises — Lesson 22: Context API & Custom Hooks

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 22/examples/advanced-react-app"
pnpm install   # only needed the first time
pnpm dev       # starts the dev server at http://localhost:5173
```
**Read each exercise fully before writing any code.** Check your student notes for reference.

---

## Exercise 1: Understand Prop Drilling

**Goal:** See the problem before you learn the solution.

1. Switch to the **🕳️ Prop Drilling** tab in the running app.
2. Open `src/demos/PropDrillingDemo.jsx` in VS Code.
3. Trace the `user` prop from the `PropDrillingDemo` component (top level) all the way down to `UserProfileBadge` (bottom level).

❓ **Answer these questions in your head (or on paper):**
- How many components receive the `user` prop?
- How many of those components actually *use* the `user` data?
- What would happen if you wanted to rename the prop from `user` to `currentUser`? How many files would you need to change?

---

## Exercise 2: Observe the Context API Solution

**Goal:** See how the same 5-level deep component tree works without passing any props.

1. Switch to the **🌍 Context API** tab in the app.
2. Open `src/demos/ContextDemo.jsx` in VS Code.
3. Count the component levels — there are 5, just like in PropDrillingDemo.
4. Look at `PageLayout`, `ContentSection`, and `ArticleWrapper` — they accept **zero props**.
5. Look at `ThemedCard` at Level 5. It calls `useContext(ThemeContext)`. No prop was passed to it!

**Now create your own consumer:**
1. Open `src/demos/PropDrillingDemo.jsx`.
2. Import `useContext` from `react` and `ThemeContext` from `../context/ThemeContext`.
3. Inside `UserProfileBadge`, call: `const { theme } = useContext(ThemeContext);`
4. Use the theme to change the badge's background: add `style={{ background: theme === 'dark' ? '#1e293b' : '#e2e8f0' }}` to the `.user-badge` div.
5. Switch back to your browser and toggle the theme (☀️/🌙 button in the Navbar). Watch the badge in the Prop Drilling tab change colour!

---

## Exercise 3: Build Your Own Custom Hook (`useFormInput`)

**Goal:** Write a custom hook from scratch that manages a text input field.

*(Read Section 3 in your student notes first.)*

1. Create a new file: `src/hooks/useFormInput.js`.
2. Write the hook:
   ```javascript
   import { useState } from 'react';

   export function useFormInput(initialValue) {
     const [value, setValue] = useState(initialValue);
     const onChange = (e) => setValue(e.target.value);
     return { value, onChange };
   }
   ```
3. Create a new file: `src/demos/FormDemo.jsx` with a simple contact form:
   ```jsx
   import { useFormInput } from '../hooks/useFormInput';

   export default function FormDemo() {
     const nameInput  = useFormInput('');
     const emailInput = useFormInput('');

     return (
       <div className="demo-container">
         <h2>📋 Contact Form</h2>
         <p>Using useFormInput to manage each field:</p>
         <input {...nameInput}  placeholder="Your name"  className="hook-input" style={{display:'block',marginBottom:'0.75rem'}} />
         <input {...emailInput} placeholder="Your email" className="hook-input" style={{display:'block',marginBottom:'0.75rem'}} />
         <p>Name: <strong>{nameInput.value || '(empty)'}</strong></p>
         <p>Email: <strong>{emailInput.value || '(empty)'}</strong></p>
       </div>
     );
   }
   ```
4. Import `FormDemo` into `src/App.jsx` and add a new tab for it:
   - In the TABS array: `{ id: 'form', label: '📋 Form Hook' }`
   - In the render: `{activeTab === 'form' && <FormDemo />}`

✅ Test: Type in both inputs. Notice both work with zero boilerplate in the component itself — the hook handles everything.

---

## Exercise 4: Prove That Hooks Don't Share State

**Goal:** Confirm that two components using the same hook have independent state.

1. Switch to the **🪝 Custom Hooks** tab in the app.
2. You'll see two spoiler cards, both using `useToggle`.
3. Click "Reveal Answer" on the **first** card only.

❓ Does the second card also reveal its answer? **No** — they have independent state.

4. Open `src/demos/HooksDemo.jsx` and look at the `SpoilerAlert` component. It uses `useToggle` once. Each time `SpoilerAlert` renders in a page, React creates a **new, separate** instance of the hook's state.

---

## 📝 Final Check: Interactive Quiz
Once you have completed the exercises above, click the **📝 Quiz** tab in the app!
