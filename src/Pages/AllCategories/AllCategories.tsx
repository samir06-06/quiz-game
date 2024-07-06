import { useEffect } from "react"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import {
  fetchingCategories,
  setCategoryId,
  setAddition,
} from "../../redux/quizSlice"
import { RootState, AppDispatch } from "../../redux/store/index"
import { useNavigate } from "react-router-dom"
import "../AllCategories/AllCategories.scss"

function AllCategories() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
  const navigate = useNavigate()

  const categories = useTypedSelector(
    (state: RootState) => state.quiz.fetchedCategories
  )

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchingCategories("quizzes"))
  }, [dispatch])

  function handleClickCategory(id: number, name: string) {
    dispatch(setCategoryId(id))
    navigate(`/allcategories/${name.toLowerCase()}`)
  }

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/addition")
    const text = (e.target as HTMLButtonElement).innerText
      .slice(5)
      .toLowerCase()
    dispatch(setAddition(text))
    console.log(text)
  }

  return (
    <div id="all-categories">
      <h1 className="main-header"> All Categories</h1>
      <div className="categories">
        {categories.map((category) => (
          <button
            className="btn addition"
            onClick={() => handleClickCategory(category.id, category.category)}
            key={category.id}
          >
            {category.category}
          </button>
        ))}
      </div>
      <button className="btn addition" onClick={(e) => handleAdd(e)}>
        +Add Category
      </button>
    </div>
  )
}

export default AllCategories
