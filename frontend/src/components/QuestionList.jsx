import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import QuestionTitle from "./QuestionTitle";
import { RiRefreshLine } from "react-icons/ri";

export default function QuestionList({ questions, setQuestions }) {
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  function handleClick(e, id) {
    navigate(`/questions/${id}`, {
      state: { question: questions.find((ques) => ques._id === id) },
    });
  }
  function handleQuestionListRefresh() {
    localStorage.removeItem("questions");
    getQuestions(true);
  }

  async function getQuestions(forceRefresh = false) {
    if (!forceRefresh) {
      const cachedQuestions = JSON.parse(localStorage.getItem("questions"));
      if (cachedQuestions && cachedQuestions.length > 0) {
        setQuestions(cachedQuestions);
        return;
      }
      if (questions && questions.length > 0) return;
    }

    setIsQuestionLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/questions`, {
        // const res = await fetch(`http://localhost:3000/api/questions`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setQuestions(data.data);
      // saving the questions array to local storage for faster access
      localStorage.setItem("questions", JSON.stringify(data.data));
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsQuestionLoading(false);
    }
  }

  useEffect(() => {
    getQuestions();
  }, [API_URL]);

  const filteredQuestions =
    searchTerm.trim() === ""
      ? questions
      : questions.filter((q) =>
          q.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="mt-6 w-[90%] mx-auto my-4 mb-2">
      {isQuestionLoading ? (
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
          <div className="flex gap-3 items-center mb-4">
            <div className="flex w-max items-center gap-2 border-gray-700 border-2 py-1.5 px-4 rounded-md text-white">
              <FiSearch />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none bg-transparent text-white placeholder-gray-400"
              />
            </div>

            <RiRefreshLine
              className="text-xl text-amber-700 hover:text-amber-600 cursor-pointer"
              onClick={() => handleQuestionListRefresh()}
            />
          </div>

          {filteredQuestions
            .sort(
              (a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
            )
            .map((ques) => (
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
