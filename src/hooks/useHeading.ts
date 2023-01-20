import { useCallback, useEffect, useState } from "react";
import { Degrees } from "../types/cartography";
import { SensorState } from "../types/game";

/**
 * On being called, checks for orientation service availability
 * and adds a listener for geolocation permission state.
 * @returns Permission state, a method to request permission and start listening,
 * and the coordinate value.
 */
export default function useHeading(): {
  state: SensorState;
  requestAccess: () => Promise<void>;
  value: number | null;
} {
  const [sensorState, setSensorState] = useState<SensorState>("unknown");
  const [heading, setHeading] = useState<Degrees | null>(null);

  // Print for debugging purposes.
  useEffect(() => {
    console.log(`Heading:
  permission state: ${sensorState}
  value: ${heading}`);
  }, [sensorState, heading]);

  // On initialization, check for availability,
  // set initial permission state based on permission endpoint availability.
  useEffect(() => {
    if (
      !("ondeviceorientation" in window) &&
      !("ondeviceorientationabsolute" in window)
    ) {
      setSensorState("unavailable");
    } else {
      const requestHeadingPermission = (
        DeviceOrientationEvent as unknown as webkitDeviceOrientationEvent
      ).requestPermission;

      // No permission endpoint. Assume permission granted.
      // This is the case for Chrome.
      if (typeof requestHeadingPermission !== "function") {
        setSensorState("granted");
      }
      // There is a method to request permission. User needs to be prompted.
      else {
        setSensorState("prompt");
      }
    }
  }, []);

  const requestAccess = useCallback(requestAccessAsync, []);

  // Access heading data once permission granted.
  // Should be on load for Android, after requestAccess() is called for iOS.
  useEffect(() => {
    if (sensorState === "granted") {
      requestAccess();
    }
  }, [sensorState, requestAccess]);

  // Coordinates ready.
  useEffect(() => {
    if (heading !== null) {
      setSensorState("ready");
    }
  }, [heading]);

  /**
   * Prompt user for permission. Update state based on results.
   */
  async function requestAccessAsync() {
    const requestHeadingPermission = (
      DeviceOrientationEvent as unknown as webkitDeviceOrientationEvent
    ).requestPermission;

    if (typeof requestHeadingPermission === "function") {
      try {
        setSensorState(await requestHeadingPermission());
      } catch (err) {
        console.log(`Device orientation error: ${err}`);
        setSensorState("unavailable");
      }
    }

    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute" as "deviceorientation",
        onDeviceOrientation
      );
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", onDeviceOrientation);
    }

    // For cases where event listeners exists, but alpha/compassHeading value is null.
    // Should be overwritten once heading value is non-null
    setSensorState("unavailable");

    if (process.env.NODE_ENV === "development") {
      setHeading(30);
    }
  }

  /**
   * Attempt to set the heading based on information available from the event.
   * @param orientation Device orientation event
   */
  function onDeviceOrientation(
    orientation: DeviceOrientationEvent | webkitDeviceOrientationEvent
  ) {
    if ("webkitCompassHeading" in orientation) {
      setHeading(orientation.webkitCompassHeading);
    } else if (orientation.absolute && orientation.alpha) {
      setHeading(359 - orientation.alpha);
    } else {
      setSensorState("unavailable");
    }
  }

  return { state: sensorState, requestAccess, value: heading };
}

/**
 * Properties and methods available on Webkit (Safari)
 */
interface webkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading: number;
  webkitCompassAccuracy: number;
  requestPermission: () => Promise<PermissionState>;
}
