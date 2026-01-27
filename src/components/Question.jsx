import { useState } from "react"
import he from "he"
import { arrayShuffle } from "array-shuffle"

export default function Question(props) {

    const [shuffledAnswers, setShuffledAnswers] = useState(() => arrayShuffle([...props.data.incorrect_answers,props.data.correct_answer]))

     const answers = shuffledAnswers.map((a,index) => {
          return (
            <li key={index}>
              <input type="radio" name={`q${props.qIndex}`} id={`q${props.qIndex}-a${index}`} />
              <label htmlFor={`q${props.qIndex}-a${index}`}>{he.decode(a)}</label>
            </li>)
        })

    return (
        <div className="question">
            <p>{he.decode(props.data.question)}</p>
            <ul>{answers}</ul>
        </div>
    )
}