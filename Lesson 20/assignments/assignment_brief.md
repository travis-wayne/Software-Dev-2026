# Assignment Brief — Lesson 20: State Management (useState, useEffect)

## Setup
All tasks should be built inside your existing React project. Create one new file per task (e.g. `ContactForm.jsx`, `TitleTracker.jsx`, `PostBrowser.jsx`). Import and render each from `App.jsx` to test.

---

## Task 1: Controlled Contact Form

Build a contact form component that uses `useState` to track all input values. The form should display the values **live** as the user types — before any submission.

**Requirements:**
- Three `useState` variables: `name` (string), `email` (string), `message` (string)
- Three inputs (text, email, textarea) — all **controlled** (value from state, onChange updates state)
- A live preview section below the form showing the current values
- A "Character count" for the message that turns **red** if over 200 characters
- A submit handler that prevents default form submission and logs the values to the console

```jsx
function ContactForm() {
    // TODO: useState for name, email, message

    function handleSubmit(e) {
        e.preventDefault();
        // TODO: Log { name, email, message } to the console
        // TODO: Reset all three state variables to empty strings
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* TODO: Name input */}
            {/* TODO: Email input */}
            {/* TODO: Message textarea */}
            {/* TODO: Character count (red if > 200) */}
            <button type="submit">Send</button>

            {/* TODO: Live preview section */}
            <div>
                <h3>Preview:</h3>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Message: {message}</p>
            </div>
        </form>
    );
}
```

**Analysis (required):**
```
// Why does each input need both `value={...}` and `onChange={...}`?
// Answer: _________________________________________________

// What is the React term for this input pattern?
// Answer: _________________________________________________

// Time Complexity of the onChange handler: O(___)
// Reason: _________________________________________________
```

---

## Task 2: Document Title Tracker

Build a component that syncs the browser tab title with component state using `useEffect`.

**Requirements:**
- Two `useState` variables: `page` (string, one of `'home'|'about'|'contact'`) and `username` (string)
- A `useEffect` that updates `document.title` whenever `page` or `username` changes
- Format: `"{Page} | {username || 'Guest'} — MyApp"` (e.g. `"Home | Travis — MyApp"`)
- Three navigation buttons to switch pages
- A username input that updates live

```jsx
function TitleTracker() {
    const [page, setPage]         = useState('home');
    const [username, setUsername] = useState('');

    useEffect(() => {
        // TODO: Set document.title based on page and username
    }, [/* TODO: what are the dependencies? */]);

    return (
        <div>
            <div>
                <button onClick={() => setPage('home')}>Home</button>
                <button onClick={() => setPage('about')}>About</button>
                <button onClick={() => setPage('contact')}>Contact</button>
            </div>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name..."
            />
            <p>Current page: <strong>{page}</strong></p>
        </div>
    );

    // Don't forget: restore the title on unmount!
    // useEffect cleanup: return () => { document.title = 'MyApp'; }
}
```

**Analysis (required):**
```
// What goes in the dependency array and why?
// Answer: _________________________________________________

// What would happen if you wrote useEffect(() => { ... }) with NO dependency array?
// Answer: _________________________________________________

// Why should you restore document.title in the cleanup function?
// Answer: _________________________________________________
```

---

## Task 3: Post Browser (Data Fetching)

Build a component that fetches posts from a public API and lets the user browse them by ID.

**Requirements:**
- Three state variables: `postId` (number, starting at 1), `post` (object, starting null), `status` (`'loading' | 'success' | 'error'`)
- A `useEffect` that fetches from `https://jsonplaceholder.typicode.com/posts/{postId}` whenever `postId` changes
- "Previous" / "Next" buttons to change `postId` (clamp between 1 and 100)
- Three distinct UI states: a spinner/loading text, the post content, and an error message
- Display: post `id`, `title`, and `body`

```jsx
function PostBrowser() {
    const [postId, setPostId] = useState(1);
    const [post, setPost]     = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        setStatus('loading');
        // TODO: fetch the post
        // On success: setPost(data), setStatus('success')
        // On error: setStatus('error')
    }, [postId]);

    // TODO: Render based on status
    // 'loading' → <p>Loading post #{postId}...</p>
    // 'error'   → <p style red>Failed to load post.</p>
    // 'success' → show post.id, post.title, post.body

    return (
        <div>
            <button onClick={() => setPostId(id => Math.max(1, id - 1))}>← Previous</button>
            <span> Post #{postId} </span>
            <button onClick={() => setPostId(id => Math.min(100, id + 1))}>Next →</button>
            {/* TODO: conditional render here */}
        </div>
    );
}
```

**Analysis (required):**
```
// Why do we use setPostId(id => Math.max(1, id - 1)) instead of setPostId(postId - 1)?
// Answer: _________________________________________________

// The buttons use functional updates (prev => ...). When is this important?
// Answer: _________________________________________________

// What is the Big O of the fetch operation as postId grows from 1 to 100?
// Answer: _________________________________________________
```

---

## Task 4 (Bonus): AbortController — Cancel In-Flight Requests

When `postId` changes quickly (e.g. user clicks Next rapidly), older fetch requests may complete after newer ones, showing stale data. Fix this using `AbortController`.

```jsx
useEffect(() => {
    const controller = new AbortController(); // Create a cancel token
    setStatus('loading');

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        signal: controller.signal // Pass it to fetch
    })
        .then(res => res.json())
        .then(data => { setPost(data); setStatus('success'); })
        .catch(err => {
            if (err.name === 'AbortError') return; // Ignore cancelled requests
            setStatus('error');
        });

    return () => controller.abort(); // Cancel the request on cleanup
}, [postId]);
```

**Task:** Add this to your Task 3 component. Test by clicking Next rapidly — open the Network tab and observe that earlier requests are cancelled.

```
// What does controller.abort() do?
// Answer: _________________________________________________

// Why do we check err.name === 'AbortError' in the catch block?
// Answer: _________________________________________________
```

---

## Submission Checklist

- [ ] `ContactForm`: 3 controlled inputs, live preview, character count warning, submit resets form
- [ ] `ContactForm`: Analysis questions answered
- [ ] `TitleTracker`: `document.title` updates with page and username, cleanup on unmount
- [ ] `TitleTracker`: Analysis questions answered
- [ ] `PostBrowser`: fetch on `postId` change, loading/error/success states, clamped navigation
- [ ] `PostBrowser`: Analysis questions answered
- [ ] **Bonus:** AbortController cleanup, explanation questions answered
- [ ] All components in separate files, imported and rendered in `App.jsx`
- [ ] Code pushed to GitHub
