export default function ProblemNotes({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  if (!isEditing && !question.notes) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Notes</h2>
      {isEditing ? (
        <textarea
          className="bg-light-dark p-2 rounded w-full"
          value={editFields.notes}
          onChange={(e) =>
            setEditFields({ ...editFields, notes: e.target.value })
          }
        />
      ) : (
        question.notes && (
          <p className="bg-light-dark p-4 rounded-md whitespace-pre-wrap text-amber-50 text-base leading-relaxed">
            {question.notes}
          </p>
        )
      )}
    </div>
  );
}
