import cities from "../assets/data/cities.json";
import useCoordinates from "../hooks/useCoordinates";
import useHeading from "../hooks/useHeading";
import { CurrentLocation, StageList } from "../types/game";
import { getBearing, getDistance } from "./cartography";

/**
 * Calculate user's score.
 * @param target Coordinate of target city.
 * @param coordinates Coordinate of user location.
 * @param heading User's direction.
 * @returns User's score for that stage.
 */
export function getScore(
  target: CurrentLocation,
  coordinates: ReturnType<typeof useCoordinates>,
  heading: ReturnType<typeof useHeading>
) {
  const maxScore = 200;

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

  return Math.round(maxScore * (1 - degreeDelta / 180) ** 2);
}

/**
 * Select a random city from the list in /assets.
 * Filters out previously played cities and
 * cities that are too close (too easy).
 * @param stages Current list of stages.
 * @param coordinates Coordinate of user location.
 * @returns A random city, from the city list in.
 */
export function getRandomCity(
  stages: StageList,
  coordinates: ReturnType<typeof useCoordinates>
) {
  let candidate: CurrentLocation;

  /**
   * Checks to see that candidate city isn't too close to user location.
   * Wouldn't want to have to guess the location of your own city.
   * @returns Whether city is too close
   */
  function cityTooClose(): boolean {
    const limit = 100;
    if (coordinates.value === null) {
      return true;
    }
    return getDistance(candidate, coordinates.value) < limit;
  }

  /**
   * Checks that user hasn't already played a stage with the candidate city.
   * @returns Whether city has already been guessed by user.
   */
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
  } while (candidateInStages() || cityTooClose());

  return candidate;
}
