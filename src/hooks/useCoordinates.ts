import { useEffect, useState } from "react";
import { Coordinates, SensorHook, SensorState } from "../types/over-yonder";

/**
 * On being called, checks for geolocation service availability
 * and adds a listener for geolocation permission state.
 * @returns Permission state, a method to request permission and start listening,
 * and the coordinate value.
 */
export default function useCoordinates(): SensorHook<Coordinates> {
  const [sensorState, setSensorState] = useState<SensorState>("unknown");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Print for debugging purposes.
  useEffect(() => {
    console.log(`Coordinates:
  permission state: ${sensorState}
  value: (${coordinates?.latitude}, ${coordinates?.longitude})`);
  }, [sensorState, coordinates]);

  // On initialization, check for availability,
  // start listening to permission state if available.
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setSensorState("unavailable");
    } else {
      attachListener();
    }

    /**
     * Start listening to geolocation permission state.
     */
    async function attachListener() {
      let res = await navigator.permissions.query({ name: "geolocation" });
      setSensorState(res.state);

      res.addEventListener("change", () => {
        setSensorState(res.state);
      });
    }
  }, []);

  // Implicitly access coordinates data if permission already granted.
  useEffect(() => {
    if (sensorState === "granted") {
      const watchId = requestAccess();

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [sensorState]);

  // Coordinates ready.
  useEffect(() => {
    if (coordinates !== null) {
      setSensorState("ready");
    }
  }, [coordinates]);

  /**
   * Prompt user for permission if not 'granted'.
   * Once granted, start monitoring the geolocation.
   */
  function requestAccess() {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setCoordinates(coords);
      },
      (err) => {
        console.log(`Geolocation position error: ${err.code} ${err.message}`);
        if (err.code === 1) {
          setSensorState("denied");
        } else {
          setSensorState("unavailable");
        }
      }
    );
    return watchId;
  }

  return {
    state: sensorState,
    requestAccess,
    value: coordinates,
  };
}
