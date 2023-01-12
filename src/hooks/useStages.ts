import { useState } from "react";

import {
  CompletedLocation,
  CurrentLocation,
  Guess,
  StageList,
} from "../types/game";
import { getRandomCity } from "../utilities/game";

export default function useStages(length = 5) {
  const initialStages: StageList = new Array(length).fill(null);
  const [stages, setStages] = useState<StageList>(initialStages);

  function current(): CurrentLocation | CompletedLocation {
    let lastStage = stages.reduce(
      (accumulator, currentValue) =>
        (accumulator = currentValue !== null ? currentValue : accumulator)
    );

    if (lastStage === null) {
      throw new Error("Game not started.");
    } else {
      return lastStage;
    }
  }

  function setNext(): CurrentLocation {
    const nextStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage == null) {
        setStages([...stages.slice(0, i), nextStage, ...stages.slice(i + 1)]);
        return nextStage;
      }
    }

    throw new Error("Max number of stages reached.");
  }

  function reroll() {
    const newStage = getRandomCity(stages);

    for (const [i, stage] of stages.entries()) {
      if (stage !== null && !("score" in stage)) {
        setStages([...stages.slice(0, i), newStage, ...stages.slice(i + 1)]);
        return;
      }
    }

    throw new Error("No stages in progress.");
  }

  function makeGuess(guess: Guess): void {
    const nextStages = stages.map((stage) => {
      if (stage !== null && !("score" in stage)) {
        return { ...stage, ...guess };
      } else {
        return stage;
      }
    });

    setStages(nextStages);
  }

  function onFinal(): boolean {
    return stages[length - 1] !== null;
  }

  function reset() {
    setStages(initialStages);
  }

  return {
    list: stages,
    current,
    setNext,
    reroll,
    makeGuess,
    onFinal,
    reset,
  };
}
