# Tutor Session Guide – Lesson 15: Project Session

## 🗺️ Skills Integration Map

Use this to show the student exactly where they've seen each tool before. Point to it when they feel overwhelmed.

| Today's code | Came from |
|---|---|
| `let tasks = []` · `task.completed` | L13 — Arrays & Objects |
| `tasks.push()` · `tasks.filter()` · `tasks.map()` | L13 — Array Methods |
| `document.getElementById()` · `createElement` | L12 — DOM Manipulation |
| `addEventListener()` · event delegation | L12 — Events |
| `async function` · `await` · `try/catch/finally` | L14 — Async/Await |
| `fetch()` · `response.ok` · `response.json()` | L14 — Fetch API |
| `localStorage.setItem/getItem` | L15 New — but uses `JSON.stringify` from L13 |

---

## ⏱️ Session Outline (Total Time: ~90 mins)

| Phase | Topic | Time |
|---|---|---|
| 1 | Project Selection & Planning (Pseudocode) | 20 min |
| 2 | Build: Core Features (Milestone 1 & 2) | 45 min |
| 3 | Polish, Debug & Stretch Goals | 20 min |
| 4 | Review, Commit to GitHub, Assignment Intro | 5 min |

---

## 🎯 Phase 1: Project Selection & Planning (≈ 20 min)

### Opening Script

**Tutor:** "Today we build something real. No exercises, no quizzes — a full application. Before we write a single line of code, we plan."

**Step 1 — Student chooses a project:**
- **To-Do List** — if they want to focus on DOM manipulation, arrays, and localStorage.
- **Weather App** — if they want to practice async/await and real API calls.

**Step 2 — Pseudocode together:**

**Tutor:** "What does the app actually need to DO? Let's list the steps in plain English first."

For To-Do:
```
1. User types a task and presses Enter (or clicks Add)
2. App creates a task object { id, text, completed: false }
3. App adds it to the tasks array
4. App re-renders the list from the array
5. User can click a checkbox to mark it done
6. User can click X to delete a task
7. App saves the list to localStorage so it persists on reload
```

For Weather:
```
1. User types a city name and clicks Search
2. App shows a loading indicator
3. App calls Nominatim API (OpenStreetMap) to get lat/lon for the city
4. App calls Open-Meteo API using those coordinates
5. App receives JSON with current weather (temp, wind, weathercode)
6. App updates the DOM to show the weather card
7. If city not found, show a friendly error message
```

**Tutor:** "Notice: we didn't write JavaScript yet. We described what needs to happen in plain English. This is pseudocoding — the most important skill in programming."

---

## 🛠️ Teaching Analogies

### 1. The Blueprint Before the Building
> "No architect starts constructing walls before drawing blueprints. Your pseudocode is the blueprint. Coding without planning is like building without measuring — you'll knock it all down and start again anyway, just later."

### 2. One Brick at a Time
> "You don't build a house by throwing all the bricks at once. You lay one brick, check it's level, then lay the next. In code: get one feature working. Confirm it works in the console. Then move to the next."

### 3. console.log() Is Your Flashlight
> "When you're in a dark room looking for something, you don't smash the walls. You use a torch. `console.log()` is your torch — shine it on the data before you try to use it."

---

## 🎬 Phase 2: Build Path — To-Do App (≈ 45 min)

### Milestone 1 (15 min): Setup + Add Task

**Tutor:** "Let's wire up the input first. Nothing else. Just: type, press Enter, task appears."

```javascript
let tasks = [];

function addTask(text) {
    const task = { id: Date.now(), text, completed: false };
    tasks.push(task);
    render();
}

document.querySelector('#task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        addTask(e.target.value.trim());
        e.target.value = '';
    }
});
```

**Predict-then-run:** "Before we write `render()` — what should it do? How do we go from the `tasks` array to actual `<li>` elements?"

### Milestone 2 (15 min): Render + Toggle Complete + Delete

```javascript
function render() {
    const list = document.querySelector('#task-list');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'task done' : 'task';
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span>${task.text}</span>
            <button data-id="${task.id}">✕</button>
        `;
        list.appendChild(li);
    });
}

