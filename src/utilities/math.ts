import { Degrees, Radians } from "../types/math";

/**
 * Convert angles in degrees into radians.
 * @param degrees Angle in degrees.
 * @returns Angle in radians.
 */
export function degToRad(degrees: Degrees): Radians {
  return degrees * (Math.PI / 180);
}

/**
 * Convert angles in radians to degrees.
 * @param rad Angle in radians.
 * @returns Angle in degrees.
 */
export function radToDeg(rad: Radians): Degrees {
  return rad / (Math.PI / 180);
}

// /**
//  * Return a random integer between the specified values.
//  * @param min Minimum range of return value (inclusive).
//  * @param max Maximum range of return value (exclusive).
//  * @returns Random integer between min and max.
//  */
// export function getRandomInt(min: number, max: number) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min) + min);
// }
