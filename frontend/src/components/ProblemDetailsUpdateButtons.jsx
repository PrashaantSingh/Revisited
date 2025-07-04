import { MdDelete } from "react-icons/md";
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
  setQuestions,
  questions,
  setIsMarkingVisited,
  visited,
}) {
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSaveEdit() {
    const previousQuestion = questions.find((ques) => ques._id === id);
    if (!previousQuestion) return;

    const updatedQuestion = { ...previousQuestion, ...editFields };
    setQuestion(updatedQuestion);
    setQuestions((prev) => {
      const updated = prev.map((ques) =>
        ques._id === id ? updatedQuestion : ques
      );
      localStorage.setItem("questions", JSON.stringify(updated));
      return updated;
    });
    setIsEditing(false);

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        // const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(editFields),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update");
    } catch (err) {
      setQuestions((prev) => {
        const rolledBack = prev.map((ques) =>
          ques._id === id ? previousQuestion : ques
        );
        localStorage.setItem("questions", JSON.stringify(rolledBack));
        return rolledBack;
      });
      setQuestion(previousQuestion);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <>
      <div className="self-center flex gap-2 items-center">
        {!isEditing ? (
          <>
            <MdDelete
              className="text-2xl text-red-500 cursor-pointer"
              onClick={() => setOverlayDisplaying(true)}
            />
            <button
              className="text-sm px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              // onClick={() => handleVisited(id)}
              onClick={() => setIsMarkingVisited(true)}
              disabled={visited}
              className={`text-sm px-4 py-2 w-30 rounded-full transition-all duration-200 ease-in
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
