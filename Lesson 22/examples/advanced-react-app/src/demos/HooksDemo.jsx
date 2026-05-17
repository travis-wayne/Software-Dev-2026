// src/demos/HooksDemo.jsx
import { useToggle } from '../hooks/useToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function HooksDemo() {
  return (
    <div className="demo-container">
      <h2>🪝 Custom Hooks</h2>
      <p className="demo-desc">
        Custom hooks let us extract repetitive stateful logic into reusable functions.
        They must always start with the word <code>use</code>.
        The most important rule: custom hooks share <strong>logic</strong>, not <strong>state</strong>.
      </p>

      {/* Demo 1: useToggle — CRITICAL: render TWO instances to prove independent state */}
      <section style={{marginBottom: '2.5rem'}}>
        <h3 style={{marginBottom: '0.5rem'}}>1. <code>useToggle</code> — Shared Logic, Independent State</h3>
        <p className="demo-desc" style={{marginBottom: '1rem'}}>
          Both cards below use the exact same <code>useToggle</code> hook — but toggling one doesn't affect the other.
          This proves each component call gets its own <em>independent</em> state.
        </p>
        <div className="hooks-grid">
          <SpoilerAlert
            question="What is the virtual DOM?"
            answer="A lightweight JavaScript copy of the real DOM. React uses it to calculate the minimum number of changes needed before updating the actual browser DOM."
          />
          <SpoilerAlert
            question="What does 'declarative' mean in React?"
            answer="You describe what the UI should look like for the current state, and React figures out how to update the DOM to match. You never write step-by-step DOM manipulation."
          />
        </div>
      </section>

      {/* Demo 2: useLocalStorage */}
      <section>
        <h3 style={{marginBottom: '0.5rem'}}>2. <code>useLocalStorage</code> — Persisting Beyond Refresh</h3>
        <p className="demo-desc" style={{marginBottom: '1rem'}}>
          This hook wraps <code>useState</code> + <code>useEffect</code> to automatically sync state
          with the browser's <code>localStorage</code>. The value survives a page refresh.
        </p>
        <div className="hooks-grid">
          <LocalStorageDemo />
          <HookSourceViewer />
        </div>
      </section>
    </div>
  );
}

// A reusable spoiler card — used TWICE to demonstrate independent state
function SpoilerAlert({ question, answer }) {
  const [isRevealed, toggleRevealed] = useToggle(false);

  return (
    <div className="hook-card">
      <div className="spoiler-box">
        <strong>{question}</strong>
        {isRevealed ? (
          <p className="answer fade-in">{answer}</p>
        ) : (
          <div className="hidden-answer">▓▓▓▓▓▓▓▓▓▓▓▓ (click to reveal)</div>
        )}
      </div>

      <button className="btn btn-secondary mt-3" onClick={toggleRevealed}>
        {isRevealed ? '🙈 Hide Answer' : '👁 Reveal Answer'}
      </button>
    </div>
  );
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('demo_name', 'Travis');

  return (
    <div className="hook-card">
      <h4 style={{marginBottom:'0.25rem'}}>Try it: Type & Refresh</h4>
      <p className="hook-desc">Edit the name, then press F5 (refresh). The value persists!</p>

      <div className="mt-3">
        <label className="block mb-2 text-sm font-semibold text-muted">
          Your name:
        </label>
        <input
          type="text"
          className="hook-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <p className="mt-3">
        Saved to <code>localStorage</code>: <strong className="text-primary">"{name}"</strong>
      </p>
    </div>
  );
}

// Shows the source code of the useLocalStorage hook to students
function HookSourceViewer() {
  return (
    <div className="hook-card">
      <h4 style={{marginBottom:'0.5rem'}}>Inside <code>useLocalStorage</code>:</h4>
      <pre style={{
        background:'#000', padding:'0.75rem', borderRadius:'6px',
        fontSize:'0.75rem', color:'#a5b4fc', overflow:'auto',
        lineHeight: 1.6
      }}>{`function useLocalStorage(key, initialValue) {
  // Read from localStorage on first render only
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}`}</pre>
    </div>
  );
}
