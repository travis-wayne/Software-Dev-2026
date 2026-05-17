# Tutor Notes — Session 22: Advanced React: Context API & Custom Hooks

## Learning Objectives
By the end of this session, the student will be able to:
- Identify "Prop Drilling" and articulate why it makes component trees hard to maintain.
- Use the **Context API** (`createContext`, `<Provider>`, `useContext`) to share global state (like a Theme) across an application.
- Understand the difference between Local State (`useState`) and Global State (Context).
- Extract reusable component logic into **Custom Hooks** (e.g., `useToggle`, `useLocalStorage`).
- Follow the Rules of Hooks when creating their own custom hooks.

## Key Concepts to Emphasize

1. **The Problem: Prop Drilling**
   - Show a visual tree: `App` -> `Layout` -> `Header` -> `UserMenu` -> `Avatar`.
   - If `App` holds the `currentUser` state, it has to pass it through `Layout`, `Header`, and `UserMenu` just so `Avatar` can render the image. The middle components don't care about `currentUser`, but they are forced to act as middlemen. This is "prop drilling".

2. **The Solution: Context API**
   - Context acts like a wormhole or a global broadcast station.
   - **`createContext()`**: Creates the broadcast station.
   - **`Provider`**: The antenna that broadcasts the value to all components below it.
   - **`useContext()`**: The receiver that any component can use to tune into the broadcast and get the value directly, skipping the middlemen.

3. **Custom Hooks**
   - Emphasize that Custom Hooks are *not* a new React feature. They are literally just plain JavaScript functions that happen to call other React Hooks inside them.
   - **Naming convention:** They MUST start with `use` (e.g., `useWindowSize`, `useFetch`). If they don't, React's linter won't be able to check them for violations of the Rules of Hooks.
   - **What do they share?** Custom hooks share *stateful logic*, not the state itself. If two components use `useToggle`, they get two completely independent boolean variables.

## Preparation & Setup
- Ensure the student navigates to `Lesson 22/examples/advanced-react-app` and runs `pnpm dev`.
- The Vite app is pre-configured with a tabbed interface showcasing:
  1. The Prop Drilling problem.
  2. The Context API solution (Theme Switcher).
  3. Custom Hooks (`useToggle` and `useLocalStorage`).
  4. The interactive Quiz.

## Suggested Session Flow
1. **Prop Drilling (10 mins):** Walk through the first tab in the example app. Show how painful it is to pass a prop down 5 levels deep.
2. **Context API (15 mins):** Switch to the Context tab. Show the `ThemeProvider` wrapping the components, and how deeply nested components use `useContext(ThemeContext)` to read and update the theme.
3. **Custom Hooks (15 mins):** Look at the `useToggle` custom hook. Show how it replaces 3 lines of repetitive `useState` logic with a single clean line. Do the same for `useLocalStorage`.
4. **Interactive Quiz (10 mins):** Have the student complete the embedded Quiz.jsx to test their understanding.
5. **Assign Homework:** Discuss how they can implement Context (Theme/Auth) and Custom Hooks (`useFormInput`) in their personal portfolio project.

## Common Stumbling Blocks
- **Overusing Context:** Students often think Context should replace all `useState`. Remind them: Context is for *global* data (theme, auth user, language). Local data (is a specific dropdown open, form input values) should stay in `useState`.
- **Context Re-renders:** Every component using `useContext` will re-render when the context value changes. If the context holds too much unrelated data, it causes performance issues.
- **Forgetting `return` in Custom Hooks:** A custom hook is just a function. If they forget to `return [value, setValue]`, the component using the hook will crash.
