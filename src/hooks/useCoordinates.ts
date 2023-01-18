import { useEffect, useState } from "react";
import { Coordinates } from "../types/cartography";

/**
 * On being called, checks for geolocation service availability
 * and adds a listener for geolocation permission state.
 * @returns Permission state, a method to request permission and start listening,
 * and the coordinate value.
 */
export default function useCoordinates(): {
  state: PermissionState | null;
  requestAccess: () => void;
  value: Coordinates | null;
} {
  const permissionState = usePermissionState();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  //  On initialization, check for availability of geolocation services.
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      throw new Error("Geolocation services not supported.");
    }
  }, []);

  // On get coordinates if permission already granted.
  useEffect(() => {
    if (permissionState === "granted") {
      const watchId = watchCoordinates();

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [permissionState]);

  /**
   * Will prompt user for permission if not 'granted'.
   * Once granted, start monitoring the geolocation.
   */
  function requestAccess() {
    const watchId = watchCoordinates();

    useEffect(() => {
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }, []);
  }

  /**
   * Start monitoring user coordinates, update coordinate state.
   */
  function watchCoordinates() {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => setCoordinates(coords),
      (err) => {
        throw err;
      }
    );
    return watchId;
  }

  return { state: permissionState, requestAccess, value: coordinates };
}

/**
 * Stores Geolocation API permission state in a React state variable.
 * Updates automatically on change.
 *
 * @returns permission state of the Geolocation API
 */
function usePermissionState(): PermissionState | null {
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  useEffect(() => {
    async function attachListener() {
      let res = await navigator.permissions.query({ name: "geolocation" });
      setPermissionState(res.state);

      res.addEventListener("change", () => {
        setPermissionState(res.state);
      });
    }

    attachListener();
  }, []);

  return permissionState;
}
