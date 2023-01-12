import usePosition from "../hooks/usePosition";

export default function Intro(position: ReturnType<typeof usePosition>) {
  return (
    <div className="">
      <p>
        This is a geography game in which you try and guess which direction the
        specified city lies.
      </p>
      <h2 className="text-lg font-bold">How to play:</h2>
      <p>
        Try and guess which direction the specified city lies. There will be
        five stages, worth 200 points each, for a total of 1,000 points.
      </p>

      <h3 className="text-base font-bold text-slate-700">Tips:</h3>
      <ul className="list-disc list-inside">
        <li>
          If you're not sure where the city is, you can re-roll up to 3 times
          per game.
        </li>
      </ul>

      <h2 className="text-lg font-bold mt-3">Requirements:</h2>

      <p>
        In order to play, the game needs to know your location and which
        direction you're facing.
      </p>
      <p>
        At this point, the game is confirmed to run on the following browsers:
      </p>
      <ul>
        <li>
          Android
          <ul>
            <li className="list-disc list-inside">Chrome</li>
          </ul>
        </li>
        <li>
          iOS
          <ul>
            <li className="list-disc list-inside">
              None (sorry, it's in the works!)
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
