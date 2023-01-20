import useCoordinates from "../../hooks/useCoordinates";
import useHeading from "../../hooks/useHeading";
import CoordinatesInfo from "./CoordinatesInfo";
import HeadingInfo from "./HeadingInfo";

interface IntroProps {
  coordinates: ReturnType<typeof useCoordinates>;
  heading: ReturnType<typeof useHeading>;
}

export default function Intro({ coordinates, heading }: IntroProps) {
  // const coordinates = useCoordinates();
  // const heading = useHeading();

  return (
    <div className="">
      <p>
        This is a location-based geography game in which you try to face towards
        the target city.
      </p>

      <h2 className="text-lg font-bold mt-3">Requirements:</h2>
      <p>
        Being a location-based geograpy game, permission to access the following
        information is needed:
      </p>

      <ul className="list-inside">
        <li>
          <CoordinatesInfo {...coordinates}></CoordinatesInfo>
        </li>
        <li>
          <HeadingInfo {...heading}></HeadingInfo>
        </li>
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
