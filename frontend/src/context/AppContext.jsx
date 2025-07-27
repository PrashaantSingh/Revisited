import {  createContext, useEffect, useReducer } from "react";
import validateToken from "../utilities/validateToken";
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;
const initialState = {
  user: null,
  questions: [],
  isLoading: false,
  isEditing: false,
  overlayDisplaying: false,
  isMarkingVisited: false,
  error: null,
  currentQuestion: null,
  editFields: {},
  isLoggingOut: false,
  streak: 0,
  maxStreak: 0,
};
export const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_STREAK":
      return { ...state, streak: action.payload };

    case "ADD_QUESTION":
      return { ...state, questions: [...state.questions, action.payload] };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };

    case "UPDATE_QUESTION": {
      const updatedQuestions = state.questions.map((question) =>
        question._id === action.payload.id
          ? { ...question, ...action.payload.updates }
          : question
      );
      return { ...state, questions: updatedQuestions };
    }

    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter((q) => q._id !== action.payload),
      };

    case "ADD_TEMP_QUESTION": {
      const tempQues = action.payload;
      const updatedTemp = [...state.questions, tempQues];
      localStorage.setItem("questions", JSON.stringify(updatedTemp));
      return { ...state, questions: updatedTemp };
    }

    case "REPLACE_TEMP_QUESTION": {
      const replaced = state.questions.map((q) =>
        q._id === action.payload.tempId ? action.payload.question : q
      );
      localStorage.setItem("questions", JSON.stringify(replaced));
      return { ...state, questions: replaced };
    }

    case "REMOVE_TEMP_QUESTION": {
      const removed = state.questions.filter((q) => q._id !== action.payload);
      localStorage.setItem("questions", JSON.stringify(removed));
      return { ...state, questions: removed };
    }

    case "ROLLBACK_QUESTION": {
      const rolledBackQuestions = state.questions.map((question) =>
        question._id === action.payload.id
          ? action.payload.previousQuestion
          : question
      );
      return { ...state, questions: rolledBackQuestions };
    }

    case "SET_IS_EDITING":
      return { ...state, isEditing: action.payload };

    case "SET_OVERLAY_DISPLAYING":
      return { ...state, overlayDisplaying: action.payload };

    case "SET_IS_MARKING_VISITED":
      return { ...state, isMarkingVisited: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestion: action.payload };

    case "SET_EDIT_FIELDS":
      return { ...state, editFields: action.payload };
    case "SET_LOGGING_OUT": {
      return { ...state, isLoggingOut: action.payload };
    }
    case "INITIAL_STATE":
      return initialState;

    default:
      return state;
  }
}

const ContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = {
    setUser: (user) => dispatch({ type: "SET_USER", payload: user }),
    setStreak: (streak) => dispatch({ type: "SET_STREAK", payload: streak }),
    refreshUser: () => getUser(true),
    setQuestions: (questions) =>
      dispatch({ type: "SET_QUESTIONS", payload: questions }),
    addQuestion: (question) =>
      dispatch({ type: "ADD_QUESTION", payload: question }),
    updateQuestion: (id, updates) =>
      dispatch({ type: "UPDATE_QUESTION", payload: { id, updates } }),
    deleteQuestion: (id) => dispatch({ type: "DELETE_QUESTION", payload: id }),
    rollbackQuestion: (id, previousQuestion) =>
      dispatch({
        type: "ROLLBACK_QUESTION",
        payload: { id, previousQuestion },
      }),
    setIsEditing: (editing) =>
      dispatch({ type: "SET_IS_EDITING", payload: editing }),
    setOverlayDisplaying: (displaying) =>
      dispatch({ type: "SET_OVERLAY_DISPLAYING", payload: displaying }),
    setIsMarkingVisited: (marking) =>
      dispatch({ type: "SET_IS_MARKING_VISITED", payload: marking }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    setCurrentQuestion: (question) =>
      dispatch({ type: "SET_CURRENT_QUESTION", payload: question }),
    setEditFields: (fields) =>
      dispatch({ type: "SET_EDIT_FIELDS", payload: fields }),
    setIsLoading: (loading) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setToLocalStorage: (key, val) =>
      localStorage.setItem(key, JSON.stringify(val)),
    setIsLoggingOut: (boolean) =>
      dispatch({ type: "SET_LOGGING_OUT", payload: boolean }),
    resetState: () => dispatch({ type: "INITIAL_STATE" }),
    addTempQuestion: (tempQuestion) =>
      dispatch({
        type: "ADD_TEMP_QUESTION",
        payload: tempQuestion,
      }),

    replaceTempQuestion: (tempId, question) =>
      dispatch({
        type: "REPLACE_TEMP_QUESTION",
        payload: { tempId, question },
      }),

    removeTempQuestion: (tempId) =>
      dispatch({
        type: "REMOVE_TEMP_QUESTION",
        payload: tempId,
      }),
  };
  async function getUser(forceRefetch = false) {
    const token = localStorage.getItem("token");
    const localUser = state.user || JSON.parse(localStorage.getItem("user"));
    const isTokenValid = validateToken(token);

    if (!token || !isTokenValid) {
      actions.setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("questions");
      navigate("/login");
      return;
    }

    if (localUser && !forceRefetch) {
      const lastUpdate = localUser.lastStreakUpdateAt
        ? new Date(localUser.lastStreakUpdateAt)
        : null;

      let streak = localUser.streak;

      if (!lastUpdate || isNaN(lastUpdate.getTime())) {
        streak = 0;
      } else {
        const now = new Date();
        const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);
        if (hoursPassed > 24) {
          streak = 0;
        }
      }

      const tempUser = {
        ...localUser,
        streak,
      };

      actions.setUser(tempUser);
    }

    actions.setIsLoading(true);
    if (forceRefetch) {
      actions.setIsLoading(false);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/user/me`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      });

      const data = await res.json();
      actions.setUser(data.user);
      actions.setToLocalStorage("user", data.user);
    } catch (error) {
      actions.setError(error.message);
    } finally {
      actions.setIsLoading(false);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser(true);
  }, []);

  async function getQuestions() {
    if (!state.user) return;
    const cachedQuestions = JSON.parse(localStorage.getItem("questions"));

    if (cachedQuestions != undefined && cachedQuestions.length > 0) {
      actions.setQuestions(cachedQuestions);
    } else actions.setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const ques = await res.json();
      if (!res.ok) throw new Error();
      actions.setQuestions(ques.data);
      actions.setToLocalStorage("questions", ques.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      actions.setIsLoading(false);
    }
  }

  useEffect(() => {
    getQuestions();
  }, [API_URL, state.user]);

  return (
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
