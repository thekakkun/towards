import { Dispatch } from "react";
import { Coordinates, Location } from "./cartography";
import { Degrees } from "./math";

export type gameState =
  | "permissions"
  | "intro"
  | "guess"
  | "answer"
  | "lastAnswer"
  | "outro";

export interface Position {
  coordinates: Coordinates | null;
  heading: Degrees | null;
}

// Stage stuff
export interface CurrentLocation extends Location, Coordinates {}

export interface Guess {
  heading: Degrees;
  score: number;
}

export interface CompletedLocation extends CurrentLocation, Guess {}

export type StageList = (CurrentLocation | CompletedLocation | null)[];
