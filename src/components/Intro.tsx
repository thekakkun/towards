import usePosition from "../hooks/usePosition";

export default function Intro(position: ReturnType<typeof usePosition>) {
  return (
    <div className="">
      <p>
        This is a location-based geography game in which you try to face towards
        the target city.
      </p>

      {/* <h2 className="text-lg font-bold">How to play:</h2>
      <ul className="list-disc list-inside">
        <li>5 cities, 200 points each, GO!</li>
        <li>
          If you're not sure where the city is, you can re-roll up to 3 times
          per game.
        </li>
      </ul> */}

      <h2 className="text-lg font-bold mt-3">Requirements:</h2>
      <p>
        Being a location-based geograpy game, permission to access the following
        information is needed:
      </p>
      <ul className="list-disc list-inside">
        <li>Geolocation (where you currently are)</li>
        <li>Orientation (which way you're facing)</li>
      </ul>
      <p>
        No user data will be collected by the game or shared with third-parties.
      </p>

      <h3 className="text-base font-bold text-slate-700">
        Supported browsers:
      </h3>

      <ul className="list-disc list-inside">
        <li>Android OS: Chrome</li>
        <li>iOS: Safari</li>
      </ul>

      <h2 className="text-lg font-bold mt-3">Learn more:</h2>
      <a
        href="https://github.com/thekakkun/over-yonder/"
        target="_blank"
        rel="noreferrer"
      >
        Source code on GitHub
      </a>
    </div>
  );
}
