import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../redux/store/index"
import { useState } from "react"
import {
  postAnswers,
  postQuestion,
  postQuiz,
  setCategoryId,
} from "../../redux/quizSlice"
import { useNavigate } from "react-router-dom"
import "../Addition/Addition.scss"

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

function Addition() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const additionType = useTypedSelector((state) => state.quiz.additionType)
  const categoryId = useTypedSelector((state) => state.quiz.selectedCategoryId)
  const [options, setOptions] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const [questionText, setQuestionText] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  function generateTimestampUniqueId(): number {
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 10000) // Add a random 4-digit number
    return parseInt(`${timestamp}${randomSuffix}`)
  }

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions]
      updatedOptions[index] = value
      return updatedOptions
    })
  }

  const handleAnswerChange = (option: string) => {
    setCorrectAnswer(option)
  }

  const handleCategoryClick = () => {
    dispatch(postQuiz({ id: generateTimestampUniqueId(), category: category }))
    dispatch(setCategoryId(null))
    navigate("/allcategories")
  }

  const handleQuestionClick = () => {
    if (categoryId === null) {
      setError("Category ID cannot be null.")
      return
    }

    const generatedQuestionId = generateTimestampUniqueId()
    dispatch(
      postQuestion({
        questionText: questionText,
        id: generatedQuestionId,
        quizId: categoryId,
      })
    )
    dispatch(
      postAnswers({
        id: generateTimestampUniqueId(),
        questionId: generatedQuestionId,
        optionText: options,
        correctAnswer: correctAnswer,
      })
    )
    dispatch(setCategoryId(null))
    navigate("/allcategories")
  }

  if (additionType === "category") {
    return (
      <>
        <h1 className="main-header">Addition</h1>
        <div id="addition" className="edit-question-details">
          <input
            className="addition add-input"
            type="text"
            placeholder="Enter Category Name"
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            className="submit btn main-btn addition"
            onClick={() => handleCategoryClick()}
            disabled={!category}
          >
            Create Category
          </button>
        </div>
      </>
    )
  } else if (additionType === "question") {
    return (
      <>
        <h1 className="main-header">Addition</h1>
        <div id="addition" className="edit-question-details">
          <input
            className="addition add-input"
            type="text"
            placeholder="Enter Question Text"
            onChange={(e) => setQuestionText(e.target.value)}
          />
          <ul>
            {[0, 1, 2, 3].map((index) => (
              <li key={index}>
                <input
                  className="addition add-input"
                  placeholder="add option"
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </li>
            ))}
          </ul>
          <h2>Mark Correct Answer</h2>
          {options.length === 4 &&
            options.map((option) => (
              <label key={option}>
                <input
                  className="addition add-input"
                  type="radio"
                  value={option}
                  checked={correctAnswer === option}
                  onChange={() => handleAnswerChange(option)}
                />
                {option}
              </label>
            ))}
          <button
            disabled={!correctAnswer}
            onClick={() => {
              handleQuestionClick()
            }}
            className="submit btn main-btn addition"
          >
            Create Question
          </button>
        </div>
      </>
    )
  }

  return null
}

export default Addition
