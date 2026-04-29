# Project Planning Exercises — Lesson 15

## How to Use This File

Complete the planning sections **before** writing any code. Once you've chosen your project and completed Phase 1, use the starter templates in Phase 2 as your actual starting point — don't begin with a blank file.

---

## Phase 0: Choose Your Project

**A: To-Do List** — No API key needed. Great for mastering DOM, arrays, and localStorage.
**B: Weather App** — Uses the Fetch API. Great for practising async/await and real data.

> **My choice:** _______________ | **Why (one sentence):** _______________

---

## Phase 1: Planning — Do This Before You Open VS Code

### Exercise 1 — Feature List (plain English only, no code)

Write 5–7 things your app must DO. Use verbs, not technical terms.

```
My app must:
1. 
2. 
3. 
4. 
5. 
6. 
```

### Exercise 2 — Data Model

What data does your app need to store? Sketch the JavaScript object/array shape.

```javascript
// My main data structure:
// Example for To-Do: const task = { id: 1234, text: "Buy milk", completed: false }


```

### Exercise 3 — User Flow Table

Every app interaction follows: **User does X → App does Y**. Fill this in:

| User does... | App should... |
|---|---|
| | |
| | |
| | |
| | |

---

## Phase 2: Start Here — Starter Templates

Use one of these as your `index.html`. Do NOT start with a blank file.

### ── OPTION A: To-Do App Starter ──

Copy this as your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My To-Do App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>📝 My Tasks</h1>

    <!-- INPUT ROW -->
    <div>
        <input type="text" id="task-input" placeholder="Add a new task...">
        <button id="add-btn">+ Add</button>
    </div>

    <!-- STATS -->
    <p id="task-count">0 tasks left</p>

    <!-- FILTERS -->
    <button class="filter-btn" data-filter="all">All</button>
    <button class="filter-btn" data-filter="active">Active</button>
    <button class="filter-btn" data-filter="completed">Completed</button>

    <!-- TASK LIST -->
    <ul id="task-list"></ul>

    <script src="script.js"></script>
</body>
</html>
```

Copy this as your `script.js` — fill in the blanks:

```javascript
// ============================================
// STEP 1: State — the single source of truth
// ============================================
let tasks  = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

// ============================================
// STEP 2: Core functions — build these first
// ============================================

function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ id: Date.now(), text: text.trim(), completed: false });
    save();
    render();
}

function toggleTask(id) {
    // TODO: Use .map() to flip the completed state of the task with this id
    // Hint: tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    
    save();
    render();
}

function deleteTask(id) {
    // TODO: Use .filter() to remove the task with this id
    // Hint: tasks = tasks.filter(t => ...)
    
    save();
    render();
}

function save() {
    // TODO: Save the tasks array to localStorage
    // Hint: localStorage.setItem('tasks', JSON.stringify(tasks));
    
}

// ============================================
// STEP 3: render() — always rebuild from array
// ============================================

function render() {
    const list = document.getElementById('task-list');
    list.innerHTML = ''; // Clear the DOM first

    // TODO: Apply filter
    const visible = tasks; // Change this to filter based on `filter` variable

    // TODO: Build each list item
    visible.forEach(task => {
        const li   = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = task.text; // textContent, never innerHTML for user data!

        // TODO: Add a checkbox and delete button
        // TODO: Mark the item visually if task.completed is true

        li.appendChild(span);
        list.appendChild(li);
    });

    // TODO: Update the task count
    const active = tasks.filter(t => !t.completed).length;
    document.getElementById('task-count').textContent = `${active} tasks left`;
}

// ============================================
// STEP 4: Event listeners
// ============================================

// Add on button click
document.getElementById('add-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    addTask(input.value);
    input.value = '';
    input.focus();
});

// Add on Enter key
document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        addTask(e.target.value);
        e.target.value = '';
    }
});

// TODO: Event delegation for task list (toggle + delete)
// ONE listener on the parent handles ALL tasks — even dynamically added ones
document.getElementById('task-list').addEventListener('click', e => {
    const id = Number(e.target.dataset.id);
    if (!id) return;
    // TODO: Check e.target and call the right function
});

// TODO: Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        render();
    });
});

