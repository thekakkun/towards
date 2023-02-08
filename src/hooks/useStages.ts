import { useState } from "react";

import cities from "../assets/data/cities.json";
import {
  CompletedLocation,
  Coordinates,
  Guess,
  SensorHook,
  StageList,
  TargetLocation,
} from "../types/over-yonder";
import { getDistance } from "../utilities/cartography";

export default function useStages(length = 5): {
  list: StageList;
  current: () => TargetLocation | CompletedLocation;
  setNext: (coordinates: SensorHook<Coordinates>) => void;
  reroll: (coordinates: SensorHook<Coordinates>) => void;
  makeGuess: (guess: Guess) => void;
  onFinal: () => boolean;
  reset: () => void;
} {
  const initialStages: StageList = new Array(length).fill(null);
  const [stages, setStages] = useState<StageList>(initialStages);

  function current(): TargetLocation | CompletedLocation {
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
  function setNext(coordinates: SensorHook<Coordinates>): void {
    const nextStage = getRandomCity(stages, coordinates);

    for (const [i, stage] of stages.entries()) {
      if (stage == null) {
        setStages([...stages.slice(0, i), nextStage, ...stages.slice(i + 1)]);
        return;
      }
    }

    throw new Error("Max number of stages reached.");
  }

  /**
   * Re-rolls the current stage.
   * @param coordinates The user's location
   * @returns
   */
  function reroll(coordinates: SensorHook<Coordinates>) {
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

/**
 * Select a random city from the list in /assets.
 * Filters out previously played cities and
 * cities that are too close (too easy).
 * @param stages Current list of stages.
 * @param coordinates Coordinate of user location.
 * @returns A random city, from the city list in.
 */
function getRandomCity(
  stages: StageList,
  coordinates: SensorHook<Coordinates>
) {
  let candidate: TargetLocation;

  /**
   * Checks to see that candidate city isn't too close to user location.
   * Wouldn't want to have to guess the location of your own city.
   * @returns Whether city is too close
   */
  function cityTooClose(): boolean {
    const limit = 100;
    if (coordinates.value === null) {
      return true;
    }
    return getDistance(candidate, coordinates.value) < limit;
  }

  /**
   * Checks that user hasn't already played a stage with the candidate city.
   * @returns Whether city has already been guessed by user.
   */
  function candidateInStages(): boolean {
    return Boolean(
      stages.filter((stage) => {
        return (
          stage !== null &&
          stage.country === candidate.country &&
          stage.city === candidate.city
        );
      }).length
    );
  }

  do {
    candidate = cities[Math.floor(Math.random() * cities.length)];
  } while (candidateInStages() || cityTooClose());

  return candidate;
}
