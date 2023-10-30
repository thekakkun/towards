import useStages from "../../hooks/useStages";

export default function Progress({
  stages,
}: {
  stages: ReturnType<typeof useStages>;
}) {
  if (stages.list === null) {
    throw new Error("Stages not initialized.");
  }

  return (
    <ol className="flex flex-row gap-2">
      {stages.list.map((stage, i) => (
        <li
          key={i}
          className={`flex-1 rounded-lg p-2 ${
            stage === null
              ? "bg-stone-300"
              : "score" in stage && stage !== stages.current()
              ? "bg-stone-400"
              : "bg-stone-700"
          }`}
        >
          <p
            className={`text-center font-bold ${
              stage === null
                ? "text-stone-100"
                : "score" in stage && stage !== stages.current()
                ? "text-stone-900"
                : "text-stone-50"
            }`}
          >
            {i + 1}
          </p>

          <p
            className={`text-center ${
              stage === null
                ? "text-stone-100"
                : "score" in stage && stage !== stages.current()
                ? "text-stone-900"
                : "text-stone-50"
            }`}
          >
            {stage !== null && "score" in stage ? stage.score : "\u00A0"}
          </p>
        </li>
      ))}
    </ol>
  );
}
