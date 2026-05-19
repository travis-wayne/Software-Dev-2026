# Student Notes — Lesson 24: Project: Interactive Dashboard

## 1. Project Overview
Congratulations! You've made it to the capstone project of the React curriculum. Today, you are going to build an **Interactive Dashboard**. 
A dashboard is the perfect project to combine everything you've learned:
- **Components:** Breaking the UI into Sidebar, Header, Cards, and Charts.
- **Props:** Passing data from the main layout down to the individual widgets.
- **State (`useState`):** Managing interactive features like dark mode toggles or dropdown menus.
- **Effects (`useEffect`):** Fetching data when the dashboard first loads.
- **Routing (`react-router-dom`):** Navigating between the Overview, Analytics, and Settings pages.

## 2. Planning Your Architecture
Before writing code, successful React developers *Think in React*.

### The Layout Pattern
Most dashboards use a persistent layout. The Sidebar and Header never disappear when you change pages.
```jsx
function App() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar /> {/* Always renders */}
      <div className="flex-1 flex flex-col">
        <Header /> {/* Always renders */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes> {/* Only the content swaps out! */}
            <Route path="/" element={<Overview />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
```

### Component Breakdown
1. **`<Sidebar />`**: Contains `<NavLink>` elements to switch routes.
2. **`<Header />`**: Contains the user profile, a search bar, and a theme toggle.
3. **`<StatCard />`**: A reusable component for the top row (e.g., Total Sales, Active Users). It accepts props like `title`, `value`, and `icon`.
4. **`<DataTable />`**: A reusable table to display a list of recent transactions or users.

## 3. Data Fetching
In a real application, your dashboard would fetch data from a backend server.
For this project, you will simulate fetching data using a `useEffect` hook and a `setTimeout` to mimic network delay, or use a public mock API like [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

```javascript
useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStats({ users: 1250, revenue: '$45,200', active: 340 });
    setIsLoading(false);
  }
  loadData();
}, []);
```

## 4. Styling with Tailwind CSS
This project uses **Tailwind CSS**. Tailwind allows you to style components directly in your JSX using utility classes.
- Layout: `flex`, `grid`, `flex-col`, `gap-4`
- Spacing: `p-4` (padding), `m-2` (margin)
- Colors: `bg-slate-800`, `text-white`, `border-slate-700`
- Responsiveness: `md:grid-cols-2`, `lg:grid-cols-4` (Grid changes based on screen size).

## 5. Next Steps
Open the `exercises/dashboard_project.md` file to see your step-by-step requirements for this project! Take your time, break the problems down, and don't forget to use your React Developer Tools to inspect your state and props.