// ============================================
// STEP 5: Initial render
// ============================================
render();
```

---

### ── OPTION B: Weather App Starter ──

Copy this as your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Weather App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>🌤 Weather App</h1>

    <!-- SEARCH -->
    <input type="text" id="city-input" placeholder="Enter city name...">
    <button id="search-btn">Search</button>

    <!-- THREE STATES: only one shows at a time -->
    <div id="loading"      style="display:none">⏳ Loading...</div>
    <div id="error-msg"    style="display:none"></div>

    <div id="weather-card" style="display:none">
        <h2 id="w-city"></h2>
        <p id="w-temp"></p>
        <p id="w-desc"></p>
        <p id="w-humidity"></p>
        <p id="w-wind"></p>
        <img id="w-icon" src="" alt="weather icon">
    </div>

    <script src="script.js"></script>
</body>
</html>
```

Copy this as your `script.js` — fill in the blanks:

```javascript
// ============================================
// STEP 1: The fetch function
// ============================================

async function fetchWeather(city) {
    // Step 1: Geocoding (City Name -> Latitude/Longitude)
    // Hint: const geoUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
    const geoData     = await geoResponse.json();
    if (geoData.length === 0) throw new Error("City not found");
    
    const { lat, lon } = geoData[0];

    // Step 2: Weather Data (using coordinates)
    // Hint: const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`;
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`);
    const data     = await response.json();
    
    return data;
}

// ============================================
// STEP 2: Display function — update the DOM
// ============================================

function displayWeather(data) {
    // LOG FIRST to see the shape:
    console.log('API Response:', data);

    // TODO: Destructure what you need from data
    // Hint: const { temperature_2m, wind_speed_10m } = data.current;

    // TODO: Update each DOM element with the data
    // document.getElementById('w-city').textContent = name;
    // document.getElementById('w-temp').textContent = Math.round(main.temp) + '°C';
    // etc.

    // Show the card
    document.getElementById('weather-card').style.display = 'block';
}

// ============================================
// STEP 3: Main handler — wires it all together
// ============================================

async function handleSearch() {
    const city   = document.getElementById('city-input').value.trim();
    const apiKey = document.getElementById('api-key').value.trim();

    // TODO: Validate inputs — show error if empty
    if (!city) {
        // show an error message
        return;
    }

    // Show loading, hide others
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-card').style.display = 'none';
    document.getElementById('error-msg').style.display = 'none';

    try {
        const data = await fetchWeather(city);
        displayWeather(data);
    } catch (err) {
        // TODO: Show the error message in the DOM
        document.getElementById('error-msg').textContent = err.message;
        document.getElementById('error-msg').style.display = 'block';
    } finally {
        // TODO: Always hide loading — this runs on success AND failure
        document.getElementById('loading').style.display = 'none';
    }
}

// ============================================
// STEP 4: Event listeners
// ============================================

document.getElementById('search-btn').addEventListener('click', handleSearch);

document.getElementById('city-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
});
```

---

## Phase 3: Milestone Checkpoints

Test these manually before moving on. Check the browser console after each.

### ✅ Milestone 1 — Data + Basic Add/Display

| Test | Pass? |
|---|---|
| Type a task → press Enter → task appears on screen | ☐ |
| `console.log(tasks)` shows array growing correctly | ☐ |
| Refreshing the page → tasks still there (localStorage working) | ☐ |
| **Weather:** Click Search → see raw JSON in console | ☐ |
| **Weather:** `data.current.temperature_2m` logs correctly | ☐ |

### ✅ Milestone 2 — Full Interactions

| Test | Pass? |
|---|---|
| Clicking checkbox marks task done (visual change visible) | ☐ |
| Clicking delete removes ONLY that task | ☐ |
| **Weather:** Temperature, city, description all appear in card | ☐ |
| **Weather:** Invalid city shows a friendly error (not a browser crash) | ☐ |
| **Weather:** Loading spinner shows during fetch, hides after | ☐ |

### ✅ Milestone 3 — Polish & Edge Cases

| Test | Pass? |
|---|---|
| Empty input → add button does nothing (no blank tasks) | ☐ |
| All / Active / Completed filters show correct tasks | ☐ |
| Task count updates correctly when tasks are completed | ☐ |
| **Weather:** Server error shows friendly message (not raw error) | ☐ |

---

## Reflection Questions (Write as Comments in Your Code)

```javascript
// 1. What was the hardest part? How did you solve it?

// 2. What would you do differently if you started over?

// 3. Which previous lesson's concept did you find most useful today?

// 4. What is one feature you'd add if you had more time?
```
