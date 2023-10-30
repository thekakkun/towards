import useGame from "../hooks/useGame";
import { Coordinates, Degrees, SensorHook } from "../types/over-yonder";

interface ButtonProps {
  game: ReturnType<typeof useGame>;
  coordinates: SensorHook<Coordinates>;
  heading: SensorHook<Degrees>;
}

export default function Button({ game, coordinates, heading }: ButtonProps) {
  return (
    <div className="w-full fixed bottom-0 inset-x-0 flex flex-col items-center bg-stone-100">
      <button
        className={`rounded-xl font-semibold w-3/4 p-4 my-4 mx-auto ${
          coordinates.state === "ready" && heading.state === "ready"
            ? "bg-emerald-600 text-stone-50"
            : "bg-stone-300 text-stone-100"
        }`}
        onClick={
          coordinates.state === "ready" && heading.state === "ready"
            ? game.advance
            : undefined
        }
      >
        {game.state === "intro"
          ? "Start Game"
          : game.state === "guess"
          ? "Make guess"
          : game.state === "answer"
          ? "Next location"
          : game.state === "last answer"
          ? "See results"
          : game.state === "outro"
          ? "Play again"
          : ""}
      </button>
    </div>
  );
}
