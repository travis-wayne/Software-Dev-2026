// src/Quiz.jsx — Lesson 20: useState & useEffect Quiz
import { useState } from 'react'

const QUESTIONS = [
  {
    q: "Why can't you use a plain `let` variable instead of useState to make a component dynamic?",
    options: ["`let` variables are not allowed inside React components","React is not aware of plain variable changes — it won't re-render when the value changes","let variables reset to their initial value on every render","useState is faster than let"],
    answer: 1,
    explanation: "React re-renders a component only when it detects a state change through useState's setter function. Changing a plain let variable updates memory, but React has no way to detect it — so the UI never updates."
  },
  {
    q: "What does calling the setter function (e.g., setCount(5)) do?",
    options: ["Changes the variable directly and updates the DOM manually","Schedules a re-render of the component with the new value","Changes the value but does NOT trigger a re-render","Sends the new value to the parent component"],
    answer: 1,
    explanation: "Calling a setter tells React: 'this state has changed, please re-render this component'. React batches and schedules the re-render efficiently. The component function runs again with the new state value."
  },
  {
    q: "What is the initial value of score here? const [score, setScore] = useState(100)",
    options: ["undefined","0","100","null"],
    answer: 2,
    explanation: "The argument passed to useState() is the initial value. useState(100) means: 'create a state variable, start it at 100'. The first render always uses this initial value."
  },
  {
    q: "Which update correctly adds 'c' to the items array and triggers a re-render?",
    code: "const [items, setItems] = useState(['a', 'b']);",
    options: ["items.push('c');","setItems(items.push('c'));","setItems([...items, 'c']);","items = [...items, 'c'];"],
    answer: 2,
    explanation: "[...items, 'c'] creates a brand new array. React detects that the reference changed and re-renders. items.push() mutates the existing array — React can't detect this because the reference is the same."
  },
  {
    q: "What is a 'side effect' in the context of React?",
    options: ["A bug caused by poor state management","An operation that affects something outside the component's rendering (e.g., data fetch, DOM change, timer)","A prop passed from child to parent","Any function that returns JSX"],
    answer: 1,
    explanation: "React's render function should be pure — no fetching, no timers, no subscriptions. Any operation that reaches 'outside' the component (network, DOM, system) is a side effect. useEffect is the designated place to run them safely."
  },
  {
    q: "When does this useEffect run?\nuseEffect(() => { console.log('hello'); }, []);",
    options: ["After every render","Before the component mounts","Once, after the component first mounts","Whenever the component unmounts"],
    answer: 2,
    explanation: "An empty dependency array [] means 'run this once, after the first render (mount)'. React sees no dependencies to watch, so it never re-runs the effect again. Perfect for one-time setup like event listeners or initial data fetches."
  },
  {
    q: "When does this useEffect run?\nuseEffect(() => { fetchData(); }, [userId]);",
    options: ["Once only, on first mount","After every render, always","Once on mount, and again whenever userId changes","Only when userId is null"],
    answer: 2,
    explanation: "[userId] in the dependency array tells React: 'watch this value. Re-run the effect whenever it changes'. This is the standard pattern for fetching data that depends on a prop or state variable."
  },
  {
    q: "Why should you return a cleanup function from useEffect?",
    options: ["To reset state to its initial value","To stop ongoing side effects (timers, subscriptions) before the component unmounts or effect re-runs","To trigger a re-render after the effect completes","It is required for every useEffect"],
    answer: 1,
    explanation: "Without cleanup, timers keep ticking and subscriptions keep firing even after the component is gone — causing memory leaks and 'setState on unmounted component' errors. The cleanup function is React's garbage collection for side effects."
  },
  {
    q: "Which form of setCount is safest when the new state depends on the previous value?",
    options: ["setCount(count + 1) — uses the current count variable","setCount(prev => prev + 1) — uses the latest state value","count = count + 1 — direct mutation","setCount(0) then re-increment"],
    answer: 1,
    explanation: "setCount(count + 1) captures 'count' in a closure. If React batches multiple state updates or if the effect runs with a stale closure, 'count' might be outdated. The functional form prev => prev + 1 always receives the guaranteed latest value."
  },
  {
    q: "What would happen with this code?\nuseEffect(() => { setCount(count + 1); }, [count]);",
    options: ["count increments once and stops","Nothing happens","Infinite loop — every state update triggers the effect, which updates state again","A React error is thrown immediately"],
    answer: 2,
    explanation: "This is the classic useEffect infinite loop: setCount updates count → count is in [count] dependency → effect re-runs → setCount updates count again → forever. Never put a state variable in the dependency array if the effect directly updates that same variable."
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
    <div className="quiz-results">
      <div className={`score-ring ${ringCls}`}>
        <span className="score-num">{score}/{QUESTIONS.length}</span>
        <span className="score-pct">{pct}%</span>
      </div>
      <h2 className="results-msg">{pct>=80?'🎉 Hooks master!':pct>=50?'👍 Good effort!':'📖 Keep studying!'}</h2>
      <p className="results-sub">Lesson 20 — useState & useEffect</p>
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
    <div className="quiz-card">
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
