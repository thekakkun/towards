import useGame, { GameState } from "../../hooks/useGame";
import useStages from "../../hooks/useStages";
import { Position } from "../../types/game";
import AnswerInfo from "./AnswerInfo";
import Compass from "./Compass";
import Display from "./Display";
import GuessInfo from "./GuessInfo";
import Map from "./Map";
import Progress from "./Progress";

interface GameProps {
  game: ReturnType<typeof useGame>;
  position: Position;
  stages: ReturnType<typeof useStages>;
}

export default function Game({ game, position, stages }: GameProps) {
  if (position.heading === null) {
    throw new Error("Heading not available.");
  } else if (position.coordinates === null) {
    throw new Error("Coordinates not available.");
  }

  const guessDisplay = (
    <Display
      info={<GuessInfo {...stages}></GuessInfo>}
      visualization={<Compass heading={position.heading}></Compass>}
    ></Display>
  );
  const answerDisplay = (
    <Display
      info={<AnswerInfo {...stages}></AnswerInfo>}
      visualization={<Map stages={stages} position={position}></Map>}
    ></Display>
  );

  return (
    <div className="h-full flex flex-col gap-3">
      <Progress {...stages}></Progress>
      {game.state === GameState.Guess ? guessDisplay : answerDisplay}
    </div>
  );
}
