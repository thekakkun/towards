import { useState } from "react";
import { GameState } from "../types/game";

import { getScore } from "../utilities/game";
import useCoordinates from "./useCoordinates";
import useHeading from "./useHeading";
import useStages from "./useStages";

export default function useGame(
  stages: ReturnType<typeof useStages>,
  coordinates: ReturnType<typeof useCoordinates>,
  heading: ReturnType<typeof useHeading>
) {
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
