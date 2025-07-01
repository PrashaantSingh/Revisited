import { useState } from "react";
import { MdDelete } from "react-icons/md";

export default function ProblemDetailsUpdateButtons({
  editFields,
  setQuestion,
  setIsEditing,
  setError,
  setLastRevisedAt,
  setIsDeleting,
  isEditing,
  id,
}) {
  const [visited, setVisited] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSaveEdit() {
    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(editFields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuestion(data.question);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleVisited(id) {
    setVisited(true);
    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ lastRevisedAt: new Date().toISOString() }),
      });

      const data = await res.json();
      const lastRevised = new Date(
        data.question.lastRevisedAt
      ).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setLastRevisedAt(lastRevised);
    } catch (error) {
      console.error(error?.message || "Couldn't marked visited");
    } finally {
      setTimeout(() => setVisited(false), 1500);
    }
  }
  return (
    <>
      <div className="self-center flex gap-2">
        <button
          onClick={() => handleVisited(id)}
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
        {!isEditing ? (
          <div className="flex gap-2 items-center">
            <button
              className="text-sm px-4 py-2 rounded-full bg-blue-600 text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <MdDelete
              className="text-2xl text-red-500 cursor-pointer"
              onClick={() => setIsDeleting(true)}
            />
          </div>
        ) : (
          <>
            <button
              className="text-sm px-4 py-2 rounded-full bg-green-600 text-white"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="text-sm px-4 py-2 rounded-full bg-red-600 text-white"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}
