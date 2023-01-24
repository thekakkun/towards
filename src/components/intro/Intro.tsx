import useCoordinates from "../../hooks/useCoordinates";
import useHeading from "../../hooks/useHeading";
import CoordinatesInfo from "./CoordinatesInfo";
import HeadingInfo from "./HeadingInfo";

interface IntroProps {
  coordinates: ReturnType<typeof useCoordinates>;
  heading: ReturnType<typeof useHeading>;
}

export default function Intro({ coordinates, heading }: IntroProps) {
  return (
    <div className="mb-28">
      <p>
        This is a location-based smartphone game where you try to guess which
        way cities around the world are.
      </p>
      <ul className="list-disc pl-4">
        <li>
          You'll get five cities, each worth 200 points for a total score out of
          1,000.
        </li>
        <li>You can re-roll your target city up to 3 times per game.</li>
      </ul>

      <h2 className="text-lg text-stone-800 font-bold mt-3">Requirements</h2>
      <p>
        The game requires permission to access your geolocation and compass
        heading to play. No user data will be collected by the game or shared
        with third-parties.
      </p>

      <ul className="list-inside mt-2">
        <CoordinatesInfo {...coordinates}></CoordinatesInfo>
        <HeadingInfo {...heading}></HeadingInfo>
      </ul>

      <h3 className="text-base font-bold text-stone-700 mt-2">
        Supported browsers
      </h3>

      <ul className="list-disc pl-4">
        <li>
          <span className="font-semibold">Android OS</span>: Chrome
        </li>
        <li>
          <span className="font-semibold">iOS</span>: Safari
        </li>
      </ul>

      <h2 className="text-lg text-stone-800 font-bold mt-3">Learn more</h2>
      <a
        className="text-sky-700 underline"
        href="https://github.com/thekakkun/over-yonder/"
        target="_blank"
        rel="noreferrer"
      >
        Source code on GitHub
      </a>
    </div>
  );
}
