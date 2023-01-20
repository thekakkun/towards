import cities from "../assets/data/cities.json";
import useCoordinates from "../hooks/useCoordinates";
import useHeading from "../hooks/useHeading";
import { Degrees } from "../types/cartography";
import { CurrentLocation, StageList } from "../types/game";
import { getBearing } from "./cartography";

export function getScore(
  target: CurrentLocation,
  coordinates: ReturnType<typeof useCoordinates>,
  heading: ReturnType<typeof useHeading>
) {
  if (heading.value === null) {
    throw Error("Heading not available");
  }
  if (coordinates.value === null) {
    throw Error("User position not available.");
  }

  const bearing = getBearing(coordinates.value, target);
  const degreeDelta = Math.min(
    Math.abs(bearing - heading.value),
    360 - Math.abs(bearing - heading.value)
  );

  return Math.round(200 * (1 - degreeDelta / 180));
}

/**
 * Get a compass heading, if available, or null
 * @param event The DeviceOrientationEvent from a "deviceorientation" or
 * "deviceorientationabsolute" event listener.
 * @returns Compass heading, if available, or null;
 */
export function getHeading(event: DeviceOrientationEvent): Degrees | null {
  if ("webkitCompassHeading" in event) {
    return (event as any).webkitCompassHeading as Degrees;
  } else if (!event.absolute) {
    return null;
  } else if (event.alpha !== null) {
    return 359 - event.alpha;
  } else {
    return null;
  }
}

export function getRandomCity(stages: StageList) {
  let candidate: CurrentLocation;

  function candidateInStages(): boolean {
    return Boolean(
      stages.filter((stage) => {
        return (
          stage !== null &&
          stage.country === candidate.country &&
          stage.city === candidate.city
        );
      }).length
    );
  }

  do {
    candidate = cities[Math.floor(Math.random() * cities.length)];
  } while (candidateInStages());

  return candidate;
}
