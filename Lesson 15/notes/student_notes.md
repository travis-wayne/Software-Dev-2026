# Student Notes — Lesson 15: JavaScript Project

## First: Why This Lesson Exists

Every lesson so far has given you isolated skills. Today you combine ALL of them to build something real. This is the step that makes you a developer — not just someone who knows syntax.

---

## Skills You Are Using Today (and Where They Came From)

| JavaScript skill | Where you learned it | How it's used today |
|:---|:---|:---|
| Variables, `const`/`let` | Lesson 10 | `let tasks = []`, `let filter = 'all'` |
| Control flow (`if`, `else`) | Lesson 11 | Input validation, filter logic |
| Functions | Lesson 11 | `addTask()`, `render()`, `deleteTask()` |
| `document.getElementById()` | Lesson 12 | Getting the input, the list, the buttons |
| `addEventListener()` | Lesson 12 | Listening for clicks, Enter key |
| `.textContent` / `createElement` | Lesson 12 | Building task items, showing weather data |
| Arrays: `.push()`, `.filter()`, `.map()` | Lesson 13 | Storing tasks, deleting, toggling completion |
| Objects: `{ id, text, completed }` | Lesson 13 | Each task is an object; weather data is an object |
| Destructuring, spread `{...t}` | Lesson 13 | Updating one task without mutating the array directly |
| `async/await` | Lesson 14 | `async function fetchWeather()` |
| `fetch()` + `response.json()` | Lesson 14 | Getting weather from the API (two awaits!) |
| `try/catch/finally` | Lesson 14 | Error handling + hiding spinner |
| `response.ok` check | Lesson 14 | Catching 404/401 errors from server |

> **Key insight:** You already know all of these separately. Today you're just combining them.

---

## The ONE Rule of Project-Based Learning

> **Plan first. Code second. Test constantly.**

Every feature should follow this loop:
1. Write a comment describing what you want to happen (pseudocode)
2. Write the smallest possible code to make it happen
3. Test it — use `console.log()` to verify the data looks right
4. Move to the next feature only when this one works

---

## Where to Start — Both Projects

### Step 0: HTML FIRST (always)
Before writing a single line of JavaScript, write the HTML skeleton. JS needs elements to exist before it can talk to them.

**Todo App Skeleton:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>To-Do App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>My Tasks</h1>

    <input type="text" id="task-input" placeholder="Add a task...">
    <button id="add-btn">Add</button>

    <p id="task-count"></p>
    <ul id="task-list"></ul>

    <script src="script.js"></script>
</body>
</html>
```

**Weather App Skeleton:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Weather App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Weather App</h1>

    <input type="text" id="city-input" placeholder="Enter city...">
    <button id="search-btn">Search</button>

    <div id="loading" style="display:none">Loading...</div>
    <div id="error-msg" style="display:none"></div>

    <div id="weather-card" style="display:none">
        <h2 id="w-city"></h2>
        <p id="w-temp"></p>
        <p id="w-desc"></p>
        <p id="w-humidity"></p>
        <p id="w-wind"></p>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

> **Why HTML first?** If you write `document.getElementById('task-input')` but there's no `<input id="task-input">` in the HTML, you get `null` — and your code crashes silently.

---

## 1. Project Architecture — To-Do List App

### The Core Loop (every state change follows this exact pattern)
```
1. User action (click/keydown)
   ↓
2. Update the tasks array (push/filter/map)
   ↓
3. Save to localStorage
   ↓
4. Call render() to rebuild the DOM from the array
```

### Start here — Make ONE thing work first

```javascript
// script.js — START HERE
// Step 1: Declare your data
let tasks = [];

// Step 2: Prove the input works BEFORE building the full feature
document.getElementById('add-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    console.log('Button clicked! Value:', input.value); // Test this FIRST
});
```

Only after the `console.log` proves the click is registering, replace it with the real `addTask()` logic.

### Core Functions — Build these in order

```javascript
// 1. ADD — push a new object into tasks
function addTask(text) {
    if (!text.trim()) return;                          // Guard: ignore empty input
    tasks.push({ id: Date.now(), text, completed: false });
    save();
    render();
}

// 2. SAVE — convert array to string and store it
function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 3. RENDER — clear the DOM, rebuild from array
function render() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';                               // Wipe old DOM

    tasks.forEach(task => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = task.text;                  // textContent not innerHTML!
        li.appendChild(span);
        list.appendChild(li);
    });

    // Update count
    const active = tasks.filter(t => !t.completed).length;
    document.getElementById('task-count').textContent = `${active} tasks left`;
}

