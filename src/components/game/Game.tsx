import useCoordinates from "../../hooks/useCoordinates";
import useGame from "../../hooks/useGame";
import useHeading from "../../hooks/useHeading";
import useStages from "../../hooks/useStages";

import AnswerInfo from "./AnswerInfo";
import Compass from "./Compass";
import GuessInfo from "./GuessInfo";
import Map from "./map/Map";
import Progress from "./Progress";

interface GameProps {
  game: ReturnType<typeof useGame>;
  coordinates: ReturnType<typeof useCoordinates>;
  heading: ReturnType<typeof useHeading>;
  stages: ReturnType<typeof useStages>;
}

export default function Game({
  game,
  coordinates,
  heading,
  stages,
}: GameProps) {
  if (heading === null) {
    throw new Error("Heading not available.");
  } else if (coordinates === null) {
    throw new Error("Coordinates not available.");
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <Progress {...stages}></Progress>
      {game.state === "guess" ? (
        <>
          <GuessInfo {...{ stages, coordinates }}></GuessInfo>
          <Compass {...heading}></Compass>
        </>
      ) : (
        <>
          <AnswerInfo {...stages}></AnswerInfo>
          <Map {...{ stages, coordinates }}></Map>
        </>
      )}
    </div>
  );
}
