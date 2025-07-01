
import CodeBlock from "./CodeBlock";
export default function ProblemCode({isEditing,editFields,setEditFields,question}) {
  return (
    <>
      {<div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Code</h2>
        <div className="rounded-md overflow-hidden">
          {isEditing ? (
            <textarea
              className="bg-light-dark p-2 rounded w-full"
              value={editFields.code}
              onChange={(e) =>
                setEditFields({ ...editFields, code: e.target.value })
              }
              rows={8}
            />
          ) : (
            <CodeBlock code={question.code} language="javascript" />
          )}
        </div>
      </div>}
    </>
  );
}
