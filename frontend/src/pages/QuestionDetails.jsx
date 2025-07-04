import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BackBtn from "../components/BackBtn";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import ProblemStatement from "../components/ProblemStatement";
import ProblemLink from "../components/ProblemLink";
import ProblemCode from "../components/ProblemCode";
import ProblemAlgo from "../components/ProblemAlgo";
import ProblemNotes from "../components/ProblemNotes";
import ProblemTag from "../components/ProblemTag";
import ProblemDifficulty from "../components/ProblemDifficulty";
import ProblemTitle from "../components/ProblemTitle";
import NextReviewDate from "../components/NextReviewDate";
import ProblemDetailsUpdateButtons from "../components/ProblemDetailsUpdateButtons";
import formatDate from "../utilities/formatDate";
import BackdropOverlay from "../components/BackdropOverlay";
import SM2 from "../utilities/sm2";
const recallQualityMap = {
  forgot: 2,
  hard: 3,
  partial: 4,
  easy: 5,
};

const recallButtons = [
  { label: "Again", value: "forgot", color: "text-white", bg: "bg-red-600" },
  {
    label: "Hard",
    value: "hard",
    color: "text-white",
    bg: "bg-orange-600",
  },
  {
    label: "Good",
    value: "partial",
    color: "text-white",
    bg: "bg-yellow-500",
  },
  { label: "Easy", value: "easy", color: "text-white", bg: "bg-green-600" },
];

