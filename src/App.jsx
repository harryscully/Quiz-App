import { useState, useEffect } from 'react'
import { arrayShuffle } from "array-shuffle"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import { Settings, X } from "lucide-react"

import Question from "./components/Question"

export default function App() {

  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [quizEnded, setQuizEnded] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})
  const [userScore, setUserScore] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState(false)
  const [category, setCategory] = useState("any")
  const [difficulty, setDifficulty] = useState("any")

  useEffect(() => {
    async function getQuestionData() {
      setLoading(true)
      const res = await fetch(`https://opentdb.com/api.php?amount=5${category !== "any" ? `&category=${category}` : ""}&type=multiple${difficulty !== "any" ? `&difficulty=${difficulty}` : ""}`)
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

  function toggleSettings() {
    setSettings(prev => !prev)
  }

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

      {!quizStarted && 
        <button
          type='button'
          onClick={toggleSettings}
          aria-label='Open settings'
          className=" button settings"
        >
          <Settings size={24} />
        </button>}
      
      {!quizStarted && settings && (
        <>
          <div 
            className="backdrop"
            onClick={toggleSettings}
          />

          <div className='settings-box'>
            <button
              className='close'
              type="button"
              aria-label='Close settings'
              onClick={toggleSettings}
            >
              <X />
            </button>

            <label htmlFor="trivia_category">Select Category: </label>
            <select
              value={category}
              name="trivia_category"
              onChange={e => setCategory(e.target.value)}
            >
              <option value="any">Any Category</option>
              <option value="9">General Knowledge</option>
              <option value="10">Entertainment: Books</option>
              <option value="11">Entertainment: Film</option>
              <option value="12">Entertainment: Music</option>
              <option value="13">Entertainment: Musicals & Theatres</option>
              <option value="14">Entertainment: Television</option>
              <option value="15">Entertainment: Video Games</option>
              <option value="16">Entertainment: Board Games</option>
              <option value="17">Science & Nature</option>
              <option value="18">Science: Computers</option>
              <option value="19">Science: Mathematics</option>
              <option value="20">Mythology</option>
              <option value="21">Sports</option>
              <option value="22">Geography</option>
              <option value="23">History</option>
              <option value="24">Politics</option>
              <option value="25">Art</option>
              <option value="26">Celebrities</option>
              <option value="27">Animals</option>
              <option value="28">Vehicles</option>
              <option value="29">Entertainment: Comics</option>
              <option value="30">Science: Gadgets</option>
              <option value="31">Entertainment: Japanese Anime & Manga</option>
              <option value="32">Entertainment: Cartoon & Animations</option>		
            </select>

            <label htmlFor="trivia_difficulty">Select Difficulty: </label>
            <select
              value={difficulty}
              name="trivia_difficulty"
              onChange={e => setDifficulty(e.target.value)}
            >
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
          </select>

          <button
            onClick={toggleSettings}
            className='save button'
          >
            Save
          </button>
          </div>
        </>
      )
        
      }

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