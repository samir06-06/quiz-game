import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import "./App.css"
import Addition from "./Pages/Addition/Addition"
import AllCategories from "./Pages/AllCategories/AllCategories"
import AllQuestions from "./Pages/sub-categories"
import Category from "./Pages/Category/Category"
import Question from "./Pages/Question/Question"
import Result from "./Pages/Result/Result"
import QuestionDetail from "./Pages/QuestionDetail"

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li className="addition">
              <Link to="/">Category</Link>
            </li>

            <li className="addition">
              <Link to="/allcategories">AllCategories</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Category />} />
          <Route path="/allcategories" element={<AllCategories />} />
          <Route
            path="/allcategories/:categoryName"
            element={<AllQuestions />}
          />
          <Route
            path="/allcategories/:categoryName/:questionId"
            element={<QuestionDetail />}
          />
          <Route path="/addition" element={<Addition />} />
          <Route path="/question" element={<Question />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