export default function QuestionDetails({ setQuestions, questions }) {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [lastRevisedAt, setLastRevisedAt] = useState(formatDate(""));
  const [isDeleting, setIsDeleting] = useState(false);
  const [overlayDisplaying, setOverlayDisplaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [recallQuality, setRecallQuality] = useState(null);
  const [isMarkingVisited, setIsMarkingVisited] = useState(false);
  const [visited, setVisited] = useState(false);

  const navigate = useNavigate();

  const [editFields, setEditFields] = useState({
    title: "",
    problemStatement: "",
    code: "",
    algorithm: "",
    notes: "",
    difficulty: "",
    tags: [],
    link: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchQuestion() {
      const stored = localStorage.getItem("questions");
      let ques = null;
      if (stored) {
        const arr = JSON.parse(stored);
        setQuestions(arr);
        ques = arr.find((q) => q._id == id);
      }
      if (ques) {
        setQuestion(ques);
        setLastRevisedAt(formatDate(ques.lastRevisedAt));
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/questions/${id}`, {
          // const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setQuestion(data.question);
        setQuestions((prev) => {
          const updated = prev.map((q) =>
            q._id === data.question._id ? data.question : q
          );
          localStorage.setItem("questions", JSON.stringify(updated));
          return updated;
        });
        setLastRevisedAt(formatDate(data.question.lastRevisedAt));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchQuestion();
  }, [id, API_URL]);

  useEffect(() => {
    if (question) {
      setEditFields({
        title: question.title || "",
        problemStatement: question.problemStatement || "",
        code: question.code || "",
        algorithm: question.algorithm || "",
        notes: question.notes || "",
        tags: question.tags || [],
        difficulty: question.difficulty.toLowerCase() || "",
        link: question.link || "",
      });
    }
  }, [question]);

  async function handleVisited(id, quality) {
    setVisited(true);
    setIsMarkingVisited(true);

    const prevQues = question;
    const { interval, repetitions, easinessFactor } = prevQues;
    const prevRevisedAt = lastRevisedAt;
    const newRevisedAt = new Date().toISOString();

    const sm2Result = SM2({ interval, repetitions, easinessFactor }, quality);

    const updatedQuestion = {
      ...prevQues,
      lastRevisedAt: newRevisedAt,
      ...sm2Result,
    };
    setQuestion(updatedQuestion);
    setLastRevisedAt(formatDate(newRevisedAt));
    setQuestions((prev) => {
      const updated = prev.map((q) => (q._id === id ? updatedQuestion : q));
      localStorage.setItem("questions", JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => setVisited(false), 1500);
    setIsMarkingVisited(false);
    try {
      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        // const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          lastRevisedAt: newRevisedAt,
          sm2Result,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      if (data.question) {
        setQuestion(data.question);
        setQuestions((prev) => {
          const updated = prev.map((q) => (q._id === id ? data.question : q));
          localStorage.setItem("questions", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      setLastRevisedAt(prevRevisedAt);
      setQuestions((prev) => {
        const rolledBack = prev.map((q) => (q._id === id ? prevQues : q));
        localStorage.setItem("questions", JSON.stringify(rolledBack));
        return rolledBack;
      });

      setQuestion(prevQues);
      console.error("Failed to update revision data:", err.message);
    } finally {
      setVisited(false);
      setIsMarkingVisited(false);
    }
  }

  async function handleRecallQuality(value) {
    const quality = recallQualityMap[value];
    setRecallQuality(quality);
    handleVisited(id, quality);
  }

  async function handleDelete(e, id) {
    const prevQuestions = [...questions];
    const filtered = prevQuestions.filter((ques) => ques._id !== id);
    setQuestions(filtered);
    localStorage.setItem("questions", JSON.stringify(filtered));
    navigate("/");

    try {
      setIsDeleting(true);
      e.target.innerText = "Deleting..";

      const res = await fetch(`${API_URL}/api/questions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error("Could not delete!");
      }
    } catch (error) {
      console.error("Delete failed, restoring UI:", error);

      setQuestions(prevQuestions);
      localStorage.setItem("questions", JSON.stringify(prevQuestions));

      alert("Failed to delete. Try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!question) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-start gap-4 px-4 py-10 text-white">
      <BackBtn />

      <div className="max-w-4xl w-full px-4">
        {overlayDisplaying && (
          <ConfirmationModal
            onClose={() => setOverlayDisplaying(false)}
            text={"Do you want to delete this question?"}
            onConfirm={(e) => handleDelete(e, question._id)}
            onCancel={() => setOverlayDisplaying(false)}
            operation="DELETE"
            isOperationPerforming={isDeleting}
          />
        )}

        {isMarkingVisited && (
          <BackdropOverlay onClose={() => setIsMarkingVisited(false)}>
            <div className="z-50 px-16 py-12 rounded-lg bg-light-dark">
              <h1 className="text-xl font-semibold text-center mb-8">
                How was your recall?
              </h1>

              <div className="flex flex-wrap justify-center gap-3">
                {recallButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleRecallQuality(btn.value)}
                    className={`text-sm px-4 py-1.5 rounded-full cursor-pointer ${btn.color} ${btn.bg}
                     hover:brightness-110 transition`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </BackdropOverlay>
        )}

        <div className="mb-6 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <ProblemTitle
              isEditing={isEditing}
              editFields={editFields}
              setEditFields={setEditFields}
              question={question}
            />

            <NextReviewDate
              nextReviewDate={formatDate(question.nextReviewDate)}
            />
          </div>

          <ProblemDetailsUpdateButtons
            editFields={editFields}
            setEditFields={setEditFields}
            setQuestion={setQuestion}
            question={question}
            setIsEditing={setIsEditing}
            setError={setError}
            setLastRevisedAt={setLastRevisedAt}
            lastRevisedAt={lastRevisedAt}
            setOverlayDisplaying={setOverlayDisplaying}
            isEditing={isEditing}
            id={id}
            questions={questions}
            setQuestions={setQuestions}
            recallQuality={recallQuality}
            setRecallQuality={setRecallQuality}
            isMarkingVisited={isMarkingVisited}
            setIsMarkingVisited={setIsMarkingVisited}
            visited={visited}
            setVisited={setVisited}
          />
        </div>

        {(question.tags || question.difficulty) && (
          <div className="mb-10 flex items-center gap-10">
            <ProblemDifficulty
              isEditing={isEditing}
              editFields={editFields}
              setEditFields={setEditFields}
              question={question}
            />
            <ProblemTag
              isEditing={isEditing}
              editFields={editFields}
              setEditFields={setEditFields}
              question={question}
            />
          </div>
        )}

        <ProblemStatement
          isEditing={isEditing}
          editFields={editFields}
          setEditFields={setEditFields}
          question={question}
        />
        <ProblemLink
          isEditing={isEditing}
          editFields={editFields}
          setEditFields={setEditFields}
        />
        <ProblemAlgo
          isEditing={isEditing}
          editFields={editFields}
          setEditFields={setEditFields}
          question={question}
        />
        <ProblemCode
          isEditing={isEditing}
          editFields={editFields}
          setEditFields={setEditFields}
          question={question}
          setQuestion={setQuestion}
        />
        <ProblemNotes
          isEditing={isEditing}
          editFields={editFields}
          setEditFields={setEditFields}
          question={question}
        />
      </div>
    </div>
  );
}
