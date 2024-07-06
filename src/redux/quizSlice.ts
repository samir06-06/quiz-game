import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"

type QuizState = {
  selectedCategoryId: number | null
  selectedQuestionId: number | null
  additionType: string | null
  fetchedQuestions: any[]
  fetchedAnswers: any[]
  fetchedCategories: any[]
  loading: boolean
  error: string | null
  result: { question: string; answer: string; isCorrect: boolean }[]
}

type Questions = {
  id: number
  quizId: number
  questionText: string
}
type Answers = {
  id: number
  questionId: number
  optionText: any[]
  correctAnswer: string
}
type Categories = {
  id: number
  category: string
}

export const initialState: QuizState = {
  selectedCategoryId: null,
  selectedQuestionId: null,
  additionType: null,
  fetchedQuestions: [],
  fetchedAnswers: [],
  fetchedCategories: [],
  loading: false,
  error: null,
  result: [],
}

export const fetchingCategories = createAsyncThunk(
  "quiz/fetching",
  async (datas: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch("http://localhost:3001/quizzes")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      dispatch(setCategories(data as Categories[]))
      return data as Categories[]
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const fetching = createAsyncThunk(
  "quiz/fetching",
  async (
    params: { name: string; id: number },
    { rejectWithValue, dispatch }
  ) => {
    const { name, id } = params
    try {
      const response = await fetch(`http://localhost:3001/${name}=${id}`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      switch (name) {
        case "questions?quizId":
          dispatch(setQuestions(data as Questions[]))
          return data as Questions[]

        case "options?questionId":
          dispatch(setAnswers(data as Answers[]))
          return data as Answers[]

        default:
          throw new Error("Invalid data type")
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const postQuiz = createAsyncThunk(
  "quiz/postQuizData",
  async (data: { id: number; category: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const postQuestion = createAsyncThunk(
  "quiz/postQuizData",
  async (
    data: { questionText: string; id: number; quizId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const postAnswers = createAsyncThunk(
  "quiz/postQuizData",
  async (
    data: {
      id: number
      questionId: number
      optionText: any[]
      correctAnswer: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("http://localhost:3001/options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const deleteCategoryAndQuestions = createAsyncThunk(
  "quiz/deleteCategoryAndQuestions",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3001/quizzes/${categoryId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      await fetch(`http://localhost:3001/questions?quizId=${categoryId}`, {
        method: "DELETE",
      })

      return categoryId
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const deleteQuestionAndAnswers = createAsyncThunk(
  "quiz/deleteQuestionsAndAnswers",
  async (questionId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:3001/questions/${questionId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      await fetch(`http://localhost:3001/options?questionId=${questionId}`, {
        method: "DELETE",
      })

      return questionId
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const updateCategoryName = createAsyncThunk(
  "quiz/updateCategoryName",
  async (
    data: { id: number; category: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(`http://localhost:3001/quizzes/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: data.category }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const updatedCategory = await response.json()
      dispatch(
        updateCategory({ id: data.id, category: updatedCategory.category })
      )
      return updatedCategory
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const updateQuestion = createAsyncThunk(
  "quiz/updateQuestion",
  async (
    data: { id: number; questionText: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3001/questions/${data.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ questionText: data.questionText }),
        }
      )

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const updatedQuestion = await response.json()
      dispatch(
        updateQuestionText({
          id: data.id,
          questionText: updatedQuestion.questionText,
        })
      )
      return updatedQuestion
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

export const updateAnswer = createAsyncThunk(
  "quiz/updateAnswer",
  async (
    data: {
      id: number
      optionText: string[]
      correctAnswer: string
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(`http://localhost:3001/options/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionText: data.optionText,
          correctAnswer: data.correctAnswer,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const updatedAnswer = await response.json()
      dispatch(
        updateAnswerText({
          id: data.id,
          optionText: updatedAnswer.optionText,
          correctAnswer: updatedAnswer.correctAnswer,
        })
      )
      return updatedAnswer
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  }
)

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setCategoryId: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload
      state.result = []
    },
    setQuestionId: (state, action: PayloadAction<number | null>) => {
      state.selectedQuestionId = action.payload
      state.result = []
    },
    setAddition: (state, action: PayloadAction<string>) => {
      state.additionType = action.payload
    },
    addResponse: (
      state,
      action: PayloadAction<{
        question: string
        answer: string
        isCorrect: boolean
      }>
    ) => {
      state.result.push(action.payload)
    },
    resetQuiz: (state) => {
      state.selectedCategoryId = null
      state.fetchedCategories = []
      state.fetchedQuestions = []
      state.fetchedAnswers = []
      state.result = []
    },
    setCategories: (state, action: PayloadAction<Categories[]>) => {
      state.fetchedCategories = action.payload
      state.loading = false
    },
    setQuestions: (state, action: PayloadAction<Questions[]>) => {
      state.fetchedQuestions = action.payload
      state.loading = false
    },
    setAnswers: (state, action: PayloadAction<Answers[]>) => {
      state.fetchedAnswers = action.payload
      state.loading = false
    },
    updateCategory: (state, action: PayloadAction<Categories>) => {
      const index = state.fetchedCategories.findIndex(
        (category) => category.id === action.payload.id
      )
      if (index !== -1) {
        state.fetchedCategories[index].category = action.payload.category
      }
    },
    updateQuestionText: (
      state,
      action: PayloadAction<{ id: number; questionText: string }>
    ) => {
      const index = state.fetchedQuestions.findIndex(
        (question) => question.id === action.payload.id
      )
      if (index !== -1) {
        state.fetchedQuestions[index].questionText = action.payload.questionText
      }
    },
    updateAnswerText: (
      state,
      action: PayloadAction<{
        id: number
        optionText: string[]
        correctAnswer: string
      }>
    ) => {
      const index = state.fetchedAnswers.findIndex(
        (answer) => answer.id === action.payload.id
      )
      if (index !== -1) {
        state.fetchedAnswers[index].optionText = action.payload.optionText
        state.fetchedAnswers[index].correctAnswer = action.payload.correctAnswer
      }
    },
  },
})

export const {
  setCategoryId,
  setAnswers,
  setCategories,
  addResponse,
  resetQuiz,
  setQuestions,
  setAddition,
  updateCategory,
  setQuestionId,
  updateQuestionText,
  updateAnswerText,
} = quizSlice.actions

export default quizSlice.reducer
