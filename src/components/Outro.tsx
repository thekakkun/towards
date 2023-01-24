import useStages from "../hooks/useStages";
import { CompletedLocation } from "../types/game";

export default function Outro(stages: ReturnType<typeof useStages>) {
  if (stages.list === null) {
    throw new Error("Stages not initialized.");
  }

  const totalScore = stages.list.reduce(
    (prev, curr) => prev + (curr as CompletedLocation).score,
    0
  );

  return (
    <div>
      <h1 className="text-lg font-bold">Good Job!</h1>
      <p className="text-lg text-emerald-700 font-semibold">
        You scored <span className="font-bold">{totalScore} / 1,000</span>
      </p>

      <h2 className="text-base font-bold text-stone-700 mt-2">Breakdown</h2>
      <table className="table-auto w-full">
        <tbody>
          {stages.list.map((stage, i) => {
            if (stage === null || !("score" in stage)) {
              throw new Error("Stage not completed");
            }
            return (
              <tr key={stage.city + stage.country}>
                <td className="py-2 pr-2 align-top">{i + 1}.</td>
                <td className="py-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${stage.latitude},${stage.longitude}`}
                    className="underline text-sky-600"
                  >
                    {stage.city}, {stage.country}
                  </a>
                </td>
                <td className="py-2 text-right">{stage.score} / 200</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="font-bold text-lg">
          <tr>
            <td className="py-2" colSpan={2}>
              Total:
            </td>
            <td className="py-2 text-right text-emerald-700">
              {totalScore} / 1,000
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
