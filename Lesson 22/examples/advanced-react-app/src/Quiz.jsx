// src/Quiz.jsx
import { useState } from 'react';

const QUESTIONS = [
  {
    q: "What is 'Prop Drilling' in React?",
    options: ["Using the context API excessively","Passing props down through multiple layers of components that don't need them, just to reach a deeply nested component","Creating a custom hook to manage state","A performance optimization technique"],
    answer: 1,
    explanation: "Prop drilling is the process of passing data from a parent component down to a deeply nested child component, through intermediate components that don't actually need the data themselves."
  },
  {
    q: "Which of the following is NOT a core part of the Context API?",
    options: ["createContext","Context.Provider","useContext","createReducer"],
    answer: 3,
    explanation: "createReducer is related to the useReducer hook, not Context. The Context API relies on createContext to initialize, Provider to broadcast, and useContext to consume the data."
  },
  {
    q: "When should you reach for the Context API instead of standard props?",
    options: ["For every single piece of state in your application to avoid passing any props","Only when data is considered 'global' and needs to be accessed by many different components at various nesting levels (e.g., Theme, Current User)","When you want to make your app run faster","When a component is only 1 level deep"],
    answer: 1,
    explanation: "Context is designed to share data that can be considered 'global' for a tree of React components. Overusing it for local state makes component reuse difficult."
  },
  {
    q: "What happens to components using `useContext(MyContext)` when the Provider's value changes?",
    options: ["Nothing, you have to manually trigger a re-render","Only the components that actually read the specific changed property will re-render","ALL components calling useContext(MyContext) will immediately re-render","The app crashes if not wrapped in useMemo"],
    answer: 2,
    explanation: "Any component that calls useContext will always re-render when the context value changes. This is why you shouldn't put rapidly changing, unrelated data into a single massive context."
  },
  {
    q: "What is a Custom Hook in React?",
    options: ["A new feature added in React 18 for server components","A built-in method on the React object","A plain JavaScript function whose name starts with 'use' and that calls other Hooks inside it","A special class component"],
    answer: 2,
    explanation: "Custom hooks are a convention, not a feature. They are just normal JS functions. However, naming them starting with 'use' allows React's linter to verify you are following the Rules of Hooks."
  },
  {
    q: "What is the primary benefit of creating a Custom Hook?",
    options: ["It makes the application render faster","It allows you to extract and reuse stateful logic across multiple components without duplicating code","It replaces the need for the Context API","It allows you to use state in Class components"],
    answer: 1,
    explanation: "Custom hooks let you bundle up complex logic (like fetching data, subscribing to a service, or managing local storage) into a reusable function."
  },
  {
    q: "If Component A and Component B both call `useToggle(false)`, do they share the same boolean state?",
    options: ["Yes, custom hooks create global state","No, each call to a hook gets its own completely independent state","Only if they are wrapped in a Provider","Yes, but only if they are rendered at the same time"],
    answer: 1,
    explanation: "Custom hooks share LOGIC, not STATE. Every time you call a hook in a component, React creates a fresh, isolated piece of state for that specific component instance."
  },
  {
    q: "Which of the following is a valid name for a Custom Hook?",
    options: ["fetchDataHook","CustomHook","useWindowSize","getWindowSize"],
    answer: 2,
    explanation: "Custom hooks MUST start with the lowercase word 'use', followed by a capital letter (camelCase). This tells React that it's a hook, subject to hook rules."
  },
  {
    q: "Where are you allowed to call a Custom Hook?",
    options: ["Inside regular JavaScript functions","Only at the top level of a React functional component or inside another Custom Hook","Inside loops, conditions, or nested functions","Inside class components"],
    answer: 1,
    explanation: "The Rules of Hooks state they can only be called at the top level of React functions (components or other hooks). You cannot call them inside if-statements, loops, or standard JS functions."
  },
  {
    q: "In the Context API, what is the purpose of the `value` prop on the Provider?",
    options: ["It specifies the ID of the context","It determines the data that will be broadcasted to all consuming components below it","It sets the initial default value of the context","It is used to name the context in React DevTools"],
    answer: 1,
    explanation: "The `value` prop is the actual payload. Whatever you pass into `<MyContext.Provider value={data}>` is exactly what `useContext(MyContext)` will return."
  }
];

export default function Quiz() {
  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState(Array(QUESTIONS.length).fill(null));
  const [checked,  setChecked]  = useState(Array(QUESTIONS.length).fill(false));
  const [showResults, setShowResults] = useState(false);

  const q = QUESTIONS[current];
  const isChecked = checked[current];
  const score = QUESTIONS.reduce((acc, q, i) => acc + (checked[i] && selected[i] === q.answer ? 1 : 0), 0);
  const pct = Math.round(score / QUESTIONS.length * 100);

  function selectOpt(oi) { if (isChecked) return; const n=[...selected]; n[current]=oi; setSelected(n); }
  function checkAnswer() { const n=[...checked]; n[current]=true; setChecked(n); }
  function nextQ() { if(current<QUESTIONS.length-1) setCurrent(c=>c+1); else setShowResults(true); }
  function restart() { setCurrent(0); setSelected(Array(QUESTIONS.length).fill(null)); setChecked(Array(QUESTIONS.length).fill(false)); setShowResults(false); }

  const ringCls = pct>=80?'ring-great':pct>=50?'ring-ok':'ring-poor';

  if (showResults) return (
    <div className="quiz-results fade-in">
      <div className={`score-ring ${ringCls}`}>
        <span className="score-num">{score}/{QUESTIONS.length}</span>
        <span className="score-pct">{pct}%</span>
      </div>
      <h2 className="results-msg">{pct>=80?'🎉 Advanced React Master!':pct>=50?'👍 Good effort!':'📖 Keep studying!'}</h2>
      <p className="results-sub">Lesson 22 — Context API & Custom Hooks</p>
      <button className="btn btn-primary" onClick={restart}>↩ Retake Quiz</button>
      <div className="review-list">
        {QUESTIONS.map((q, i) => {
          const ok = selected[i] === q.answer;
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
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="quiz-card fade-in">
      <div className="quiz-progress-label">Question {current+1} of {QUESTIONS.length}</div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{width:`${((current+1)/QUESTIONS.length)*100}%`}} />
      </div>

      <div className="quiz-q-text">{q.q}</div>
      {q.code && <pre className="quiz-code">{q.code}</pre>}

      <div className="quiz-options">
        {q.options.map((opt, oi) => {
          let cls = 'quiz-option';
          if(isChecked){
            if(oi===q.answer) cls+=' q-correct';
            else if(oi===selected[current]&&selected[current]!==q.answer) cls+=' q-wrong';
          } else if(selected[current]===oi) cls+=' q-selected';
          return (
            <div key={oi} className={cls} onClick={()=>selectOpt(oi)}>
              <span className="q-key">{['A','B','C','D'][oi]}</span>
              <span>{opt}</span>
            </div>
          );
        })}
      </div>

      {isChecked && <div className="quiz-explanation">{q.explanation}</div>}

      <div className="quiz-btn-row">
        {!isChecked
          ? <button className="btn btn-primary" disabled={selected[current]===null} onClick={checkAnswer}>Check Answer</button>
          : <button className="btn btn-success" onClick={nextQ}>{current<QUESTIONS.length-1?'Next →':'See Results 🎉'}</button>
        }
      </div>
    </div>
  );
}
