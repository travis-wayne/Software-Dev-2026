import React, { useState } from 'react';

const QUESTIONS = [
  {
    question: "What is the primary purpose of writing software tests?",
    options: [
      "To make the application run faster in the browser",
      "To ensure code behaves as expected and prevent regressions",
      "To automatically write documentation for users",
      "To replace the need for QA engineers"
    ],
    correctAnswer: 1,
    explanation: "Tests provide confidence that our code works and prevents old bugs from returning (regressions) when we add new features."
  },
  {
    question: "Which of the following is a UNIT test?",
    options: [
      "Testing if a user can complete a checkout flow in a browser",
      "Testing if a React component renders the correct text",
      "Testing if a `calculateTotal` math function returns the correct number",
      "Testing if the database connects successfully"
    ],
    correctAnswer: 2,
    explanation: "A unit test isolates the smallest piece of testable code, like a single math function. Component tests test the UI, and E2E tests test the whole flow."
  },
  {
    question: "What does the 'AAA' pattern stand for in testing?",
    options: [
      "Arrange, Act, Assert",
      "Assign, Analyze, Approve",
      "Always Assert Accurately",
      "Assemble, Attack, Assess"
    ],
    correctAnswer: 0,
    explanation: "Arrange (set up the test data), Act (call the function or render the component), Assert (check if the result matches expectations)."
  },
  {
    question: "What is the core philosophy of React Testing Library (RTL)?",
    options: [
      "Test the internal state variables of every component",
      "Test components exactly as a developer would write them",
      "Test components in a way that resembles how users interact with them",
      "Test only the HTML structure of the page"
    ],
    correctAnswer: 2,
    explanation: "RTL encourages testing the UI from the user's perspective (e.g., finding text on the screen, clicking buttons) rather than testing implementation details like state variables."
  },
  {
    question: "In Vitest/Jest, which function is used to GROUP related test cases together?",
    options: [
      "test()",
      "describe()",
      "it()",
      "group()"
    ],
    correctAnswer: 1,
    explanation: "The `describe()` function creates a block that groups together several related tests, keeping your test suite organized."
  }
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === QUESTIONS[currentQ].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    
    setAnswers([...answers, {
      q: QUESTIONS[currentQ].question,
      userAns: QUESTIONS[currentQ].options[idx],
      correctAns: QUESTIONS[currentQ].options[QUESTIONS[currentQ].correctAnswer],
      isCorrect
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

  if (showResults) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    let ringClass = 'ring-poor';
    if (pct >= 80) ringClass = 'ring-great';
    else if (pct >= 60) ringClass = 'ring-ok';

    return (
      <div className="quiz-card fade-in">
        <div className="quiz-results">
          <div className={`score-ring ${ringClass}`}>
            <span className="score-num">{score}/{QUESTIONS.length}</span>
            <span className="score-pct">{pct}%</span>
          </div>
          <h2 className="results-msg">
            {pct >= 80 ? 'Excellent work! 🏆' : pct >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪'}
          </h2>
          <p className="results-sub">You have completed the intro to testing quiz.</p>
          
          <div className="review-list">
            {answers.map((ans, i) => (
              <div key={i} className={`review-item ${ans.isCorrect ? 'r-ok' : 'r-wrong'}`}>
                <p className="review-q">{i+1}. {ans.q}</p>
                <p className="review-a">
                  Your answer: <span className={ans.isCorrect ? 'ans-ok' : 'ans-wrong'}>{ans.userAns}</span>
                  {!ans.isCorrect && (
                    <span className="block mt-2 text-muted">Correct answer: <span className="ans-ok">{ans.correctAns}</span></span>
                  )}
                </p>
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div className="quiz-card fade-in">
      <div className="quiz-progress-label">
        <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
      </div>
      <div className="quiz-progress-bar">
        <div 
          className="quiz-progress-fill" 
          style={{width: `${((currentQ) / QUESTIONS.length) * 100}%`}}
        ></div>
      </div>

      <h3 className="quiz-q-text">{q.question}</h3>
      
      <div className="quiz-options">
        {q.options.map((opt, idx) => {
          let btnClass = 'quiz-option';
          if (isAnswered) {
            if (idx === q.correctAnswer) btnClass += ' q-correct';
            else if (idx === selected) btnClass += ' q-wrong';
          } else if (idx === selected) {
            btnClass += ' q-selected';
          }

          return (
            <button 
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
            >
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
            {currentQ === QUESTIONS.length - 1 ? 'See Results' : 'Next Question ➔'}
          </button>
        </div>
      )}
    </div>
  );
}
