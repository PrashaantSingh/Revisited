export default function ProblemNotes({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      {isEditing ? (
        <textarea
          className="bg-light-dark p-2 rounded w-full"
          value={editFields.notes}
          onChange={(e) =>
            setEditFields({ ...editFields, notes: e.target.value })
          }
        />
      ) : (
        <p className="bg-light-dark p-4 rounded-md whitespace-pre-wrap">
          {question.notes}
        </p>
      )}
    </div>
  );
}
