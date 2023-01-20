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
  // const position = usePosition();
  const coordinates = useCoordinates();
  const heading = useHeading();

  const stages = useStages();
  const game = useGame(stages, coordinates, heading);

  function getContent() {
    if (game.state === "intro") {
      return <Intro {...{ coordinates, heading }}></Intro>;
    } else if (game.state === "outro") {
      return <Outro {...stages}></Outro>;
    } else {
      return <Game {...{ game, coordinates, heading, stages }}></Game>;
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
