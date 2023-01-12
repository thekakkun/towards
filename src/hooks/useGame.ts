import { useEffect, useState } from "react";

import { getScore } from "../utilities/game";
import usePosition from "./usePosition";
import useStages from "./useStages";

export enum GameState {
  Permissions,
  Ready,
  Guess,
  Answer,
  LastAnswer,
  Outro,
}

export default function useGame(
  stages: ReturnType<typeof useStages>,
  position: ReturnType<typeof usePosition>
) {
  const [gameState, setGameState] = useState(GameState.Permissions);

  useEffect(() => {
    if (gameState === GameState.Permissions) {
      if (position.coordinates.value && position.heading.value) {
        setGameState(GameState.Ready);
      } else if (
        position.coordinates.permission === "granted" &&
        position.heading.permission === "granted"
      ) {
        position.coordinates.requestPermission();
        position.heading.requestPermission();
      }
    }
  }, [gameState, position.coordinates, position.heading]);

  function advance() {
    switch (gameState) {
      case GameState.Permissions:
        position.coordinates.requestPermission();
        position.heading.requestPermission();
        break;

      case GameState.Ready:
        stages.setNext();
        setGameState(GameState.Guess);
        break;

      case GameState.Guess:
        if (position.heading.value === null) {
          throw new Error("Heading is null.");
        }

        const score = getScore(stages.current(), {
          coordinates: position.coordinates.value,
          heading: position.heading.value,
        });
        stages.makeGuess({ heading: position.heading.value, score });

        if (stages.onFinal()) {
          setGameState(GameState.LastAnswer);
        } else {
          setGameState(GameState.Answer);
        }
        break;

      case GameState.Answer:
        stages.setNext();
        setGameState(GameState.Guess);

        break;

      case GameState.LastAnswer:
        setGameState(GameState.Outro);
        break;

      case GameState.Outro:
        stages.reset();
        setGameState(GameState.Ready);
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
