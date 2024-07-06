import React, { useState, useEffect } from "react"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import { fetchingCategories, setCategoryId } from "../../redux/quizSlice"
import { RootState, AppDispatch } from "../../redux/store/index"
import { useNavigate } from "react-router-dom"
import "../Category/Category.scss"

const Category: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  )

  useEffect(() => {
    dispatch(fetchingCategories("quizzes"))
  }, [dispatch])

  const quizzes = useTypedSelector(
    (state: RootState) => state.quiz.fetchedCategories
  )

  const handleCategoryChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const newCategoryId = parseInt(event.currentTarget.getAttribute("data-id")!)
    setSelectedCategoryId(newCategoryId)
  }

  const submitCategory = () => {
    if (selectedCategoryId !== null) {
      dispatch(setCategoryId(selectedCategoryId))
      navigate("/question")
    }
  }

  const isButtonDisabled = selectedCategoryId === null

  return (
    <div id="category">
      <h1 className="main-header">Choose a category</h1>
      <div className="given-categories">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`category ${
              selectedCategoryId === quiz.id ? "selected" : ""
            }`}
            data-id={quiz.id.toString()}
            onClick={handleCategoryChange}
          >
            <p>
              {quiz.category.charAt(0).toUpperCase() + quiz.category.slice(1)}
            </p>
          </div>
        ))}
      </div>
      <button
        className="btn start-quiz"
        disabled={isButtonDisabled}
        onClick={submitCategory}
      >
        Start Quiz
      </button>
    </div>
  )
}

export default Category
