import { useState } from 'react'
import { questionData } from './data/data'

import Question from "./components/Question"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState(questionData.results)

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  const questionElements = questions.map((q, qIndex) => {
    return (
      <Question key={qIndex} qIndex={qIndex} data={q} />
    )
  })

  return (
    <main>
      {!quizStarted && <section className="start-screen">
        <h1>Quizzical</h1>
        <p>See how you fare against 5 multiple choice trivia questions!</p>
        <button
          onClick={handleStartQuiz}
          className="button"
        >
          Start quiz
        </button>
      </section>}

      {quizStarted && <section className="quiz-section">
        {questionElements}
        <button className="button">Check answers</button>
      </section>}
    </main>
  )
}