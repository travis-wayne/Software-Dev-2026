// src/Quiz.jsx — Lesson 21: React Router Quiz
import { useState } from 'react'

const QUESTIONS = [
  {
    q: "What is the primary advantage of a Single Page Application (SPA)?",
    options: ["It uses a single database table","It prevents the browser from reloading the entire page when navigating, making the app feel much faster","It requires less JavaScript code to be written","It runs faster on the server"],
    answer: 1,
    explanation: "In an SPA, the initial HTML is loaded once. After that, client-side routing (like React Router) intercepts navigation clicks, updates the URL, and swaps React components directly in the DOM without requesting a new HTML page from the server."
  },
  {
    q: "Which component must wrap your entire application to enable React Router?",
    options: ["<Routes>","<Route>","<BrowserRouter>","<RouterApp>"],
    answer: 2,
    explanation: "<BrowserRouter> provides the routing context to the rest of your app and connects to the browser's History API so the URL bar stays in sync."
  },
  {
    q: "What does the <Routes> component do?",
    options: ["It renders all of its child <Route> components simultaneously","It looks at the current URL and renders ONLY the first child <Route> that matches","It sends a request to the server to fetch the route data","It creates a navigation menu"],
    answer: 1,
    explanation: "<Routes> acts like a switch statement. It examines the current browser URL, scans its list of child <Route> elements, and renders the element of the one that matches."
  },
  {
    q: "Why is it dangerous to use a standard <a href=\"/about\"> tag for internal navigation in a React app?",
    options: ["It is not dangerous, it is the recommended way","It will cause a full browser reload, wiping out all React state (like login status or cart items)","React Router will throw an error and crash the app","It is slower than using <button>"],
    answer: 1,
    explanation: "A standard anchor tag tells the browser to navigate to a new page, completely refreshing the window. You must use React Router's <Link> or <NavLink> instead to maintain the SPA experience and preserve state."
  },
  {
    q: "What is the difference between <Link> and <NavLink>?",
    options: ["<NavLink> is used for external websites, <Link> is for internal routes","<Link> causes a page reload, <NavLink> does not","<NavLink> knows when its route is active, making it easy to style the current page in a navigation bar","There is no difference, they are aliases"],
    answer: 2,
    explanation: "<NavLink> provides an `isActive` property to its className or style props, allowing you to highlight the link when the user is currently on that route."
  },
  {
    q: "How do you define a dynamic route for a user profile where the ID changes?",
    options: ["<Route path=\"/users/*\" element={<UserProfile />} />","<Route path=\"/users/:id\" element={<UserProfile />} />","<Route dynamic=\"/users\" element={<UserProfile />} />","<Route path=\"/users/[id]\" element={<UserProfile />} />"],
    answer: 1,
    explanation: "The colon `:` tells React Router that `id` is a dynamic URL parameter. It will match `/users/123`, `/users/abc`, etc."
  },
  {
    q: "Which hook do you use inside a component to read the value of a dynamic URL parameter (like the `:id`)?",
    options: ["useUrl()","useRoute()","useLocation()","useParams()"],
    answer: 3,
    explanation: "The `useParams()` hook returns an object of key/value pairs of the dynamic params from the current URL that were matched by the `<Route path>`."
  },
  {
    q: "If the route is <Route path=\"/products/:productId\" /> and the URL is /products/99, what does useParams() return?",
    options: ["{ id: 99 }","{ productId: '99' }","99","['products', '99']"],
    answer: 1,
    explanation: "useParams returns an object where the keys match the parameter names defined in the path (with the colon removed), and the values are the strings from the URL."
  },
  {
    q: "How do you create a 'Catch-All' or 404 Not Found route?",
    options: ["<Route path=\"404\" element={<NotFound />} />","<Route catchAll element={<NotFound />} />","<Route path=\"*\" element={<NotFound />} />","<Route error element={<NotFound />} />"],
    answer: 2,
    explanation: "The asterisk `*` acts as a wildcard that matches anything. Placed at the bottom of your `<Routes>`, it catches any URL that didn't match the routes above it."
  },
  {
    q: "Which hook allows you to navigate to a new route programmatically (e.g., inside an onClick handler after a form submission)?",
    options: ["useNavigate()","useLink()","useRedirect()","useHistory()"],
    answer: 0,
    explanation: "`useNavigate()` returns a function that lets you navigate programmatically. E.g., `const navigate = useNavigate(); navigate('/home');`"
  }
]

