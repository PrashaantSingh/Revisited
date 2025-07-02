import { useState } from "react";
import { MdDelete } from "react-icons/md";
import formatDate from "../utilities/formatDate";

export default function ProblemDetailsUpdateButtons({
  editFields,
  setQuestion,
  setIsEditing,
  setError,
  setLastRevisedAt,
  lastRevisedAt,
  isEditing,
  id,
  setOverlayDisplaying,
  setQuestions,
  questions,
}) {
  const [visited, setVisited] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSaveEdit() {
    const previousQuestion = questions.find((ques) => ques._id === id);

    const updatedQuestion = { ...previousQuestion, ...editFields };

    setQuestions((prev) =>
      prev.map((ques) => (ques._id === id ? updatedQuestion : ques))
    );
    setQuestion(updatedQuestion);
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
      if (!res.ok) throw new Error(data.message);
    } catch (err) {
      setQuestions((prev) =>
        prev.map((ques) => (ques._id === id ? previousQuestion : ques))
      );
      setQuestion(previousQuestion);
      setError(err.message);
    } finally {
      setIsEditing(false);
    }
  }

  async function handleVisited(id) {
    setVisited(true);
    const prevRevisedAt = lastRevisedAt;
    const newRevisedAt = new Date().toISOString();

    setLastRevisedAt(formatDate(newRevisedAt));

    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ lastRevisedAt: newRevisedAt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
    } catch (err) {
      setLastRevisedAt(prevRevisedAt);
      console.error(err.message);
    } finally {
      setVisited(false);
    }
  }

  // async function handleVisited(id) {
  //   setVisited(true);
  //   try {
  //     const res = await fetch(`${API_URL}/api/questions/${id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-type": "application/json",
  //         Authorization: localStorage.getItem("token"),
  //       },
  //       body: JSON.stringify({ lastRevisedAt: new Date().toISOString() }),
  //     });

  //     const data = await res.json();

  //     const lastRevised = formatDate(data.question.lastRevisedAt);
  //     setLastRevisedAt(lastRevised);
  //   } catch (error) {
  //     console.error(error?.message || "Couldn't marked visited");
  //   } finally {
  //     setTimeout(() => setVisited(false), 1500);
  //   }
  // }

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
              onClick={() => setOverlayDisplaying(true)}
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
