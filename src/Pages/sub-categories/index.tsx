import { useEffect, useState } from "react"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import {
  fetching,
  setCategoryId,
  setAddition,
  deleteCategoryAndQuestions,
  updateCategoryName,
  setQuestionId,
  deleteQuestionAndAnswers,
} from "../../redux/quizSlice"
import { RootState, AppDispatch } from "../../redux/store/index"
import { useNavigate, useParams } from "react-router-dom"
import "./style.scss"

type Question = {
  id: number
  questionText: string
}

function AllQuestions() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
  const navigate = useNavigate()
  const { categoryName } = useParams<{ categoryName: string }>()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [localQuestions, setLocalQuestions] = useState<Question[]>([])

  const categoryId = useTypedSelector(
    (state: RootState) => state.quiz.selectedCategoryId
  )
  const categories = useTypedSelector(
    (state: RootState) => state.quiz.fetchedCategories
  )
  const questions = useTypedSelector(
    (state: RootState) => state.quiz.fetchedQuestions
  )

  const selectedCategory = categories.find(
    (category) => category.id === categoryId
  )

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (categoryId) {
      dispatch(fetching({ name: "questions?quizId", id: categoryId }))
    }
  }, [categoryId, dispatch])

  useEffect(() => {
    if (categoryName) {
      const selectedCategory = categories.find(
        (category) =>
          category.category.toLowerCase() === categoryName.toLowerCase()
      )
      if (selectedCategory) {
        dispatch(setCategoryId(selectedCategory.id))
        setNewCategoryName(selectedCategory.category)
      }
    }
  }, [categoryName, categories, dispatch])

  useEffect(() => {
    setLocalQuestions(questions)
  }, [questions])

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/addition")
    const text = (e.target as HTMLButtonElement).innerText
      .slice(5)
      .toLowerCase()
    dispatch(setAddition(text))
    console.log(text)
  }

  const handleDelete = () => {
    if (categoryId !== null) dispatch(deleteCategoryAndQuestions(categoryId))
    navigate("/allcategories")
  }

  const handleUpdateCategoryName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedCategory && newCategoryName) {
      dispatch(
        updateCategoryName({
          id: selectedCategory.id,
          category: newCategoryName,
        })
      )
      setNewCategoryName("")
    }
  }

  const handleQuestionClick = (questionId: number) => {
    navigate(`/allcategories/${categoryName}/${questionId}`)
    dispatch(setQuestionId(questionId))
  }

  function handleDeleteQuestion(id: number) {
    dispatch(deleteQuestionAndAnswers(id))
    setLocalQuestions(localQuestions.filter((question) => question.id !== id))
  }

  return (
    <div id="sub-category">
      <div className="delete-edit">
        <button className="btn addition main-btn" onClick={handleDelete}>
          Delete category
        </button>
      </div>
      <form onSubmit={handleUpdateCategoryName}>
        <label>
          Edit category name:
          <input
            className="addition"
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="btn addition"
          onClick={() => navigate("/allcategories")}
        >
          Submit
        </button>
      </form>

      <h4>Questions related to category:</h4>
      <div className="questions-list">
        {localQuestions.map((question) => (
          <div key={question.id} className="db-question">
            <button
              className="btn addition"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              X
            </button>
            <button
              className="btn addition"
              onClick={() => handleQuestionClick(question.id)}
            >
              {question.questionText}
            </button>
          </div>
        ))}
      </div>
      <button className="btn addition main-btn" onClick={(e) => handleAdd(e)}>
        +Add Question
      </button>
    </div>
  )
}

export default AllQuestions
