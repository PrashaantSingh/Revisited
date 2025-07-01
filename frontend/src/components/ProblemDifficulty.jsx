export default function ProblemDifficulty({isEditing,editFields,setEditFields,question}) {
      const bgColorClass =
        {
          hard: "bg-red-600",
          medium: "bg-yellow-600",
          easy: "bg-green-600",
        }[question?.difficulty?.toLowerCase()] || "";
  return (
    <>
      {isEditing ? (
        <select
          name="difficulty"
          id="difficulty"
          className="bg-light-dark px-2 py-1 rounded-md "
          value={editFields.difficulty}
          onChange={(e) =>
            setEditFields({
              ...editFields,
              difficulty: e.target.value.toLowerCase(),
            })
          }
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      ) : (
        question.difficulty && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${bgColorClass}`}
          >
            {question.difficulty.charAt(0).toUpperCase() +
              question.difficulty.slice(1)}
          </span>
        )
      )}
    </>
  );
}
