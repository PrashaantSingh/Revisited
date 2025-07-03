export default function ProblemStatement({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  if (
    !isEditing &&
    (!question.problemStatement || question.problemStatement.trim() === "")
  )
    return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Problem Statement</h2>
      {isEditing ? (
        <textarea
          className="bg-light-dark text-amber-100 p-2 rounded w-full"
          value={editFields.problemStatement}
          onChange={(e) =>
            setEditFields({
              ...editFields,
              problemStatement: e.target.value,
            })
          }
        />
      ) : (
        <p className="bg-light-dark text-amber-200 p-4 rounded-md whitespace-pre-wrap">
          {question.problemStatement}
        </p>
      )}
    </div>
  );
}
