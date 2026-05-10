// src/Quiz.jsx — Lesson 19: React Components & Props Quiz
import { useState } from 'react'

const QUESTIONS = [
  {
    q: "In React, what is a Component?",
    options: ["A CSS class that styles an element","A JavaScript function that returns JSX","An HTML file that contains JavaScript","A global variable that holds app state"],
    answer: 1,
    explanation: "A React component is just a JavaScript function that returns JSX. That's it — no magic! The function name must start with a capital letter so React can tell it apart from regular HTML tags."
  },
  {
    q: "Which component name is valid in React?",
    options: ["function myButton() { ... }","function MyButton() { ... }","function my-button() { ... }","function 1Button() { ... }"],
    answer: 1,
    explanation: "React component names MUST start with a capital letter. This tells React to treat it as a component, not a built-in HTML tag. 'myButton' would be treated as an unknown HTML tag."
  },
  {
    q: "What is JSX?",
    options: ["A new programming language that replaces JavaScript","A special React feature that makes components faster","A syntax extension for JavaScript that lets you write HTML-like code within JS","A version of HTML5"],
    answer: 2,
    explanation: "JSX is just a syntax extension — it looks like HTML but it's actually JavaScript. Babel/Vite transforms it into regular React.createElement() calls under the hood."
  },
  {
    q: "Why do we write className instead of class in JSX?",
    options: ["React invented its own attribute names","class is a reserved keyword in JavaScript, so JSX uses className to avoid conflicts","class is deprecated in HTML5","It's just a convention — class also works"],
    answer: 1,
    explanation: "JSX compiles to JavaScript. 'class' is a reserved keyword in JavaScript (used for ES6 classes). To avoid the conflict, JSX uses 'className'. Same reason: 'for' → 'htmlFor'."
  },
  {
    q: 'What does this render? <h1>Hello, name!</h1> where name = "Alex"',
    code: `const name = "Alex";\nreturn <h1>Hello, name!</h1>;`,
    options: ["Hello, Alex!","Hello, name! (the literal string \"name\")","A blank screen","An error"],
    answer: 1,
    explanation: "Without curly braces {}, JSX treats 'name' as plain text — it renders the literal string 'name'. You need {name} to inject the JavaScript variable value."
  },
  {
    q: "A parent renders <UserCard name=\"Travis\" age={25} />. How does UserCard receive these values?",
    options: ["Through a global variable called data","Through the this keyword","As a single JavaScript object called props passed as the first argument","Through localStorage"],
    answer: 2,
    explanation: "React bundles ALL the attributes you pass into one object called props and passes it as the first argument to the component function. So props = { name: 'Travis', age: 25 }."
  },
  {
    q: "Which JSX is correct?",
    options: ['<img src="logo.png">','<img src="logo.png" />','<IMG src="logo.png" />','<image src="logo.png" />'],
    answer: 1,
    explanation: "In JSX, ALL tags must be closed — either with a closing tag or self-closing slash. <img> is a void element in HTML but in JSX it must be <img />. Tags are also case-sensitive — always lowercase for HTML elements."
  },
  {
    q: "A component returns two sibling elements without a parent wrapper. What happens?",
    code: `function App() {\n  return (\n    <h1>Title</h1>\n    <p>Body</p>\n  );\n}`,
    options: ["Both elements render correctly","Only the h1 renders","A syntax error — JSX must return a single root element","The p renders on top of the h1"],
    answer: 2,
    explanation: "JSX can only return ONE root element. Wrap siblings in a <div> or a React Fragment <></> to fix this. Fragments are preferred when you don't want an extra DOM node."
  },
  {
    q: "Inside a Button component, a developer writes: props.text = 'Loading'. What happens?",
    options: ["The button text changes to Loading","It causes a runtime TypeError — props are read-only","The parent component re-renders","Nothing — React silently ignores it"],
    answer: 1,
    explanation: "Props are immutable (read-only). React enforces this by freezing the props object in development. If a component needs to change data, it must use State — not mutate props."
  },
  {
    q: "What does 'declarative' programming mean in the context of React?",
    options: ["You write step-by-step DOM instructions telling the browser exactly how to build the UI","You describe what the UI should look like for the current data, and React handles DOM updates","You declare all variables at the top of the file","You use document.createElement and React renders them"],
    answer: 1,
    explanation: "Declarative = describe the WHAT (the desired output), not the HOW (the step-by-step process). React takes your JSX description and figures out the most efficient way to update the actual DOM."
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

  function selectOpt(oi) {
    if (isChecked) return
    const next = [...selected]; next[current] = oi; setSelected(next)
  }

  function checkAnswer() {
    const next = [...checked]; next[current] = true; setChecked(next)
  }

  function nextQ() {
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1)
    else setShowResults(true)
  }

  function restart() {
    setCurrent(0); setSelected(Array(QUESTIONS.length).fill(null))
    setChecked(Array(QUESTIONS.length).fill(false)); setShowResults(false)
  }

  const ringClass = pct >= 80 ? 'ring-great' : pct >= 50 ? 'ring-ok' : 'ring-poor'

  if (showResults) {
    return (
      <div className="quiz-results">
        <div className={`score-ring ${ringClass}`}>
          <span className="score-num">{score}/{QUESTIONS.length}</span>
          <span className="score-pct">{pct}%</span>
        </div>
        <h2 className="results-msg">
          {pct >= 80 ? '🎉 Excellent work!' : pct >= 50 ? '👍 Good effort!' : '📖 Keep studying!'}
        </h2>
        <p className="results-sub">Lesson 19 — React Components & Props</p>
        <button className="quiz-btn quiz-btn-primary" onClick={restart}>↩ Retake Quiz</button>

        <div className="review-list">
          {QUESTIONS.map((q, i) => {
            const ok = selected[i] === q.answer
            return (
              <div key={i} className={`review-item ${ok ? 'r-ok' : 'r-wrong'}`}>
                <p className="review-q">{i+1}. {q.q}</p>
                <p className="review-a">
                  Your answer: <span className={ok ? 'ans-ok' : 'ans-wrong'}>
                    {selected[i] !== null ? `${['A','B','C','D'][selected[i]]}) ${q.options[selected[i]]}` : 'Not answered'}
                  </span>
                  {!ok && <><br/>Correct: <span className="ans-ok">{['A','B','C','D'][q.answer]}) {q.options[q.answer]}</span></>}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-card">
      {/* Progress */}
      <div className="quiz-progress-label">Question {current+1} of {QUESTIONS.length}</div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{width:`${((current+1)/QUESTIONS.length)*100}%`}} />
      </div>

      {/* Question */}
      <div className="quiz-q-text">{q.q}</div>
      {q.code && <pre className="quiz-code">{q.code}</pre>}

      {/* Options */}
      <div className="quiz-options">
        {q.options.map((opt, oi) => {
          let cls = 'quiz-option'
          if (isChecked) {
            if (oi === q.answer) cls += ' q-correct'
            else if (oi === selected[current] && selected[current] !== q.answer) cls += ' q-wrong'
          } else if (selected[current] === oi) {
            cls += ' q-selected'
          }
          return (
            <div key={oi} className={cls} onClick={() => selectOpt(oi)}>
              <span className="q-key">{['A','B','C','D'][oi]}</span>
              <span>{opt}</span>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {isChecked && <div className="quiz-explanation">{q.explanation}</div>}

      {/* Actions */}
      <div className="quiz-btn-row">
        {!isChecked
          ? <button className="quiz-btn quiz-btn-primary" disabled={selected[current] === null} onClick={checkAnswer}>Check Answer</button>
          : <button className="quiz-btn quiz-btn-next" onClick={nextQ}>
              {current < QUESTIONS.length - 1 ? 'Next →' : 'See Results 🎉'}
            </button>
        }
      </div>
    </div>
  )
}
