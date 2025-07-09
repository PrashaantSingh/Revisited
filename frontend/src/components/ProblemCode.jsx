// import CodeBlock from "./CodeBlock";
// import { js_beautify } from "js-beautify";
// import prettier from "prettier/standalone";
// import parserJava from "prettier-plugin-java";

// export default function ProblemCode({
//   isEditing,
//   editFields,
//   setEditFields,
//   question,
// }) {
//   const formattedCode = prettier.format(question.code, {
//     parser: "java",
//     tabWidth: 2,
//     plugins: [parserJava],
//   });

//   console.log(formattedCode)

//   // const formattedCode = js_beautify(question.code, {
//   //   indent_size: 2,
//   //   indent_with_tabs: false,
//   //   brace_style: "collapse",
//   // });

//   if (!isEditing && (!question.code || question.code.trim() === ""))
//     return null;

//   return (
//     <div className="mb-6">
//       <h2 className="text-lg font-semibold mb-2">Code</h2>
//       <div className="rounded-md overflow-hidden">
//         {isEditing ? (
//           <textarea
//             className="bg-light-dark p-2 rounded w-full"
//             value={editFields.code}
//             onChange={(e) =>
//               setEditFields({ ...editFields, code: e.target.value })
//             }
//             rows={8}
//           />
//         ) : (
//           <CodeBlock code={formattedCode} language="java" />
//         )}
//       </div>
//     </div>
//   );
// }

import CodeBlock from "./CodeBlock";
import { useState, useEffect } from "react";
import prettier from "prettier/standalone";
import parserJava from "prettier-plugin-java";

export default function ProblemCode({
  isEditing,
  editFields,
  setEditFields,
  question,
}) {
  const [formattedCode, setFormattedCode] = useState("");

  useEffect(() => {
    async function formatCode() {
      if (!question.code) return;

      try {
        const result = await prettier.format(question.code, {
          parser: "java",
          tabWidth: 2,
          plugins: [parserJava],
        });

        setFormattedCode(result);
      } catch (err) {
        console.error("Failed to format code:", err);
        setFormattedCode(question.code); // fallback
      }
    }

    formatCode();
  }, [question.code]);

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
