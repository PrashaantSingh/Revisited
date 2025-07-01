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
import LastRevisedAt from "../components/LastRevisedAt";
import ProblemDetailsUpdateButtons from "../components/ProblemDetailsUpdateButtons";

export default function QuestionDetails() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");
  const [lastRevisedAt, setLastRevisedAt] = useState(question?.lastRevisedAt);
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
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
  }, [id]);

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

  async function handleDelete(id) {
    const res = await fetch(`http://localhost:3000/api/questions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    if (data.success) {
      navigate("/");
    } else {
      throw new Error("could not delete!");
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
      {isDeleting && (
        <ConfirmationModal
          text={"Do you want to delete this question?"}
          onConfirm={() => handleDelete(question._id)}
          onCancel={() => setIsDeleting(false)}
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
              setIsDeleting={setIsDeleting}
              isEditing={isEditing}
              id={id}
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
