import { BiLink } from "react-icons/bi";
import { PiBrainBold } from "react-icons/pi";
export default function QuestionTitle({ question, clickHandler }) {
  const { title, link, nextReviewDate, lastRevisedAt } = question;

  // Dynamic color logic based on percentage of interval passed
  const colorClass = getDynamicColor(lastRevisedAt, nextReviewDate);

  return (
    <div
      onClick={question.isTemp ? null : clickHandler}
      className={`flex justify-between bg-light-dark py-2 px-3 mb-3 rounded-md text-white transition-opacity duration-300 ${
        question.isTemp
          ? "opacity-80 pointer-events-none cursor-default grayscale"
          : "opacity-100 pointer-events-auto cursor-pointer"
      }`}
    >
      <div className={`flex items-center gap-2`}>
        <div>{title}</div>
        <a href={link} target="_blank" onClick={(e) => e.stopPropagation()}>
          <BiLink
            className={link ? `text-amber-500 hover:text-amber-600` : "hidden"}
          />
        </a>
      </div>
      <div className="px-2 py-1">
        <PiBrainBold className={`text-xl ${colorClass}`} />
      </div>
    </div>
  );
}

function getDynamicColor(lastRevisedAt, nextReviewDate) {
  if (!lastRevisedAt || !nextReviewDate) return "text-gray-500";
  const now = new Date();
  const last = new Date(lastRevisedAt);
  const next = new Date(nextReviewDate);

  const intervalMs = Math.max(60 * 1000, next - last); // at least 1 minute
  const elapsedMs = now - last;
  const progress = Math.max(0, elapsedMs / intervalMs);

  if (progress < 0.5) return "text-green-500"; // 0-50% of interval (green)
  if (progress < 0.8) return "text-yellow-600"; // 50-80% of interval (yellow)
  if (progress < 1) return "text-red-600"; // 80-100% of interval (red)
  return "text-gray-500"; // 100%+ of interval (gray)
}
