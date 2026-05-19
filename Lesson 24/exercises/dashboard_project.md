# Project Guidelines — Lesson 24: Interactive Dashboard

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 24/examples/interactive-dashboard"
pnpm install
pnpm dev
```
Open the code in VS Code. This project comes pre-configured with React Router, Tailwind CSS, Lucide React (for icons), and Recharts (for charts).

---

## 🎯 Project Requirements

Your goal is to build a 3-page interactive dashboard. We have provided the basic layout shell in `App.jsx`. Your job is to build the components and fetch the data!

### Milestone 1: The Overview Page (`src/pages/Overview.jsx`)
1. Create a `StatCard` component (`src/components/StatCard.jsx`). It should accept props for:
   - `title` (e.g., "Total Revenue")
   - `value` (e.g., "$45,231")
   - `icon` (Pass a Lucide icon component)
   - `trend` (e.g., "+12.5%")
2. In the `Overview` page, render a grid of 4 `StatCard` components with different data.
3. **Data Fetching:** Use `useState` and `useEffect` in the Overview page to simulate fetching this data when the component mounts. Show a loading spinner while the data is fetching.

### Milestone 2: Navigation & Routing
1. Open `src/components/Sidebar.jsx`.
2. Convert the standard HTML `<a>` tags into React Router `<NavLink>` components.
3. Use the `isActive` property of `<NavLink>` to give the active link a distinct background color (e.g., `bg-indigo-600/20 text-indigo-400`).
4. Ensure clicking the links navigates between `/`, `/analytics`, and `/settings` without a page reload.

### Milestone 3: The Analytics Page (`src/pages/Analytics.jsx`)
1. Build a basic page structure with a title "Analytics".
2. Use the `recharts` library (already installed) to render a simple Bar Chart or Line Chart showing user growth over 6 months.
   *(Hint: Look at the Recharts documentation for a simple `ResponsiveContainer` and `BarChart` example. We've included a mock data array in the file for you).*

### Milestone 4: Interactive Settings (`src/pages/Settings.jsx`)
1. Build a Settings page with a mock "Profile Profile" form.
2. Add a functional toggle switch (using `useState`) for "Email Notifications".
3. When the user clicks a "Save Changes" button, show a success toast/message (using `useState`) that disappears after 3 seconds (using `setTimeout` inside a `useEffect`).

---

## 🎨 Bonus Challenge
- Extract the Header into its own `src/components/Header.jsx` file to keep `App.jsx` clean.
- Make the Sidebar collapsible (add a hamburger menu button to the header that toggles a boolean state in `App.jsx`, passing that state down to the Sidebar).

Take your time, read the errors in your console, and have fun building!
