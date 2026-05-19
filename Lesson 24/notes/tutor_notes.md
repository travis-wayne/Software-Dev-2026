# Tutor Notes — Lesson 24: Project: Interactive Dashboard (Capstone)

---

## Session Objectives

By the end of this session, the student will have:

1. Built a working multi-page React dashboard application from a professional starter template.
2. Implemented **persistent layout** with `Sidebar` and `Header` outside `<Routes>`.
3. Converted plain `<a>` tags to **`<NavLink>`** with `isActive` active-state styling.
4. Used `useEffect` + `useState` to simulate and handle an **asynchronous data fetch** with loading skeletons.
5. Displayed data in a **Recharts `BarChart`** and toggled it to a `LineChart` using conditional rendering.
6. Built **controlled form inputs**, animated **toggle switches**, and a **toast notification** that auto-dismisses via `useEffect + setTimeout`.

---

## Pre-Session Setup Checklist

- [ ] `pnpm dev` runs successfully in `Lesson 24/examples/interactive-dashboard/`.
- [ ] All three pages load: Overview (with skeleton → stat cards), Analytics (with chart), Settings (with working toggles).
- [ ] The sidebar NavLinks are active (bold/highlighted) on the current page.
- [ ] React DevTools extension is installed in the student's browser.

---

## Pedagogical Context: Capstone Session

This session is different. You are **not introducing new concepts**. Every concept in this project — `useState`, `useEffect`, `props`, `NavLink` — has been taught in a previous lesson. This session is about:

1. **Integration** — seeing how all the pieces fit together into one real application.
2. **Pattern recognition** — helping the student identify the same patterns they've seen before, just in a more complex context.
3. **Ownership** — the student should feel like they *built* this, not just watched you build it.

**Your role this session is a Senior Developer / Code Reviewer, not an instructor.** Resist the urge to explain everything unprompted. Let the student open files, read the comments, and figure things out. Step in with guidance, not answers.

---

## Lesson Flow (90-minute session)

### Phase 1 — Tour the Running App (10 minutes)
Start by running the app together without touching any code.

1. Open `pnpm dev` and navigate all three pages.
2. Ask the student: *"What do you notice happens when you click between pages in the sidebar?"*
   - Expected answer: The page doesn't reload, the sidebar stays in place.
   - This is the SPA behaviour — use it as a jumping-off point for the layout discussion.
3. Click "Save Changes" on Settings → observe the toast notification.
4. Toggle the chart type on Analytics.
5. Refresh the Overview → watch the skeleton animation for 1.5 seconds.

### Phase 2 — Architecture Walk-Through (15 minutes)
Open VS Code side-by-side with the browser.

1. **`App.jsx` — The Layout:** Show visually how `<Sidebar>` and `<Header>` are **outside** `<Routes>`. Use React DevTools to show that they never unmount.
2. **`Sidebar.jsx` — NavLink:** Find the `NavLink` usage. Show the `({ isActive }) => ...` pattern in the `className` prop. Toggle between pages and watch the active indicator move.
3. **`Overview.jsx` — Data Fetch:** Walk through the `useState(null)` → `useEffect` → `setStats(data)` sequence. Match each step in the code to what the student observed in the browser (skeleton → cards).

### Phase 3 — Guided Exercises (50 minutes)
Have the student work through the `exercises/dashboard_project.md` milestones. Your job is to:
- Ask guiding questions rather than giving direct answers.
- Point them to the right file to look at rather than writing the code for them.
- Validate their mental model with questions like: *"Before you write this, tell me what you think will happen."*

**Suggested guiding questions per milestone:**

| Milestone | Guiding question |
|---|---|
| StatCard component | "Look at how `StatCard` is used in Overview.jsx. What props does it receive? Now build a component that accepts those same props." |
| NavLink active state | "Open Sidebar.jsx. What is different about a `NavLink` compared to an `<a>` tag? Find the `isActive` pattern and explain it back to me." |
| Recharts chart | "Look at the existing `BarChart` in Analytics.jsx. What does `<ResponsiveContainer>` do? Why do you think we use it instead of setting a fixed width?" |
| Toast notification | "What would happen if you removed the `return () => clearTimeout(timer)` line in Settings.jsx? When would that become a problem?" |

### Phase 4 — Reflection & Wrap-Up (15 minutes)
1. Open the React DevTools with the student. Navigate around and inspect:
   - `Overview` state: `isLoading` flips from `true` to `false`.
   - `Settings` state: Toggle switches flip between `true` and `false`.
   - `Analytics` state: `chartType` changes from `'bar'` to `'line'`.
2. Ask: *"Looking back at Lesson 19 where you wrote your first component — what's the biggest difference between what you wrote then and what you've built today?"*
3. Celebrate the milestone! This is a genuinely impressive project.

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| Page goes blank when navigating | Route path doesn't match `<Link to>` string | Check that `to="/analytics"` matches `path="/analytics"` exactly |
| NavLink never shows active state | Used `<Link>` instead of `<NavLink>` | Replace `import { Link }` with `import { NavLink }` |
| Recharts chart doesn't appear | Missing `<ResponsiveContainer>` wrapper | Wrap the chart in `<ResponsiveContainer width="100%" height={300}>` |
| Toast never disappears | `useEffect` dependency array missing `[showToast]` | Ensure `[showToast]` is the dependency — otherwise the effect won't re-run |
| Stats never load | `useEffect` dependency array not empty (`[]`) | An empty array `[]` ensures the effect only runs once on mount |
| Tailwind classes not applying | Typo in class name (Tailwind v4 doesn't warn) | Check spelling; try the class in isolation first |

---

## Key Teaching Moments to Emphasise

### 1. "Outside Routes" is the Layout Pattern
The most important architectural lesson: anything you want to **persist across routes** (Sidebar, Header, Navbar, Footer) must live **outside** `<Routes>` in the component tree.

### 2. `useEffect` is a Promise Listener
A good mental model for students who struggle with `useEffect`:
> "Think of `useEffect` as saying: *'After you've finished rendering, do this side effect.'* The empty `[]` array means *'only do it once, on the first render.'*"

### 3. Props Make Components Reusable
Point to the four `<StatCard>` instances on the Overview page. Ask: *"How many times did we write the card HTML?"* Answer: once. Props are what transform a one-off hard-coded element into a reusable component.

### 4. React State = Reactive UI
When the student clicks a Settings toggle, ask them to predict what will happen before they click. Then click and confirm. This builds the mental model that state is the **single source of truth** and the UI is just a reflection of it.

---

## Deployment (Optional, if time permits)

If the session finishes early, introduce deployment as a preview for the next module:

```bash
# Build the production bundle
pnpm build

# Preview the production build locally
pnpm preview
```

Then guide the student to drag-and-drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop) for an instant live URL — no account required. This is a powerful motivation tool.

---

## Post-Session Assignment

1. Complete any unfinished milestones from `exercises/dashboard_project.md`.
2. Add a **fourth page** to the dashboard: a "Tasks" page with a simple to-do list that uses `useState` to add/remove tasks.
3. Deploy the completed dashboard to Vercel or Netlify and share the live URL.
4. Push the project to a new GitHub repository as a portfolio piece.
