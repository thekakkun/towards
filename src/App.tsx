import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/game/Game";
import Header from "./components/Header";
import Intro from "./components/intro/Intro";
import Outro from "./components/Outro";
import useCoordinates from "./hooks/useCoordinates";
import useGame, { GameState } from "./hooks/useGame";
import useHeading from "./hooks/useHeading";
import usePosition from "./hooks/usePosition";
import useStages from "./hooks/useStages";

function App() {
  const position = usePosition();
  const heading = useHeading();

  const stages = useStages();
  const game = useGame(stages, position);

  function getContent() {
    if (
      game.state === GameState.Permissions ||
      game.state === GameState.Ready
    ) {
      return <Intro {...position}></Intro>;
    } else if (game.state === GameState.Outro) {
      return <Outro {...stages}></Outro>;
    } else {
      return (
        <Game
          game={game}
          position={{
            coordinates: position.coordinates.value,
            heading: position.heading.value,
          }}
          stages={stages}
        ></Game>
      );
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-between pb-4">
      <Header></Header>
      <Content>{getContent()}</Content>
      <Button {...game}></Button>
    </div>
  );
}

export default App;
