import { useState } from "react";

import {
  Coordinates,
  Degrees,
  GameState,
  SensorHook,
  TargetLocation,
} from "../types/over-yonder";
import { getBearing } from "../utilities/cartography";
import useStages from "./useStages";

export default function useGame(
  stages: ReturnType<typeof useStages>,
  coordinates: SensorHook<Coordinates>,
  heading: SensorHook<Degrees>
): {
  state: GameState;
  advance: () => void;
} {
  const [gameState, setGameState] = useState<GameState>("intro");

  /**
   * Advance the game state based on current state.
   */
  function advance() {
    switch (gameState) {
      case "intro":
        stages.setNext(coordinates);
        setGameState("guess");
        break;

      case "guess":
        if (heading.value === null) {
          throw new Error("Heading is null.");
        }

        const score = getScore(stages.current(), coordinates, heading);
        stages.makeGuess({ heading: heading.value, score });

        if (stages.onFinal()) {
          setGameState("last answer");
        } else {
          setGameState("answer");
        }
        break;

      case "answer":
        stages.setNext(coordinates);
        setGameState("guess");

        break;

      case "last answer":
        setGameState("outro");
        break;

      case "outro":
        stages.reset();
        setGameState("intro");
        break;

      default:
        break;
    }
  }

  return {
    state: gameState,
    advance,
  };
}

/**
 * Calculate user's score.
 * @param target Coordinate of target city.
 * @param coordinates Coordinate of user location.1
 * @param heading User's direction.
 * @returns User's score for that stage.
 */
function getScore(
  target: TargetLocation,
  coordinates: SensorHook<Coordinates>,
  heading: SensorHook<Degrees>
) {
  const maxScore = 200;

  if (heading.value === null) {
    throw Error("Heading not available");
  }
  if (coordinates.value === null) {
    throw Error("User position not available.");
  }

  const bearing = getBearing(coordinates.value, target);
  const degreeDelta = Math.min(
    Math.abs(bearing - heading.value),
    360 - Math.abs(bearing - heading.value)
  );

  return Math.round(maxScore * (1 - degreeDelta / 180) ** 2);
}
