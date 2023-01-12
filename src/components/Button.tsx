import useGame, { GameState } from "../hooks/useGame";

export default function Button(game: ReturnType<typeof useGame>) {
  return (
    <button
      className="rounded-full bg-slate-500 text-slate-50 w-3/4 p-4"
      onClick={game.advance}
    >
      {buttonText(game)}
    </button>
  );
}

function buttonText({ state: gameState }: ReturnType<typeof useGame>) {
  switch (gameState) {
    case GameState.Permissions:
      return "Provide permissions";

    case GameState.Ready:
      return "Start Game";

    case GameState.Guess:
      return "Make guess";

    case GameState.Answer:
      return "Next location";

    case GameState.LastAnswer:
      return "Final results";

    case GameState.Outro:
      return "New game";

    default:
      break;
  }
}
