import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IoCopy } from "react-icons/io5";
import {
  vscDarkPlus,
  tomorrow,
  atomDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function CodeBlock({ code, language = "java" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 bg-light-dark text-amber-100 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? (
          "Copied!"
        ) : (
          <IoCopy className="cursor-pointer text-amber-100" />
        )}
      </button>

      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        wrapLongLines
        showLineNumbers
        customStyle={{ fontSize: "1rem", borderRadius: "8px" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
