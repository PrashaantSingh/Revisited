export default function NextReviewDate({ nextReviewDate }) {
  return (
    <p
      className={`text-xs mt-2 text-amber-100 italic ${
        nextReviewDate ? "visible" : "hidden"
      }`}
    >
      [ Next Visit: {nextReviewDate} ]
    </p>
  );
}
