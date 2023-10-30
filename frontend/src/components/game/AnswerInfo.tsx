import useStages from "../../hooks/useStages";

export default function AnswerInfo({
  stages,
}: {
  stages: ReturnType<typeof useStages>;
}) {
  const target = stages.current();

  if (!("score" in target)) {
    throw new Error("stage is unscored.");
  }

  return (
    <div className="mb-4">
      <p>
        Your target:{" "}
        <span className="text-lg text-emerald-700 font-semibold">
          {target.city}, {target.country}
        </span>
      </p>

      <p>
        You scored:{" "}
        <span className="text-lg text-emerald-700 font-semibold">
          {target.score} / 200
        </span>
      </p>
    </div>
  );
}
