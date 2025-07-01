

export default function LastRevisedAt({lastRevisedAt}) {
  return (
    <p
      className={`text-xs mt-2 text-amber-100 italic ${
        lastRevisedAt ? "visible" : "hidden"
      }`}
    >
      [ Last Visited: {lastRevisedAt} ]
    </p>
  );
}
