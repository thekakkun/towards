import useStages from "../../hooks/useStages";

export default function Progress(stages: ReturnType<typeof useStages>) {
  if (stages.list === null) {
    throw new Error("Stages not initialized.");
  }

  return (
    <ol className="flex flex-row gap-1">
      {stages.list.map((stage, i) => (
        <li key={i} className="flex-1 bg-slate-400">
          <p className="text-center">{i + 1}</p>
          {stage ? <p className="text-center">{stage.city}</p> : null}
          {stage !== null && "score" in stage && (
            <p className="text-center">{stage.score}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
