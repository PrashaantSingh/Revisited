import { BiLink } from "react-icons/bi";
import { PiBrainBold } from "react-icons/pi";
export default function QuestionTitle({ question, clickHandler }) {
  const { title, difficulty, link, lastRevisedAt } = question;
  const daysAgo = getDaysAgo(lastRevisedAt);

  const colorClass =
    {
      hard: "text-red-500",
      medium: "text-yellow-500",
      easy: "text-green-500",
    }[difficulty.toLowerCase()] || "";

  return (
    <div
      onClick={clickHandler}
      className={`flex justify-between bg-light-dark py-2 px-3 mb-3 rounded-md cursor-pointer text-white`}
    >
      <div className="flex items-center gap-2">
        <div>{title}</div>
        <a href={link} target="_blank" onClick={(e) => e.stopPropagation()}>
          <BiLink
            className={link ? `text-amber-500 hover:text-amber-600` : "hidden"}
          />
        </a>
      </div>
      <div className="px-2 py-1">
        <PiBrainBold
          className={`text-xl ${
            daysAgo <= 2
              ? "text-green-500"
              : daysAgo <= 4
              ? "text-yellow-600"
              : daysAgo <= 7
              ? "text-red-600"
              : "text-gray-500"
          }`}
        />

        {/* <p className={`${colorClass} font-semibold text-sm leading-none px-2 py-1 rounded-md`}>
          {difficulty.length > 4
            ? capitalize(difficulty.slice(0, 3) + ".")
            : capitalize(difficulty)}
        </p> */}
      </div>
    </div>
  );
}

function getDaysAgo(dateString) {
  const now = new Date();
  const revisedDate = new Date(dateString);

  const timeDiff = now - revisedDate; 
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); 

  return daysAgo;
}
