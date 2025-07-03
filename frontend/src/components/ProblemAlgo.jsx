export default function ProblemAlgo({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  if (!isEditing && (!question.algorithm || question.algorithm.trim() == ""))
    return null;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Approach</h2>
        {isEditing ? (
          <textarea
            className="bg-light-dark p-2 rounded w-full"
            value={editFields.algorithm}
            onChange={(e) =>
              setEditFields({ ...editFields, algorithm: e.target.value })
            }
          />
        ) : (
          question.algorithm && (
            <p className="bg-light-dark p-4 rounded-md whitespace-pre-wrap text-amber-50 leading-relaxed text-base">
              {question.algorithm}
            </p>
          )
        )}
      </div>
    </>
  );
}
