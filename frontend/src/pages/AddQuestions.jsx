import { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router";

const AddQuestionForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    problemStatement: "",
    code: "",
    algorithm: "",
    notes: "",
    tags: "",
    link: "",
    difficulty: "easy", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionData = {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()),
      createdAt: new Date(),
      lastRevisedAt: new Date(),
    };

    try {
      const res = await fetch("http://localhost:3000/api/questions/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(questionData),
      });

      const data = await res.json();
      if (data.success) {
        navigate("/");
      }
      console.log();
      setForm({
        title: "",
        problemStatement: "",
        code: "",
        algorithm: "",
        notes: "",
        tags: "",
        link: "",
        difficulty: "easy", // reset to default value
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      {/* <Header /> */}
      <div className="w-[90%] text-amber-600 mx-auto text-3xl m-5">
        <IoMdArrowRoundBack
          className="cursor-pointer"
          onClick={() => handleBack()}
        />
      </div>
      <div className="flex-grow flex justify-center items-start p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl p-6 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-2xl font-semibold text-white text-center">
            Add New Question
          </h2>

          <div>
            <label className="block font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-md p-2 focus:outline-none focus:border-amber-600 bg-light-dark"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Problem Link</label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Problem Statement</label>
            <textarea
              name="problemStatement"
              value={form.problemStatement}
              onChange={handleChange}
              rows="5"
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Code</label>
            <textarea
              name="code"
              value={form.code}
              onChange={handleChange}
              rows="6"
              className="w-full font-mono bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Algorithm</label>
            <textarea
              name="algorithm"
              value={form.algorithm}
              onChange={handleChange}
              rows="4"
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
              placeholder="e.g. array, binary search, dp"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full bg-light-dark rounded-md p-2 focus:outline-none focus:border-amber-600"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md shadow"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionForm;
