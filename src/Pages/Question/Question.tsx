import React, { useState, useEffect } from "react"
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "../../redux/store/index"
import {
  fetching,
  addResponse,
  fetchingCategories,
} from "../../redux/quizSlice"
import { useNavigate } from "react-router-dom"
import "../Question/Question.scss"

const Question: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const categoryId = useTypedSelector(
    (state: RootState) => state.quiz.selectedCategoryId
  )
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(60)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

  const questions = useTypedSelector(
    (state: RootState) => state.quiz.fetchedQuestions
  )
  const categories = useTypedSelector(
    (state: RootState) => state.quiz.fetchedCategories
  )

  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  )

  const loading = useTypedSelector((state: RootState) => state.quiz.loading)

  useEffect(() => {
    if (categoryId) {
      dispatch(fetching({ name: "questions?quizId", id: categoryId }))
    }
  }, [categoryId, dispatch])

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchingCategories("quizzes"))
    }
  }, [categoryId, dispatch])

  useEffect(() => {
    setCurrentQuestionIndex(0)
  }, [questions])

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1)
      } else {
        onNext()
      }
    }, 1000)

    return () => clearTimeout(timerId)
  }, [timeLeft])

  useEffect(() => {
    if (
      !loading &&
      currentQuestionIndex >= questions.length &&
      questions.length > 0
    ) {
      navigate("/result")
    }
  }, [currentQuestionIndex, questions.length, navigate, loading])

  const options = useTypedSelector(
    (state: RootState) => state.quiz.fetchedAnswers
  )

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const onNext = () => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex]

      dispatch(
        addResponse({
          question: currentQuestion.questionText,
          answer: selectedAnswer || "No answer",
          isCorrect:
            selectedAnswer === options[0]?.correctAnswer ? true : false,
        })
      )
    }

    setSelectedAnswer(null)
    setTimeLeft(60)
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
  }

  const currentQuestion = questions[currentQuestionIndex]
  useEffect(() => {
    if (currentQuestion?.id) {
      dispatch(fetching({ name: "options?questionId", id: currentQuestion.id }))
    }
  }, [currentQuestion?.id, dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  if (currentQuestionIndex >= questions.length) {
    return null
  }

  return (
    <div style={{ position: "relative" }} id="question">
      <h1 className="main-header">
        <span className="first-letter">
          {selectedCategory?.category.charAt(0).toUpperCase()}
        </span>
        {selectedCategory?.category.slice(1)}
      </h1>
      <div
        className="time-left"
        style={{ position: "absolute", top: 50, right: 0 }}
      >
        {timeLeft}s
      </div>
      <div key={currentQuestionIndex} className="question-answer">
        <h2 className="question-text">{currentQuestion.questionText}</h2>
        <div className="answers-container">
          {options[0]?.optionText.map((answer: string, index: number) => (
            <div
              key={index}
              className={`answer ${
                selectedAnswer === answer ? "selected" : ""
              }`}
              onClick={() => handleAnswerChange(answer)}
            >
              {answer}
            </div>
          ))}
        </div>
      </div>
      <button
        className="btn next"
        disabled={!selectedAnswer}
        onClick={() => onNext()}
      >
        Next
      </button>
    </div>
  )
}

export default Question
