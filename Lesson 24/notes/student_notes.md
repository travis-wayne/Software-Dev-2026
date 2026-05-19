# Student Notes — Lesson 24: Project: Interactive Dashboard

> **Open the app first!** Run `pnpm dev` inside `examples/interactive-dashboard/` and click through all three pages before reading these notes.

---

## 1. What Are We Building?

This is your **React capstone project** — an Interactive Dashboard. A dashboard is the perfect project because it brings together *every* React concept you've learned into one coherent application:

| Concept | Where it's used in this project |
|---|---|
| **Components** | `Sidebar`, `Header`, `StatCard`, `RecentActivity` — each is an isolated, reusable piece |
| **Props** | `StatCard` receives `title`, `value`, `trend`, `icon` as props — zero hardcoded data inside |
| **useState** | Settings toggles, chart type toggle, toast visibility, form values |
| **useEffect** | Simulating a data fetch on the Overview page; auto-hiding the Settings toast |
| **React Router** | Navigating between `/`, `/analytics`, `/settings` without a full page reload |
| **Conditional Rendering** | Loading skeletons vs. real data; bar chart vs. line chart; toast shown/hidden |
| **Third-party libraries** | Recharts for data visualisation; Lucide React for icons |

---

## 2. The Most Important Pattern: The Persistent Layout

The most important architectural decision in any dashboard is the **persistent layout**. The Sidebar and Header should never unmount when you navigate — only the page content changes.

The way React Router achieves this is simple: **put the Sidebar and Header outside the `<Routes>` block.**

```jsx
// App.jsx — The Layout Shell
function App() {
  return (
    <div className="flex h-screen">

      <Sidebar />  {/* ← Lives OUTSIDE Routes — never unmounts */}

      <div className="flex-1 flex flex-col">
        <Header />  {/* ← Also OUTSIDE Routes */}

        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* ↓ Only THIS part swaps out when you navigate */}
            <Route path="/"          element={<Overview />}  />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings"  element={<Settings />}  />
          </Routes>
        </main>
      </div>

    </div>
  );
}
```

Open `App.jsx` in VS Code and confirm this is exactly how it is structured. Then open your browser's DevTools → React DevTools → navigate between pages. Notice that `Sidebar` and `Header` **never disappear from the component tree** — only the page component changes.

---

## 3. NavLink vs. Anchor Tags

You may be tempted to write `<a href="/analytics">`. **Don't.** An `<a>` tag causes a full browser page reload, destroying all React state.

Use `<NavLink>` from React Router instead:

```jsx
import { NavLink } from 'react-router-dom';

// ❌ WRONG — causes a full page reload
<a href="/analytics">Analytics</a>

// ✅ CORRECT — client-side navigation, no reload
<NavLink to="/analytics">Analytics</NavLink>
```

**The `isActive` super-power:** Unlike a plain `<Link>`, `NavLink` knows if it's the currently active route and gives you an `isActive` boolean in the `className` function so you can style it differently:

```jsx
<NavLink
  to="/analytics"
  className={({ isActive }) =>
    isActive
      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'  // active style
      : 'text-slate-400 hover:bg-slate-800/60'                           // inactive style
  }
>
  Analytics
</NavLink>
```

Open `Sidebar.jsx` and find this exact pattern in the code.

---

## 4. The Data Fetching Pattern (useEffect + useState)

The Overview page demonstrates the most common React data-fetching pattern. Study it carefully — you will use this pattern in almost every professional React project you build.

```javascript
// src/pages/Overview.jsx

// ① Start with "no data" and "loading = true"
const [stats, setStats]         = useState(null);
const [isLoading, setIsLoading] = useState(true);

// ② useEffect runs AFTER the first render
useEffect(() => {
  fetchDashboardStats().then(data => {
    setStats(data);      // ③ Store the data
    setIsLoading(false); // ④ Signal that loading is done
  });
}, []); // ⬅ Empty array = "run only once, on mount"

// ⑤ Render different UI based on current state
if (isLoading) {
  return <LoadingSkeletons />;  // shown while data is fetching
}
return <StatCardGrid stats={stats} />; // shown once data has arrived
```

**The lifecycle, step by step:**
1. Component renders for the first time → `isLoading` is `true` → skeletons appear.
2. `useEffect` fires → `fetchDashboardStats()` starts (a 1.5s simulated delay).
3. 1.5 seconds later, the promise resolves → `setStats(data)` and `setIsLoading(false)` are called.
4. React re-renders → `isLoading` is now `false` → real StatCards appear.

Watch this happen in real time. Refresh the Overview page and observe the skeleton shimmer for 1.5 seconds before the data appears.

---

## 5. The StatCard Component: Reusability Through Props

The `StatCard` is the best example of a **data-driven, reusable component** in this project. It renders four times on the Overview page — but all four cards look completely different because of the **props** passed to each one.

