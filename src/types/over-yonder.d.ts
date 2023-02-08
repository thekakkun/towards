// Angle units. Doesn't really prevent mistakes, sort-of helps me keep units in mind.
export type Degrees = number;
export type Radians = number;

// Game state
export type GameState = "intro" | "guess" | "answer" | "last answer" | "outro";

// Sensors
export type SensorState = "unknown" | "unavailable" | PermissionState | "ready";
export interface SensorHook<T> {
  state: SensorState;
  requestAccess: () => void;
  value: T | null;
}

// Location and stage types
export interface Coordinates {
  longitude: Degrees;
  latitude: Degrees;
}

export interface TargetLocation extends Coordinates {
  city: string;
  country: string;
  link: string;
}

export interface Guess {
  heading: Degrees;
  score: number;
}

export interface CompletedLocation extends TargetLocation, Guess {}

export type StageList = (TargetLocation | CompletedLocation | null)[];