// Event delegation — one listener for the whole list
document.querySelector('#task-list').addEventListener('click', e => {
    const id = Number(e.target.dataset.id);
    if (e.target.type === 'checkbox') {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    }
    if (e.target.tagName === 'BUTTON') {
        tasks = tasks.filter(t => t.id !== id);
    }
    render();
});
```

**Key teaching point:** "Notice `event delegation` — one listener on the parent `<ul>`, not one per task. Why? Because tasks are created dynamically. Listeners added before the element exists don't attach."

### Milestone 3 (15 min): localStorage + Filters

```javascript
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load on startup
tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Filter buttons
let filter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        render();
    });
});
```

---

## 🎬 Phase 2: Build Path — Weather App (≈ 45 min)

### Milestone 1 (10 min): Geocoding (City -> Coordinates)

**Tutor:** "Unlike some APIs that take a city name, many weather APIs (like Open-Meteo) need exact coordinates. We use Nominatim to translate a name into numbers."

```javascript
async function getCoords(city) {
    const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) throw new Error("City not found");
    return { lat: data[0].lat, lon: data[0].lon };
}
```

### Milestone 2 (20 min): Chained Fetch + Display

```javascript
async function getWeather() {
    const city = document.querySelector('#city-input').value.trim();
    if (!city) return;

    showLoading(true);
    try {
        // Step 1: Get coordinates
        const { lat, lon } = await getCoords(city);

        // Step 2: Get weather
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`;
        const response = await fetch(url);
        const data = await response.json();

        displayWeather(data);
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
}
```

**Predict-then-run:** "`data` is a big JSON object. Before we write `displayWeather`, let's log it and look at its shape. What properties do we need?"

```javascript
function displayWeather(data) {
    const { temperature_2m, wind_speed_10m, weather_code } = data.current;
    document.querySelector('#temperature').textContent = Math.round(temperature_2m) + '°C';
    document.querySelector('#wind').textContent = wind_speed_10m + ' km/h';
    // Students can map weather_code to a string (e.g. 0 = Clear)
}
```

### Milestone 3 (15 min): Error Handling + Loading State + Polish

Emphasize: Show a loading spinner before the `await`, hide it in `finally`.

---

## ⚠️ Common Mistakes & Troubleshooting Guide

1. **Event listener added before element exists:** Use event delegation or move the `<script>` tag to the bottom of `<body>`.
2. **Forgetting to call `render()` after every state change:** Every mutation to `tasks` must be followed by `render()` and `saveTasks()`.
3. **`task.id` is a number, `dataset.id` is a string:** Always `Number(e.target.dataset.id)` or use `.toString()` to compare.
4. **`innerHTML` injection for user input:** Use `textContent` for the task text to prevent XSS.
5. **Forgetting `await response.json()`:** `response` is the Response object — you must await the body parse too.
6. **CORS errors on weather API:** This only happens server-side. Browser-based calls to OpenWeatherMap work fine.
7. **`localStorage` is empty on first load:** Always default with `|| []` or `|| {}` when parsing.
8. **API key not yet active:** OpenWeatherMap free keys take up to 2 hours to activate after registration.

---

## ✅ Session Closing Check (≈ 5 min)

1. "How does our app know which task to delete when the delete button is clicked?" → Event delegation + `data-id` attribute
2. "What happens to the task list when the page refreshes — without localStorage?" → It's gone. Arrays live in memory only.
3. "In the Weather App, if the server returns a 404, does `fetch()` throw automatically?" → No. We check `response.ok`.
4. "Why do we use `finally` to hide the loading spinner?" → Because we always want to hide it, whether the fetch succeeded or failed.

---

## 🐛 Live Debug Scenarios — What Students Will Break (and How to Guide Them)

When a student is stuck, DON'T give them the answer. Ask these diagnostic questions instead:

### Scenario 1: "I click Add but nothing appears"
**Ask:** "Check the console — any red errors?"
**Ask:** "Put `console.log('clicked')` as the very first line of your event handler. Does it log?"
- If no log → the event listener isn't attached (wrong ID, or script runs before DOM)
- If it logs but no task → check if `render()` is being called; log `tasks` after `push`

### Scenario 2: "My delete button doesn't work"
**Ask:** "Log `e.target.dataset.id` inside your listener. What type is it — string or number?"
**Ask:** "Log the task IDs in your array. What type are they?"
- Almost always: `dataset.id` is `"1234"` (string) but `task.id` is `1234` (number). Fix: `Number(e.target.dataset.id)`

### Scenario 3: "My tasks disappear when I refresh"
**Ask:** "Open DevTools → Application → LocalStorage. Is anything stored there?"
**Ask:** "Log `localStorage.getItem('tasks')` at the top of the script. What does it return?"
- If `null` → `save()` is never being called, or key name doesn't match
- If a string → JSON.parse is missing on load

### Scenario 4: "My fetch gives me an error but the city is spelled correctly"
**Ask:** "Check the Network tab. Which fetch failed? The one to Nominatim or the one to Open-Meteo?"
- Failed to Nominatim → Service might be down or rate-limited (don't spam it!)
- Failed to Open-Meteo → Check if your coordinates (lat/lon) are valid numbers
- `404` → City genuinely not found (try a larger city)
- CORS error in console → Nominatim usually allows CORS, but check your browser extensions.

### Scenario 5: "I get the weather data but the page doesn't update"
**Ask:** "Log `data.main.temp` directly. Does it print a number?"
**Ask:** "Log `document.getElementById('w-temp')`. Is it `null`?"
- If `null` → the HTML `id` doesn't match what the JS is looking for
- If correct → check if `displayWeather()` is actually being called (add a log at the top of the function)

### Scenario 6: "The loading spinner never goes away"
**Ask:** "Do you have a `finally` block? Where is it hiding the spinner?"
- Students put the hide-spinner code inside `try` — but if an error throws, it never reaches that line
- Solution: `finally` always runs regardless of success or failure

### Scenario 7: "My filter buttons don't do anything"
**Ask:** "Log the `filter` variable inside `render()`. What value does it have?"
**Ask:** "Are you actually setting the `filter` variable in the button click handler?"
- Students often forget to call `render()` after changing `filter`
- Or they shadow the variable with a local `const filter` inside the listener

---

## 📋 Session Notes

- **Let the student drive.** This is their project. Guide with questions, not by typing for them.
- **Celebrate milestones.** When the first task appears on screen — that's a real moment. Acknowledge it.
- **Console.log everything.** Log the raw API response before writing `displayWeather`. Log `tasks` after every mutation.
- **Don't rush to the finish.** A working Milestone 1 + 2 is a better lesson than a buggy complete app.
