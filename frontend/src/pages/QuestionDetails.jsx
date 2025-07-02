import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
import LastRevisedAt from "../components/LastRevisedAt";
import ProblemDetailsUpdateButtons from "../components/ProblemDetailsUpdateButtons";
import formatDate from "../utilities/formatDate";

export default function QuestionDetails({ setQuestions, questions }) {
  const location = useLocation();
  const ques = location?.state?.question;
  const { id } = useParams();
  const [question, setQuestion] = useState(ques || null);
  const [error, setError] = useState("");
  const [lastRevisedAt, setLastRevisedAt] = useState(
    formatDate(question?.lastRevisedAt || "")
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [overayDisplaying, setOverlayDisplaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      if (question) return;
      try {
        const res = await fetch(`${API_URL}/api/questions/${id}`, {
          headers: {
            "Content-type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setQuestion(data.question);

        const lastRevised = new Date(
          data.question.lastRevisedAt
        ).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        setLastRevisedAt(lastRevised);
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

  async function handleDelete(e, id) {
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
      if (data.success) {
        setQuestions((prev) => prev.filter((ques) => ques._id !== id));
        navigate("/");
      } else throw new Error("could not delete!");
    } catch (error) {
      console.error(error);
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
    <div>
      {overayDisplaying && (
        <ConfirmationModal
          text={"Do you want to delete this question?"}
          onConfirm={(e) => handleDelete(e, question._id)}
          onCancel={() => setOverlayDisplaying(false)}
          operation="DELETE"
          isOperationPerforming={isDeleting}
        />
      )}
      <div>
        <BackBtn className="mt-10 ml-4" />
        <div className="max-w-4xl mx-auto py-10 px-4 text-white">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col">
                <ProblemTitle
                  isEditing={isEditing}
                  editFields={editFields}
                  setEditFields={setEditFields}
                  question={question}
                />

                <LastRevisedAt lastRevisedAt={lastRevisedAt} />
              </div>
            </div>

            <ProblemDetailsUpdateButtons
              editFields={editFields}
              setQuestion={setQuestion}
              setIsEditing={setIsEditing}
              setError={setError}
              setLastRevisedAt={setLastRevisedAt}
              lastRevisedAt={lastRevisedAt}
              setOverlayDisplaying={setOverlayDisplaying}
              isEditing={isEditing}
              id={id}
              questions={questions}
              setQuestions={setQuestions}
            />
          </div>

          {(question.tags || question.difficulty) && (
            <div className="mb-10 flex items-center gap-10 ">
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

          {
            <ProblemStatement
              isEditing={isEditing}
              editFields={editFields}
              setEditFields={setEditFields}
              question={question}
            />
          }

          <ProblemLink
            isEditing={isEditing}
            editFields={editFields}
            setEditFields={setEditFields}
          />

          <ProblemCode
            isEditing={isEditing}
            editFields={editFields}
            setEditFields={setEditFields}
            question={question}
          />

          <ProblemAlgo
            isEditing={isEditing}
            editFields={editFields}
            setEditFields={setEditFields}
            question={question}
          />

          <ProblemNotes
            isEditing={isEditing}
            editFields={editFields}
            setEditFields={setEditFields}
            question={question}
          />
        </div>
      </div>
    </div>
  );
}
