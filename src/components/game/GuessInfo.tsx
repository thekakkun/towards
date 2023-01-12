import { useState } from "react";

import useStages from "../../hooks/useStages";

export default function GuessInfo(stages: ReturnType<typeof useStages>) {
  const [rolls, setRolls] = useState<number>(3);

  return (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content]">
      <p className="">Which way is:</p>
      <p className="">{`${stages.current().city}, ${
        stages.current().country
      }`}</p>
      <button
        className="bg-slate-400 row-start-1 col-start-2 row-span-2"
        onClick={() => {
          if (rolls) {
            setRolls(rolls - 1);
            stages.reroll();
          }
        }}
      >
        {`Re-roll (${rolls})`}
      </button>
    </div>
  );
}
