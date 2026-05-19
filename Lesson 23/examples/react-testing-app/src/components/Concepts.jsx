import React from 'react';

const PYRAMID = [
  {
    id: 'e2e',
    label: 'E2E Tests',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.3)',
    badge: 'Slowest · Fewest',
    desc: 'Simulates a real user opening a browser and clicking through the entire application — from login to checkout. Tools: Playwright, Cypress.',
    example: '// A user can log in and purchase an item',
    width: '60%',
  },
  {
    id: 'component',
    label: 'Component Tests',
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.3)',
    badge: 'Medium Speed',
    desc: 'Renders a single React component in isolation and verifies how it looks and responds to user interaction. Tools: React Testing Library.',
    example: '// The <Button> shows "Loading..." when clicked',
    width: '75%',
  },
  {
    id: 'unit',
    label: 'Unit Tests',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.3)',
    badge: 'Fastest · Most',
    desc: 'Tests the smallest possible piece of logic (a single function) in complete isolation. No browser, no React. Tools: Vitest / Jest.',
    example: '// add(2, 3) should return 5',
    width: '100%',
  },
];

const CONCEPTS = [
  {
    icon: '🧩',
    title: 'Vitest / Jest',
    color: '#a78bfa',
    points: [
      '`describe()` — Groups related tests together into a suite.',
      '`it()` / `test()` — Defines one individual test case.',
      '`expect()` — Makes an assertion (the actual check).',
      'Vitest is a Vite-native Jest replacement — same API, much faster.',
    ],
  },
  {
    icon: '🎭',
    title: 'React Testing Library',
    color: '#34d399',
    points: [
      '`render(<Component />)` — Renders into a virtual DOM (jsdom).',
      '`screen.getByText()` — Finds elements by their visible text.',
      '`screen.getByRole()` — Finds elements by their accessible role (button, heading).',
      '`userEvent.click()` — Simulates real user interaction (async!).',
    ],
  },
  {
    icon: '📐',
    title: 'The AAA Pattern',
    color: '#f59e0b',
    points: [
      '**Arrange** — Set up your test data and state.',
      '**Act** — Call the function or render the component.',
      '**Assert** — Use `expect()` to verify the result.',
      'Every test you write should follow this structure.',
    ],
  },
];

export default function Concepts() {
  return (
    <div className="concepts-page fade-in">

      {/* Testing Pyramid */}
      <section className="concept-section">
        <h2 className="section-title">The Testing Pyramid</h2>
        <p className="section-sub">
          Not all tests are equal. The pyramid shows the ideal balance: <strong>many fast unit tests</strong> at the base,
          and <strong>fewer slow E2E tests</strong> at the top.
        </p>
        <div className="pyramid-container">
          {PYRAMID.map(level => (
            <div
              key={level.id}
              className="pyramid-level"
              style={{ width: level.width }}
            >
              <div
                className="pyramid-block"
                style={{ background: level.bgColor, border: `1px solid ${level.border}` }}
              >
                <div className="pyramid-block-left">
                  <span className="pyramid-label" style={{ color: level.color }}>{level.label}</span>
                  <span className="pyramid-badge" style={{ background: level.bgColor, color: level.color, borderColor: level.border }}>{level.badge}</span>
                </div>
                <p className="pyramid-desc">{level.desc}</p>
              </div>
              <div className="pyramid-example">
                <code>{level.example}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key concepts */}
      <section className="concept-section">
        <h2 className="section-title">Key Tools & Concepts</h2>
        <div className="concept-cards">
          {CONCEPTS.map(c => (
            <div key={c.title} className="concept-card" style={{ '--accent': c.color }}>
              <div className="concept-card-icon">{c.icon}</div>
              <h3 className="concept-card-title" style={{ color: c.color }}>{c.title}</h3>
              <ul className="concept-card-list">
                {c.points.map((pt, i) => (
                  <li key={i} dangerouslySetInnerHTML={{
                    __html: pt.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  }} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* RTL golden rule */}
      <section className="golden-rule">
        <div className="golden-rule-icon">💡</div>
        <blockquote className="golden-rule-quote">
          "The more your tests resemble the way your software is used, the more confidence they can give you."
        </blockquote>
        <p className="golden-rule-author">— Kent C. Dodds, Creator of React Testing Library</p>
        <p className="golden-rule-explain">
          This is why we use <code>screen.getByText('Submit')</code> instead of <code>component.state.isSubmitting</code>.
          Tests should verify what users <em>see</em>, not how the code works internally.
        </p>
      </section>

    </div>
  );
}
