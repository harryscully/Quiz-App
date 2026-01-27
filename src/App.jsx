import { useState } from 'react'

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)

  function handleStartQuiz() {
    setQuizStarted(true)
  }

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
        <h2>Quiz!</h2>
      </section>}
    </main>
  )
}