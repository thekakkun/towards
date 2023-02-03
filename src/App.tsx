import Button from "./components/Button";
import Game from "./components/game/Game";
import Intro from "./components/intro/Intro";
import Outro from "./components/Outro";
import useCoordinates from "./hooks/useCoordinates";
import useGame from "./hooks/useGame";
import useHeading from "./hooks/useHeading";
import useStages from "./hooks/useStages";

function App() {
  const coordinates = useCoordinates();
  const heading = useHeading();
  const stages = useStages();
  const game = useGame(stages, coordinates, heading);

  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex-none w-full pt-4 px-4">
        <h1 className="text-stone-800 text-xl font-bold">🧭 Over Yonder!</h1>
      </header>
      <button onClick={coordinates.bump}>bump</button>

      <div className="w-full  mt-4 px-4">
        {game.state === "intro" ? (
          <Intro {...{ coordinates, heading }}></Intro>
        ) : game.state === "outro" ? (
          <Outro {...stages}></Outro>
        ) : (
          <Game {...{ game, coordinates, heading, stages }}></Game>
        )}
      </div>
      <Button {...{ game, coordinates, heading }}></Button>
    </div>
  );
}

export default App;
