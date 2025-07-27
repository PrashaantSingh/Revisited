import { MdDelete } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
export default function ProblemDetailsUpdateButtons({
  editFields,
  setEditFields,
  setQuestion,
  question,
  setIsEditing,
  setError,
  isEditing,
  id,
  setOverlayDisplaying,
  setIsMarkingVisited,
  visited,
}) {
  const { state, setQuestions, setToLocalStorage, refreshUser, setUser } =
    useContext(AppContext);
  const questions = state.questions;
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSaveEdit() {
    const previousQuestion = questions.find((ques) => ques._id === id);
    if (!previousQuestion) return;

    const updatedQuestion = { ...previousQuestion, ...editFields };
    setQuestion(updatedQuestion);
    const updatedQuestions = questions.map((ques) =>
      ques._id === id ? updatedQuestion : ques
    );
    setQuestions(updatedQuestions);
    setToLocalStorage("questions", updatedQuestions);
    const currStreak = state.user.streak;
    setUser({ ...state.user, streak: currStreak + 1 });
    setIsEditing(false);

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(editFields),
      });

      const data = await res.json();
      await refreshUser();

      if (!res.ok) throw new Error(data.message || "Failed to update");
    } catch (err) {
      const rollback = questions.map((ques) =>
        ques._id === id ? previousQuestion : ques
      );
      setQuestions(rollback);
      setToLocalStorage("questions", rollback);
      setQuestion(previousQuestion);
      setUser({ ...state.user, streak: currStreak });
      setError(err.message || "Something went wrong.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        {!isEditing ? (
          <>
            <MdDelete
              className="text-2xl text-red-500 cursor-pointer"
              onClick={() => setOverlayDisplaying(true)}
            />
            <button
              className="text-xs sm:text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              // onClick={() => handleVisited(id)}
              onClick={() => setIsMarkingVisited(true)}
              disabled={visited}
              className={`text-xs sm:text-sm px-4 py-2 w-30 rounded-full transition-all duration-200 ease-in
                ${
                  visited
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : "bg-light-dark text-green-500 cursor-pointer"
                }`}
            >
              {visited ? "✓ Visited" : "Mark Visited"}
            </button>
          </>
        ) : (
          <>
            <button
              className="text-sm px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white cursor-pointer"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="text-sm px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              onClick={() => {
                setIsEditing(false);
                setQuestion(question);
                setEditFields(question);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}
