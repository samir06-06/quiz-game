import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import { RootState, AppDispatch } from "../../redux/store/index"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  fetching,
  resetQuiz,
  setCategoryId,
  setQuestionId,
  updateAnswer,
  updateQuestion,
} from "../../redux/quizSlice"

const QuestionDetail = () => {
  const { questionId = "" }: { questionId?: string } = useParams()

  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

  const answers = useTypedSelector((state) => state.quiz.fetchedAnswers)
  const questions = useTypedSelector((state) => state.quiz.fetchedQuestions)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [options, setOptions] = useState<string[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const [questionText, setQuestionText] = useState<string>("")

  useEffect(() => {
    if (questionId) {
      dispatch(
        fetching({ name: "options?questionId", id: parseInt(questionId) })
      )
    }
  }, [questionId, dispatch])

  useEffect(() => {
    const parsedQuestionId = parseInt(questionId, 10)
    if (!isNaN(parsedQuestionId)) {
      const fetchedQuestion = questions.find(
        (question) => question.id === parsedQuestionId
      )
      const fetchedAnswer = answers.find(
        (answer) => answer.questionId === parsedQuestionId
      )

      if (fetchedQuestion) {
        setQuestionText(fetchedQuestion.questionText)
      }
      if (fetchedAnswer) {
        setOptions(fetchedAnswer.optionText)
        setCorrectAnswer(fetchedAnswer.correctAnswer)
      }

      dispatch(setQuestionId(parsedQuestionId))
    }
  }, [questionId, questions, answers, dispatch])

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions]
      updatedOptions[index] = value
      return updatedOptions
    })
  }

  const handleAnswerChange = (option: string) => {
    setCorrectAnswer(option)
    console.log(correctAnswer)
  }

  const handleQuestionClick = () => {
    const parsedQuestionId = parseInt(questionId, 10)
    if (!isNaN(parsedQuestionId)) {
      dispatch(updateQuestion({ id: parsedQuestionId, questionText }))
      const fetchedAnswer = answers.find(
        (answer) => answer.questionId === parsedQuestionId
      )

      if (fetchedAnswer) {
        dispatch(
          updateAnswer({
            id: fetchedAnswer.id,
            optionText: options,
            correctAnswer,
          })
        )
      }
      dispatch(setQuestionId(null))
      dispatch(resetQuiz())
      navigate("/allcategories")
    }
  }

  return (
    <>
      <h1 className="main-header">Edit Question details</h1>
      <div className="edit-question-details">
        <input
          type="text"
          className="addition add-input"
          placeholder="Enter Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
        <ul>
          {options.map((option, index) => (
            <li key={index}>
              <input
                placeholder="Add option"
                className="addition add-input"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            </li>
          ))}
        </ul>
        <h2>Mark Correct Answer</h2>
        {options.length > 0 &&
          options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                className="addition add-input"
                name="correctAnswer"
                value={option}
                checked={correctAnswer === option}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
              {option}
            </label>
          ))}
        <button
          className="submit btn main-btn addition"
          onClick={handleQuestionClick}
        >
          Submit
        </button>
      </div>
    </>
  )
}

export default QuestionDetail
