import { useState } from 'react'
import { questionData } from './data/data'
import he from "he"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState(questionData)

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  const questionElements = questions.results.map((q) => {
    
    const answers = [...q.incorrect_answers,q.correct_answer].map((a,index) => {
      return <li key={index}>{he.decode(a)}</li>
    })
    
    return (
      <div className="question">
        <p>{he.decode(q.question)}</p>
        <ul>{answers}</ul>
      </div>
    )
  })

  return (
    <main>
      {!quizStarted && <section className="start-screen">
        <h1>Quizzical</h1>
        <p>See how you fare against 5 multiple choice trivia questions!</p>
        <button
          onClick={handleStartQuiz}
        >
          Start quiz
        </button>
      </section>}

      {quizStarted && <section className="quiz-section">
        {questionElements}
      </section>}
    </main>
  )
}