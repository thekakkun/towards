import Button from "./components/Button";
import Content from "./components/Content";
import Game from "./components/game/Game";
import Header from "./components/Header";
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
      <Header></Header>
      <Content>
        {game.state === "intro" ? (
          <Intro {...{ coordinates, heading }}></Intro>
        ) : game.state === "outro" ? (
          <Outro {...stages}></Outro>
        ) : (
          <Game {...{ game, coordinates, heading, stages }}></Game>
        )}
      </Content>
      <Button {...{ game, coordinates, heading }}></Button>
    </div>
  );
}

export default App;
