import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import QuestionTitle from "./QuestionTitle";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function handleClick(e, id) {
    navigate(`/questions/${id}`);
  }

  useEffect(() => {
    async function getQuestions() {
      try {
        const res = await fetch("http://localhost:3000/api/questions", {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setQuestions(data.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getQuestions();
  }, []);

  const filteredQuestions =
    searchTerm.trim() === ""
      ? questions
      : questions.filter((q) =>
          q.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="mt-6 w-[90%] mx-auto my-4 mb-2">
      {isLoading ? (
        <h2 className="text-white text-center text-xl">Loading questions...</h2>
      ) : questions.length === 0 ? (
        <h2 className="text-white font-semibold text-3xl text-center">
          Looks like you haven't added any notes yet.
          <br /> Click <span className="text-amber-500">Add notes </span>
          to get started.
        </h2>
      ) : filteredQuestions.length === 0 ? (
        <>
          {/* temporarily add search so that if no result shown search appear */}
          <div className="flex w-max items-center gap-2 border-gray-700 border-2 py-1.5 px-4 rounded-md text-white mb-4">
            <FiSearch />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none bg-transparent text-white placeholder-gray-400"
            />
          </div>
          <h2 className="text-white font-semibold text-2xl text-center">
            No matching questions found.
          </h2>
        </>
      ) : (
        <>
          <div className="flex w-max items-center gap-2 border-gray-700 border-2 py-1.5 px-4 rounded-md text-white mb-4">
            <FiSearch />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none bg-transparent text-white placeholder-gray-400"
            />
          </div>

          {filteredQuestions.map((ques) => (
            <QuestionTitle
              key={ques._id}
              question={ques}
              clickHandler={(e) => handleClick(e, ques._id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