```jsx
// This is the StatCard being used (in Overview.jsx)
<StatCard
  title="Total Revenue"
  value="$48,295"
  trend="+14.5%"
  isUp={true}
  icon={DollarSign}
  color="indigo"
/>

<StatCard
  title="Active Sessions"
  value="12,340"
  trend="-2.1%"
  isUp={false}   // ← false means red/down arrow
  icon={Activity}
  color="violet"
/>
```

Open `src/components/StatCard.jsx` and read it thoroughly. Notice:
- The component has **zero hardcoded data** — everything comes from props.
- The `color` prop controls the entire colour scheme of the card via a lookup object.
- The `isUp` prop determines whether to show a green upward trend or a red downward trend.

**This is the pattern you must follow when you build your own version for the exercises.**

---

## 6. Conditional Rendering (The Analytics Page)

The Analytics page has a toggle switch that changes the chart type between Bar and Line. This is **conditional rendering** driven by `useState`.

```javascript
const [chartType, setChartType] = useState('bar');

// Later in the JSX:
{chartType === 'bar'
  ? <BarChart data={monthlyData} ... />
  : <LineChart data={monthlyData} ... />
}
```

When you click the "line chart" button, `setChartType('line')` is called → React re-renders → the ternary evaluates to `false` → `<LineChart>` renders instead of `<BarChart>`.

Click between the two chart types in your browser and watch this happen. Then open `Analytics.jsx` and trace exactly which line of code is responsible for each step.

---

## 7. The Toast Notification Pattern (Settings Page)

The Settings page demonstrates one of the most useful real-world patterns: a **temporary UI notification** (toast) that auto-dismisses.

```javascript
const [showToast, setShowToast] = useState(false);

// When showToast becomes true, start a 3-second countdown to hide it
useEffect(() => {
  if (!showToast) return; // guard: do nothing unless toast is showing

  const timer = setTimeout(() => {
    setShowToast(false); // hide the toast after 3 seconds
  }, 3000);

  return () => clearTimeout(timer); // cleanup: cancel if component unmounts early
}, [showToast]); // re-run this effect whenever showToast changes

// Triggered when user clicks "Save Changes"
const handleSave = () => {
  setShowToast(true); // this triggers the useEffect above
};
```

**Key observation:** The `return () => clearTimeout(timer)` line is a **cleanup function**. If the user navigates away from Settings before 3 seconds is up, React calls this cleanup to cancel the pending timer — preventing a memory leak.

Click "Save Changes" on the Settings page and watch the toast appear and disappear.

---

## 8. Tailwind CSS Cheat Sheet

This project uses Tailwind v4. Here are the classes used most frequently:

| Category | Classes | What they do |
|---|---|---|
| **Layout** | `flex`, `flex-col`, `flex-1` | Flexbox layout |
| **Sizing** | `h-screen`, `w-64`, `w-full` | Heights and widths |
| **Spacing** | `p-6`, `px-4`, `py-2`, `gap-4`, `mb-8` | Padding, gaps, margins |
| **Background** | `bg-slate-800/50` | Background with `/50` opacity |
| **Borders** | `border`, `border-slate-700/50`, `rounded-2xl` | Borders and rounding |
| **Text** | `text-slate-100`, `text-sm`, `font-bold` | Colours, sizes, weights |
| **Effects** | `backdrop-blur-xl`, `shadow-xl` | Blur and shadows |
| **Responsive** | `sm:grid-cols-2`, `lg:grid-cols-4` | Breakpoint prefixes |
| **Hover** | `hover:bg-slate-700`, `hover:-translate-y-0.5` | Hover state changes |

---

## 9. Your Exercise Map

Open `exercises/dashboard_project.md` for the full task list. Here's the overview:

| Milestone | What to build | Key concept |
|---|---|---|
| **1 — StatCards** | `<StatCard>` component + data in Overview | Props & reusability |
| **2 — Routing** | Replace `<a>` tags with `<NavLink>` in Sidebar | React Router active state |
| **3 — Chart** | Add a `<ResponsiveContainer>` with `<BarChart>` to Analytics | Third-party library usage |
| **4 — Settings** | Wire the toggle + toast notification | useState + useEffect |
| **Bonus** | Collapsible sidebar, additional pages | useState lifted to App.jsx |

---

## Quick Reference: Concept → File Location

| Concept | File to open |
|---|---|
| Persistent Layout Pattern | `src/App.jsx` |
| NavLink active state | `src/components/Sidebar.jsx` |
| useEffect data fetching | `src/pages/Overview.jsx` |
| Reusable props-driven component | `src/components/StatCard.jsx` |
| Conditional chart rendering | `src/pages/Analytics.jsx` |
| useEffect toast auto-dismiss | `src/pages/Settings.jsx` |
| Recharts implementation | `src/pages/Analytics.jsx` |
