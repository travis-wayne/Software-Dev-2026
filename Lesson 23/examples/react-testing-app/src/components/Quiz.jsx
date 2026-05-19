import React, { useState } from 'react';

const QUESTIONS = [
  {
    question: 'What is the primary purpose of writing software tests?',
    options: [
      'To make the application run faster in the browser',
      'To ensure code behaves as expected and prevent regressions',
      'To automatically write documentation for users',
      'To replace the need for QA engineers',
    ],
    correctAnswer: 1,
    explanation: 'Tests provide confidence that our code works correctly. They also prevent "regressions" — old bugs that silently reappear when you add new features.',
  },
  {
    question: 'Which of these is a UNIT test?',
    options: [
      'A test that simulates a user completing a checkout in a browser',
      'A test that renders a React component and checks its output',
      'A test that calls a `calculateTotal()` function and checks the return value',
      'A test that verifies the database saves a record correctly',
    ],
    correctAnswer: 2,
    explanation: 'A unit test isolates the smallest piece of logic — a single pure function. No DOM, no browser, no database. Just input → output.',
  },
  {
    question: "What does the 'AAA' pattern stand for?",
    options: [
      'Arrange, Act, Assert',
      'Assign, Analyze, Approve',
      'Always Assert Accurately',
      'Assemble, Attack, Assess',
    ],
    correctAnswer: 0,
    explanation: 'Arrange (set up your test data), Act (call the function or render the component), Assert (use expect() to verify the result). Every good test follows this structure.',
  },
  {
    question: 'What is the core philosophy of React Testing Library?',
    options: [
      'Test every internal state variable and implementation detail',
      'Test only the HTML structure of the rendered output',
      'Test components the way users interact with them — by text and roles',
      'Test only the functions passed as props',
    ],
    correctAnswer: 2,
    explanation: 'RTL encourages testing from the user\'s perspective. Instead of inspecting component.state, you use screen.getByText() to find what the user would actually see.',
  },
  {
    question: 'Why must you `await userEvent.click(button)` in your tests?',
    options: [
      'Because userEvent is slower than fireEvent',
      'Because React state updates are asynchronous and need time to apply',
      'Because `await` is required for all DOM operations',
      'It is optional — `await` makes no difference',
    ],
    correctAnswer: 1,
    explanation: 'When you click a button, React may update state asynchronously. Using `await` ensures Vitest/RTL waits for all pending state updates and re-renders to finish before making assertions.',
  },
  {
    question: 'Which `screen` query should you use when you KNOW an element exists and want to throw an error if it doesn\'t?',
    options: [
      'screen.queryByText() — returns null if not found',
      'screen.findByText() — waits asynchronously',
      'screen.getByText() — throws an error if not found',
      'screen.existsByText() — returns a boolean',
    ],
    correctAnswer: 2,
    explanation: '`getByText` throws a descriptive error if the element is not found, which gives you a clear test failure. `queryByText` returns null (useful for asserting absence). `findByText` is async (useful for elements that appear after a delay).',
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ]   = useState(0);
  const [selected, setSelected]   = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore]         = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers]     = useState([]);

  const q = QUESTIONS[currentQ];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    const isCorrect = idx === q.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, {
      question: q.question,
      userAns: q.options[idx],
      correctAns: q.options[q.correctAnswer],
      isCorrect,
    }]);
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQ(0); setSelected(null); setIsAnswered(false);
    setScore(0); setShowResults(false); setAnswers([]);
  };

  if (showResults) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const ringClass = pct >= 80 ? 'ring-great' : pct >= 60 ? 'ring-ok' : 'ring-poor';
    return (
      <div className="quiz-card fade-in">
        <div className="quiz-results">
          <div className={`score-ring ${ringClass}`}>
            <span className="score-num">{score}/{QUESTIONS.length}</span>
            <span className="score-pct">{pct}%</span>
          </div>
          <h2 className="results-msg">
            {pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good effort!' : '💪 Keep practising!'}
          </h2>
          <p className="results-sub">Review your answers below, then head to the Demos tab to complete the exercises.</p>
          <div className="review-list">
            {answers.map((ans, i) => (
              <div key={i} className={`review-item ${ans.isCorrect ? 'r-ok' : 'r-wrong'}`}>
                <p className="review-q">{i + 1}. {ans.question}</p>
                <p className="review-a">
                  Your answer: <span className={ans.isCorrect ? 'ans-ok' : 'ans-wrong'}>{ans.userAns}</span>
                  {!ans.isCorrect && (
                    <span className="block mt-2">Correct: <span className="ans-ok">{ans.correctAns}</span></span>
                  )}
                </p>
              </div>
            ))}
          </div>
          <button className="retake-btn" onClick={handleRetake}>↩ Retake Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card fade-in">
      <div className="quiz-progress-label">
        <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
        <span>{score} correct so far</span>
      </div>
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}></div>
      </div>

      <h3 className="quiz-q-text">{q.question}</h3>

      <div className="quiz-options">
        {q.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (isAnswered) {
            if (idx === q.correctAnswer) cls += ' q-correct';
            else if (idx === selected) cls += ' q-wrong';
          } else if (idx === selected) cls += ' q-selected';
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={isAnswered}>
              <span className="q-key">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="quiz-explanation">
          <strong>{selected === q.correctAnswer ? '✅ Correct!' : '❌ Incorrect.'}</strong>
          <span className="block mt-2">{q.explanation}</span>
        </div>
      )}

      {isAnswered && (
        <div className="quiz-btn-row">
          <button className="quiz-btn quiz-btn-next" onClick={handleNext}>
            {currentQ === QUESTIONS.length - 1 ? 'See Results →' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
