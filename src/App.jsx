import { useState } from 'react'
import { questionData } from './data/data'
import { arrayShuffle } from "array-shuffle"

import Question from "./components/Question"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState(questionData.results)
  const [quizEnded, setQuizEnded] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [userScore, setUserScore] = useState(0)

   const [shuffledAnswers, setShuffledAnswers] = useState(() => questions.map(q => arrayShuffle([...q.incorrect_answers, q.correct_answer])))

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  function handleCheckAnswers() {
    setQuizEnded(true)
    let score = userScore
    questions.forEach((q,qIndex) => {
      if (shuffledAnswers[qIndex][userAnswers[qIndex]] == q.correct_answer) {
        score += 1
      }
    })
    setUserScore(score)
  }

  function handlePlayAgain () {
    setQuizEnded(false)
    setUserAnswers({})
    setUserScore(0)
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
      <Question
        shuffledAnswers={shuffledAnswers[qIndex]}
        quizEnded={quizEnded} 
        userAnswer={userAnswers[qIndex]}
        onChange={handleSelectAnswer} 
        key={qIndex} 
        qIndex={qIndex} 
        data={q} />
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
          disabled={Object.keys(userAnswers).length !== questions.length}
        >
          Check answers
        </button>}

        {quizEnded && <div className="result-section">
          <p>{`You scored ${userScore}/5 correct answers`}</p>
          <button onClick={handlePlayAgain} className="button">Play again</button>
        </div>}
      </section>}


    </main>
  )
}