export default function Quiz() {
  const [current, setCurrent]   = useState(0)
  const [selected, setSelected] = useState(Array(QUESTIONS.length).fill(null))
  const [checked,  setChecked]  = useState(Array(QUESTIONS.length).fill(false))
  const [showResults, setShowResults] = useState(false)

  const q = QUESTIONS[current]
  const isChecked = checked[current]
  const score = QUESTIONS.reduce((acc, q, i) => acc + (checked[i] && selected[i] === q.answer ? 1 : 0), 0)
  const pct = Math.round(score / QUESTIONS.length * 100)

  function selectOpt(oi) { if (isChecked) return; const n=[...selected];n[current]=oi;setSelected(n) }
  function checkAnswer() { const n=[...checked];n[current]=true;setChecked(n) }
  function nextQ() { if(current<QUESTIONS.length-1) setCurrent(c=>c+1); else setShowResults(true) }
  function restart() { setCurrent(0);setSelected(Array(QUESTIONS.length).fill(null));setChecked(Array(QUESTIONS.length).fill(false));setShowResults(false) }

  const ringCls = pct>=80?'ring-great':pct>=50?'ring-ok':'ring-poor'

  if (showResults) return (
    <div className="quiz-results fade-in">
      <div className={`score-ring ${ringCls}`}>
        <span className="score-num">{score}/{QUESTIONS.length}</span>
        <span className="score-pct">{pct}%</span>
      </div>
      <h2 className="results-msg">{pct>=80?'🎉 Routing Master!':pct>=50?'👍 Good effort!':'📖 Keep studying!'}</h2>
      <p className="results-sub">Lesson 21 — React Router</p>
      <button className="quiz-btn quiz-btn-primary" onClick={restart}>↩ Retake Quiz</button>
      <div className="review-list">
        {QUESTIONS.map((q, i) => {
          const ok = selected[i] === q.answer
          return (
            <div key={i} className={`review-item ${ok?'r-ok':'r-wrong'}`}>
              <p className="review-q">{i+1}. {q.q}</p>
              <p className="review-a">
                Your answer: <span className={ok?'ans-ok':'ans-wrong'}>
                  {selected[i]!==null ? `${['A','B','C','D'][selected[i]]}) ${q.options[selected[i]]}` : 'Not answered'}
                </span>
                {!ok && <><br/>Correct: <span className="ans-ok">{['A','B','C','D'][q.answer]}) {q.options[q.answer]}</span></>}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="quiz-card fade-in">
      <div className="quiz-progress-label">Question {current+1} of {QUESTIONS.length}</div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{width:`${((current+1)/QUESTIONS.length)*100}%`}} />
      </div>

      <div className="quiz-q-text" style={{whiteSpace:'pre-line'}}>{q.q}</div>
      {q.code && <pre className="quiz-code">{q.code}</pre>}

      <div className="quiz-options">
        {q.options.map((opt, oi) => {
          let cls = 'quiz-option'
          if(isChecked){
            if(oi===q.answer) cls+=' q-correct'
            else if(oi===selected[current]&&selected[current]!==q.answer) cls+=' q-wrong'
          } else if(selected[current]===oi) cls+=' q-selected'
          return (
            <div key={oi} className={cls} onClick={()=>selectOpt(oi)}>
              <span className="q-key">{['A','B','C','D'][oi]}</span>
              <span>{opt}</span>
            </div>
          )
        })}
      </div>

      {isChecked && <div className="quiz-explanation">{q.explanation}</div>}

      <div className="quiz-btn-row">
        {!isChecked
          ? <button className="quiz-btn quiz-btn-primary" disabled={selected[current]===null} onClick={checkAnswer}>Check Answer</button>
          : <button className="quiz-btn quiz-btn-next" onClick={nextQ}>{current<QUESTIONS.length-1?'Next →':'See Results 🎉'}</button>
        }
      </div>
    </div>
  )
}
