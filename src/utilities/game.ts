import cities from "../assets/data/cities.json";
import useCoordinates from "../hooks/useCoordinates";
import useHeading from "../hooks/useHeading";
import { CurrentLocation, StageList } from "../types/game";
import { getBearing } from "./cartography";

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