// 4. TOGGLE — flip the completed state without mutating directly
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    save();
    render();
}

// 5. DELETE — filter out the task with this id
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save();
    render();
}

// 6. LOAD from localStorage on startup
tasks = JSON.parse(localStorage.getItem('tasks')) || [];
render();
```

### Event Delegation — How to Handle Dynamic Elements

```javascript
// ❌ WRONG — These buttons don't exist yet when the page loads
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteTask(id));
});

// ✅ CORRECT — Listen on the PARENT, which always exists
document.getElementById('task-list').addEventListener('click', e => {
    const id = Number(e.target.dataset.id);  // Note: dataset is always a string!

    if (e.target.classList.contains('delete-btn')) deleteTask(id);
    if (e.target.type === 'checkbox')              toggleTask(id);
});
```

---

## 2. Project Architecture — Weather App

### The Core Loop
```
1. User types city + clicks Search
   ↓
2. Show loading indicator
   ↓
3. await fetch(geo_url)       ← Step 1: City -> Lat/Lon
   ↓
4. await fetch(weather_url)   ← Step 2: Lat/Lon -> Weather
   ↓
5. await response.json()      ← Step 3: Parse the JSON body
   ↓
6. Update the DOM with the data
   ↓
7. finally: Hide loading indicator (always)
```

### Start here — Get the data in the console first

```javascript
// script.js — START HERE
document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    
    // 1. Get Coordinates
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    const { lat, lon } = geoData[0];

    // 2. Get Weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    console.log(data);  // ← READ THIS FIRST before writing displayWeather()
});
```

> **Why log first?** Open-Meteo returns a large object. Before you can extract `data.current.temperature_2m`, you need to SEE what shape the object is. Always log, then destructure.

### The Complete Async Function

```javascript
async function handleSearch() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) { showError('Please enter a city name'); return; }

    // Show loading, hide other states
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-card').style.display = 'none';
    document.getElementById('error-msg').style.display = 'none';

    try {
        // Step 1: Geocoding
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        if (geoData.length === 0) throw new Error("City not found");
        const { lat, lon } = geoData[0];

        // Step 2: Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        displayWeather(data);

    } catch (err) {
        document.getElementById('error-msg').textContent = err.message;
        document.getElementById('error-msg').style.display = 'block';
    } finally {
        document.getElementById('loading').style.display = 'none';  // ALWAYS hide
    }
}

document.getElementById('search-btn').addEventListener('click', handleSearch);
```

---

## 3. Key Patterns Reference

```javascript
// Add to array
arr.push({ id: Date.now(), text, done: false });

// Remove from array (by id)
arr = arr.filter(x => x.id !== id);

// Update one item (immutably)
arr = arr.map(x => x.id === id ? { ...x, done: true } : x);

// Save to localStorage
localStorage.setItem('key', JSON.stringify(arr));

// Load from localStorage (with fallback)
const arr = JSON.parse(localStorage.getItem('key')) || [];

// Two-step fetch
const res  = await fetch(url);
if (!res.ok) throw new Error(res.status);
const data = await res.json();
```

---

## 4. Debugging Checklist

Work through these **in order** when something isn't working:

- [ ] **Check the Console (F12)** — is there a red error? What line number?
- [ ] **Log your data** — `console.log(tasks)` after every mutation. Does the array look right?
- [ ] **Check the element exists** — `console.log(document.getElementById('my-id'))` — is it `null`?
- [ ] **Prove the event fires** — Put `console.log('event fired')` as the very FIRST line of your handler
- [ ] **Check ID types** — `e.target.dataset.id` is always a STRING. Compare with `Number()` or use `===` carefully
- [ ] **For fetch errors** — log `response.status` before calling `response.json()`

---

## 5. Common Mistakes That Confuse Beginners

| Mistake | Symptom | Fix |
|:---|:---|:---|
| `const data = fetch(url)` (no await) | `data` is a Promise, not JSON | Add `await` |
| `e.target.dataset.id === task.id` | Delete never works | `Number(e.target.dataset.id)` |
| Listener added before element exists | Nothing happens on click | Move `<script>` to bottom of `<body>` |
| No `response.ok` check | 404 doesn't show error | Always add `if (!response.ok) throw` |
| Mutating task object directly: `task.completed = true` | Might not trigger re-render | Use `.map()` and spread: `{...t, completed: true}` |
| Forgetting `render()` after state change | Array updated but screen doesn't change | Call `render()` after every mutation |
