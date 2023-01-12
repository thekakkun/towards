import cities from "../assets/data/cities.json";
import { CurrentLocation, Position, StageList } from "../types/game";
import { Degrees } from "../types/math";
import { getBearing } from "./cartography";

export function getScore(target: CurrentLocation, position: Position, ) {
  if (position.heading === null) {
    throw Error("Heading not available");
  }
  if (position.coordinates === null) {
    throw Error("User position not available.");
  }

  const bearing = getBearing(position.coordinates, target);
  const degreeDelta = Math.min(
    Math.abs(bearing - position.heading),
    360 - Math.abs(bearing - position.heading)
  );

  return Math.round(200 * (1 - degreeDelta / 180));
}

// /**
//  * Get a random location.
//  * @param currentStages The list of current stages
//  * @returns A random location, not in the current stage list.
//  */
// export function getLocation(currentStages: StageList = []): CurrentLocation {
//   let candidate: CurrentLocation;

//   /**
//    * Create a function to compare the candidate with a stage.
//    * Function exists, since a anonymous function raises the
//    * 'no-loop-func' ESLint warning.
//    * @param candidate The candidate location
//    * @returns A function to compare the candidate location with a stage.
//    */
//   function compareCandidate(candidate: CurrentLocation) {
//     return function _candidateChecker({
//       country,
//       city,
//     }: {
//       country: string;
//       city: string;
//     }) {
//       return country === candidate.country && city === candidate.city;
//     };
//   }

//   while (true) {
//     candidate = cities[getRandomInt(0, cities.length)];

//     if (currentStages.length === 0) {
//       return candidate;
//     } else if (currentStages.filter(compareCandidate(candidate)).length !== 0) {
//       continue;
//     }

//     return candidate;
//   }
// }

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

  do {
    candidate = cities[Math.floor(Math.random() * cities.length)];
  } while (
    stages.filter((stage) => {
      return (
        stage !== null &&
        stage.country === candidate.country &&
        stage.city === candidate.city
      );
    }).length
  );

  return candidate;
}
