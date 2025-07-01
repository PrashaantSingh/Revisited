export default function ProblemAlgo({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  return (
    <>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Algorithm</h2>
          {isEditing ? (
            <textarea
              className="bg-light-dark p-2 rounded w-full"
              value={editFields.algorithm}
              onChange={(e) =>
                setEditFields({ ...editFields, algorithm: e.target.value })
              }
            />
          ) : (
            <p className="bg-light-dark p-4 rounded-md whitespace-pre-wrap">
              {question.algorithm}
            </p>
          )}
        </div>
    </>
  );
}
