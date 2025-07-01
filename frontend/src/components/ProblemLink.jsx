export default function ProblemLink({ isEditing, editFields,setEditFields }) {
  return (
    <>
      {isEditing ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Problem Link</h2>
          <input
            className="bg-light-dark text-amber-100 p-2 rounded w-full"
            type="link"
            value={editFields.link}
            onChange={(e) =>
              setEditFields({ ...editFields, link: e.target.value })
            }
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}
