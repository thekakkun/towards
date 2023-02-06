import { GeoPath, GeoPermissibleObjects } from "d3-geo";
import { select } from "d3-selection";
import { useRef, useEffect } from "react";
import colors from "tailwindcss/colors";
import { Coordinates } from "../../../types/cartography";
import { CompletedLocation } from "../../../types/game";
import { getDestination } from "../../../utilities/cartography";

interface GuessProps {
  geoGenerator: GeoPath<any, GeoPermissibleObjects>;
  location: Coordinates;
  target: CompletedLocation;
}

export default function Guess({ geoGenerator, location, target }: GuessProps) {
  const guessRef = useRef(null);

  useEffect(() => {
    if (guessRef.current) {
      select(guessRef.current).attr(
        "d",
        geoGenerator({
          type: "Polygon",
          coordinates: [getArrowCoords(location, target)],
        })
      );
    }
  }, [geoGenerator, location, target]);

  return (
    <g>
      <path ref={guessRef} fill={colors.emerald[600]}></path>
    </g>
  );
}

/**
 * Create polygon for arrow, based off needle svg shape and heading
 * @returns coordinates for arrow polygon
 */
function getArrowCoords(location: Coordinates, target: CompletedLocation) {
  // Coordinates of arrow polygon, in radial coordinates from center
  // Measured from needle svg.
  let coords = [
    [34.79, -90], // tip, clockwise from here.
    [27.1, -80.63],
    [35.06, 82.77],
    [26.74, 90], // tail
    [35.06, 97.23],
    [27.1, -99.37],
  ].map(([dist, angle]) => [dist, angle + 90]); // rotate so tip is at 0 degrees

  const arrowLength = 2500;
  const scale = arrowLength / (coords[0][0] + coords[3][0]);
  let arrowPolygon = coords.map(([dist, angle]) =>
    getDestination(location, target.heading + angle, dist * scale)
  );

  arrowPolygon.push(arrowPolygon[0]); // close the polygon
  return arrowPolygon.map((coords) => [coords.longitude, coords.latitude]);
}
