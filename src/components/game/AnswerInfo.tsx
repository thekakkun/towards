import useStages from "../../hooks/useStages";

export default function AnswerInfo(stages: ReturnType<typeof useStages>) {
  const target = stages.current();

  if (!("score" in target)) {
    throw new Error("stage is unscored.");
  }

  return (
    <div>
      <p>Your target:</p>
      <p>{`${target.city}, ${target.country}`}</p>

      <p>You scored:</p>
      <p>{target.score}</p>
    </div>
  );
}
