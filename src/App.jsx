import { useState } from 'react'
import { questionData } from './data/data'

import Question from "./components/Question"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState(questionData.results)
  const [quizEnded, setQuizEnded] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  function handleCheckAnswers() {
    setQuizEnded(true)
  }

  function handlePlayAgain () {
    setQuizEnded(false)
  }

  function handleSelectAnswer(qIndex, aIndex) {
    setUserAnswers(prev => {
      return {
        ...prev,
        [qIndex]: aIndex
      }
    })
  }

  console.log(userAnswers)

  const questionElements = questions.map((q, qIndex) => {
    return (
      <Question onChange={handleSelectAnswer} key={qIndex} qIndex={qIndex} data={q} />
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
        {!quizEnded && <button
          onClick={handleCheckAnswers}
          className="button"
        >
          Check answers
        </button>}

        {quizEnded && <div className="result-section">
          <p>You scored 3/5 correct answers</p>
          <button onClick={handlePlayAgain} className="button">Play again</button>
        </div>}
      </section>}


    </main>
  )
}