# Tutor Notes — Lesson 24: Project: Interactive Dashboard

## Session Objectives
By the end of this session, the student will have built a functional, multi-page Interactive Dashboard that integrates:
- React Router (Persistent Layouts).
- `useState` & `useEffect` (Data fetching and local state).
- Reusable Components & Props (Stat cards, tables).
- Tailwind CSS for modern, responsive UI design.

## Preparation
- Ensure the student's Vite environment is running.
- This project comes pre-configured with **Tailwind CSS**, **React Router DOM**, **Lucide React** (for icons), and **Recharts** (for simple data visualization).
- The starter code provides a beautiful dark-mode layout shell. The student's job is to populate it and build the interactive features.

## Guiding the Project
This is a capstone project session. Your role shifts from "instructor" to "senior developer/mentor".
1. **Planning Phase (15 mins):** Open `App.jsx` and review the Layout pattern. Explain how the `Sidebar` and `Header` sit outside the `<Routes>` block so they don't re-render.
2. **Component Creation (30 mins):** Have the student build the `<StatCard>` component. Teach them to identify which parts of the card are dynamic (title, value, icon, trend) and pass those as props.
3. **Data Fetching (30 mins):** Guide them through fetching data in the `<Overview>` page using `useEffect`. Use the provided mock data function or JSONPlaceholder.
4. **Routing (15 mins):** Ensure they use `<NavLink>` in the Sidebar to get active state styling.

## Troubleshooting Tips
- **Empty Routes:** If a page is blank, check if they imported the component correctly and added the `<Route>` to `App.jsx`.
- **Prop Drilling:** If they are passing a user object down 4 levels, gently suggest using the Context API (or just keep it simple if they are overwhelmed).
- **Tailwind Typos:** If styles aren't applying, remind them that Tailwind doesn't warn on invalid class names. Check spelling carefully.

## Celebrate!
This is a major milestone. Remind the student how far they've come from basic JavaScript to building full Single Page Applications with professional tooling!
