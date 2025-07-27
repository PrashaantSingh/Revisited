import { FiSearch } from "react-icons/fi";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import QuestionTitle from "./QuestionTitle";
import { AppContext } from "../context/AppContext";
import { FaFire } from "react-icons/fa";

export default function QuestionList() {
  const { state } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // const API_URL = import.meta.env.VITE_API_URL;

  function handleClick(e, id) {
    navigate(`/questions/${id}`, {
      state: { question: questions.find((ques) => ques._id === id) },
    });
  }

  const questions = state.questions;

  const filteredQuestions =
    searchTerm.trim() === ""
      ? questions
      : questions.filter((q) =>
          q.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <div className="mt-6 w-[95%] sm:w-[90%] mx-auto my-4 mb-2 max-w-[1450px]">
      {questions.length && (
        <div className="flex gap-3 justify-between items-center mb-6">
          {/* <div className="flex w-[] xs:w-max items-center gap-2 border-light-dark border-2  py-1 sm:py-1.5 px-2 sm:px-4 rounded-full text-white"> */}
          <div className="flex w-[160px] xs:w-max items-center gap-3 xs:gap-2 border-light-dark border-2 py-1 px-3 rounded-full text-white sm:px-6 sm:py-2">
            <div className="min-w-2.5">
              <FiSearch className="" />
            </div>
            <input
              type="text"
              placeholder="Search Questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none bg-transparent text-white placeholder-gray-300 text-sm sm:text-[16px]"
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <div className="bg-light-dark px-3 py-1 text-sm sm:text-md sm:px-6 sm:py-2 text-white rounded-3xl">
              <p>Total: {state.questions.length||0}</p>
            </div>
            <div className="bg-light-dark px-3 py-1 text-sm sm:text-md sm:px-6 sm:py-2 text-white rounded-3xl">
              <div className="flex items-center gap-2">
                <FaFire className="text-purple-600 text-lg" />
                <span className="">{state.user.streak || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.isLoading ? (
        <h2 className="text-white text-center text-xl">Loading questions...</h2>
      ) : questions.length === 0 ? (
        <h2 className="text-white font-semibold text-3xl text-center">
          Looks like you haven't added any notes yet.
          <br /> Click <span className="text-amber-500">Add notes </span>
          to get started.
        </h2>
      ) : filteredQuestions.length === 0 ? (
        <h2 className="text-white font-semibold text-2xl text-center">
          No matching questions found.
        </h2>
      ) : (
        filteredQuestions
          .sort(
            (a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
          )
          .map((ques) => (
            <QuestionTitle
              key={ques._id}
              question={ques}
              clickHandler={(e) => handleClick(e, ques._id)}
            />
          ))
      )}
    </div>
  );
}
