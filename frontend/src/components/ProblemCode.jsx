import CodeBlock from "./CodeBlock";
import { js_beautify } from "js-beautify";

export default function ProblemCode({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {


  const formattedCode = js_beautify(question.code, {
    indent_size: 2,
    indent_with_tabs: false,
    brace_style: "collapse",
  });

  if (!isEditing && (!question.code || question.code.trim() === ""))
    return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Code</h2>
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
          <CodeBlock code={formattedCode} language="java" />
        )}
      </div>
    </div>
  );
}
