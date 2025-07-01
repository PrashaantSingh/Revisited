
import { FaTags } from "react-icons/fa";
export default function ProblemTag({isEditing,editFields,setEditFields,question}) {
  return (
    <>
      {isEditing ? (
        <input
          className="bg-light-dark px-2 py-1 rounded-md"
          type="text"
          value={editFields.tags.join(",")}
          onChange={(e) =>
            setEditFields({
              ...editFields,
              tags: [...e.target.value.split(",")],
            })
          }
          placeholder="eg: array, searching"
        />
      ) : (
        Array.isArray(question.tags) &&
        question.tags.filter((tag) => tag.trim() != "").length > 0 && (
          <span>
            <div className="flex gap-3 items-center bg-light-dark px-3 py-1.5 rounded-full">
              <FaTags className="text-lg" />
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-amber-500 px-1.5 py-1 rounded-full text-xs"
                  >
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </span>
        )
      )}
    </>
  );
}
