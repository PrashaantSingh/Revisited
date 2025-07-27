
export default function MarkVisitedButton({ visited, setIsMarkingVisited }) {
  return (
    <button
      onClick={() => setIsMarkingVisited(true)}
      disabled={visited}
      className={`text-sm px-4 py-2 w-30 rounded-full transition-all duration-200 ease-in
          ${
            visited
              ? "bg-green-600 text-white cursor-not-allowed"
              : "bg-light-dark text-green-500 cursor-pointer"
          }`}
    >
      {visited ? "✓ Visited" : "Mark Visited"}
    </button>
  );
}
