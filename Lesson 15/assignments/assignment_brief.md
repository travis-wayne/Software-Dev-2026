# Assignment Brief — Lesson 15: JavaScript Project

## Overview

Build a complete, working JavaScript web application of your choice. This project is the capstone of Lessons 10–14 — every concept you have learned should appear here in some form.

---

## Option A: To-Do List Application

### Core Requirements

**Setup:**
- Create `index.html`, `style.css`, `script.js` in a new folder `todo-app/`.

**Features — must all be working:**
1. **Add Tasks:** User can type a task and add it by pressing Enter or clicking a button.
2. **Complete Tasks:** Clicking a checkbox marks the task as done (visual strikethrough).
3. **Delete Tasks:** A delete button permanently removes the task.
4. **Persistence:** Tasks survive a full page refresh (use `localStorage`).
5. **Filter:** Three filter buttons — All, Active, Completed.
6. **Count:** Display the number of remaining active tasks (e.g. "3 tasks left").

**Code Requirements:**
- Tasks stored in a JavaScript array of objects: `{ id, text, completed }`.
- A single `render()` function that re-builds the DOM from the array.
- Event delegation on the task list (one listener, not one per task).
- `textContent` used for task text (never `innerHTML` with user input — XSS risk).

---

## Option B: Weather Application

### Setup
- Create `index.html`, `style.css`, `script.js` in a new folder `weather-app/`.
- No API key needed! We will use Open-Meteo and OpenStreetMap Nominatim.

### Features — must all be working:
1. **Search:** User enters a city name and triggers a search.
2. **Current Weather:** Display temperature (°C) and a description (e.g., "Clear sky").
3. **Extra Details:** Display wind speed and coordinates (Lat/Lon) retrieved from geocoding.
4. **Weather Icon:** Show the icon image returned by the API.
5. **Loading State:** A loading indicator shows while the fetch is in progress.
6. **Error Handling:** Clear, friendly messages for: city not found, no internet, empty input.

**Code Requirements:**
- Chained `async/await` pattern (Fetch geocoding FIRST, then fetch weather).
- `try/catch/finally` wrapping both fetches.
- Error handling for city not found (empty geocoding results).
- `async/await` — no raw `.then()` chains.

---

## Submission Checklist

### To-Do App
- [ ] Tasks appear when added (Enter key AND button both work)
- [ ] Completed tasks have a visual strikethrough style
- [ ] Delete button removes the task from the array AND screen
- [ ] Page refresh → tasks are still there (localStorage working)
- [ ] All 3 filter buttons work correctly
- [ ] Active task count updates correctly
- [ ] Code uses `textContent` for task text (not `innerHTML`)
- [ ] Code uses event delegation on the list (not per-task listeners)

### Weather App
- [ ] Searching a valid city displays weather data
- [ ] Temperature, description, humidity, wind all visible
- [ ] Weather icon image loads correctly
- [ ] Loading spinner shows during fetch, hides after
- [ ] Invalid city shows a friendly error (not a browser crash)
- [ ] Empty search input shows a validation message
- [ ] Geocoding and Weather fetches are correctly sequenced
- [ ] `try/catch/finally` wrapping the fetch

### Both Projects
- [ ] Code pushed to a new GitHub repository
- [ ] `README.md` in the repo explains what the app does
- [ ] No console errors visible in DevTools

---

## Bonus Challenges ⭐

### To-Do Bonuses
- **Bonus 1 — Edit In-Place:** Double-clicking a task text turns it into an editable input.
- **Bonus 2 — Clear Completed:** A button that removes all completed tasks at once.
- **Bonus 3 — Drag to Reorder:** Tasks can be rearranged by dragging.

### Weather Bonuses
- **Bonus 1 — 5-Day Forecast:** Fetch from `/forecast` endpoint and display the next 5 days.
- **Bonus 2 — Dynamic Background:** Page background or colour changes based on weather condition.
- **Bonus 3 — Last Search:** Remember the last searched city in localStorage and auto-load it on page open.

---

## Assessment Criteria

| Area | What We Look For |
|:---|:---|
| Functionality | Does the app do what it's supposed to do? |
| Data Management | Is state held in an array/object (not scattered variables)? |
| DOM Handling | Does `render()` rebuild from the array? No direct DOM hacks? |
| Error Handling | Does the app fail gracefully with friendly messages? |
| Code Quality | Meaningful variable names, consistent indentation, comments on complex logic |
| Git | Code committed and pushed to GitHub with a README |
