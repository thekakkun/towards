import { Dispatch } from "react";

import useCoordinates from "../hooks/useCoordinates";
import useHeading from "../hooks/useHeading";
import { Coordinates, Location } from "./cartography";
import { Degrees } from "./math";

export type SensorState = "unknown" | "unavailable" | PermissionState | "ready";
export type GameState = "intro" | "guess" | "answer" | "last answer" | "outro";

// export interface Position {
//   coordinates: ReturnType<typeof useCoordinates>;
//   heading: ReturnType<typeof useHeading>;
// }

// Stage stuff
export interface CurrentLocation extends Location, Coordinates {}

export interface Guess {
  heading: Degrees;
  score: number;
}

export interface CompletedLocation extends CurrentLocation, Guess {}

export type StageList = (CurrentLocation | CompletedLocation | null)[];
