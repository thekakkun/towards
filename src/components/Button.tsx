import useGame from "../hooks/useGame";

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
    case "intro":
      return "Start Game";

    case "guess":
      return "Make guess";

    case "answer":
      return "Next location";

    case "last answer":
      return "Final results";

    case "outro":
      return "Play again";

    default:
      break;
  }
}
