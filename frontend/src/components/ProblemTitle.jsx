
import { BiLink } from "react-icons/bi";
export default function ProblemTitle({isEditing,editFields,setEditFields,question}) {
  return (
    <>
      {isEditing ? (
        <input
          className="text-2xl font-bold leading-none px-2 rounded bg-light-dark"
          value={editFields.title}
          onChange={(e) =>
            setEditFields({ ...editFields, title: e.target.value })
          }
        />
      ) : (
        <div className="flex gap-3 items-center">
          <h1 className="text-2xl font-bold leading-none">
            {question.title?.toUpperCase()}
          </h1>
          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500"
            >
              <BiLink className="text-2xl" />
            </a>
          )}
        </div>
      )}
    </>
  );
}
