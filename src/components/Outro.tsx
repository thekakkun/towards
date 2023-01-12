import useStages from "../hooks/useStages";
import { CompletedLocation } from "../types/game";

export default function Outro(stages: ReturnType<typeof useStages>) {
  if (stages.list === null) {
    throw new Error("Stages not initialized.");
  }

  return (
    <div>
      <h1 className="text-lg font-bold">Good Job!</h1>
      <p>
        You scored{" "}
        {`${stages.list.reduce(
          (prev, curr) => prev + (curr as CompletedLocation).score,
          0
        )}/1000`}
      </p>

      <h2 className="text-base font-bold text-slate-700 mt-3">Breakdown</h2>
      <ol>
        {stages.list.map((stage) => {
          if (stage === null || !("score" in stage)) {
            throw new Error("Stage not completed");
          }
          return (
            <li
              className="list-decimal list-inside"
              key={`${stage.city}_${stage.country}`}
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${stage.latitude},${stage.longitude}`}
                className="underline text-sky-500"
              >{`${stage.city}, ${stage.country}`}</a>
              {`: ${stage.score}/200`}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
