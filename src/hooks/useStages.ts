import { useState } from "react";

import {
  CompletedLocation,
  CurrentLocation,
  Guess,
  StageList,
} from "../types/game";
import { getRandomCity } from "../utilities/game";
import useCoordinates from "./useCoordinates";

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

  /**
   * Sets the next stage.
   * @param coordinates The user's location.
   * @returns The new stage.
   */
  function setNext(
    coordinates: ReturnType<typeof useCoordinates>
  ): CurrentLocation {
    const nextStage = getRandomCity(stages, coordinates);

    for (const [i, stage] of stages.entries()) {
      if (stage == null) {
        setStages([...stages.slice(0, i), nextStage, ...stages.slice(i + 1)]);
        return nextStage;
      }
    }

    throw new Error("Max number of stages reached.");
  }

  /**
   * Re-rolls the current stage.
   * @param coordinates The user's location
   * @returns
   */
  function reroll(coordinates: ReturnType<typeof useCoordinates>) {
    const newStage = getRandomCity(stages, coordinates);

    for (const [i, stage] of stages.entries()) {
      if (stage !== null && !("score" in stage)) {
        setStages([...stages.slice(0, i), newStage, ...stages.slice(i + 1)]);
        return;
      }
    }

    throw new Error("No stages in progress.");
  }

  /**
   * Update the score based on user's guess and set the next stage.
   * @param guess Heading guessed by user.
   */
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

  /**
   * Checks whether game is on final stage.
   * @returns Whether user is on final stage.
   */
  function onFinal(): boolean {
    return stages[length - 1] !== null;
  }

  /**
   * Reset the game
   */
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
