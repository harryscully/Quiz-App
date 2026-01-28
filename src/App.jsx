import { useState, useEffect } from 'react'
import { arrayShuffle } from "array-shuffle"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

import Question from "./components/Question"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [quizEnded, setQuizEnded] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [userScore, setUserScore] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getQuestionData() {
      setLoading(true)
      const res = await fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
      const data = await res.json()

      if (!data.results) return

      setQuestions(data.results)
      setShuffledAnswers(() => data.results.map(q => arrayShuffle([...q.incorrect_answers, q.correct_answer])))
      setLoading(false)
    }

    if(quizStarted) {
      getQuestionData()
    }
  }, [quizStarted])

  function handleStartQuiz() {
    setQuizStarted(true)
  }

  function handleCheckAnswers() {
    setQuizEnded(true)
    let score = 0
    questions.forEach((q,qIndex) => {
      if (shuffledAnswers[qIndex][userAnswers[qIndex]] == q.correct_answer) {
        score += 1
      }
    })
    setUserScore(score)
  }

  function handlePlayAgain () {
    setQuizEnded(false)
    setQuizStarted(false)
    setUserAnswers({})
    setUserScore(0)
    setLoading(true)
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

  const { width, height } = useWindowSize()

  return (
    <main>

      {quizStarted && quizEnded && userScore == questions.length && <Confetti width={width} height={height} gravity={0.1}/>}

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
        {loading && <p className="loading">Questions loading...</p>}
        
        {!loading && (
          <>
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
        </>
        )}
      </section>}


    </main>
  )
}