export type Degrees = number;
export type Radians = number;

export interface Location {
  city: string;
  country: string;
}

export interface Coordinates {
  longitude: Degrees;
  latitude: Degrees;
}
