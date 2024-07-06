import React from "react"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { RootState } from "../../redux/store/index"
import "../Result/Result.scss"
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

const Result: React.FC = () => {
  const results = useTypedSelector((state: RootState) => state.quiz.result)

  const correctAnswers = results.filter((result) => result.isCorrect).length
  const successPercentage = (correctAnswers / results.length) * 100

  return (
    <div id="result">
      <h1 className="main-header">Quiz Results</h1>
      <h2 className="percentage btn">
        Success Rate: {successPercentage.toFixed(2)}%
      </h2>
      <ul>
        {results.map((result, index) => (
          <li
            className="question-res"
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <span>
              <strong>Question:</strong> {result.question}
            </span>
            <span>
              <strong>Your Answer:</strong> {result.answer}{" "}
              {result.isCorrect ? (
                <span style={{ color: "green" }}>✔️</span>
              ) : (
                <span style={{ color: "red" }}>❌</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Result
