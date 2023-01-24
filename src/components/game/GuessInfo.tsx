import { useState } from "react";

import useStages from "../../hooks/useStages";

export default function GuessInfo(stages: ReturnType<typeof useStages>) {
  const [rolls, setRolls] = useState<number>(3);

  return (
    <div className="grid grid-rows-1 grid-cols-[1fr_max-content]">
      <p className="">Which way is...</p>
      <p className="text-lg text-emerald-900 font-semibold">{`${
        stages.current().city
      }, ${stages.current().country}`}</p>
      <button
        className={`row-start-1 col-start-2 row-span-2 place-self-center
        rounded-md h-min px-3 py-2 font-bold
        ${
          rolls ? "bg-emerald-600 text-stone-50" : "bg-stone-300 text-stone-100"
        }`}
        onClick={() => {
          if (rolls) {
            setRolls(rolls - 1);
            stages.reroll();
          }
        }}
      >
        {`🎲 × ${rolls}`}
      </button>
    </div>
  );
}
