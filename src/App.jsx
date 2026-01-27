import { useState } from 'react'
import { questionData } from './data/data'
import he from "he"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  const questionElements = questionData.results.map((q) => {
    return <p>{he.decode(q.question)}</p>
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

      {quizStarted && <section>
        {questionElements}
      </section>}
    </main>
  )
}