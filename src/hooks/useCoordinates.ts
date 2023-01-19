import { useEffect, useState } from "react";
import { Coordinates } from "../types/cartography";
import { SensorState } from "../types/game";

/**
 * On being called, checks for geolocation service availability
 * and adds a listener for geolocation permission state.
 * @returns Permission state, a method to request permission and start listening,
 * and the coordinate value.
 */
export default function useCoordinates(): {
  state: SensorState;
  requestAccess: () => void;
  value: Coordinates | null;
} {
  const [sensorState, setSensorState] = useState<SensorState>("unknown");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  // Check geolocation availability and listen for state on load.
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setSensorState("unavailable");
    } else {
      attachListener();
    }

    async function attachListener() {
      let res = await navigator.permissions.query({ name: "geolocation" });
      setSensorState(res.state);

      res.addEventListener("change", () => {
        setSensorState(res.state);
      });
    }
  }, []);

  // Monitor sensor state and
  useEffect(() => {
    console.log(`Coordinates:
  permission state: ${sensorState}
  value: (${coordinates?.latitude}, ${coordinates?.longitude})`);

    if (coordinates !== null) {
      setSensorState("ready");
    } else if (sensorState === "granted") {
      const watchId = requestAccess();

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [sensorState, coordinates]);

  /**
   * Will prompt user for permission if not 'granted'.
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
